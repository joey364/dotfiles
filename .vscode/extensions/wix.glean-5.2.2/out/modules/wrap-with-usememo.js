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
const code_actions_1 = require("../code-actions");
const snippet_builder_1 = require("../snippet-builder");
const parsing_1 = require("../parsing");
const file_system_1 = require("../file-system");
const t = require("@babel/types");
function isFunction(node) {
    return t.isFunctionDeclaration(node) || t.isFunctionExpression(node) || t.isArrowFunctionExpression(node);
}
function isVariableDeclarationWithNonFunctionInit(text) {
    try {
        const ast = parsing_1.codeToAst(text);
        if (ast.program.body.length > 1)
            return false;
        return t.isVariableDeclaration(ast.program.body[0]) && !isFunction(ast.program.body[0].declarations[0].init);
    }
    catch (e) {
        return false;
    }
}
exports.isVariableDeclarationWithNonFunctionInit = isVariableDeclarationWithNonFunctionInit;
function wrapWithUseMemo() {
    return __awaiter(this, void 0, void 0, function* () {
        const snippet = editor_1.selectedText();
        const ast = parsing_1.codeToAst(snippet);
        const memoWrapper = snippet_builder_1.buildUseMemo({
            VAR: ast.program.body[0].declarations[0].id,
            EXPRESSION: ast.program.body[0].declarations[0].init
        });
        yield file_system_1.persistFileSystemChanges(code_actions_1.replaceSelectionWith(parsing_1.astToCode(t.program([memoWrapper]))));
        return editor_1.importMissingDependencies(editor_1.activeFileName());
    });
}
exports.wrapWithUseMemo = wrapWithUseMemo;
//# sourceMappingURL=wrap-with-usememo.js.map