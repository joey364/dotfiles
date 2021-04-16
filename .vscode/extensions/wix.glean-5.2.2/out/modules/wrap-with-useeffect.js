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
function isWrappableByEffect(text) {
    try {
        const allAST = parsing_1.codeToAst(editor_1.allText());
        const containerPath = ast_helpers_1.findFirstPathInRange(allAST, editor_1.selectedTextStart(), editor_1.selectedTextEnd());
        return !t.isProgram(containerPath.parent);
    }
    catch (e) {
        return false;
    }
}
exports.isWrappableByEffect = isWrappableByEffect;
function wrapWithUseEffect() {
    return __awaiter(this, void 0, void 0, function* () {
        const snippet = editor_1.selectedText();
        const ast = parsing_1.codeToAst(snippet);
        const effectWrapper = snippet_builder_1.buildEffectHook({
            EFFECT: t.arrowFunctionExpression([], t.blockStatement(ast.program.body))
        });
        yield file_system_1.persistFileSystemChanges(code_actions_1.replaceSelectionWith(parsing_1.astToCode(t.program([effectWrapper]))));
        return editor_1.importMissingDependencies(editor_1.activeFileName());
    });
}
exports.wrapWithUseEffect = wrapWithUseEffect;
//# sourceMappingURL=wrap-with-useeffect.js.map