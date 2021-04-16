"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItems = exports.getItemBuilder = exports.getComporator = exports.getTemplate = void 0;
const known_css_properties_1 = require("known-css-properties");
const vscode_1 = require("vscode");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
exports.getTemplate = (property, lineText) => {
    const lineData = utils_1.getColonData(lineText);
    let template = property;
    if (!lineData.colon) {
        template += `${constants_1.COLON} ${constants_1.CURSOR}`;
    }
    if (!lineData.semicolon) {
        template += constants_1.SEMICOLON;
    }
    return template;
};
exports.getComporator = (usageMap) => (a, b) => {
    var _a, _b;
    const valA = (_a = usageMap[a]) !== null && _a !== void 0 ? _a : 0;
    const valB = (_b = usageMap[b]) !== null && _b !== void 0 ? _b : 0;
    return valB - valA;
};
exports.getItemBuilder = (usageMap, lineText) => (property, num) => {
    var _a;
    const item = new vscode_1.CompletionItem(property, vscode_1.CompletionItemKind.Field);
    const usageCount = (_a = usageMap[property]) !== null && _a !== void 0 ? _a : 0;
    item.command = {
        title: constants_1.COMMANDS.SELECTED.TITLE,
        command: constants_1.COMMANDS.SELECTED.CMD,
        arguments: [property],
    };
    if (usageCount) {
        item.detail = `Usage: ${usageCount} times`;
    }
    item.sortText = utils_1.toAlphabetic(num + 1);
    item.insertText = new vscode_1.SnippetString(exports.getTemplate(property, lineText));
    return item;
};
exports.getItems = (context, prefix, lineText) => {
    const prefixData = utils_1.getColonData(prefix);
    if (prefixData.colon || prefixData.semicolon)
        return [];
    const usageMap = utils_1.getStore(context);
    return known_css_properties_1.all
        .filter((prop) => prop.startsWith(prefix) && utils_1.longEnough(prop)) // TODO: deside to use fuzzy search here
        .sort(exports.getComporator(usageMap))
        .map(exports.getItemBuilder(usageMap, lineText));
};
