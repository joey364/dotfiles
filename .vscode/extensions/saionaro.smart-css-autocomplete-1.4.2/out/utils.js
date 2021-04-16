"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColonData = exports.longEnough = exports.getStore = exports.toAlphabetic = void 0;
const constants_1 = require("./constants");
exports.toAlphabetic = (num) => constants_1.FIRST_LETTER.repeat(num); // TODO: replace with a way smarter approach
exports.getStore = (context, isCopy = false) => {
    var _a;
    const map = (_a = context.globalState.get(constants_1.STORAGE_KEYS.USAGE_MAP)) !== null && _a !== void 0 ? _a : {};
    return isCopy ? { ...map } : map;
};
exports.longEnough = (prop) => prop.length > 1;
exports.getColonData = (text) => {
    const data = {
        colon: false,
        semicolon: text[text.length - 1] === constants_1.SEMICOLON,
    };
    for (let i = 0; i < text.length; i++) {
        if (text[i] === constants_1.COLON) {
            data.colon = true;
            break;
        }
    }
    return data;
};
