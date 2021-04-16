"use strict";
// Copyright (c) Elektronik Workshop. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceSettings = void 0;
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const constants = require("./common/constants");
const util = require("./common/util");
const logger = require("./logger/logger");
/**
 * Generic class which provides monitoring of a specific settings value.
 * If the value is modified a flag is set and an event is emitted.
 *
 * Usually you want to specialize the setter for any given value type
 * to prevent invalid or badly formatted values to enter your settings.
 */
class Setting {
    constructor(defaultValue) {
        /** Event emitter which fires when the value is changed. */
        this._emitter = new vscode.EventEmitter();
        this.default = defaultValue;
        this._value = this.default;
    }
    /**
     * Value-setter - sets the value.
     * If modified, the modified flag is set and the modified event is
     * fired.
     */
    set value(value) {
        if (value !== this._value) {
            this._value = value;
            this._modified = true;
            this._emitter.fire(this._value);
        }
    }
    /** Value-getter - returns the internal value. */
    get value() {
        return this._value;
    }
    /**
     * Returns true, if the internal value has been modified.
     * To clear the modified flag call commit().
     */
    get modified() {
        return this._modified;
    }
    /** Returns the modified-event emitter. */
    get emitter() {
        return this._emitter;
    }
    /**
     * Returns the internal value to its default value.
     * If the default value is different from the previous value,
     * it triggers the modified event and the modified flag is set.
     */
    reset() {
        this.value = this.default;
    }
    /** Reset the modified flag (if you know what you're doing) */
    commit() {
        this._modified = false;
    }
}
/**
 * String specialization of the Setting class.
 */
class StrSetting extends Setting {
    /**
     * When we override setter (below) we have to override getter as well
     * (see JS language specs).
     */
    get value() {
        return super.value;
    }
    /**
     * Set string value. Anything else than a string will set the value to
     * its default value (undefined). White spaces at the front and back are
     * trimmed before setting the value.
     * If the setting's value is changed during this operation, the base
     * class' event emitter will fire and the modified flag will be set.
     */
    set value(value) {
        if (typeof value !== "string") {
            value = this.default;
        }
        else {
            value = value.trim();
        }
        super.value = value;
    }
}
class BuildPrefSetting extends Setting {
    get value() {
        return super.value;
    }
    set value(value) {
        if (!Array.isArray(value)) {
            super.value = super.default;
            return;
        }
        if (value.length <= 0) {
            super.value = super.default;
            return;
        }
        for (const pref of value) {
            if (!Array.isArray(pref) || pref.length !== 2) {
                super.value = super.default;
                return;
            }
            for (const i of pref) {
                if (typeof i !== "string") {
                    super.value = super.default;
                    return;
                }
            }
        }
        super.value = value;
    }
}
/**
 * This class encapsulates all device/project specific settings and
 * provides common operations on them.
 */
class DeviceSettings {
    constructor() {
        this.port = new StrSetting();
        this.board = new StrSetting();
        this.sketch = new StrSetting();
        this.output = new StrSetting();
        this.debugger = new StrSetting();
        this.intelliSenseGen = new StrSetting();
        this.configuration = new StrSetting();
        this.prebuild = new StrSetting();
        this.postbuild = new StrSetting();
        this.programmer = new StrSetting();
        this.buildPreferences = new BuildPrefSetting();
    }
    /**
     * @returns true if any of the settings values has its modified flag
     * set.
     */
    get modified() {
        return this.port.modified ||
            this.board.modified ||
            this.sketch.modified ||
            this.output.modified ||
            this.debugger.modified ||
            this.intelliSenseGen.modified ||
            this.configuration.modified ||
            this.prebuild.modified ||
            this.postbuild.modified ||
            this.programmer.modified ||
            this.buildPreferences.modified;
    }
    /**
     * Clear modified flags of all settings values.
     */
    commit() {
        this.port.commit();
        this.board.commit();
        this.sketch.commit();
        this.output.commit();
        this.debugger.commit();
        this.intelliSenseGen.commit();
        this.configuration.commit();
        this.prebuild.commit();
        this.postbuild.commit();
        this.programmer.commit();
        this.buildPreferences.commit();
    }
    /**
     * Resets all settings values to their default values.
     * @param commit If true clear the modified flags after all values are
     * reset.
     */
    reset(commit = true) {
        this.port.reset();
        this.board.reset();
        this.sketch.reset();
        this.output.reset();
        this.debugger.reset();
        this.intelliSenseGen.reset();
        this.configuration.reset();
        this.prebuild.reset();
        this.postbuild.reset();
        this.programmer.reset();
        this.buildPreferences.reset();
        if (commit) {
            this.commit();
        }
    }
    /**
     * Load settings values from the given file.
     * If a value is changed through this operation, its event emitter will
     * fire.
     * @param file Path to the file the settings should be loaded from.
     * @param commit If true reset the modified flags after all values are read.
     * @returns true if the settings are loaded successfully.
     */
    load(file, commit = true) {
        const settings = util.tryParseJSON(fs.readFileSync(file, "utf8"));
        if (settings) {
            this.port.value = settings.port;
            this.board.value = settings.board;
            this.sketch.value = settings.sketch;
            this.configuration.value = settings.configuration;
            this.output.value = settings.output;
            this.debugger.value = settings.debugger;
            this.intelliSenseGen.value = settings.intelliSenseGen;
            this.prebuild.value = settings.prebuild;
            this.postbuild.value = settings.postbuild;
            this.programmer.value = settings.programmer;
            this.buildPreferences.value = settings.buildPreferences;
            if (commit) {
                this.commit();
            }
            return true;
        }
        else {
            logger.notifyUserError("arduinoFileError", new Error(constants.messages.ARDUINO_FILE_ERROR));
            return false;
        }
    }
    /**
     * Writes the settings to the given file if there are modified
     * values. The modification flags are reset (commit()) on successful write.
     * On write failure the modification flags are left unmodified.
     * @param file Path to file the JSON representation of the settings should
     * written to. If either the folder or the file does not exist they are
     * created.
     * @returns true on succes, false on write failure.
     */
    save(file) {
        if (!this.modified) {
            return true;
        }
        let settings = {};
        if (util.fileExistsSync(file)) {
            settings = util.tryParseJSON(fs.readFileSync(file, "utf8"));
        }
        if (!settings) {
            logger.notifyUserError("arduinoFileError", new Error(constants.messages.ARDUINO_FILE_ERROR));
            return false;
        }
        settings.sketch = this.sketch.value;
        settings.port = this.port.value;
        settings.board = this.board.value;
        settings.output = this.output.value;
        settings.debugger = this.debugger.value;
        settings.intelliSenseGen = this.intelliSenseGen.value;
        settings.configuration = this.configuration.value;
        settings.programmer = this.programmer.value;
        util.mkdirRecursivelySync(path.dirname(file));
        fs.writeFileSync(file, JSON.stringify(settings, undefined, 4));
        this.commit();
        return true;
    }
}
exports.DeviceSettings = DeviceSettings;

//# sourceMappingURL=deviceSettings.js.map
