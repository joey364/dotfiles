"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
exports.workspaceRoot = () => vscode.workspace.rootPath;
exports.activeURI = () => vscode.window.activeTextEditor.document.uri;
exports.activeFileName = () => vscode.window.activeTextEditor.document.fileName;
exports.selectedTextStart = () => vscode.window.activeTextEditor.selection.start;
exports.selectedTextEnd = () => vscode.window.activeTextEditor.selection.end;
exports.activeEditor = () => vscode.window.activeTextEditor;
exports.config = () => vscode.workspace.getConfiguration("glean");
function currentEditorPath() {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor)
        return;
    const currentFilePath = path.dirname(activeEditor.document.fileName);
    const rootMatcher = new RegExp(`^${exports.workspaceRoot()}`);
    const relativeCurrentFilePath = currentFilePath.replace(rootMatcher, "");
    return relativeCurrentFilePath;
}
exports.currentEditorPath = currentEditorPath;
function openFile(absolutePath) {
    return vscode.workspace
        .openTextDocument(absolutePath)
        .then((textDocument) => {
        if (textDocument) {
            vscode.window.showTextDocument(textDocument);
            return absolutePath;
        }
        else {
            throw Error("Could not open document");
        }
    });
}
exports.openFile = openFile;
function selectedText() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const selection = editor.selection;
        return editor.document.getText(selection);
    }
    else {
        return null;
    }
}
exports.selectedText = selectedText;
function allText() {
    const editor = vscode.window.activeTextEditor;
    return editor.document.getText();
}
exports.allText = allText;
function showInputBox(defaultValue, placeHolder) {
    return vscode.window.showInputBox({
        value: defaultValue,
        placeHolder,
    });
}
exports.showInputBox = showInputBox;
function showQuickPicksList(choices, placeHolder = "") {
    return vscode.window.showQuickPick(choices, {
        placeHolder,
    });
}
exports.showQuickPicksList = showQuickPicksList;
exports.convertRelativeToFullPath = (relativePath) => {
    const root = exports.workspaceRoot();
    return root ? path.join(root, relativePath) : relativePath;
};
exports.extractQuickPickValue = (selection) => {
    if (!selection)
        return;
    return selection.label;
};
exports.toQuickPick = (label, description) => ({
    label,
    description,
});
exports.toQuickPicksList = (choices) => choices.map((item) => exports.toQuickPick(item));
exports.showErrorMessage = (message) => vscode.window.showErrorMessage(message);
exports.showInformationMessage = (message, items = []) => vscode.window.showInformationMessage(message, ...items);
exports.importMissingDependencies = (targetFile) => vscode.commands.executeCommand("_typescript.applyFixAllCodeAction", targetFile, { fixId: "fixMissingImport" });
//# sourceMappingURL=editor.js.map