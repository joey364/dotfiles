"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const editor_1 = require("./editor");
const file_system_1 = require("./file-system");
const utils_1 = require("./utils");
function completeToFullFilePath(file, folder) {
    if (file === NEW_FILE_OPTION) {
        return promptFileNameInput(folder).then(file_system_1.createFileIfDoesntExist);
    }
    else {
        const root = editor_1.workspaceRoot();
        return `${root || ''}${folder}/${file}`;
    }
}
;
function promptFileNameInput(directory) {
    return editor_1.showInputBox(directory, 'Filename or relative path to a file')
        .then(editor_1.convertRelativeToFullPath);
}
exports.promptFileNameInput = promptFileNameInput;
const NEW_FILE_OPTION = 'Create New File';
function filesInDirectoryQuickPicksList(directory) {
    return editor_1.toQuickPicksList([
        NEW_FILE_OPTION,
        ...file_system_1.filesInFolder(directory)
    ]);
}
function showFilePicker(directory) {
    return editor_1.showQuickPicksList(filesInDirectoryQuickPicksList(directory), 'Select File to extract to')
        .then(editor_1.extractQuickPickValue)
        .then(utils_1.cancelActionIfNeeded)
        .then(file => completeToFullFilePath(file, directory));
}
exports.showFilePicker = showFilePicker;
;
//# sourceMappingURL=file-picker.js.map