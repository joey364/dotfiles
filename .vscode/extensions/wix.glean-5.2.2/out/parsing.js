"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("@babel/parser");
const traverse_1 = require("@babel/traverse");
const t = require("@babel/types");
const core_1 = require("@babel/core");
const settings_1 = require("./settings");
const template_1 = require("@babel/template");
exports.parsingOptions = {
    plugins: [
        'objectRestSpread',
        'classProperties',
        'typescript',
        'jsx',
        'optionalChaining',
    ],
    sourceType: 'module',
};
exports.codeToAst = (code) => parser_1.parse(code, Object.assign({ startLine: 0 }, exports.parsingOptions));
exports.jsxToAst = (code) => {
    try {
        return exports.codeToAst(code);
    }
    catch (e) {
        return exports.codeToAst(`<>${code}</>`);
    }
};
exports.templateToAst = (code) => template_1.default.ast(code, exports.parsingOptions);
function getIdentifier(code) {
    const identifiers = [];
    const Visitor = {
        Identifier(path) {
            if ((t.isProgram(path.parentPath.parent) ||
                t.isFile(path.parentPath.parent) ||
                t.isExportDeclaration(path.parentPath.parent)) &&
                path.listKey !== 'params' &&
                path.key !== 'superClass') {
                identifiers.push(path.node.name);
            }
        },
    };
    traverse_1.default(exports.codeToAst(code), Visitor);
    return identifiers;
}
exports.getIdentifier = getIdentifier;
function assignment(value) {
    return t.assignmentExpression('=', t.memberExpression(t.identifier('module'), t.identifier('exports'), false), value);
}
function generateExportsExpr(value) {
    return t.expressionStatement(assignment(value));
}
function getImportedIdentifier(identifiersString = '') {
    return settings_1.shouldUseExportDefault()
        ? `${identifiersString}`
        : `{ ${identifiersString} }`;
}
function generateImportStatementFromFile(identifiers, modulePath) {
    const identifiersString = identifiers.join(', ');
    if (settings_1.esmModuleSystemUsed()) {
        const importType = getImportedIdentifier(identifiersString);
        return `import ${importType} from './${modulePath}';\n`;
    }
    else if (settings_1.commonJSModuleSystemUsed()) {
        return `const { ${identifiersString} } = require('./${modulePath}');\n`;
    }
}
exports.generateImportStatementFromFile = generateImportStatementFromFile;
function exportAllDeclarationsESM(code) {
    const ast = exports.codeToAst(code);
    const visitor = {
        Declaration(path) {
            if (path.parent.type === 'Program' &&
                !path.node.type.includes('Export')) {
                // check use default declaration or not
                if (settings_1.shouldUseExportDefault()) {
                    path.replaceWith(t.exportDefaultDeclaration(path.node));
                }
                else {
                    path.replaceWith(t.exportNamedDeclaration(path.node, []));
                }
            }
        },
    };
    traverse_1.default(ast, visitor);
    return core_1.transformFromAst(ast).code;
}
exports.exportAllDeclarationsESM = exportAllDeclarationsESM;
function exportAllDeclarationsCommonJS(code) {
    const identifiers = getIdentifier(code).map((id) => t.objectProperty(t.identifier(id), t.identifier(id), false, true));
    const exportExpression = generateExportsExpr(t.objectExpression(identifiers));
    const ast = t.file(t.program([exportExpression]), '', '');
    return `
${code}
    
${core_1.transformFromAst(ast).code}
        `;
}
exports.exportAllDeclarationsCommonJS = exportAllDeclarationsCommonJS;
function transformJSIntoExportExpressions(code) {
    if (settings_1.esmModuleSystemUsed()) {
        return exportAllDeclarationsESM(code);
    }
    else if (settings_1.commonJSModuleSystemUsed()) {
        return exportAllDeclarationsCommonJS(code);
    }
}
exports.transformJSIntoExportExpressions = transformJSIntoExportExpressions;
exports.astToCode = (ast) => core_1.transformFromAst(ast).code;
//# sourceMappingURL=parsing.js.map