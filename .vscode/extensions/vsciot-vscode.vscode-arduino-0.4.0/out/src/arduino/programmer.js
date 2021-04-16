"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Programmer = exports.parseProgrammerDescriptor = void 0;
function parseProgrammerDescriptor(programmerDescriptor, plat) {
    const progrmmerLineRegex = /([^\.]+)\.(\S+)=(.+)/;
    const result = new Map();
    const lines = programmerDescriptor.split(/[\r|\r\n|\n]/);
    const menuMap = new Map();
    lines.forEach((line) => {
        // Ignore comments.
        if (line.startsWith("#")) {
            return;
        }
        const match = progrmmerLineRegex.exec(line);
        if (match && match.length > 3) {
            let programmer = result.get(match[1]);
            if (!programmer) {
                programmer = new Programmer(match[1], plat);
                result.set(programmer.name, programmer);
            }
            if (match[2] === "name") {
                programmer.displayName = match[3].trim();
            }
        }
    });
    return result;
}
exports.parseProgrammerDescriptor = parseProgrammerDescriptor;
class Programmer {
    constructor(_name, _platform, _displayName = _name) {
        this._name = _name;
        this._platform = _platform;
        this._displayName = _displayName;
    }
    get name() {
        return this._name;
    }
    get platform() {
        return this._platform;
    }
    get displayName() {
        return this._displayName;
    }
    set displayName(value) {
        this._displayName = value;
    }
    /**
     * @returns {string} Return programmer key in format packageName:name
     */
    get key() {
        return `${this.getPackageName}:${this.name}`;
    }
    get getPackageName() {
        return this.platform.packageName ? this.platform.packageName : this.platform.package.name;
    }
}
exports.Programmer = Programmer;

//# sourceMappingURL=programmer.js.map
