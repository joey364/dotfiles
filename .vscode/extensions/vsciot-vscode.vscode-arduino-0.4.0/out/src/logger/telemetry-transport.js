"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryTransport = void 0;
const vscode_extension_telemetry_1 = require("vscode-extension-telemetry");
const winston = require("winston");
const logger_1 = require("./logger");
function getPackageInfo(context) {
    const extensionPackage = require(context.asAbsolutePath("./package.json"));
    if (extensionPackage) {
        return {
            name: extensionPackage.name,
            version: extensionPackage.version,
            aiKey: extensionPackage.aiKey,
        };
    }
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
class TelemetryTransport extends winston.Transport {
    constructor(options) {
        super(Object.assign(Object.assign({}, options), { context: null }));
        this.name = "telemetry";
        if (!options.context) {
            winston.error("Failed to initialize telemetry, please set the vscode context in options.");
            return;
        }
        const packageInfo = getPackageInfo(options.context);
        if (!packageInfo.aiKey) {
            winston.error("Failed to initialize telemetry due to no aiKey in package.json.");
            return;
        }
        this.reporter = new vscode_extension_telemetry_1.default(packageInfo.name, packageInfo.version, packageInfo.aiKey, true);
    }
    log(level, message, metadata, callback) {
        if (this.reporter && metadata && metadata.telemetry) {
            try {
                delete metadata.telemetry;
                const properties = { level };
                const measures = {};
                for (const key of Object.keys(metadata)) {
                    if (typeof key === "string") {
                        const value = metadata[key];
                        if (value === null || typeof value === "string" || value instanceof String) {
                            properties[key] = value;
                        }
                        else if (isNumeric(value)) {
                            measures[key] = value;
                        }
                        else {
                            winston.debug(`Ignore log(${key} = ${value}) since the value type are not supported.`);
                        }
                    }
                }
                if (level === logger_1.LogLevel.Info) {
                    this.reporter.sendTelemetryEvent(message, properties, measures);
                }
                else {
                    this.reporter.sendTelemetryErrorEvent(message, properties, measures, ["message", "notification", "errorLine"]);
                }
            }
            catch (telemetryErr) {
                // If sending telemetry event fails ignore it so it won"t break the extension
                winston.error("Failed to send telemetry event. error: " + telemetryErr);
            }
        }
        super.emit("logged");
        if (callback) {
            callback(null, true);
        }
    }
}
exports.TelemetryTransport = TelemetryTransport;
exports.default = TelemetryTransport;

//# sourceMappingURL=telemetry-transport.js.map
