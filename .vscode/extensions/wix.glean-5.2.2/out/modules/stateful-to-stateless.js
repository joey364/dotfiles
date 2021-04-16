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
const template_1 = require("@babel/template");
const t = require("@babel/types");
const core_1 = require("@babel/core");
const utils_1 = require("../utils");
const settings_1 = require("../settings");
const ast_helpers_1 = require("../ast-helpers");
const editor_1 = require("../editor");
const code_actions_1 = require("../code-actions");
const file_system_1 = require("../file-system");
const vscode_1 = require("vscode");
const snippet_builder_1 = require("../snippet-builder");
function statefulToStateless(component) {
    const functionBody = [];
    const stateProperties = new Map();
    const refProperties = new Map();
    const classMethods = new Set();
    const RemoveThisVisitor = {
        MemberExpression(path) {
            if (path.node.wasVisited || path.shouldSkip)
                return;
            if (settings_1.hooksSupported() &&
                path.key !== "callee") {
                if (t.isIdentifier(path.node.property) &&
                    t.isThisExpression(path.node.object) &&
                    !classMethods.has(path.node.property.name) &&
                    path.node.property.name !== 'props') {
                    if (!refProperties.has(path.node.property.name)) {
                        refProperties.set(path.node.property.name, undefined);
                    }
                    const replacement = t.memberExpression(t.identifier(path.node.property.name), t.identifier("current"));
                    replacement.wasVisited = true;
                    path.replaceWith(replacement);
                    path.skip();
                }
                else {
                    if (t.isThisExpression(path.node.object.object) &&
                        !classMethods.has(path.node.property.name)) {
                        path.replaceWith(t.memberExpression(t.identifier("props"), path.node.property));
                    }
                    else {
                        if (t.isThisExpression(path.node.object)) {
                            path.replaceWith(path.node.property);
                        }
                    }
                }
                path.skip();
            }
            else {
                if (t.isThisExpression(path.node.object)) {
                    path.replaceWith(path.node.property);
                }
            }
        },
    };
    const ReplaceStateWithPropsVisitor = {
        MemberExpression(path) {
            if (settings_1.hooksSupported()) {
                if (t.isThisExpression(path.node.object.object) &&
                    path.node.object.property.name === "state") {
                    const stateVariable = path.node.property.name;
                    if (!stateProperties.has(stateVariable)) {
                        stateProperties.set(stateVariable, void 0);
                    }
                    path.replaceWith(t.identifier(stateVariable));
                }
            }
            else {
                if (t.isThisExpression(path.node.object) &&
                    path.node.property.name === "state") {
                    path.node.property.name = "props";
                }
            }
        },
    };
    const RemoveSetStateAndForceUpdateVisitor = {
        CallExpression(path) {
            if (t.isMemberExpression(path.node.callee) &&
                t.isThisExpression(path.node.callee.object)) {
                if (settings_1.hooksSupported()) {
                    if (path.node.callee.property.name === "forceUpdate") {
                        path.remove();
                    }
                    else if (path.node.callee.property.name === "setState") {
                        const buildRequire = template_1.default(`
              STATE_SETTER(STATE_VALUE);
            `);
                        if (isStateChangedThroughFunction(path.node.arguments[0])) {
                            covertStateChangeThroughFunction(path, buildRequire, stateProperties);
                        }
                        else {
                            convertStateChangeThroughObject(path, buildRequire, stateProperties);
                        }
                        path.remove();
                    }
                }
                else {
                    if (["setState", "forceUpdate"].indexOf(path.node.callee.property.name) !== -1) {
                        path.remove();
                    }
                }
            }
        },
    };
    let nonLifeycleMethodsPresent = false;
    let effectBody, effectTeardown;
    const lifecycleMethods = [
        "constructor",
        "componentWillMount",
        "componentDidMount",
        "componentWillReceiveProps",
        "shouldComponentUpdate",
        "componentWillUpdate",
        "componentDidUpdate",
        "componentWillUnmount",
        "componentDidCatch",
        "getDerivedStateFromProps",
    ];
    const namedArrowFunction = ({ name, params = [], propType = null, paramDefaults = [], body = [], arrowFunctionCreator = arrowFunction, isAsync = false, }) => {
        const identifier = t.identifier(name);
        addPropTSAnnotationIfNeeded(propType, identifier);
        return t.variableDeclaration("const", [
            t.variableDeclarator(identifier, arrowFunctionCreator(params, paramDefaults, body, isAsync)),
        ]);
    };
    const copyNonLifeCycleMethods = (path) => {
        const methodName = path.node.key.name;
        const classBody = t.isClassMethod(path)
            ? path["node"].body.body
            : path.node.value.body.body;
        if (!lifecycleMethods.includes(methodName)) {
            path.traverse(RemoveSetStateAndForceUpdateVisitor);
            path.traverse(ReplaceStateWithPropsVisitor);
            path.traverse(RemoveThisVisitor);
            appendFunctionBodyToStatelessComponent(methodName, classBody, path.node.async);
        }
        else if (settings_1.hooksSupported()) {
            if (methodName === "componentDidMount") {
                path.traverse(RemoveSetStateAndForceUpdateVisitor);
                path.traverse(ReplaceStateWithPropsVisitor);
                path.traverse(RemoveThisVisitor);
                effectBody = path.node.body;
            }
            else if (methodName === "componentWillUnmount") {
                path.traverse(RemoveSetStateAndForceUpdateVisitor);
                path.traverse(ReplaceStateWithPropsVisitor);
                path.traverse(RemoveThisVisitor);
                effectTeardown = path.node.body;
            }
        }
    };
    const appendFunctionBodyToStatelessComponent = (name, body, isAsync) => {
        if (name !== "render") {
            if (settings_1.hooksSupported()) {
                functionBody.push(namedArrowFunction({
                    name,
                    body,
                    arrowFunctionCreator: (params, paramDefaults, arrowBody) => snippet_builder_1.buildUseCallbackHook({
                        CALLBACK: arrowFunction(params, paramDefaults, arrowBody, isAsync),
                    }).expression,
                }));
            }
            else {
                functionBody.push(namedArrowFunction({ name, body, isAsync }));
            }
        }
        else {
            functionBody.push(...body);
        }
    };
    const visitor = {
        ClassDeclaration(path) {
            const statelessComponentName = path.node.id.name;
            const defaultPropsPath = path
                .get("body")
                .get("body")
                .find((property) => {
                return (t.isClassProperty(property) &&
                    property["node"].key.name === "defaultProps");
            });
            const statelessComponent = namedArrowFunction({
                name: statelessComponentName,
                params: ["props"],
                propType: path.node.superTypeParameters &&
                    path.node.superTypeParameters.params.length
                    ? path.node.superTypeParameters.params
                    : null,
                paramDefaults: defaultPropsPath ? [defaultPropsPath.node.value] : [],
                body: functionBody,
            });
            const isExportDefaultDeclaration = t.isExportDefaultDeclaration(path.container);
            const isExportNamedDeclaration = t.isExportNamedDeclaration(path.container);
            const exportDefaultStatelessComponent = t.exportDefaultDeclaration(t.identifier(statelessComponentName));
            const exportNamedStatelessComponent = t.exportNamedDeclaration(statelessComponent, []);
            const mainPath = t.isExportDeclaration(path.container)
                ? path.findParent((p) => t.isExportDeclaration(p))
                : path;
            if (isExportDefaultDeclaration) {
                mainPath.insertBefore(statelessComponent);
                mainPath.insertBefore(exportDefaultStatelessComponent);
            }
            else if (isExportNamedDeclaration) {
                mainPath.insertBefore(exportNamedStatelessComponent);
            }
            else {
                mainPath.insertBefore(statelessComponent);
            }
        },
        ClassMethod(path) {
            if (settings_1.hooksSupported()) {
                const methodName = path.node.key.name;
                classMethods.add(methodName);
                if (!lifecycleMethods.includes(methodName) && methodName !== "render") {
                    nonLifeycleMethodsPresent = true;
                }
                if (path.node.kind === "constructor") {
                    const { expression = null } = path.node.body.body.find((bodyStatement) => {
                        return t.isAssignmentExpression(bodyStatement.expression);
                    }) || {};
                    if (expression && expression.left.property.name === "state") {
                        expression.right.properties.map(({ key, value }) => {
                            stateProperties.set(key.name, value);
                        });
                    }
                }
            }
            copyNonLifeCycleMethods(path);
        },
        ClassProperty(path) {
            const propValue = path.node.value;
            if (t.isFunctionExpression(propValue) ||
                t.isArrowFunctionExpression(propValue)) {
                classMethods.add(path.node.key.name);
                copyNonLifeCycleMethods(path);
            }
            else {
                refProperties.set(path.node.key.name, path.node.value);
            }
            if (t.isObjectExpression(propValue) && path.node.key.name === "state") {
                propValue.properties.map(({ key, value }) => {
                    stateProperties.set(key.name, value);
                });
            }
        },
        ImportDeclaration(path) {
            if (path.node.source.value === "react") {
            }
        },
    };
    const ast = parsing_1.codeToAst(component);
    const hasComponentDidUpdate = (node) => {
        const classDeclaration = ast_helpers_1.isExportedDeclaration(node)
            ? node.declaration
            : ast.program.body[0];
        return Boolean(classDeclaration.body.body.find((node) => t.isClassMethod(node) &&
            node.key.name === "componentDidUpdate"));
    };
    traverse_1.default(ast, visitor);
    if (settings_1.hooksSupported()) {
        const refHookExpression = Array.from(refProperties).map(([key, defaultValue]) => {
            return snippet_builder_1.buildRefHook({
                VAR_NAME: t.identifier(key),
                INITIAL_VALUE: defaultValue,
            });
        });
        functionBody.unshift(...refHookExpression);
        if (effectBody || effectTeardown) {
            const expressions = [];
            if (effectBody) {
                expressions.push(...effectBody.body);
            }
            if (effectTeardown) {
                expressions.push(t.returnStatement(t.arrowFunctionExpression([], effectTeardown)));
            }
            const lifecycleEffectHook = snippet_builder_1.buildEffectHook({ EFFECT: expressions });
            lifecycleEffectHook.expression.arguments.push(t.arrayExpression([]));
            functionBody.unshift(lifecycleEffectHook);
        }
        const hookExpressions = Array.from(stateProperties).map(([key, defaultValue]) => {
            return snippet_builder_1.buildStateHook({
                STATE_PROP: t.identifier(key),
                STATE_SETTER: t.identifier(`set${utils_1.capitalizeFirstLetter(key)}`),
                STATE_VALUE: defaultValue,
            });
        });
        functionBody.unshift(...hookExpressions);
    }
    ast.program.body.splice(-1);
    const processedJSX = core_1.transformFromAst(ast).code;
    return {
        text: processedJSX,
        metadata: {
            stateHooksPresent: stateProperties.size > 0,
            refHooksPresent: refProperties.size > 0,
            nonLifeycleMethodsPresent,
        },
    };
}
exports.statefulToStateless = statefulToStateless;
function isStateChangedThroughFunction(setStateArg) {
    return (t.isFunctionExpression(setStateArg) ||
        t.isArrowFunctionExpression(setStateArg));
}
function convertStateChangeThroughObject(path, buildRequire, stateProperties) {
    path.node.arguments[0].properties.forEach(({ key, value }) => {
        path.insertBefore(buildRequire({
            STATE_SETTER: t.identifier(`set${utils_1.capitalizeFirstLetter(key.name)}`),
            STATE_VALUE: value,
        }));
        if (!stateProperties.has(key.name)) {
            stateProperties.set(key.name, void 0);
        }
    });
}
function covertStateChangeThroughFunction(path, buildRequire, stateProperties) {
    const stateProducer = path.node.arguments[0];
    const stateProducerArg = stateProducer.params[0];
    const isPrevStateDestructured = t.isObjectPattern(stateProducerArg);
    if (!isPrevStateDestructured) {
        path.traverse({
            Identifier(nestedPath) {
                if (nestedPath.listKey === "params") {
                    Object.values(nestedPath.scope.bindings)[0].referencePaths.forEach((ref) => {
                        ref.parentPath.replaceWith(ref.container.property);
                    });
                }
            },
        });
    }
    let stateUpdates;
    if (t.isObjectExpression(stateProducer.body)) {
        stateUpdates = stateProducer.body.properties;
    }
    else {
        stateUpdates = stateProducer.body.body.find((exp) => t.isReturnStatement(exp)).argument.properties;
    }
    stateUpdates.forEach((prop) => {
        const fn = arrowFunction([prop.key.name], [], [t.returnStatement(prop.value)]);
        traverse_1.default(fn, {
            Identifier(ss) {
                if (ss.node.name === prop.key.name && ss.key !== "key") {
                    ss.node.name = `prev${utils_1.capitalizeFirstLetter(prop.key.name)}`;
                }
            },
        }, path.scope, path);
        path.insertBefore(buildRequire({
            STATE_SETTER: t.identifier(`set${utils_1.capitalizeFirstLetter(prop.key.name)}`),
            STATE_VALUE: fn,
        }));
        if (!stateProperties.has(prop.key.name)) {
            stateProperties.set(prop.key.name, void 0);
        }
    });
}
function arrowFunction(params, paramDefaults, body, isAsync = false) {
    return t.arrowFunctionExpression(params.map((param, idx) => {
        const paramIdentifier = t.identifier(param);
        let paramObj = paramIdentifier;
        if (paramDefaults[idx]) {
            paramObj = t.assignmentPattern(paramIdentifier, paramDefaults[idx]);
        }
        return paramObj;
    }), t.blockStatement(body), isAsync);
}
function addPropTSAnnotationIfNeeded(typeAnnotation, identifier) {
    if (typeAnnotation) {
        identifier.typeAnnotation = resolveTypeAnnotation(typeAnnotation);
    }
}
function resolveTypeAnnotation(propType) {
    let typeAnnotation;
    const hasTypeReferences = propType.some((annotation) => t.isTSTypeReference(annotation));
    if (hasTypeReferences) {
        if (propType.length > 1) {
            typeAnnotation = t.tsIntersectionType(propType);
        }
        else {
            typeAnnotation = propType[0];
        }
    }
    else {
        const members = propType.reduce((acc, typeLiteral) => {
            return [...acc, ...typeLiteral.members];
        }, []);
        typeAnnotation = t.tsTypeLiteral(members);
    }
    const componentTypeAnnotation = settings_1.hooksSupported()
        ? "FC"
        : "SFC";
    return t.tsTypeAnnotation(t.tsTypeReference(t.identifier(componentTypeAnnotation), t.tsTypeParameterInstantiation([typeAnnotation])));
}
function statefulToStatelessComponent() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const answer = settings_1.shouldShowConversionWarning()
                ? yield editor_1.showInformationMessage("WARNING! All lifecycle methods and react instance methods would be removed. Are you sure you want to continue?", ["Yes", "No"])
                : "Yes";
            if (answer === "Yes") {
                const selectionProccessingResult = statefulToStateless(editor_1.selectedText());
                const persistantChanges = [
                    code_actions_1.replaceSelectionWith(selectionProccessingResult.text),
                ];
                const { stateHooksPresent, refHooksPresent, nonLifeycleMethodsPresent, } = selectionProccessingResult.metadata;
                const usedHooks = [
                    ...(stateHooksPresent ? ["useState"] : []),
                    ...(refHooksPresent ? ["useRef"] : []),
                    ...(nonLifeycleMethodsPresent ? ["useCallback"] : []),
                ];
                if (usedHooks.length) {
                    persistantChanges.push(importHooks(...usedHooks));
                }
                yield file_system_1.persistFileSystemChanges(...persistantChanges);
                yield editor_1.importMissingDependencies(editor_1.activeFileName());
            }
        }
        catch (e) {
            code_actions_1.handleError(e);
        }
        function importHooks(...hooks) {
            const currentFile = editor_1.activeURI().fsPath;
            const file = file_system_1.readFileContent(currentFile);
            const ast = parsing_1.codeToAst(file);
            const reactImport = ast_helpers_1.getReactImportReference(ast);
            hooks.forEach((hook) => {
                reactImport.specifiers.push(t.importSpecifier(t.identifier(hook), t.identifier(hook)));
            });
            const updatedReactImport = core_1.transformFromAst(t.program([reactImport])).code;
            return file_system_1.replaceTextInFile(updatedReactImport, new vscode_1.Position(reactImport.loc.start.line, reactImport.loc.start.column), new vscode_1.Position(reactImport.loc.end.line, reactImport.loc.end.column), editor_1.activeFileName());
        }
    });
}
exports.statefulToStatelessComponent = statefulToStatelessComponent;
function isStatefulComp(code) {
    const ast = parsing_1.templateToAst(code);
    const isSupportedComponent = (classPath) => {
        const supportedComponents = ["Component", "PureComponent"];
        if (!classPath) {
            return false;
        }
        return (classPath.superClass &&
            ((classPath.superClass.object &&
                classPath.superClass.object.name === "React" &&
                supportedComponents.indexOf(classPath.superClass.property.name) !==
                    -1) ||
                supportedComponents.indexOf(classPath.superClass.name) !== -1));
    };
    return ((ast_helpers_1.isExportedDeclaration(ast) && isSupportedComponent(ast.declaration)) ||
        isSupportedComponent(ast));
}
exports.isStatefulComp = isStatefulComp;
//# sourceMappingURL=stateful-to-stateless.js.map