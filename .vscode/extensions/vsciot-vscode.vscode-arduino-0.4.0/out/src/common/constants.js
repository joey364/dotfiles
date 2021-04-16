"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusBarPriority = exports.messages = exports.EXAMPLES_URI = exports.BOARD_CONFIG_URI = exports.LIBRARY_MANAGER_URI = exports.BOARD_MANAGER_URI = exports.ARDUINO_MANAGER_PROTOCOL = exports.ARDUINO_MODE = exports.LogLevel = exports.C_CPP_PROPERTIES_CONFIG_NAME = exports.CPP_CONFIG_FILE = exports.ARDUINO_CONFIG_FILE = void 0;
const path = require("path");
const vscode = require("vscode");
exports.ARDUINO_CONFIG_FILE = path.join(".vscode", "arduino.json");
exports.CPP_CONFIG_FILE = path.join(".vscode", "c_cpp_properties.json");
/** The name of the intellisense configuration managed by vscode-arduino. */
exports.C_CPP_PROPERTIES_CONFIG_NAME = "Arduino";
var LogLevel;
(function (LogLevel) {
    LogLevel["Info"] = "info";
    LogLevel["Verbose"] = "verbose";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
;
exports.ARDUINO_MODE = [
    { language: "cpp", scheme: "file" },
    { language: "arduino", scheme: "file" },
];
exports.ARDUINO_MANAGER_PROTOCOL = "arduino-manager";
exports.BOARD_MANAGER_URI = vscode.Uri.parse("arduino-manager://arduino/arduino-boardsmanager");
exports.LIBRARY_MANAGER_URI = vscode.Uri.parse("arduino-manager://arduino/arduino-librariesmanager");
exports.BOARD_CONFIG_URI = vscode.Uri.parse("arduino-manager://arduino/arduino-config");
exports.EXAMPLES_URI = vscode.Uri.parse("arduino-manager://arduino/arduino-examples");
exports.messages = {
    ARDUINO_FILE_ERROR: "The arduino.json file format is not correct.",
    NO_BOARD_SELECTED: "Please select the board type first.",
    INVALID_ARDUINO_PATH: "Cannot find Arduino IDE. Please specify the \"arduino.path\" in the User Settings. Requires a restart after change.",
    INVALID_COMMAND_PATH: "Please check the \"arduino.commandPath\" in the User Settings." +
        "Requires a restart after change.Cannot find the command file:",
    FAILED_SEND_SERIALPORT: "Failed to send message to serial port.",
    SERIAL_PORT_NOT_STARTED: "Serial Monitor has not been started.",
    SEND_BEFORE_OPEN_SERIALPORT: "Please open a serial port first.",
    NO_PROGRAMMMER_SELECTED: "Please select the programmer first.",
    INVALID_OUTPUT_PATH: "Please check the \"output\" in the sketch Settings.Cannot find the output path:",
};
exports.statusBarPriority = {
    PORT: 20,
    OPEN_PORT: 30,
    BAUD_RATE: 40,
    BOARD: 60,
    ENDING: 70,
    SKETCH: 80,
    PROGRAMMER: 90,
};

//# sourceMappingURL=constants.js.map
