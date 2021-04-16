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
exports.DeviceContext = void 0;
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const constants = require("./common/constants");
const util = require("./common/util");
const constants_1 = require("./common/constants");
const workspace_1 = require("./common/workspace");
const deviceSettings_1 = require("./deviceSettings");
class DeviceContext {
    /**
     * @constructor
     */
    constructor() {
        this._settings = new deviceSettings_1.DeviceSettings();
        this._suppressSaveContext = false;
        if (vscode.workspace && workspace_1.ArduinoWorkspace.rootPath) {
            this._watcher = vscode.workspace.createFileSystemWatcher(path.join(workspace_1.ArduinoWorkspace.rootPath, constants_1.ARDUINO_CONFIG_FILE));
            // We only care about the deletion arduino.json in the .vscode folder:
            this._vscodeWatcher = vscode.workspace.createFileSystemWatcher(path.join(workspace_1.ArduinoWorkspace.rootPath, ".vscode"), true, true, false);
            this._watcher.onDidCreate(() => this.loadContext());
            this._watcher.onDidChange(() => this.loadContext());
            this._watcher.onDidDelete(() => this.loadContext());
            this._vscodeWatcher.onDidDelete(() => this.loadContext());
            this._sketchStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, constants.statusBarPriority.SKETCH);
            this._sketchStatusBar.command = "arduino.setSketchFile";
            this._sketchStatusBar.tooltip = "Sketch File";
        }
    }
    static getInstance() {
        return DeviceContext._deviceContext;
    }
    dispose() {
        if (this._watcher) {
            this._watcher.dispose();
        }
        if (this._vscodeWatcher) {
            this._vscodeWatcher.dispose();
        }
    }
    get extensionPath() {
        return this._extensionPath;
    }
    set extensionPath(value) {
        this._extensionPath = value;
    }
    /**
     * TODO: Current we use the Arduino default settings. For future release, this dependency might be removed
     * and the setting only depends on device.json.
     * @method
     *
     * TODO EW, 2020-02-18:
     * A problem I discovered: here you try to find the config file location
     * and when you're writing below, you use a hard-coded location. When
     * resorting to "find", you have to store the file's location at least and
     * reuse it when saving.
     * But I think the intention is: load a config file from anywhere and save
     * it under .vscode/arduino.json. But then the initial load has to use find
     * and afterwards it must not use find anymore.
     */
    loadContext() {
        return vscode.workspace.findFiles(constants_1.ARDUINO_CONFIG_FILE, null, 1)
            .then((files) => {
            if (files && files.length > 0) {
                this._settings.load(files[0].fsPath);
                // on invalid configuration we continue with current settings
            }
            else {
                // No configuration file found, starting over with defaults
                this._settings.reset();
            }
            return this;
        }, (reason) => {
            // Workaround for change in API.
            // vscode.workspace.findFiles() for some reason now throws an error ehn path does not exist
            // vscode.window.showErrorMessage(reason.toString());
            // Logger.notifyUserError("arduinoFileUnhandleError", new Error(reason.toString()));
            // Workaround for change in API, populate required props for arduino.json
            this._settings.reset();
            return this;
        });
    }
    showStatusBar() {
        if (!this._settings.sketch.value) {
            return false;
        }
        this._sketchStatusBar.text = this._settings.sketch.value;
        this._sketchStatusBar.show();
    }
    get onChangePort() { return this._settings.port.emitter.event; }
    get onChangeBoard() { return this._settings.board.emitter.event; }
    get onChangeSketch() { return this._settings.sketch.emitter.event; }
    get onChangeOutput() { return this._settings.output.emitter.event; }
    get onChangeDebugger() { return this._settings.debugger.emitter.event; }
    get onChangeISAutoGen() { return this._settings.intelliSenseGen.emitter.event; }
    get onChangeConfiguration() { return this._settings.configuration.emitter.event; }
    get onChangePrebuild() { return this._settings.prebuild.emitter.event; }
    get onChangePostbuild() { return this._settings.postbuild.emitter.event; }
    get onChangeProgrammer() { return this._settings.programmer.emitter.event; }
    get port() {
        return this._settings.port.value;
    }
    set port(value) {
        this._settings.port.value = value;
        this.saveContext();
    }
    get board() {
        return this._settings.board.value;
    }
    set board(value) {
        this._settings.board.value = value;
        this.saveContext();
    }
    get sketch() {
        return this._settings.sketch.value;
    }
    set sketch(value) {
        this._settings.sketch.value = value;
        this.saveContext();
    }
    get prebuild() {
        return this._settings.prebuild.value;
    }
    get postbuild() {
        return this._settings.postbuild.value;
    }
    get output() {
        return this._settings.output.value;
    }
    set output(value) {
        this._settings.output.value = value;
        this.saveContext();
    }
    get debugger_() {
        return this._settings.debugger.value;
    }
    set debugger_(value) {
        this._settings.debugger.value = value;
        this.saveContext();
    }
    get intelliSenseGen() {
        return this._settings.intelliSenseGen.value;
    }
    set intelliSenseGen(value) {
        this._settings.intelliSenseGen.value = value;
        this.saveContext();
    }
    get configuration() {
        return this._settings.configuration.value;
    }
    set configuration(value) {
        this._settings.configuration.value = value;
        this.saveContext();
    }
    get programmer() {
        return this._settings.programmer.value;
    }
    set programmer(value) {
        this._settings.programmer.value = value;
        this.saveContext();
    }
    get suppressSaveContext() {
        return this._suppressSaveContext;
    }
    set suppressSaveContext(value) {
        this._suppressSaveContext = value;
    }
    get buildPreferences() {
        return this._settings.buildPreferences.value;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (workspace_1.ArduinoWorkspace.rootPath && util.fileExistsSync(path.join(workspace_1.ArduinoWorkspace.rootPath, constants_1.ARDUINO_CONFIG_FILE))) {
                vscode.window.showInformationMessage("Arduino.json already generated.");
                return;
            }
            else {
                if (!workspace_1.ArduinoWorkspace.rootPath) {
                    vscode.window.showInformationMessage("Please open a folder first.");
                    return;
                }
                yield this.resolveMainSketch();
                if (this.sketch) {
                    yield vscode.commands.executeCommand("arduino.changeBoardType");
                    vscode.window.showInformationMessage("The workspace is initialized with the Arduino extension support.");
                }
                else {
                    vscode.window.showInformationMessage("No sketch (*.ino or *.cpp) was found or selected - initialization skipped.");
                }
            }
        });
    }
    /**
     * Note: We're using the class' setter for the sketch (i.e. this.sketch = ...)
     * to make sure that any changes are synched to the configuration file.
     */
    resolveMainSketch() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO (EW, 2020-02-18): Here you look for *.ino files but below you allow
            //  *.cpp/*.c files to be set as sketch
            yield vscode.workspace.findFiles("**/*.ino", null)
                .then((fileUris) => __awaiter(this, void 0, void 0, function* () {
                if (fileUris.length === 0) {
                    let newSketchFileName = yield vscode.window.showInputBox({
                        value: "my-sketch.ino",
                        prompt: "No sketch (*.ino) found in workspace, please provide a name",
                        placeHolder: "Sketch file name (*.ino or *.cpp)",
                        validateInput: (value) => {
                            /* TODO (EW, 2020-02-18):
                             * is 'c' actually allowed? Also found on within other files.
                             * And the regular expression doesn't need the internal groups.
                             * The outer group can be an anonymous group.
                             * And \w doesn't match dashes - so any sketch containing dashes
                             * will not be found.
                             * The correct expression therefore would be something like this:
                             *
                             *   /^[\w\-]+\.(?:ino|cpp)$/
                             *
                             * I'd recommend to define such regular expressions (including)
                             * line splitting etc.) at the global constants file.
                             * This is true for any hard coded paths (like the snippets below)
                             * as well.
                             */
                            if (value && /^\w+\.((ino)|(cpp)|c)$/.test(value.trim())) {
                                return null;
                            }
                            else {
                                return "Invalid sketch file name. Should be *.ino/*.cpp/*.c";
                            }
                        },
                    });
                    newSketchFileName = (newSketchFileName && newSketchFileName.trim()) || "";
                    if (newSketchFileName) {
                        const snippets = fs.readFileSync(path.join(this.extensionPath, "snippets", "sample.ino"));
                        fs.writeFileSync(path.join(workspace_1.ArduinoWorkspace.rootPath, newSketchFileName), snippets);
                        this.sketch = newSketchFileName;
                        // Open the new sketch file.
                        const textDocument = yield vscode.workspace.openTextDocument(path.join(workspace_1.ArduinoWorkspace.rootPath, newSketchFileName));
                        vscode.window.showTextDocument(textDocument, vscode.ViewColumn.One, true);
                    }
                    else {
                        this.sketch = undefined;
                    }
                }
                else if (fileUris.length === 1) {
                    this.sketch = path.relative(workspace_1.ArduinoWorkspace.rootPath, fileUris[0].fsPath);
                }
                else if (fileUris.length > 1) {
                    const chosen = yield vscode.window.showQuickPick(fileUris.map((fileUri) => {
                        return {
                            label: path.relative(workspace_1.ArduinoWorkspace.rootPath, fileUri.fsPath),
                            description: fileUri.fsPath,
                        };
                    }), { placeHolder: "Select the main sketch file" });
                    if (chosen && chosen.label) {
                        this.sketch = chosen.label;
                    }
                }
            }));
            return this.sketch;
        });
    }
    saveContext() {
        if (!workspace_1.ArduinoWorkspace.rootPath) {
            return;
        }
        const deviceConfigFile = path.join(workspace_1.ArduinoWorkspace.rootPath, constants_1.ARDUINO_CONFIG_FILE);
        this._settings.save(deviceConfigFile);
    }
}
exports.DeviceContext = DeviceContext;
DeviceContext._deviceContext = new DeviceContext();

//# sourceMappingURL=deviceContext.js.map
