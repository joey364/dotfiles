"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const command_1 = require("./command");
const item_provider_1 = require("./item-provider");
exports.activate = (context) => {
    command_1.registerCommand(context);
    item_provider_1.registerProvider(context);
};
exports.deactivate = () => {
    return Promise.resolve();
};
