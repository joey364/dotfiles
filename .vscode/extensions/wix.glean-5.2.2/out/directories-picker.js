"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const editor_1 = require("./editor");
const file_system_1 = require("./file-system");
const utils_1 = require("./utils");
function getWorkspaceFolderStructure() {
    return new Promise((resolveWith, reject) => {
        const findDirectories = () => {
            try {
                resolveWith(file_system_1.subfoldersListOf(editor_1.workspaceRoot(), file_system_1.gitIgnoreFolders()));
            }
            catch (error) {
                reject(error);
            }
        };
        const delayToAllowVSCodeToRender = 1;
        setTimeout(findDirectories, delayToAllowVSCodeToRender);
    });
}
const prependQuickpickForCurrentFileFolder = (quickPicksList) => {
    return [
        editor_1.toQuickPick(editor_1.currentEditorPath(), 'current file directory'),
        ...quickPicksList
    ];
};
const getQuickPicksForWorkspaceFolderStructure = () => {
    if (!editor_1.workspaceRoot()) {
        return Promise.resolve([]);
    }
    return getWorkspaceFolderStructure().then(editor_1.toQuickPicksList);
};
function showDirectoryPicker() {
    return getQuickPicksForWorkspaceFolderStructure()
        .then(prependQuickpickForCurrentFileFolder)
        .then(choices => editor_1.showQuickPicksList(choices, 'Pick directory that contains the file'))
        .then(editor_1.extractQuickPickValue)
        .then(utils_1.cancelActionIfNeeded);
}
exports.showDirectoryPicker = showDirectoryPicker;
//# sourceMappingURL=directories-picker.js.map