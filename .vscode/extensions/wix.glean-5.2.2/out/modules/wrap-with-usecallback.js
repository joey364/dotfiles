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
const ast_helpers_1 = require("../ast-helpers");
const traverse_1 = require("@babel/traverse");
function isFunctionExpression(path) {
    return t.isVariableDeclaration(path) || t.isFunctionExpression(path.node.init);
}
function isFunction(path) {
    return (t.isFunctionDeclaration(path) || isFunctionExpression(path));
}
function findSelectedFunctionInRange(ast, start, end) {
    let foundPath = null;
    const visitor = {
        'VariableDeclaration|FunctionDeclaration'(path) {
            if (!foundPath && ast_helpers_1.pathContains(path, start, end)) {
                foundPath = path;
            }
        }
    };
    traverse_1.default(ast, visitor);
    return foundPath;
}
exports.findSelectedFunctionInRange = findSelectedFunctionInRange;
function isFunctionInsideAFunction() {
    try {
        const allAST = parsing_1.codeToAst(editor_1.allText());
        const containerPath = findSelectedFunctionInRange(allAST, editor_1.selectedTextStart(), editor_1.selectedTextEnd());
        return isFunction(containerPath) && t.isBlockStatement(containerPath.parent);
    }
    catch (e) {
        return false;
    }
}
exports.isFunctionInsideAFunction = isFunctionInsideAFunction;
function functionDeclartionToExpression(declarations) {
    const { params, body, generator, async } = declarations;
    return t.functionExpression(null, params, body, generator, async);
}
function wrapWithUseCallback() {
    return __awaiter(this, void 0, void 0, function* () {
        const snippet = editor_1.selectedText();
        const ast = parsing_1.codeToAst(snippet);
        const callackWrapper = snippet_builder_1.buildUseCallbackHook({
            CALLBACK: t.isFunctionDeclaration(ast.program.body[0]) ? functionDeclartionToExpression(ast.program.body[0]) : ast.program.body[0].declarations[0].init
        });
        const callbackId = t.isFunctionDeclaration(ast.program.body[0]) ? ast.program.body[0].id : ast.program.body[0].declarations[0].id;
        yield file_system_1.persistFileSystemChanges(code_actions_1.replaceSelectionWith(parsing_1.astToCode(t.program([t.variableDeclaration('const', [t.variableDeclarator(callbackId, callackWrapper.expression)])]))));
        return editor_1.importMissingDependencies(editor_1.activeFileName());
    });
}
exports.wrapWithUseCallback = wrapWithUseCallback;
//# sourceMappingURL=wrap-with-usecallback.js.map