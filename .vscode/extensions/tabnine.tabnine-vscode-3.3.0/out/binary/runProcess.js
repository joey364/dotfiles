"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runProcess = void 0;
const child_process_1 = require("child_process");
const readline_1 = require("readline");
const reporter_1 = require("../reports/reporter");
function runProcess(command, args, options = {}) {
    if (process.env.NODE_ENV === "test") {
        // eslint-disable-next-line
        return require("./mockedRunProcess").default();
    }
    reporter_1.report(reporter_1.EventName.START_BINARY);
    const proc = args ? child_process_1.spawn(command, args, options) : child_process_1.spawn(command, options);
    const input = proc.stdout;
    const readLine = readline_1.createInterface({
        input,
        output: proc.stdin,
    });
    return { proc, readLine };
}
exports.runProcess = runProcess;
//# sourceMappingURL=runProcess.js.map