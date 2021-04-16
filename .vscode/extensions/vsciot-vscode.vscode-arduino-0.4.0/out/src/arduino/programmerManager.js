"use strict";
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
exports.ProgrammerManager = void 0;
const vscode = require("vscode");
const constants = require("../common/constants");
const deviceContext_1 = require("../deviceContext");
class ProgrammerManager {
    constructor(_settings, _arduinoApp) {
        this._settings = _settings;
        this._arduinoApp = _arduinoApp;
        this._programmerStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, constants.statusBarPriority.PROGRAMMER);
        this._programmerStatusBar.command = "arduino.selectProgrammer";
        this._programmerStatusBar.tooltip = "Select Programmer";
        this.setProgrammerValue(deviceContext_1.DeviceContext.getInstance().programmer);
        this._programmerStatusBar.show();
        deviceContext_1.DeviceContext.getInstance().onChangeProgrammer(() => {
            this.setProgrammerValue(deviceContext_1.DeviceContext.getInstance().programmer);
        });
    }
    get currentProgrammer() {
        return this._programmerValue;
    }
    get currentDisplayName() {
        return this._programmerDisplayName;
    }
    /**
     * Select a programmer from the list of available programmers
     * Set the programmer value in device context
     * List format: programmer_name:friendly_name
     */
    selectProgrammer() {
        return __awaiter(this, void 0, void 0, function* () {
            const selectionItems = this.getAvailableProgrammers(this._arduinoApp.boardManager.currentBoard).map((programmer) => ({
                label: programmer.displayName,
                description: programmer.name,
                programmer
            }));
            const chosen = yield vscode.window.showQuickPick(selectionItems, {
                placeHolder: "Select programmer",
            });
            if (!chosen) {
                return;
            }
            this.setProgrammerValue(chosen.programmer.name);
            deviceContext_1.DeviceContext.getInstance().programmer = this._programmerValue;
        });
    }
    setProgrammerValue(programmerName) {
        const programmer = this._arduinoApp.boardManager.installedProgrammers.get(programmerName);
        this._programmerValue = this._settings.useArduinoCli ? programmerName : programmer ? programmer.key : programmerName;
        this._programmerDisplayName = this._programmerValue
            ? this.getDisplayName(programmerName)
            : ProgrammerManager.notFoundDisplayValue;
        this._programmerStatusBar.text = this._programmerDisplayName;
    }
    getDisplayName(programmerName) {
        const programmer = this._arduinoApp.boardManager.installedProgrammers.get(programmerName);
        return programmer ? programmer.displayName : programmerName;
    }
    getAvailableProgrammers(currentBoard) {
        if (!currentBoard || !currentBoard.platform) {
            return [];
        }
        // Filter the list of all programmers to those that share the same platform as the board
        const availableProgrammers = [];
        for (const programmer of this._arduinoApp.boardManager.installedProgrammers.values()) {
            if (programmer.platform === currentBoard.platform) {
                availableProgrammers.push(programmer);
            }
        }
        return availableProgrammers;
    }
}
exports.ProgrammerManager = ProgrammerManager;
ProgrammerManager.notFoundDisplayValue = "<Select Programmer>";

//# sourceMappingURL=programmerManager.js.map
