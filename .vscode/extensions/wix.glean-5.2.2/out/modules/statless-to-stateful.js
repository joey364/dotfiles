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
const traverse_1 = require("@babel/traverse");
const t = require("@babel/types");
const core_1 = require("@babel/core");
const ast_helpers_1 = require("../ast-helpers");
const file_system_1 = require("../file-system");
const editor_1 = require("../editor");
const code_actions_1 = require("../code-actions");
function isStatelessComp(code) {
    const ast = parsing_1.templateToAst(code);
    return ((t.isVariableDeclaration(ast) && t.isFunction(ast.declarations[0].init)) ||
        (ast_helpers_1.isExportedDeclaration(ast) && t.isFunction(ast.declaration)) ||
        t.isFunction(ast));
}
exports.isStatelessComp = isStatelessComp;
function isReferenced(node, parent) {
    for (const param of parent.params) {
        if (param === node)
            return false;
    }
    return parent.id !== node;
}
function getRenderFunctionBody(statelessComponentBody) {
    if (t.isBlockStatement(statelessComponentBody)) {
        const returnStatement = statelessComponentBody.body.find(bodyContent => bodyContent.type === 'ReturnStatement');
        const returnStatementContent = returnStatement.argument;
        if (!t.isParenthesizedExpression(returnStatementContent)) {
            const parenthesizedReturnStatement = t.parenthesizedExpression(returnStatementContent);
            returnStatement.argument = parenthesizedReturnStatement;
        }
        return statelessComponentBody;
    }
    else if (t.isJSXElement(statelessComponentBody)) {
        const body = t.isParenthesizedExpression(statelessComponentBody) ? statelessComponentBody : t.parenthesizedExpression(statelessComponentBody);
        return t.blockStatement([t.returnStatement(body)]);
    }
    else {
        return t.blockStatement([t.returnStatement(statelessComponentBody)]);
    }
}
const getParamTypeAnnotation = (param) => {
    return param && param.typeAnnotation ? t.tsTypeParameterInstantiation([param.typeAnnotation.typeAnnotation]) : null;
};
const getDeclarationTypeAnnotation = (declaration) => {
    return declaration && declaration.typeAnnotation ? t.tsTypeParameterInstantiation([declaration.typeAnnotation.typeAnnotation.typeParameters.params[0]]) : null;
};
function statelessToStateful(component) {
    const defaultProps = new Map();
    let name;
    const visitor = {
        Function(path) {
            if (path.node.params.length) {
                if (path.node.params[0].type === 'ObjectPattern') {
                    path.node.params[0].properties.map(prop => {
                        if (isReferenced(prop.value, path.node)) {
                            if (t.isAssignmentPattern(prop.value)) {
                                defaultProps.set(prop.value.left.name, prop.value.right);
                            }
                            const name = prop.value ? (prop.value.left ? prop.value.left.name : prop.value.name) : prop.argument.name;
                            const membershipExpr = t.memberExpression(t.memberExpression(t.thisExpression(), t.identifier('props')), t.identifier(name));
                            path.scope.bindings[name].referencePaths.forEach(refPath => refPath.replaceWith(membershipExpr));
                        }
                    });
                }
                else {
                    path.scope.bindings[path.node.params[0].name].referencePaths.forEach(refPath => {
                        if (t.isIdentifier(refPath)) {
                            const membershipExpr = t.memberExpression(t.thisExpression(), refPath.node);
                            refPath.replaceWith(membershipExpr);
                        }
                    });
                }
            }
            let replacementPath;
            if (t.isArrowFunctionExpression(path)) {
                name = path.container.id;
            }
            else {
                name = path.node.id;
            }
            const typeAnnotation = getParamTypeAnnotation(path.node.params[0]) || getDeclarationTypeAnnotation(path.container.id);
            const render = t.classMethod('method', t.identifier('render'), [], getRenderFunctionBody(path.node.body));
            const superCall = t.expressionStatement(t.callExpression(t.super(), [t.identifier('props')]));
            const ctor = t.classMethod('constructor', t.identifier('constructor'), [t.identifier('props')], t.blockStatement([superCall]));
            const classDefinition = t.classDeclaration(name, t.identifier('Component'), t.classBody([ctor, render]));
            classDefinition.superTypeParameters = typeAnnotation;
            if (t.isArrowFunctionExpression(path) && !t.isExportDefaultDeclaration(path.parentPath)) {
                replacementPath = path.parentPath.parentPath;
            }
            else {
                replacementPath = path;
            }
            replacementPath.replaceWith(classDefinition);
            replacementPath.skip();
            path.skip();
        }
    };
    const ast = parsing_1.codeToAst(component);
    traverse_1.default(ast, visitor);
    if (defaultProps.size) {
        const properties = Array.from(defaultProps).map(([key, value]) => {
            return t.objectProperty(t.identifier(key), value);
        });
        ast.program.body.push(t.expressionStatement(t.assignmentExpression('=', t.memberExpression(name, t.identifier('defaultProps')), t.objectExpression(properties))));
    }
    const processedJSX = core_1.transformFromAst(ast).code;
    return {
        text: processedJSX,
        metadata: {}
    };
}
exports.statelessToStateful = statelessToStateful;
function statelessToStatefulComponent() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const selectionProccessingResult = statelessToStateful(editor_1.selectedText());
            yield file_system_1.persistFileSystemChanges(code_actions_1.replaceSelectionWith(selectionProccessingResult.text));
        }
        catch (e) {
            code_actions_1.handleError(e);
        }
    });
}
exports.statelessToStatefulComponent = statelessToStatefulComponent;
//# sourceMappingURL=statless-to-stateful.js.map