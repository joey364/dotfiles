"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const debuggerManager_1 = require("./debug/debuggerManager");
const deviceContext_1 = require("./deviceContext");
class ArduinoContext {
    constructor() {
        // TODO EW: You don't have to initialize members to null
        //  if they don't get a default value or aren't initialized
        //  within a constructor they are "undefined" by default.
        //  This makes comparing against null (above) superfluous.
        this._arduinoApp = null;
        this._debuggerManager = null;
        this._boardManager = null;
    }
    get initialized() {
        return !!this._arduinoApp;
    }
    get arduinoApp() {
        return this._arduinoApp;
    }
    set arduinoApp(value) {
        this._arduinoApp = value;
    }
    // TODO EW: This is redundant: the board manager is already part of
    // the arduino app
    get boardManager() {
        return this._boardManager;
    }
    set boardManager(value) {
        this._boardManager = value;
    }
    get debuggerManager() {
        if (this._debuggerManager === null) {
            this._debuggerManager = new debuggerManager_1.DebuggerManager(deviceContext_1.DeviceContext.getInstance().extensionPath, this.arduinoApp.settings, this.boardManager);
            this._debuggerManager.initialize();
        }
        return this._debuggerManager;
    }
}
exports.default = new ArduinoContext();

//# sourceMappingURL=arduinoContext.js.map
