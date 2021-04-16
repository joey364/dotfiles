"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disposeReporter = exports.reportException = exports.reportErrorEvent = exports.report = exports.initReporter = exports.EventName = void 0;
const vscode_extension_telemetry_1 = require("vscode-extension-telemetry");
const reportData_1 = require("./reportData");
const inTestMode = process.env.NODE_ENV === "test";
var EventName;
(function (EventName) {
    EventName["EXTENSION_INSTALLED"] = "extension-installed";
    EventName["EXTENSION_ACTIVATED"] = "extension-activated";
    EventName["EXTENSION_UNINSTALLED"] = "extension-uninstalled";
    EventName["BUNDLE_DOWNLOAD_SUCCESS"] = "bundle-download-success";
    EventName["BUNDLE_DOWNLOAD_FAILURE"] = "bundle-download-failure";
    EventName["START_BINARY"] = "tabnine-binary-run";
})(EventName = exports.EventName || (exports.EventName = {}));
let reporter;
function initReporter(context, id, version, key) {
    if (inTestMode)
        return;
    reporter = new vscode_extension_telemetry_1.default(id, version, key);
    context.subscriptions.push(reporter);
}
exports.initReporter = initReporter;
function report(event) {
    if (inTestMode)
        return;
    void reportData_1.default().then((data) => reporter.sendTelemetryEvent(event, data));
}
exports.report = report;
function reportErrorEvent(event, error) {
    if (inTestMode)
        return;
    void reportData_1.default().then((data) => {
        const fullData = { ...(data !== null && data !== void 0 ? data : {}), error: error.message };
        reporter.sendTelemetryErrorEvent(event, fullData);
    });
}
exports.reportErrorEvent = reportErrorEvent;
function reportException(error) {
    if (inTestMode)
        return;
    void reportData_1.default().then((data) => {
        reporter.sendTelemetryException(error, data);
    });
}
exports.reportException = reportException;
function disposeReporter() {
    void reporter.dispose();
}
exports.disposeReporter = disposeReporter;
//# sourceMappingURL=reporter.js.map