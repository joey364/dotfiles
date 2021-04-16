"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArduinoWorkspace = void 0;
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const constants_1 = require("./constants");
class ArduinoWorkspace {
    static get rootPath() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            return undefined;
        }
        for (const workspaceFolder of workspaceFolders) {
            const workspaceFolderPath = workspaceFolder.uri.fsPath;
            const arduinoConfigPath = path.join(workspaceFolderPath, constants_1.ARDUINO_CONFIG_FILE);
            if (fs.existsSync(arduinoConfigPath)) {
                return workspaceFolderPath;
            }
        }
        return workspaceFolders[0].uri.fsPath;
    }
}
exports.ArduinoWorkspace = ArduinoWorkspace;

//# sourceMappingURL=workspace.js.map
