"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const winston = require("winston");
const logger_1 = require("./logger");
class UserNotificationTransport extends winston.Transport {
    constructor(options) {
        super(options);
    }
    log(level, message, metadata, callback) {
        if (metadata && metadata.showUser) {
            const notification = (metadata && metadata.notification) ? metadata.notification : message;
            if (level === logger_1.LogLevel.Warn) {
                vscode.window.showWarningMessage(notification);
            }
            else if (level === logger_1.LogLevel.Error) {
                vscode.window.showErrorMessage(notification);
            }
            else {
                winston.error(`Invalid error level '${level}' for user notification.`);
            }
        }
        super.emit("logged");
        if (callback) {
            callback(null, true);
        }
    }
}
exports.default = UserNotificationTransport;

//# sourceMappingURL=user-notification-transport.js.map
