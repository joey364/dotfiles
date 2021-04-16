"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.boardEqual = exports.Board = exports.parseBoardDescriptor = void 0;
const package_1 = require("./package");
function parseBoardDescriptor(boardDescriptor, plat) {
    const boardLineRegex = /([^\.]+)\.(\S+)=(.+)/;
    const result = new Map();
    const lines = boardDescriptor.split(/(?:\r|\r\n|\n)/);
    const menuMap = new Map();
    lines.forEach((line) => {
        // Ignore comments.
        if (line.startsWith("#")) {
            return;
        }
        const match = boardLineRegex.exec(line);
        if (match) {
            if (line.startsWith("menu.")) {
                menuMap.set(match[2], match[3]);
                return;
            }
            let boardObject = result.get(match[1]);
            if (!boardObject) {
                boardObject = new Board(match[1], plat, menuMap);
                result.set(boardObject.board, boardObject);
            }
            if (match[2] === "name") {
                boardObject.name = match[3].trim();
            }
            else {
                boardObject.addParameter(match[2], match[3]);
            }
        }
    });
    return result;
}
exports.parseBoardDescriptor = parseBoardDescriptor;
const MENU_REGEX = /menu\.([^\.]+)\.([^\.]+)(\.?(\S+)?)/;
class Board {
    constructor(_board, _platform, _menuMap) {
        this._board = _board;
        this._platform = _platform;
        this._menuMap = _menuMap;
        this._configItems = [];
    }
    get board() {
        return this._board;
    }
    get platform() {
        return this._platform;
    }
    addParameter(key, value) {
        const match = key.match(MENU_REGEX);
        if (match) {
            const existingItem = this._configItems.find((item) => item.id === match[1]);
            if (existingItem) {
                if (!existingItem.selectedOption) {
                    existingItem.selectedOption = match[2];
                }
                const existingOption = existingItem.options.find((opt) => opt.id === match[2]);
                if (!existingOption) {
                    existingItem.options.push({ id: match[2], displayName: value });
                }
            }
            else {
                this._configItems.push({
                    displayName: this._menuMap.get(match[1]),
                    id: match[1],
                    selectedOption: match[2],
                    options: [{ id: match[2], displayName: value }],
                });
            }
        }
    }
    getBuildConfig() {
        return `${this.getPackageName()}:${this.platform.architecture}:${this.board}${this.customConfig ? ":" + this.customConfig : ""}`;
    }
    /**
     * @returns {string} Return board key in format packageName:arch:boardName
     */
    get key() {
        return `${this.getPackageName()}:${this.platform.architecture}:${this.board}`;
    }
    get customConfig() {
        if (this._configItems && this._configItems.length > 0) {
            return this._configItems.map((configItem) => `${configItem.id}=${configItem.selectedOption}`).join(",");
        }
    }
    get configItems() {
        return this._configItems;
    }
    loadConfig(configString) {
        // An empty or undefined config string resets the configuration
        if (!configString) {
            this.resetConfig();
            return package_1.BoardConfigResult.Success;
        }
        const configSections = configString.split(",");
        const keyValueRegex = /(\S+)=(\S+)/;
        let result = package_1.BoardConfigResult.Success;
        for (const section of configSections) {
            const match = section.match(keyValueRegex);
            if (!match) {
                return package_1.BoardConfigResult.InvalidFormat;
            }
            const r = this.updateConfig(match[1], match[2]);
            switch (r) {
                case package_1.BoardConfigResult.SuccessNoChange:
                    result = r;
                    break;
                case package_1.BoardConfigResult.Success:
                    break;
                default:
                    return r;
            }
        }
        ;
        return result;
    }
    /**
     * For documentation see the documentation on IBoard.updateConfig().
     */
    updateConfig(configId, optionId) {
        const targetConfig = this._configItems.find((config) => config.id === configId);
        if (!targetConfig) {
            return package_1.BoardConfigResult.InvalidConfigID;
        }
        // Iterate through all options and ...
        for (const o of targetConfig.options) {
            // Make sure that we only set valid options, e.g. when loading
            // from config files.
            if (o.id === optionId) {
                if (targetConfig.selectedOption !== optionId) {
                    targetConfig.selectedOption = optionId;
                    return package_1.BoardConfigResult.Success;
                }
                return package_1.BoardConfigResult.SuccessNoChange;
            }
        }
        return package_1.BoardConfigResult.InvalidOptionID;
    }
    resetConfig() {
        for (const c of this._configItems) {
            c.selectedOption = c.options[0].id;
        }
    }
    getPackageName() {
        return this.platform.packageName ? this.platform.packageName : this.platform.package.name;
    }
}
exports.Board = Board;
/**
 * Test if two boards are of the same type, i.e. have the same key.
 * @param {IBoard | undefined} a A board.
 * @param {IBoard | undefined} b And another board.
 * @returns {boolean} true if two boards are of the same type, else false.
 */
function boardEqual(a, b) {
    if (a && b) {
        return a.key === b.key;
    }
    else if (a || b) {
        return false;
    }
    return true;
}
exports.boardEqual = boardEqual;

//# sourceMappingURL=board.js.map
