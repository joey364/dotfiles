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
const directories_picker_1 = require("../directories-picker");
const file_picker_1 = require("../file-picker");
const path = require("path");
const jsx_1 = require("./jsx");
const code_actions_1 = require("../code-actions");
const t = require("@babel/types");
const file_system_1 = require("../file-system");
const parsing_1 = require("../parsing");
const utils_1 = require("../utils");
const core_1 = require("@babel/core");
const traverse_1 = require("@babel/traverse");
const component_builder_1 = require("./component-builder");
function produceComponentNameFrom(fullPath) {
    const baseName = path.basename(fullPath, path.extname(fullPath));
    return baseName
        .split("-")
        .map(utils_1.capitalizeFirstLetter)
        .join("");
}
exports.produceComponentNameFrom = produceComponentNameFrom;
function wrapWithComponent(componentName, jsx) {
    const componentProperties = {
        argumentProps: new Set(),
        memberProps: new Set(),
        state: new Set(),
        componentMembers: new Set(),
    };
    const visitor = {
        Identifier(path) {
            let isMember = !!path.findParent((parentPath) => {
                return (t.isMemberExpression(parentPath.node) ||
                    path.isArrowFunctionExpression(parentPath.node));
            }) || t.isObjectProperty(path.parent);
            if (!isMember && !path.node.wasVisited && !path.shouldSkip) {
                componentProperties.argumentProps.add(path.node.name);
            }
        },
        MemberExpression(path) {
            if (!path.node.wasVisited) {
                if (t.isThisExpression(path.node.object.object) &&
                    (path.node.object.property.name === "props" ||
                        path.node.object.property.name === "state")) {
                    //props or state = path.node.property.name;
                    if (path.node.object.property.name === "props") {
                        componentProperties.memberProps.add(path.node.property.name);
                    }
                    else {
                        path.node.object.property.name = "props";
                        componentProperties.state.add(path.node.property.name);
                    }
                    path.replaceWith(t.identifier(path.node.property.name));
                }
                else {
                    if (t.isThisExpression(path.node.object)) {
                        componentProperties.componentMembers.add(path.node.property.name);
                        path.replaceWith(t.identifier(path.node.property.name));
                    }
                }
                path.node.wasVisited = true;
                path.skip();
            }
        },
    };
    const ast = parsing_1.jsxToAst(jsx);
    traverse_1.default(ast, visitor);
    const processedJSX = core_1.transformFromAst(ast).code;
    const indexOfLastSemicolon = processedJSX.lastIndexOf(";");
    const code = processedJSX.slice(0, indexOfLastSemicolon) +
        processedJSX.slice(indexOfLastSemicolon + 1);
    return {
        text: component_builder_1.buildComponent(componentName, code, componentProperties),
        metadata: {
            isJSX: true,
            componentProperties,
            name: componentName,
        },
    };
}
exports.wrapWithComponent = wrapWithComponent;
function createComponentInstance(name, props) {
    const stateToInputProps = Array.from(props.state)
        .map((prop) => `${prop}={this.state.${prop}}`)
        .join(" ");
    const argPropsToInputProps = Array.from(props.argumentProps)
        .map((prop) => `${prop}={${prop}}`)
        .join(" ");
    const memberPropsToInputProps = Array.from(props.memberProps)
        .map((prop) => `${prop}={this.props.${prop}}`)
        .join(" ");
    const componentMembersToInputProps = Array.from(props.componentMembers)
        .map((prop) => `${prop}={this.${prop}}`)
        .join(" ");
    return `<${name}  ${stateToInputProps} ${argPropsToInputProps} ${memberPropsToInputProps} ${componentMembersToInputProps}/>`;
}
exports.createComponentInstance = createComponentInstance;
function extractJSXToComponentToFile() {
    return __awaiter(this, void 0, void 0, function* () {
        var editor = editor_1.activeEditor();
        if (!editor) {
            return; // No open text editor
        }
        try {
            const folderPath = yield directories_picker_1.showDirectoryPicker();
            const filePath = yield file_picker_1.showFilePicker(folderPath);
            const componentName = produceComponentNameFrom(filePath);
            const selectionProccessingResult = yield wrapWithComponent(componentName, editor_1.selectedText());
            yield code_actions_1.appendSelectedTextToFile(selectionProccessingResult, filePath);
            yield jsx_1.importReactIfNeeded(filePath);
            yield code_actions_1.prependImportsToFileIfNeeded(selectionProccessingResult, filePath);
            const componentInstance = createComponentInstance(selectionProccessingResult.metadata.name, selectionProccessingResult.metadata.componentProperties);
            yield file_system_1.persistFileSystemChanges(code_actions_1.replaceSelectionWith(componentInstance));
            yield editor_1.importMissingDependencies(filePath);
            yield code_actions_1.switchToDestinationFileIfRequired(filePath);
        }
        catch (e) {
            code_actions_1.handleError(e);
        }
    });
}
exports.extractJSXToComponentToFile = extractJSXToComponentToFile;
function extractJSXToComponent() {
    return __awaiter(this, void 0, void 0, function* () {
        var editor = editor_1.activeEditor();
        if (!editor) {
            return; // No open text editor
        }
        try {
            const componentName = yield editor_1.showInputBox(null, "Select Component Name");
            const selectionProccessingResult = yield wrapWithComponent(componentName, editor_1.selectedText());
            yield file_system_1.appendTextToFile(selectionProccessingResult.text, editor_1.activeFileName());
            const componentInstance = createComponentInstance(selectionProccessingResult.metadata.name, selectionProccessingResult.metadata.componentProperties);
            yield file_system_1.persistFileSystemChanges(code_actions_1.replaceSelectionWith(componentInstance));
        }
        catch (e) {
            code_actions_1.handleError(e);
        }
    });
}
exports.extractJSXToComponent = extractJSXToComponent;
//# sourceMappingURL=extract-to-component.js.map