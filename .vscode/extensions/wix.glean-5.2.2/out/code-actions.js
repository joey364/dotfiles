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
const editor_1 = require("./editor");
const settings_1 = require("./settings");
const file_system_1 = require("./file-system");
const parsing_1 = require("./parsing");
const relative = require("relative");
const path = require("path");
function switchToDestinationFileIfRequired(destinationFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (settings_1.shouldSwitchToTarget()) {
            yield editor_1.openFile(destinationFilePath);
        }
    });
}
exports.switchToDestinationFileIfRequired = switchToDestinationFileIfRequired;
function replaceSelectionWith(text) {
    return file_system_1.replaceTextInFile(text, editor_1.selectedTextStart(), editor_1.selectedTextEnd(), editor_1.activeFileName());
}
exports.replaceSelectionWith = replaceSelectionWith;
exports.appendSelectedTextToFile = ({ text: selection }, destinationPath) => {
    let text;
    if (exports.isOperationBetweenJSFiles(destinationPath)) {
        text = parsing_1.transformJSIntoExportExpressions(selection);
    }
    else {
        text = selection;
    }
    return file_system_1.appendTextToFile(`
${text}
  `, destinationPath);
};
exports.prependImportsToFileIfNeeded = ({ text: selection }, destinationFilePath) => {
    if (!exports.isOperationBetweenJSFiles(destinationFilePath))
        return;
    const originFilePath = editor_1.activeFileName();
    const identifiers = parsing_1.getIdentifier(selection);
    const destinationPathRelativeToOrigin = relative(originFilePath, destinationFilePath);
    const destinationFileName = path.parse(destinationPathRelativeToOrigin).name;
    const destinationModule = [...destinationPathRelativeToOrigin.split('/').slice(0, -1), destinationFileName].join('/');
    const importStatement = parsing_1.generateImportStatementFromFile(identifiers, destinationModule);
    return file_system_1.prependTextToFile(importStatement, originFilePath);
};
exports.isOperationBetweenJSFiles = destinationPath => settings_1.shouldBeConsideredJsFiles(editor_1.activeFileName(), destinationPath);
exports.handleError = e => {
    if (e) {
        editor_1.showErrorMessage(e.message);
    }
};
//# sourceMappingURL=code-actions.js.map