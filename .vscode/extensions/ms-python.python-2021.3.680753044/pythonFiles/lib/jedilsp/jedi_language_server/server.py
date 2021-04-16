"""Jedi Language Server.

Creates the language server constant and wraps "features" with it.

Official language server spec:
    https://microsoft.github.io/language-server-protocol/specification
"""

import itertools
from typing import Any, List, Optional, Union

from jedi import Project
from jedi.api.refactoring import RefactoringError
from pygls.features import (
    CODE_ACTION,
    COMPLETION,
    COMPLETION_ITEM_RESOLVE,
    DEFINITION,
    DOCUMENT_HIGHLIGHT,
    DOCUMENT_SYMBOL,
    HOVER,
    REFERENCES,
    RENAME,
    SIGNATURE_HELP,
    TEXT_DOCUMENT_DID_CHANGE,
    TEXT_DOCUMENT_DID_OPEN,
    TEXT_DOCUMENT_DID_SAVE,
    WORKSPACE_DID_CHANGE_CONFIGURATION,
    WORKSPACE_SYMBOL,
)
from pygls.protocol import LanguageServerProtocol
from pygls.server import LanguageServer
from pygls.types import (
    CodeAction,
    CodeActionKind,
    CodeActionParams,
    CompletionItem,
    CompletionList,
    CompletionParams,
    DidChangeConfigurationParams,
    DidChangeTextDocumentParams,
    DidOpenTextDocumentParams,
    DidSaveTextDocumentParams,
    DocumentHighlight,
    DocumentSymbol,
    DocumentSymbolParams,
    Hover,
    InitializeParams,
    InitializeResult,
    Location,
    MarkupContent,
    MarkupKind,
    RenameParams,
    SymbolInformation,
    TextDocumentPositionParams,
    WorkspaceEdit,
    WorkspaceSymbolParams,
)

from . import jedi_utils, pygls_utils, text_edit_utils
from .initialize_params_parser import InitializeParamsParser
from .pygls_type_overrides import (
    ParameterInformation,
    SignatureHelp,
    SignatureInformation,
)

# pylint: disable=line-too-long


class JediLanguageServerProtocol(LanguageServerProtocol):
    """Override some built-in functions."""

    def bf_initialize(self, params: InitializeParams) -> InitializeResult:
        """Override built-in initialization.

        Here, we can conditionally register functions to features based
        on client capabilities and initializationOptions.
        """
        server: "JediLanguageServer" = self._server
        ip = server.initialize_params  # pylint: disable=invalid-name
        ip.set_initialize_params(params)
        jedi_utils.set_jedi_settings(ip)
        if ip.initializationOptions_diagnostics_enable:
            if ip.initializationOptions_diagnostics_didOpen:
                server.feature(TEXT_DOCUMENT_DID_OPEN)(did_open)
            if ip.initializationOptions_diagnostics_didChange:
                server.feature(TEXT_DOCUMENT_DID_CHANGE)(did_change)
            if ip.initializationOptions_diagnostics_didSave:
                server.feature(TEXT_DOCUMENT_DID_SAVE)(did_save)
        initialize_result: InitializeResult = super().bf_initialize(params)
        server.project = Project(
            path=server.workspace.root_path,
            added_sys_path=ip.initializationOptions_workspace_extraPaths,
            smart_sys_path=True,
            load_unsafe_extensions=False,
        )
        return initialize_result


class JediLanguageServer(LanguageServer):
    """Jedi language server.

    :attr initialize_params: initialized in bf_initialize from the protocol_cls
    :attr project: a Jedi project. This value is created in
                   `JediLanguageServerProtocol.bf_initialize`
    """

    project: Project

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        self.initialize_params = InitializeParamsParser()
        super().__init__(*args, **kwargs)


SERVER = JediLanguageServer(protocol_cls=JediLanguageServerProtocol)


# Server capabilities


@SERVER.feature(COMPLETION_ITEM_RESOLVE)
def completion_item_resolve(
    server: JediLanguageServer, params: Any
) -> CompletionItem:
    """Resolves documentation and detail of given completion item."""
    markup_kind = _choose_markup(server)
    # note: params is not a CompletionItem
    # but a namedtuple complying with CompletionItem protocol
    item = CompletionItem(
        label=params.label,
        kind=getattr(params, "kind", None),
        detail=getattr(params, "detail", None),
        documentation=getattr(params, "documentation", None),
        deprecated=getattr(params, "deprecated", None),
        preselect=getattr(params, "preselect", None),
        sort_text=getattr(params, "sortText", None),
        filter_text=getattr(params, "filterText", None),
        insert_text=getattr(params, "insertText", None),
        insert_text_format=getattr(params, "insertTextFormat", None),
        text_edit=getattr(params, "textEdit", None),
        additional_text_edits=getattr(params, "additionalTextEdits", None),
        commit_characters=getattr(params, "commitCharacters", None),
        command=getattr(params, "command", None),
        data=getattr(params, "data", None),
    )
    return jedi_utils.lsp_completion_item_resolve(
        item, markup_kind=markup_kind
    )


@SERVER.feature(COMPLETION, trigger_characters=[".", "'", '"'])
def completion(
    server: JediLanguageServer, params: CompletionParams
) -> Optional[CompletionList]:
    """Returns completion items."""
    document = server.workspace.get_document(params.textDocument.uri)
    jedi_script = jedi_utils.script(server.project, document)
    jedi_lines = jedi_utils.line_column(jedi_script, params.position)
    completions_jedi = jedi_script.complete(**jedi_lines)
    snippet_support = (
        server.initialize_params.capabilities_textDocument_completion_completionItem_snippetSupport
    )
    snippet_disable = (
        server.initialize_params.initializationOptions_completion_disableSnippets
    )
    resolve_eagerly = (
        server.initialize_params.initializationOptions_completion_resolveEagerly
    )
    markup_kind = _choose_markup(server)
    is_import_context = jedi_utils.is_import(
        script_=jedi_script,
        line=jedi_lines["line"],
        column=jedi_lines["column"],
    )
    enable_snippets = (
        snippet_support and not snippet_disable and not is_import_context
    )
    char_before_cursor = pygls_utils.char_before_cursor(
        document=server.workspace.get_document(params.textDocument.uri),
        position=params.position,
    )
    jedi_utils.clear_completions_cache()
    completion_items = [
        jedi_utils.lsp_completion_item(
            completion=completion,
            char_before_cursor=char_before_cursor,
            enable_snippets=enable_snippets,
            resolve_eagerly=resolve_eagerly,
            markup_kind=markup_kind,
        )
        for completion in completions_jedi
    ]
    return (
        CompletionList(is_incomplete=False, items=completion_items)
        if completion_items
        else None
    )


@SERVER.feature(SIGNATURE_HELP, trigger_characters=["(", ","])
def signature_help(
    server: JediLanguageServer, params: TextDocumentPositionParams
) -> Optional[SignatureHelp]:
    """Returns signature help."""
    document = server.workspace.get_document(params.textDocument.uri)
    jedi_script = jedi_utils.script(server.project, document)
    jedi_lines = jedi_utils.line_column(jedi_script, params.position)
    signatures_jedi = jedi_script.get_signatures(**jedi_lines)
    signatures = [
        SignatureInformation(
            label=signature.to_string(),
            parameters=[
                ParameterInformation(label=info.to_string())
                for info in signature.params
            ],
        )
        for signature in signatures_jedi
    ]
    return (
        SignatureHelp(
            signatures=signatures,
            active_signature=0,
            active_parameter=(
                signatures_jedi[0].index if signatures_jedi else 0
            ),
        )
        if signatures
        else None
    )


@SERVER.feature(DEFINITION)
def definition(
    server: JediLanguageServer, params: TextDocumentPositionParams
) -> Optional[List[Location]]:
    """Support Goto Definition."""
    document = server.workspace.get_document(params.textDocument.uri)
    jedi_script = jedi_utils.script(server.project, document)
    jedi_lines = jedi_utils.line_column(jedi_script, params.position)
    names = jedi_script.goto(
        follow_imports=True,
        follow_builtin_imports=True,
        **jedi_lines,
    )
    definitions = [jedi_utils.lsp_location(name) for name in names]
    return definitions if definitions else None


@SERVER.feature(DOCUMENT_HIGHLIGHT)
def highlight(
    server: JediLanguageServer, params: TextDocumentPositionParams
) -> Optional[List[DocumentHighlight]]:
    """Support document highlight request.

    This function is called frequently, so we minimize the number of expensive
    calls. These calls are:

    1. Getting assignment of current symbol (script.goto)
    2. Getting all names in the current script (script.get_names)

    Finally, we only return names if there are more than 1. Otherwise, we don't
    want to highlight anything.
    """
    document = server.workspace.get_document(params.textDocument.uri)
    jedi_script = jedi_utils.script(server.project, document)
    jedi_lines = jedi_utils.line_column(jedi_script, params.position)
    names = jedi_script.get_references(**jedi_lines, scope="file")
    highlight_names = [
        DocumentHighlight(jedi_utils.lsp_range(name)) for name in names
    ]
    return highlight_names if highlight_names else None


@SERVER.feature(HOVER)
def hover(
    server: JediLanguageServer, params: TextDocumentPositionParams
) -> Optional[Hover]:
    """Support Hover."""
    document = server.workspace.get_document(params.textDocument.uri)
    jedi_script = jedi_utils.script(server.project, document)
    jedi_lines = jedi_utils.line_column(jedi_script, params.position)
    for name in jedi_script.help(**jedi_lines):
        docstring = name.docstring()
        if not docstring:
            continue
        markup_kind = _choose_markup(server)
        docstring_clean = jedi_utils.convert_docstring(docstring, markup_kind)
        contents = MarkupContent(kind=markup_kind, value=docstring_clean)
        document = server.workspace.get_document(params.textDocument.uri)
        _range = pygls_utils.current_word_range(document, params.position)
        return Hover(contents=contents, range=_range)  # type: ignore
    return None


@SERVER.feature(REFERENCES)
def references(
    server: JediLanguageServer, params: TextDocumentPositionParams
) -> Optional[List[Location]]:
    """Obtain all references to text."""
    document = server.workspace.get_document(params.textDocument.uri)
    jedi_script = jedi_utils.script(server.project, document)
    jedi_lines = jedi_utils.line_column(jedi_script, params.position)
    names = jedi_script.get_references(**jedi_lines)
    locations = [jedi_utils.lsp_location(name) for name in names]
    return locations if locations else None


@SERVER.feature(DOCUMENT_SYMBOL)
def document_symbol(
    server: JediLanguageServer, params: DocumentSymbolParams
) -> Optional[Union[List[DocumentSymbol], List[SymbolInformation]]]:
    """Document Python document symbols, hierarchically if possible.

    In Jedi, valid values for `name.type` are:

    - `module`
    - `class`
    - `instance`
    - `function`
    - `param`
    - `path`
    - `keyword`
    - `statement`

    We do some cleaning here. For hierarchical symbols, names from scopes that
    aren't directly accessible with dot notation are removed from display. For
    non-hierarchical symbols, we simply remove `param` symbols. Others are
    included for completeness.
    """
    document = server.workspace.get_document(params.textDocument.uri)
    jedi_script = jedi_utils.script(server.project, document)
    names = jedi_script.get_names(all_scopes=True, definitions=True)
    if (
        server.initialize_params.capabilities_textDocument_documentSymbol_hierarchicalDocumentSymbolSupport
    ):
        document_symbols = jedi_utils.lsp_document_symbols(names)
        return document_symbols if document_symbols else None
    symbol_information = [
        jedi_utils.lsp_symbol_information(name)
        for name in names
        if name.type != "param"
    ]
    return symbol_information if symbol_information else None


def _ignore_folder(path_check: str, jedi_ignore_folders: List[str]) -> bool:
    """Determines whether there's an ignore folder in the path.

    Intended to be used with the `workspace_symbol` function
    """
    for ignore_folder in jedi_ignore_folders:
        if f"/{ignore_folder}/" in path_check:
            return True
    return False


@SERVER.feature(WORKSPACE_SYMBOL)
def workspace_symbol(
    server: JediLanguageServer, params: WorkspaceSymbolParams
) -> Optional[List[SymbolInformation]]:
    """Document Python workspace symbols.

    Returns up to maxSymbols, or all symbols if maxSymbols is <= 0, ignoring
    the following symbols:

    1. Those that don't have a module_path associated with them (built-ins)
    2. Those that are not rooted in the current workspace.
    3. Those whose folders contain a directory that is ignored (.venv, etc)
    """
    names = server.project.complete_search(params.query)
    workspace_root = server.workspace.root_path
    ignore_folders = (
        server.initialize_params.initializationOptions_workspace_symbols_ignoreFolders
    )
    _symbols = (
        jedi_utils.lsp_symbol_information(name)
        for name in names
        if name.module_path
        and str(name.module_path).startswith(workspace_root)
        and not _ignore_folder(str(name.module_path), ignore_folders)
    )
    max_symbols = (
        server.initialize_params.initializationOptions_workspace_symbols_maxSymbols
    )
    symbols = (
        list(itertools.islice(_symbols, max_symbols))
        if max_symbols > 0
        else list(_symbols)
    )
    return symbols if symbols else None


@SERVER.feature(RENAME)
def rename(
    server: JediLanguageServer, params: RenameParams
) -> Optional[WorkspaceEdit]:
    """Rename a symbol across a workspace."""
    document = server.workspace.get_document(params.textDocument.uri)
    jedi_script = jedi_utils.script(server.project, document)
    jedi_lines = jedi_utils.line_column(jedi_script, params.position)
    try:
        refactoring = jedi_script.rename(new_name=params.newName, **jedi_lines)
    except RefactoringError:
        return None
    changes = text_edit_utils.lsp_document_changes(
        server.workspace, refactoring
    )
    return WorkspaceEdit(document_changes=changes) if changes else None  # type: ignore


@SERVER.feature(
    CODE_ACTION,
    code_action_kinds=[
        CodeActionKind.RefactorInline,
        CodeActionKind.RefactorExtract,
    ],
)
def code_action(
    server: JediLanguageServer, params: CodeActionParams
) -> Optional[List[CodeAction]]:
    """Get code actions.

    Currently supports:
        1. Inline variable
        2. Extract variable
        3. Extract function
    """
    document = server.workspace.get_document(params.textDocument.uri)
    jedi_script = jedi_utils.script(server.project, document)
    code_actions = []
    jedi_lines = jedi_utils.line_column(jedi_script, params.range.start)
    jedi_lines_extract = jedi_utils.line_column_range(params.range)

    try:
        if params.range.start.line != params.range.end.line:
            # refactor this at some point; control flow with exception == bad
            raise RefactoringError("inline only viable for single-line range")
        inline_refactoring = jedi_script.inline(**jedi_lines)
    except (RefactoringError, AttributeError, IndexError):
        inline_changes = []
    else:
        inline_changes = text_edit_utils.lsp_document_changes(
            server.workspace, inline_refactoring
        )
    if inline_changes:
        code_actions.append(
            CodeAction(
                title="Inline variable",
                kind=CodeActionKind.RefactorInline,
                edit=WorkspaceEdit(
                    document_changes=inline_changes,  # type: ignore
                ),
            )
        )

    extract_var = jedi_utils.random_var("var_")
    try:
        extract_variable_refactoring = jedi_script.extract_variable(
            new_name=extract_var, **jedi_lines_extract
        )
    except (RefactoringError, AttributeError, IndexError):
        extract_variable_changes = []
    else:
        extract_variable_changes = text_edit_utils.lsp_document_changes(
            server.workspace, extract_variable_refactoring
        )
    if extract_variable_changes:
        code_actions.append(
            CodeAction(
                title=f"Extract expression into variable '{extract_var}'",
                kind=CodeActionKind.RefactorExtract,
                edit=WorkspaceEdit(
                    document_changes=extract_variable_changes,  # type: ignore
                ),
            )
        )

    extract_func = jedi_utils.random_var("func_")
    try:
        extract_function_refactoring = jedi_script.extract_function(
            new_name=extract_func, **jedi_lines_extract
        )
    except (RefactoringError, AttributeError, IndexError):
        extract_function_changes = []
    else:
        extract_function_changes = text_edit_utils.lsp_document_changes(
            server.workspace, extract_function_refactoring
        )
    if extract_function_changes:
        code_actions.append(
            CodeAction(
                title=f"Extract expression into function '{extract_func}'",
                kind=CodeActionKind.RefactorExtract,
                edit=WorkspaceEdit(
                    document_changes=extract_function_changes,  # type: ignore
                ),
            )
        )

    return code_actions if code_actions else None


@SERVER.feature(WORKSPACE_DID_CHANGE_CONFIGURATION)
def did_change_configuration(
    server: JediLanguageServer,  # pylint: disable=unused-argument
    params: DidChangeConfigurationParams,  # pylint: disable=unused-argument
) -> None:
    """Implement event for workspace/didChangeConfiguration.

    Currently does nothing, but necessary for pygls. See::
        <https://github.com/pappasam/jedi-language-server/issues/58>
    """


# Static capability or initializeOptions functions that rely on a specific
# client capability or user configuration. These are associated with
# JediLanguageServer within JediLanguageServerProtocol.bf_initialize
def _publish_diagnostics(server: JediLanguageServer, uri: str) -> None:
    """Helper function to publish diagnostics for a file."""
    document = server.workspace.get_document(uri)
    jedi_script = jedi_utils.script(server.project, document)
    errors = jedi_script.get_syntax_errors()
    diagnostics = [jedi_utils.lsp_diagnostic(error) for error in errors]
    server.publish_diagnostics(uri, diagnostics)


# TEXT_DOCUMENT_DID_SAVE
def did_save(
    server: JediLanguageServer, params: DidSaveTextDocumentParams
) -> None:
    """Actions run on textDocument/didSave."""
    _publish_diagnostics(server, params.textDocument.uri)


# TEXT_DOCUMENT_DID_CHANGE
def did_change(
    server: JediLanguageServer, params: DidChangeTextDocumentParams
) -> None:
    """Actions run on textDocument/didChange."""
    _publish_diagnostics(server, params.textDocument.uri)


# TEXT_DOCUMENT_DID_OPEN
def did_open(
    server: JediLanguageServer, params: DidOpenTextDocumentParams
) -> None:
    """Actions run on textDocument/didOpen."""
    _publish_diagnostics(server, params.textDocument.uri)


def _choose_markup(server: JediLanguageServer) -> MarkupKind:
    """Returns the preferred or first of supported markup kinds."""
    markup_preferred = (
        server.initialize_params.initializationOptions_markupKindPreferred
    )
    markup_supported = (
        server.initialize_params.capabilities_textDocument_completion_completionItem_documentationFormat
    )
    return MarkupKind(
        markup_preferred
        if markup_preferred in markup_supported
        else markup_supported[0]
    )
