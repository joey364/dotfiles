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
const code_actions_1 = require("../code-actions");
const file_system_1 = require("../file-system");
exports.removeSelectedTextFromOriginalFile = () => {
    let content = '';
    return file_system_1.removeContentFromFileAtLineAndColumn(editor_1.selectedTextStart(), editor_1.selectedTextEnd(), editor_1.activeFileName(), content);
};
function extractToFile() {
    return __awaiter(this, void 0, void 0, function* () {
        var editor = editor_1.activeEditor();
        if (!editor) {
            return; // No open text editor
        }
        try {
            const folderPath = yield directories_picker_1.showDirectoryPicker();
            const filePath = yield file_picker_1.showFilePicker(folderPath);
            const selectionProccessingResult = {
                text: editor_1.selectedText(),
                metadata: {}
            };
            yield code_actions_1.appendSelectedTextToFile(selectionProccessingResult, filePath);
            yield exports.removeSelectedTextFromOriginalFile();
            yield code_actions_1.prependImportsToFileIfNeeded(selectionProccessingResult, filePath);
            yield code_actions_1.switchToDestinationFileIfRequired(filePath);
        }
        catch (e) {
            code_actions_1.handleError(e);
        }
    });
}
exports.extractToFile = extractToFile;
//# sourceMappingURL=extract-to-file.js.map