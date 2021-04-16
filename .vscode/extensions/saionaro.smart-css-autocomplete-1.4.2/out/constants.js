"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CURSOR = exports.SEMICOLON = exports.COLON = exports.FIRST_LETTER = exports.COMMANDS = exports.STORAGE_KEYS = exports.SELECTOR = exports.FILES_GLOB = exports.SCHEME = exports.TITLE = void 0;
exports.TITLE = "vs-smart-css-autocomplete";
exports.SCHEME = "file";
exports.FILES_GLOB = "**/*.{css,scss,less,sass,styl}";
exports.SELECTOR = {
    scheme: exports.SCHEME,
    pattern: exports.FILES_GLOB,
};
exports.STORAGE_KEYS = {
    USAGE_MAP: `${exports.TITLE}.usage`,
};
exports.COMMANDS = {
    SELECTED: {
        TITLE: "selected-notification",
        CMD: `${exports.TITLE}.selected`,
    },
};
exports.FIRST_LETTER = "a";
exports.COLON = ":";
exports.SEMICOLON = ";";
exports.CURSOR = "$0";
