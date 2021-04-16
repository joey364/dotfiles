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
exports.SerialPortCtrl = void 0;
const os = require("os");
const vscodeSettings_1 = require("../arduino/vscodeSettings");
class SerialPortCtrl {
    constructor(port, baudRate, _outputChannel) {
        this._outputChannel = _outputChannel;
        this._currentSerialPort = null;
        this._currentBaudRate = baudRate;
        this._currentPort = port;
    }
    static get serialport() {
        if (!SerialPortCtrl._serialport) {
            SerialPortCtrl._serialport = require("node-usb-native").SerialPort;
        }
        return SerialPortCtrl._serialport;
    }
    static list() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lists = SerialPortCtrl.serialport.list();
                return lists;
            }
            catch (err) {
                throw err;
            }
        });
    }
    get isActive() {
        return this._currentSerialPort && this._currentSerialPort.isOpen;
    }
    get currentPort() {
        return this._currentPort;
    }
    open() {
        this._outputChannel.appendLine(`[Starting] Opening the serial port - ${this._currentPort}`);
        return new Promise((resolve, reject) => {
            if (this._currentSerialPort && this._currentSerialPort.isOpen) {
                this._currentSerialPort.close((err) => {
                    if (err) {
                        return reject(err);
                    }
                    this._currentSerialPort = null;
                    return this.open().then(() => {
                        resolve();
                    }, (error) => {
                        reject(error);
                    });
                });
            }
            else {
                this._currentSerialPort = new SerialPortCtrl.serialport(this._currentPort, { baudRate: this._currentBaudRate, hupcl: false });
                this._outputChannel.show();
                this._currentSerialPort.on("open", () => {
                    if (vscodeSettings_1.VscodeSettings.getInstance().disableTestingOpen) {
                        this._outputChannel.appendLine("[Warning] Auto checking serial port open is disabled");
                        return resolve();
                    }
                    this._currentSerialPort.write("TestingOpen" + "\r\n", (err) => {
                        // TODO: Fix this on the serial port lib: https://github.com/EmergingTechnologyAdvisors/node-serialport/issues/795
                        if (err && !(err.message.indexOf("Writing to COM port (GetOverlappedResult): Unknown error code 121") >= 0)) {
                            this._outputChannel.appendLine(`[Error] Failed to open the serial port - ${this._currentPort}`);
                            reject(err);
                        }
                        else {
                            this._outputChannel.appendLine(`[Info] Opened the serial port - ${this._currentPort}`);
                            this._currentSerialPort.set(["dtr=true", "rts=true"], (err) => {
                                if (err) {
                                    reject(err);
                                }
                            });
                            resolve();
                        }
                    });
                });
                this._currentSerialPort.on("data", (_event) => {
                    this._outputChannel.append(_event.toString());
                });
                this._currentSerialPort.on("error", (_error) => {
                    this._outputChannel.appendLine("[Error]" + _error.toString());
                });
            }
        });
    }
    sendMessage(text) {
        return new Promise((resolve, reject) => {
            if (!text || !this._currentSerialPort || !this.isActive) {
                resolve();
                return;
            }
            this._currentSerialPort.write(text + "\r\n", (error) => {
                if (!error) {
                    resolve();
                }
                else {
                    return reject(error);
                }
            });
        });
    }
    changePort(newPort) {
        return new Promise((resolve, reject) => {
            if (newPort === this._currentPort) {
                resolve();
                return;
            }
            this._currentPort = newPort;
            if (!this._currentSerialPort || !this.isActive) {
                resolve();
                return;
            }
            this._currentSerialPort.close((err) => {
                if (err) {
                    reject(err);
                }
                else {
                    this._currentSerialPort = null;
                    resolve();
                }
            });
        });
    }
    stop() {
        return new Promise((resolve, reject) => {
            if (!this._currentSerialPort || !this.isActive) {
                resolve(false);
                return;
            }
            this._currentSerialPort.close((err) => {
                if (this._outputChannel) {
                    this._outputChannel.appendLine(`[Done] Closed the serial port ${os.EOL}`);
                }
                this._currentSerialPort = null;
                if (err) {
                    reject(err);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    changeBaudRate(newRate) {
        return new Promise((resolve, reject) => {
            this._currentBaudRate = newRate;
            if (!this._currentSerialPort || !this.isActive) {
                resolve();
                return;
            }
            this._currentSerialPort.update({ baudRate: this._currentBaudRate }, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    this._currentSerialPort.set(["dtr=true", "rts=true"], (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    });
                }
            });
        });
    }
}
exports.SerialPortCtrl = SerialPortCtrl;

//# sourceMappingURL=serialportctrl.js.map
