"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExecutableFileName = exports.findFile = exports.validateArduinoPath = exports.resolveArduinoPath = exports.isLinux = exports.isMacintosh = exports.isWindows = void 0;
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const path = require("path");
exports.isWindows = (process.platform === "win32");
exports.isMacintosh = (process.platform === "darwin");
exports.isLinux = (process.platform === "linux");
/*tslint:disable:no-var-requires*/
const internalSysLib = require(path.join(__dirname, `sys/${process.platform}`));
function resolveArduinoPath() {
    return internalSysLib.resolveArduinoPath();
}
exports.resolveArduinoPath = resolveArduinoPath;
function validateArduinoPath(arduinoPath, useArduinoCli = false) {
    return internalSysLib.validateArduinoPath(arduinoPath, useArduinoCli);
}
exports.validateArduinoPath = validateArduinoPath;
function findFile(fileName, cwd) {
    return internalSysLib.findFile(fileName, cwd);
}
exports.findFile = findFile;
function getExecutableFileName(fileName) {
    if (exports.isWindows) {
        return `${fileName}.exe`;
    }
    return fileName;
}
exports.getExecutableFileName = getExecutableFileName;

//# sourceMappingURL=platform.js.map
