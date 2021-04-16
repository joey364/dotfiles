"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerProvider = void 0;
const vscode_1 = require("vscode");
const constants_1 = require("./constants");
const items_manager_1 = require("./items-manager");
let context;
const providerFunction = {
    provideCompletionItems: (document, position) => {
        const lineStart = new vscode_1.Position(position.line, 0);
        const range = new vscode_1.Range(lineStart, lineStart.translate(0, 100));
        const lineText = document.getText(range);
        const prefix = lineText.slice(0, position.character);
        return items_manager_1.getItems(context, prefix.trim(), lineText.trim());
    },
};
exports.registerProvider = (ctx) => {
    context = ctx;
    vscode_1.languages.registerCompletionItemProvider(constants_1.SELECTOR, providerFunction);
};
