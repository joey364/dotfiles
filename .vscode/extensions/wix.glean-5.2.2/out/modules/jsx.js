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
const core_1 = require("@babel/core");
const t = require("@babel/types");
const file_system_1 = require("../file-system");
const ast_helpers_1 = require("../ast-helpers");
function isJSX(code) {
    let ast;
    try {
        ast = parsing_1.templateToAst(code);
    }
    catch (e) {
        try {
            ast = parsing_1.templateToAst(`<>${code}</>`);
        }
        catch (e2) {
            return false;
        }
    }
    return ast && ast.expression && t.isJSX(ast.expression);
}
exports.isJSX = isJSX;
function isJSXExpression(code) {
    try {
        const ast = parsing_1.templateToAst(code);
        return ast && ast.expression && t.isJSX(ast.expression);
    }
    catch (e) {
        return false;
    }
}
exports.isJSXExpression = isJSXExpression;
function importReactIfNeeded(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = file_system_1.readFileContent(filePath);
        const ast = parsing_1.codeToAst(file);
        const reactImport = ast_helpers_1.getReactImportReference(ast);
        if (!reactImport) {
            ast.program.body.unshift(t.importDeclaration([t.importDefaultSpecifier(t.identifier("React"))], t.stringLiteral("react")));
        }
        const code = core_1.transformFromAst(ast).code;
        return file_system_1.prependTextToFile(code, filePath);
    });
}
exports.importReactIfNeeded = importReactIfNeeded;
//# sourceMappingURL=jsx.js.map