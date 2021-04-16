"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const editor_1 = require("../editor");
const jsx_1 = require("./jsx");
const vscode_1 = require("vscode");
const code_actions_1 = require("../code-actions");
const parsing_1 = require("../parsing");
const traverse_1 = require("@babel/traverse");
const t = require("@babel/types");
function isRangeContainedInJSXExpression(code, start, end) {
    try {
        const ast = parsing_1.codeToAst(code);
        const path = findContainerPath(ast, start, end);
        return path && t.isJSXElement(path.node);
    }
    catch (e) {
        return false;
    }
}
function pathContains(path, start, end) {
    if (!path.node)
        return false;
    const pathStart = path.node.loc.start;
    const pathEnd = path.node.loc.end;
    return ((pathStart.line < start.line ||
        (pathStart.line === start.line && pathStart.column < start.character)) &&
        (pathEnd.line > end.line ||
            (pathEnd.line === end.line && pathEnd.column > end.character)));
}
function findContainerPath(ast, start, end) {
    let foundPath = null;
    const visitor = {
        JSXElement(path) {
            if (!foundPath && pathContains(path, start, end)) {
                foundPath = path;
            }
        }
    };
    traverse_1.default(ast, visitor);
    return foundPath;
}
function wrapJSXWithCondition() {
    return __awaiter(this, void 0, void 0, function* () {
        var editor = editor_1.activeEditor();
        if (!editor) {
            return; // No open text editor
        }
        try {
            const selText = editor_1.selectedText();
            const isParentJSXExpression = isRangeContainedInJSXExpression(editor_1.allText(), editor_1.selectedTextStart(), editor_1.selectedTextEnd());
            const conditionalJSX = jsx_1.isJSXExpression(selText)
                ? selText
                : `<>${selText}</>`;
            const snippetInnerText = `\n$\{1:true\}\n? ${conditionalJSX}\n: $\{2:null\}\n`;
            const snippetText = isParentJSXExpression
                ? `{${snippetInnerText}}`
                : `(${snippetInnerText})`;
            yield editor.insertSnippet(new vscode_1.SnippetString(snippetText));
        }
        catch (e) {
            code_actions_1.handleError(e);
        }
    });
}
exports.wrapJSXWithCondition = wrapJSXWithCondition;
//# sourceMappingURL=wrap-with-conditional.js.map