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
exports.CompletionProvider = void 0;
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const constants = require("../common/constants");
const util = require("../common/util");
const vscodeSettings_1 = require("../arduino/vscodeSettings");
const arduinoActivator_1 = require("../arduinoActivator");
const arduinoContext_1 = require("../arduinoContext");
const workspace_1 = require("../common/workspace");
/**
 * Provides completions for library header includes.
 *
 * NOTE: With the new IntelliSense auto-configuration this doesn't make
 * much sense in its current state, since it tries to fetch includes
 * from the wrongly guessed include paths. And it tries to fetch includes
 * from the c_cpp_properties which is now automatically generated from the
 * files already included -> therefore the user already included the header
 * and doesn't need a completion. Furthermore IntelliSense knows the location
 * as well and can complete it too.
 *
 * To make this useful it has to parse the actual library folders and then
 * it makes only sense if it reads the library information and checks if
 * the individual libraries are actually compatible with the current board
 * before offering a completion.
 *
 * EW, 2020-02-17
 */
class CompletionProvider {
    constructor() {
        this._headerFiles = new Set();
        this._libPaths = new Set();
        this._activated = false;
        if (vscode.workspace && workspace_1.ArduinoWorkspace.rootPath) {
            this._cppConfigFile = path.join(workspace_1.ArduinoWorkspace.rootPath, constants.CPP_CONFIG_FILE);
            this._watcher = vscode.workspace.createFileSystemWatcher(this._cppConfigFile);
            this._watcher.onDidCreate(() => this.updateLibList());
            this._watcher.onDidChange(() => this.updateLibList());
            this._watcher.onDidDelete(() => this.updateLibList());
        }
    }
    provideCompletionItems(document, position) {
        return __awaiter(this, void 0, void 0, function* () {
            if (vscodeSettings_1.VscodeSettings.getInstance().skipHeaderProvider) {
                return [];
            }
            if (!arduinoContext_1.default.initialized) {
                yield arduinoActivator_1.default.activate();
            }
            if (!this._activated) {
                this._activated = true;
                this.updateLibList();
            }
            // Check if we are currently inside an include statement.
            const text = document.lineAt(position.line).text.substr(0, position.character);
            const match = text.match(/^\s*#\s*include\s*(<[^>]*|"[^"]*)$/);
            if (match) {
                const result = [];
                this._headerFiles.forEach((headerFile) => {
                    result.push(new vscode.CompletionItem(headerFile, vscode.CompletionItemKind.File));
                });
                return result;
            }
        });
    }
    updateLibList() {
        if (!this._activated) {
            return;
        }
        this._libPaths.clear();
        this._headerFiles.clear();
        if (fs.existsSync(this._cppConfigFile)) {
            const deviceConfig = util.tryParseJSON(fs.readFileSync(this._cppConfigFile, "utf8"));
            if (deviceConfig) {
                if (deviceConfig.sketch) {
                    const appFolder = path.dirname(deviceConfig.sketch);
                    if (util.directoryExistsSync(appFolder)) {
                        this._libPaths.add(path.normalize(appFolder));
                    }
                }
                if (deviceConfig.configurations) {
                    deviceConfig.configurations.forEach((configSection) => {
                        if (configSection.name === constants.C_CPP_PROPERTIES_CONFIG_NAME && Array.isArray(configSection.includePath)) {
                            configSection.includePath.forEach((includePath) => {
                                this._libPaths.add(path.normalize(includePath));
                            });
                        }
                    });
                }
            }
        }
        this._libPaths.forEach((includePath) => {
            this.addLibFiles(includePath);
        });
    }
    addLibFiles(libPath) {
        if (!util.directoryExistsSync(libPath)) {
            return;
        }
        const subItems = fs.readdirSync(libPath);
        subItems.forEach((item) => {
            try {
                const state = fs.statSync(path.join(libPath, item));
                if (state.isFile() && item.endsWith(".h")) {
                    this._headerFiles.add(item);
                }
                else if (state.isDirectory()) {
                    this.addLibFiles(path.join(libPath, item));
                }
            }
            catch (ex) {
            }
        });
    }
}
exports.CompletionProvider = CompletionProvider;

//# sourceMappingURL=completionProvider.js.map
