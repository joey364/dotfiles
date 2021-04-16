"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommand = void 0;
const vscode_1 = require("vscode");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
let context;
const handleSelect = (cmd) => {
    const store = utils_1.getStore(context, true);
    if (!store[cmd])
        store[cmd] = 0;
    store[cmd]++;
    context.globalState.update(constants_1.STORAGE_KEYS.USAGE_MAP, store);
};
exports.registerCommand = (ctx) => {
    context = ctx;
    context.subscriptions.push(vscode_1.commands.registerCommand(constants_1.COMMANDS.SELECTED.CMD, handleSelect));
};
