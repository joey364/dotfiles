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
const parsing_1 = require("../parsing");
const editor_1 = require("../editor");
const core_1 = require("@babel/core");
const vscode_1 = require("vscode");
const file_system_1 = require("../file-system");
const utils_1 = require("../utils");
const t = require("@babel/types");
const ast_helpers_1 = require("../ast-helpers");
function isPathOnLines(path, start, end) {
    if (!path.node)
        return false;
    const pathStart = path.node.loc.start;
    const pathEnd = path.node.loc.end;
    return ((pathStart.line === start.line && pathStart.column === start.character) &&
        (pathEnd.line === end.line && pathEnd.column === end.character));
}
function isStateVariable(text) {
    try {
        const allAST = parsing_1.codeToAst(editor_1.allText());
        const containerPath = ast_helpers_1.findPathInContext(allAST, text);
        const variableDeclarationParent = containerPath.scope.bindings[containerPath.node.name].path.parentPath;
        return variableDeclarationParent && variableDeclarationParent.node.declarations[0].init.callee.name === 'useState';
    }
    catch (e) {
        return false;
    }
}
exports.isStateVariable = isStateVariable;
function renameState() {
    return __awaiter(this, void 0, void 0, function* () {
        const selectedStateVariable = editor_1.selectedText();
        const varName = yield editor_1.showInputBox(null, 'Name of the state variable');
        const allAST = parsing_1.codeToAst(editor_1.allText());
        const containerPath = ast_helpers_1.findPathInContext(allAST, selectedStateVariable);
        const variableDeclarationParent = containerPath.findParent(parent => t.isVariableDeclaration(parent));
        if (variableDeclarationParent && variableDeclarationParent.node.declarations[0].init.callee.name === 'useState') {
            containerPath.scope.bindings[selectedStateVariable].path.parentPath.get('declarations.0.id.elements.0').scope.rename(selectedStateVariable, varName);
            containerPath.scope.bindings[varName].path.parentPath.get('declarations.0.id.elements.1').scope.rename(`set${utils_1.capitalizeFirstLetter(selectedStateVariable)}`, `set${utils_1.capitalizeFirstLetter(varName)}`);
            const processedJSX = core_1.transformFromAst(allAST).code;
            const endLine = editor_1.activeEditor().document.lineAt(editor_1.activeEditor().document.lineCount - 1).range;
            const change = file_system_1.replaceTextInFile(processedJSX, new vscode_1.Position(0, 0), endLine.end, editor_1.activeFileName());
            return file_system_1.persistFileSystemChanges(change);
        }
    });
}
exports.renameState = renameState;
//# sourceMappingURL=rename-state.js.map