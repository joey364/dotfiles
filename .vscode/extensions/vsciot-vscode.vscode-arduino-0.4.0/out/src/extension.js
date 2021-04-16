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
exports.deactivate = exports.activate = void 0;
const impor = require("impor")(__dirname);
const fs = require("fs");
const path = require("path");
const uuidModule = impor("uuid/v4");
const vscode = require("vscode");
const constants = require("./common/constants");
const arduinoContentProviderModule = impor("./arduino/arduinoContentProvider");
const vscodeSettings_1 = require("./arduino/vscodeSettings");
const arduinoActivatorModule = impor("./arduinoActivator");
const arduinoContextModule = impor("./arduinoContext");
const constants_1 = require("./common/constants");
const platform_1 = require("./common/platform");
const util = require("./common/util");
const workspace_1 = require("./common/workspace");
const arduinoDebugConfigurationProviderModule = impor("./debug/configurationProvider");
const deviceContext_1 = require("./deviceContext");
const completionProviderModule = impor("./langService/completionProvider");
const Logger = require("./logger/logger");
const nsatModule = impor("./nsat");
const arduino_1 = require("./arduino/arduino");
const serialMonitor_1 = require("./serialmonitor/serialMonitor");
const usbDetectorModule = impor("./serialmonitor/usbDetector");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        Logger.configure(context);
        const activeGuid = uuidModule().replace(/-/g, "");
        Logger.traceUserData("start-activate-extension", { correlationId: activeGuid });
        // Show a warning message if the working file is not under the workspace folder.
        // People should know the extension might not work appropriately, they should look for the doc to get started.
        const openEditor = vscode.window.activeTextEditor;
        if (openEditor && openEditor.document.fileName.endsWith(".ino")) {
            const workingFile = path.normalize(openEditor.document.fileName);
            const workspaceFolder = (vscode.workspace && workspace_1.ArduinoWorkspace.rootPath) || "";
            if (!workspaceFolder || workingFile.indexOf(path.normalize(workspaceFolder)) < 0) {
                vscode.window.showWarningMessage(`The open file "${workingFile}" is not inside the workspace folder, ` +
                    "the arduino extension might not work properly.");
            }
        }
        const vscodeSettings = vscodeSettings_1.VscodeSettings.getInstance();
        const deviceContext = deviceContext_1.DeviceContext.getInstance();
        deviceContext.extensionPath = context.extensionPath;
        context.subscriptions.push(deviceContext);
        const commandExecution = (command, commandBody, args, getUserData) => __awaiter(this, void 0, void 0, function* () {
            const guid = uuidModule().replace(/\-/g, "");
            Logger.traceUserData(`start-command-` + command, { correlationId: guid });
            const timer1 = new Logger.Timer();
            let telemetryResult;
            try {
                let result = commandBody(...args);
                if (result) {
                    result = yield Promise.resolve(result);
                }
                if (result && result.telemetry) {
                    telemetryResult = result;
                }
                else if (getUserData) {
                    telemetryResult = getUserData();
                }
            }
            catch (error) {
                Logger.traceError("executeCommandError", error, { correlationId: guid, command });
            }
            Logger.traceUserData(`end-command-` + command, Object.assign(Object.assign({}, telemetryResult), { correlationId: guid, duration: timer1.end() }));
            nsatModule.NSAT.takeSurvey(context);
        });
        const registerArduinoCommand = (command, commandBody, getUserData) => {
            return context.subscriptions.push(vscode.commands.registerCommand(command, (...args) => __awaiter(this, void 0, void 0, function* () {
                if (!arduinoContextModule.default.initialized) {
                    yield arduinoActivatorModule.default.activate();
                }
                if (!serialMonitor_1.SerialMonitor.getInstance().initialized) {
                    serialMonitor_1.SerialMonitor.getInstance().initialize();
                }
                const arduinoPath = arduinoContextModule.default.arduinoApp.settings.arduinoPath;
                const commandPath = arduinoContextModule.default.arduinoApp.settings.commandPath;
                const useArduinoCli = arduinoContextModule.default.arduinoApp.settings.useArduinoCli;
                // Pop up vscode User Settings page when cannot resolve arduino path.
                if (!arduinoPath || !platform_1.validateArduinoPath(arduinoPath, useArduinoCli)) {
                    Logger.notifyUserError("InvalidArduinoPath", new Error(constants.messages.INVALID_ARDUINO_PATH));
                    vscode.commands.executeCommand("workbench.action.openGlobalSettings");
                }
                else if (!commandPath || !util.fileExistsSync(commandPath)) {
                    Logger.notifyUserError("InvalidCommandPath", new Error(constants.messages.INVALID_COMMAND_PATH + commandPath));
                }
                else {
                    yield commandExecution(command, commandBody, args, getUserData);
                }
            })));
        };
        const registerNonArduinoCommand = (command, commandBody, getUserData) => {
            return context.subscriptions.push(vscode.commands.registerCommand(command, (...args) => __awaiter(this, void 0, void 0, function* () {
                if (!serialMonitor_1.SerialMonitor.getInstance().initialized) {
                    serialMonitor_1.SerialMonitor.getInstance().initialize();
                }
                yield commandExecution(command, commandBody, args, getUserData);
            })));
        };
        registerArduinoCommand("arduino.initialize", () => __awaiter(this, void 0, void 0, function* () { return yield deviceContext.initialize(); }));
        registerArduinoCommand("arduino.verify", () => __awaiter(this, void 0, void 0, function* () {
            if (!arduinoContextModule.default.arduinoApp.building) {
                yield vscode.window.withProgress({
                    location: vscode.ProgressLocation.Window,
                    title: "Arduino: Verifying...",
                }, () => __awaiter(this, void 0, void 0, function* () {
                    yield arduinoContextModule.default.arduinoApp.build(arduino_1.BuildMode.Verify);
                }));
            }
        }), () => {
            return {
                board: (arduinoContextModule.default.boardManager.currentBoard === null) ? null :
                    arduinoContextModule.default.boardManager.currentBoard.name,
            };
        });
        registerArduinoCommand("arduino.upload", () => __awaiter(this, void 0, void 0, function* () {
            if (!arduinoContextModule.default.arduinoApp.building) {
                yield vscode.window.withProgress({
                    location: vscode.ProgressLocation.Window,
                    title: "Arduino: Uploading...",
                }, () => __awaiter(this, void 0, void 0, function* () {
                    yield arduinoContextModule.default.arduinoApp.build(arduino_1.BuildMode.Upload);
                }));
            }
        }), () => {
            return { board: arduinoContextModule.default.boardManager.currentBoard.name };
        });
        registerArduinoCommand("arduino.cliUpload", () => __awaiter(this, void 0, void 0, function* () {
            if (!arduinoContextModule.default.arduinoApp.building) {
                yield vscode.window.withProgress({
                    location: vscode.ProgressLocation.Window,
                    title: "Arduino: Using CLI to upload...",
                }, () => __awaiter(this, void 0, void 0, function* () {
                    yield arduinoContextModule.default.arduinoApp.build(arduino_1.BuildMode.CliUpload);
                }));
            }
        }), () => {
            return { board: arduinoContextModule.default.boardManager.currentBoard.name };
        });
        registerArduinoCommand("arduino.setSketchFile", () => __awaiter(this, void 0, void 0, function* () {
            const sketchFileName = deviceContext.sketch;
            const newSketchFileName = yield vscode.window.showInputBox({
                placeHolder: sketchFileName,
                validateInput: (value) => {
                    if (value && /\.((ino)|(cpp)|c)$/.test(value.trim())) {
                        return null;
                    }
                    else {
                        return "Invalid sketch file name. Should be *.ino/*.cpp/*.c";
                    }
                },
            });
            if (!newSketchFileName) {
                return;
            }
            deviceContext.sketch = newSketchFileName;
            deviceContext.showStatusBar();
        }));
        registerArduinoCommand("arduino.uploadUsingProgrammer", () => __awaiter(this, void 0, void 0, function* () {
            if (!arduinoContextModule.default.arduinoApp.building) {
                yield vscode.window.withProgress({
                    location: vscode.ProgressLocation.Window,
                    title: "Arduino: Uploading (programmer)...",
                }, () => __awaiter(this, void 0, void 0, function* () {
                    yield arduinoContextModule.default.arduinoApp.build(arduino_1.BuildMode.UploadProgrammer);
                }));
            }
        }), () => {
            return { board: arduinoContextModule.default.boardManager.currentBoard.name };
        });
        registerArduinoCommand("arduino.cliUploadUsingProgrammer", () => __awaiter(this, void 0, void 0, function* () {
            if (!arduinoContextModule.default.arduinoApp.building) {
                yield vscode.window.withProgress({
                    location: vscode.ProgressLocation.Window,
                    title: "Arduino: Using CLI to upload (programmer)...",
                }, () => __awaiter(this, void 0, void 0, function* () {
                    yield arduinoContextModule.default.arduinoApp.build(arduino_1.BuildMode.CliUploadProgrammer);
                }));
            }
        }), () => {
            return { board: arduinoContextModule.default.boardManager.currentBoard.name };
        });
        registerArduinoCommand("arduino.rebuildIntelliSenseConfig", () => __awaiter(this, void 0, void 0, function* () {
            if (!arduinoContextModule.default.arduinoApp.building) {
                yield vscode.window.withProgress({
                    location: vscode.ProgressLocation.Window,
                    title: "Arduino: Rebuilding IS Configuration...",
                }, () => __awaiter(this, void 0, void 0, function* () {
                    yield arduinoContextModule.default.arduinoApp.build(arduino_1.BuildMode.Analyze);
                }));
            }
        }), () => {
            return { board: arduinoContextModule.default.boardManager.currentBoard.name };
        });
        registerArduinoCommand("arduino.selectProgrammer", () => __awaiter(this, void 0, void 0, function* () {
            // Note: this guard does not prevent building while setting the
            // programmer. But when looking at the code of selectProgrammer
            // it seems not to be possible to trigger building while setting
            // the programmer. If the timed IntelliSense analysis is triggered
            // this is not a problem, since it doesn't use the programmer.
            if (!arduinoContextModule.default.arduinoApp.building) {
                try {
                    yield arduinoContextModule.default.arduinoApp.programmerManager.selectProgrammer();
                }
                catch (ex) {
                }
            }
        }), () => {
            return {
                board: (arduinoContextModule.default.boardManager.currentBoard === null) ? null :
                    arduinoContextModule.default.boardManager.currentBoard.name,
            };
        });
        registerArduinoCommand("arduino.openExample", (path) => arduinoContextModule.default.arduinoApp.openExample(path));
        registerArduinoCommand("arduino.loadPackages", () => __awaiter(this, void 0, void 0, function* () { return yield arduinoContextModule.default.boardManager.loadPackages(true); }));
        registerArduinoCommand("arduino.installBoard", (packageName, arch, version = "") => __awaiter(this, void 0, void 0, function* () {
            let installed = false;
            const installedBoards = arduinoContextModule.default.boardManager.installedBoards;
            installedBoards.forEach((board, key) => {
                let _packageName;
                if (board.platform.package && board.platform.package.name) {
                    _packageName = board.platform.package.name;
                }
                else {
                    _packageName = board.platform.packageName;
                }
                if (packageName === _packageName &&
                    arch === board.platform.architecture &&
                    (!version || version === board.platform.installedVersion)) {
                    installed = true;
                }
            });
            if (!installed) {
                yield arduinoContextModule.default.boardManager.loadPackages(true);
                yield arduinoContextModule.default.arduinoApp.installBoard(packageName, arch, version);
            }
            return;
        }));
        // serial monitor commands
        const serialMonitor = serialMonitor_1.SerialMonitor.getInstance();
        context.subscriptions.push(serialMonitor);
        registerNonArduinoCommand("arduino.selectSerialPort", () => serialMonitor.selectSerialPort(null, null));
        registerNonArduinoCommand("arduino.openSerialMonitor", () => serialMonitor.openSerialMonitor());
        registerNonArduinoCommand("arduino.changeBaudRate", () => serialMonitor.changeBaudRate());
        registerNonArduinoCommand("arduino.sendMessageToSerialPort", () => serialMonitor.sendMessageToSerialPort());
        registerNonArduinoCommand("arduino.closeSerialMonitor", (port, showWarning = true) => serialMonitor.closeSerialMonitor(port, showWarning));
        const completionProvider = new completionProviderModule.CompletionProvider();
        context.subscriptions.push(vscode.languages.registerCompletionItemProvider(constants_1.ARDUINO_MODE, completionProvider, "<", '"', "."));
        context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider("arduino", new arduinoDebugConfigurationProviderModule.ArduinoDebugConfigurationProvider()));
        if (workspace_1.ArduinoWorkspace.rootPath && (util.fileExistsSync(path.join(workspace_1.ArduinoWorkspace.rootPath, constants_1.ARDUINO_CONFIG_FILE))
            || (openEditor && openEditor.document.fileName.endsWith(".ino")))) {
            (() => __awaiter(this, void 0, void 0, function* () {
                if (!arduinoContextModule.default.initialized) {
                    yield arduinoActivatorModule.default.activate();
                }
                if (!serialMonitor_1.SerialMonitor.getInstance().initialized) {
                    serialMonitor_1.SerialMonitor.getInstance().initialize();
                }
                vscode.commands.executeCommand("setContext", "vscode-arduino:showExampleExplorer", true);
            }))();
        }
        vscode.window.onDidChangeActiveTextEditor(() => __awaiter(this, void 0, void 0, function* () {
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor && ((path.basename(activeEditor.document.fileName) === "arduino.json"
                && path.basename(path.dirname(activeEditor.document.fileName)) === ".vscode")
                || activeEditor.document.fileName.endsWith(".ino"))) {
                if (!arduinoContextModule.default.initialized) {
                    yield arduinoActivatorModule.default.activate();
                }
                if (!serialMonitor_1.SerialMonitor.getInstance().initialized) {
                    serialMonitor_1.SerialMonitor.getInstance().initialize();
                }
                vscode.commands.executeCommand("setContext", "vscode-arduino:showExampleExplorer", true);
            }
        }));
        const allowPDEFiletype = vscodeSettings.allowPDEFiletype;
        if (allowPDEFiletype) {
            vscode.workspace.onDidOpenTextDocument((document) => __awaiter(this, void 0, void 0, function* () {
                if (/\.pde$/.test(document.uri.fsPath)) {
                    const newFsName = document.uri.fsPath.replace(/\.pde$/, ".ino");
                    yield vscode.commands.executeCommand("workbench.action.closeActiveEditor");
                    fs.renameSync(document.uri.fsPath, newFsName);
                    yield vscode.commands.executeCommand("vscode.open", vscode.Uri.file(newFsName));
                }
            }));
            vscode.window.onDidChangeActiveTextEditor((editor) => __awaiter(this, void 0, void 0, function* () {
                if (!editor) {
                    return;
                }
                const document = editor.document;
                if (/\.pde$/.test(document.uri.fsPath)) {
                    const newFsName = document.uri.fsPath.replace(/\.pde$/, ".ino");
                    yield vscode.commands.executeCommand("workbench.action.closeActiveEditor");
                    fs.renameSync(document.uri.fsPath, newFsName);
                    yield vscode.commands.executeCommand("vscode.open", vscode.Uri.file(newFsName));
                }
            }));
        }
        Logger.traceUserData("end-activate-extension", { correlationId: activeGuid });
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            const arduinoManagerProvider = new arduinoContentProviderModule.ArduinoContentProvider(context.extensionPath);
            yield arduinoManagerProvider.initialize();
            context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(constants_1.ARDUINO_MANAGER_PROTOCOL, arduinoManagerProvider));
            registerArduinoCommand("arduino.showBoardManager", () => __awaiter(this, void 0, void 0, function* () {
                const panel = vscode.window.createWebviewPanel("arduinoBoardManager", "Arduino Board Manager", vscode.ViewColumn.Two, {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                });
                panel.webview.html = yield arduinoManagerProvider.provideTextDocumentContent(constants_1.BOARD_MANAGER_URI);
            }));
            registerArduinoCommand("arduino.showLibraryManager", () => __awaiter(this, void 0, void 0, function* () {
                const panel = vscode.window.createWebviewPanel("arduinoLibraryManager", "Arduino Library Manager", vscode.ViewColumn.Two, {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                });
                panel.webview.html = yield arduinoManagerProvider.provideTextDocumentContent(constants_1.LIBRARY_MANAGER_URI);
            }));
            registerArduinoCommand("arduino.showBoardConfig", () => __awaiter(this, void 0, void 0, function* () {
                const panel = vscode.window.createWebviewPanel("arduinoBoardConfiguration", "Arduino Board Configuration", vscode.ViewColumn.Two, {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                });
                panel.webview.html = yield arduinoManagerProvider.provideTextDocumentContent(constants_1.BOARD_CONFIG_URI);
            }));
            registerArduinoCommand("arduino.showExamples", (forceRefresh = false) => __awaiter(this, void 0, void 0, function* () {
                vscode.commands.executeCommand("setContext", "vscode-arduino:showExampleExplorer", true);
                if (forceRefresh) {
                    vscode.commands.executeCommand("arduino.reloadExample");
                }
                const panel = vscode.window.createWebviewPanel("arduinoExamples", "Arduino Examples", vscode.ViewColumn.Two, {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                });
                panel.webview.html = yield arduinoManagerProvider.provideTextDocumentContent(constants_1.EXAMPLES_URI);
            }));
            // change board type
            registerArduinoCommand("arduino.changeBoardType", () => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield arduinoContextModule.default.boardManager.changeBoardType();
                }
                catch (exception) {
                    Logger.error(exception.message);
                }
                arduinoManagerProvider.update(constants_1.LIBRARY_MANAGER_URI);
                arduinoManagerProvider.update(constants_1.EXAMPLES_URI);
            }), () => {
                return { board: arduinoContextModule.default.boardManager.currentBoard.name };
            });
            registerArduinoCommand("arduino.reloadExample", () => {
                arduinoManagerProvider.update(constants_1.EXAMPLES_URI);
            }, () => {
                return {
                    board: (arduinoContextModule.default.boardManager.currentBoard === null) ? null :
                        arduinoContextModule.default.boardManager.currentBoard.name,
                };
            });
        }), 100);
        setTimeout(() => {
            // delay to detect usb
            usbDetectorModule.UsbDetector.getInstance().initialize(context.extensionPath);
            usbDetectorModule.UsbDetector.getInstance().startListening();
        }, 200);
    });
}
exports.activate = activate;
function deactivate() {
    return __awaiter(this, void 0, void 0, function* () {
        const monitor = serialMonitor_1.SerialMonitor.getInstance();
        yield monitor.closeSerialMonitor(null, false);
        usbDetectorModule.UsbDetector.getInstance().stopListening();
        Logger.traceUserData("deactivate-extension");
    });
}
exports.deactivate = deactivate;

//# sourceMappingURL=extension.js.map
