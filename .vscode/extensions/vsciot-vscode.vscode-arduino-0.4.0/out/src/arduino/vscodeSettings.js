"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VscodeSettings = void 0;
const vscode = require("vscode");
const configKeys = {
    ARDUINO_PATH: "arduino.path",
    ARDUINO_COMMAND_PATH: "arduino.commandPath",
    ADDITIONAL_URLS: "arduino.additionalUrls",
    LOG_LEVEL: "arduino.logLevel",
    AUTO_UPDATE_INDEX_FILES: "arduino.autoUpdateIndexFiles",
    ALLOW_PDE_FILETYPE: "arduino.allowPDEFiletype",
    ENABLE_USB_DETECTION: "arduino.enableUSBDetection",
    DISABLE_TESTING_OPEN: "arduino.disableTestingOpen",
    IGNORE_BOARDS: "arduino.ignoreBoards",
    SKIP_HEADER_PROVIDER: "arduino.skipHeaderProvider",
    DEFAULT_BAUD_RATE: "arduino.defaultBaudRate",
    USE_ARDUINO_CLI: "arduino.useArduinoCli",
    DISABLE_INTELLISENSE_AUTO_GEN: "arduino.disableIntelliSenseAutoGen",
};
class VscodeSettings {
    constructor() {
    }
    static getInstance() {
        if (!VscodeSettings._instance) {
            VscodeSettings._instance = new VscodeSettings();
        }
        return VscodeSettings._instance;
    }
    get arduinoPath() {
        return this.getConfigValue(configKeys.ARDUINO_PATH);
    }
    get commandPath() {
        return this.getConfigValue(configKeys.ARDUINO_COMMAND_PATH);
    }
    get additionalUrls() {
        return this.getConfigValue(configKeys.ADDITIONAL_URLS);
    }
    get logLevel() {
        return this.getConfigValue(configKeys.LOG_LEVEL) || "info";
    }
    get allowPDEFiletype() {
        return this.getConfigValue(configKeys.ALLOW_PDE_FILETYPE);
    }
    get enableUSBDetection() {
        return this.getConfigValue(configKeys.ENABLE_USB_DETECTION);
    }
    get disableTestingOpen() {
        return this.getConfigValue(configKeys.DISABLE_TESTING_OPEN);
    }
    get ignoreBoards() {
        return this.getConfigValue(configKeys.IGNORE_BOARDS);
    }
    set ignoreBoards(value) {
        this.setConfigValue(configKeys.IGNORE_BOARDS, value, true);
    }
    get defaultBaudRate() {
        return this.getConfigValue(configKeys.DEFAULT_BAUD_RATE);
    }
    get useArduinoCli() {
        return this.getConfigValue(configKeys.USE_ARDUINO_CLI);
    }
    get skipHeaderProvider() {
        return this.getConfigValue(configKeys.SKIP_HEADER_PROVIDER);
    }
    get disableIntelliSenseAutoGen() {
        return this.getConfigValue(configKeys.DISABLE_INTELLISENSE_AUTO_GEN);
    }
    updateAdditionalUrls(value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setConfigValue(configKeys.ADDITIONAL_URLS, value, true);
        });
    }
    getConfigValue(key) {
        const workspaceConfig = vscode.workspace.getConfiguration();
        return workspaceConfig.get(key);
    }
    setConfigValue(key, value, global = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const workspaceConfig = vscode.workspace.getConfiguration();
            yield workspaceConfig.update(key, value, global);
        });
    }
}
exports.VscodeSettings = VscodeSettings;

//# sourceMappingURL=vscodeSettings.js.map
