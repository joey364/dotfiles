"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMacArduinoAppPath = exports.convertToHex = exports.getRegistryValues = exports.parseConfigFile = exports.padStart = exports.union = exports.trim = exports.formatVersion = exports.parseProperties = exports.filterJunk = exports.isJunk = exports.tryParseJSON = exports.decodeData = exports.spawn = exports.isArduinoFile = exports.cp = exports.rmdirRecursivelySync = exports.mkdirRecursivelySync = exports.readdirSync = exports.directoryExistsSync = exports.fileExistsSync = void 0;
const child_process = require("child_process");
const fs = require("fs");
const iconv = require("iconv-lite");
const os = require("os");
const path = require("path");
const properties = require("properties");
const WinReg = require("winreg");
const outputChannel_1 = require("./outputChannel");
const encodingMapping = JSON.parse(fs.readFileSync(path.join(__dirname, "../../../misc", "codepageMapping.json"), "utf8"));
/**
 * This function will detect the file existing in the sync mode.
 * @function fileExistsSync
 * @argument {string} filePath
 */
function fileExistsSync(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    }
    catch (e) {
        return false;
    }
}
exports.fileExistsSync = fileExistsSync;
/**
 * This function will detect the directoy existing in the sync mode.
 * @function directoryExistsSync
 * @argument {string} dirPath
 */
function directoryExistsSync(dirPath) {
    try {
        return fs.statSync(dirPath).isDirectory();
    }
    catch (e) {
        return false;
    }
}
exports.directoryExistsSync = directoryExistsSync;
/**
 * This function will implement the same function as the fs.readdirSync,
 * besides it could filter out folders only when the second argument is true.
 * @function readdirSync
 * @argument {string} dirPath
 * @argument {boolean} folderOnly
 */
function readdirSync(dirPath, folderOnly = false) {
    const dirs = fs.readdirSync(dirPath);
    if (folderOnly) {
        return dirs.filter((subdir) => {
            return directoryExistsSync(path.join(dirPath, subdir));
        });
    }
    else {
        return dirs;
    }
}
exports.readdirSync = readdirSync;
/**
 * Recursively create directories. Equals to "mkdir -p"
 * @function mkdirRecursivelySync
 * @argument {string} dirPath
 */
function mkdirRecursivelySync(dirPath) {
    if (directoryExistsSync(dirPath)) {
        return;
    }
    const dirname = path.dirname(dirPath);
    if (path.normalize(dirname) === path.normalize(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    else if (directoryExistsSync(dirname)) {
        fs.mkdirSync(dirPath);
    }
    else {
        mkdirRecursivelySync(dirname);
        fs.mkdirSync(dirPath);
    }
}
exports.mkdirRecursivelySync = mkdirRecursivelySync;
/**
 * Recursively delete files. Equals to "rm -rf"
 * @function rmdirRecursivelySync
 * @argument {string} rootPath
 */
function rmdirRecursivelySync(rootPath) {
    if (fs.existsSync(rootPath)) {
        fs.readdirSync(rootPath).forEach((file) => {
            const curPath = path.join(rootPath, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                rmdirRecursivelySync(curPath);
            }
            else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(rootPath);
    }
}
exports.rmdirRecursivelySync = rmdirRecursivelySync;
function copyFileSync(src, dest, overwrite = true) {
    if (!fileExistsSync(src) || (!overwrite && fileExistsSync(dest))) {
        return;
    }
    const BUF_LENGTH = 64 * 1024;
    const buf = new Buffer(BUF_LENGTH);
    let lastBytes = BUF_LENGTH;
    let pos = 0;
    let srcFd = null;
    let destFd = null;
    try {
        srcFd = fs.openSync(src, "r");
    }
    catch (error) {
    }
    try {
        destFd = fs.openSync(dest, "w");
    }
    catch (error) {
    }
    try {
        while (lastBytes === BUF_LENGTH) {
            lastBytes = fs.readSync(srcFd, buf, 0, BUF_LENGTH, pos);
            fs.writeSync(destFd, buf, 0, lastBytes);
            pos += lastBytes;
        }
    }
    catch (error) {
    }
    if (srcFd) {
        fs.closeSync(srcFd);
    }
    if (destFd) {
        fs.closeSync(destFd);
    }
}
function copyFolderRecursivelySync(src, dest) {
    if (!directoryExistsSync(src)) {
        return;
    }
    if (!directoryExistsSync(dest)) {
        mkdirRecursivelySync(dest);
    }
    const items = fs.readdirSync(src);
    for (const item of items) {
        const fullPath = path.join(src, item);
        const targetPath = path.join(dest, item);
        if (directoryExistsSync(fullPath)) {
            copyFolderRecursivelySync(fullPath, targetPath);
        }
        else if (fileExistsSync(fullPath)) {
            copyFileSync(fullPath, targetPath);
        }
    }
}
/**
 * Copy files & directories recursively. Equals to "cp -r"
 * @argument {string} src
 * @argument {string} dest
 */
function cp(src, dest) {
    if (fileExistsSync(src)) {
        let targetFile = dest;
        if (directoryExistsSync(dest)) {
            targetFile = path.join(dest, path.basename(src));
        }
        if (path.relative(src, targetFile)) {
            // if the source and target file is the same, skip copying.
            return;
        }
        copyFileSync(src, targetFile);
    }
    else if (directoryExistsSync(src)) {
        copyFolderRecursivelySync(src, dest);
    }
    else {
        throw new Error(`No such file or directory: ${src}`);
    }
}
exports.cp = cp;
/**
 * Check if the specified file is an arduino file (*.ino, *.pde).
 * @argument {string} filePath
 */
function isArduinoFile(filePath) {
    return fileExistsSync(filePath) && (path.extname(filePath) === ".ino" || path.extname(filePath) === ".pde");
}
exports.isArduinoFile = isArduinoFile;
/**
 * Send a command to arduino
 * @param {string} command - base command path (either Arduino IDE or CLI)
 * @param {vscode.OutputChannel} outputChannel - output display channel
 * @param {string[]} [args=[]] - arguments to pass to the command
 * @param {any} [options={}] - options and flags for the arguments
 * @param {(string) => {}} - callback for stdout text
 */
function spawn(command, args = [], options = {}, output) {
    return new Promise((resolve, reject) => {
        options.cwd = options.cwd || path.resolve(path.join(__dirname, ".."));
        const child = child_process.spawn(command, args, options);
        let codepage = "65001";
        if (os.platform() === "win32") {
            try {
                const chcp = child_process.execSync("chcp.com");
                codepage = chcp.toString().split(":").pop().trim();
            }
            catch (error) {
                outputChannel_1.arduinoChannel.warning(`Defaulting to code page 850 because chcp.com failed.\
                \rEnsure your path includes %SystemRoot%\\system32\r${error.message}`);
                codepage = "850";
            }
        }
        if (output) {
            if (output.channel || output.stdout) {
                child.stdout.on("data", (data) => {
                    const decoded = decodeData(data, codepage);
                    if (output.stdout) {
                        output.stdout(decoded);
                    }
                    if (output.channel) {
                        output.channel.append(decoded);
                    }
                });
            }
            if (output.channel || output.stderr) {
                child.stderr.on("data", (data) => {
                    const decoded = decodeData(data, codepage);
                    if (output.stderr) {
                        output.stderr(decoded);
                    }
                    if (output.channel) {
                        output.channel.append(decoded);
                    }
                });
            }
        }
        child.on("error", (error) => reject({ error }));
        child.on("exit", (code) => {
            if (code === 0) {
                resolve({ code });
            }
            else {
                reject({ code });
            }
        });
    });
}
exports.spawn = spawn;
function decodeData(data, codepage) {
    if (encodingMapping.hasOwnProperty(codepage)) {
        return iconv.decode(data, encodingMapping[codepage]);
    }
    return data.toString();
}
exports.decodeData = decodeData;
function tryParseJSON(jsonString) {
    try {
        const jsonObj = JSON.parse(jsonString);
        if (jsonObj && typeof jsonObj === "object") {
            return jsonObj;
        }
    }
    catch (ex) { }
    return undefined;
}
exports.tryParseJSON = tryParseJSON;
function isJunk(filename) {
    // tslint:disable-next-line
    const re = /^npm-debug\.log$|^\..*\.swp$|^\.DS_Store$|^\.AppleDouble$|^\.LSOverride$|^Icon\r$|^\._.*|^\.Spotlight-V100(?:$|\/)|\.Trashes|^__MACOSX$|~$|^Thumbs\.db$|^ehthumbs\.db$|^Desktop\.ini$/;
    return re.test(filename);
}
exports.isJunk = isJunk;
function filterJunk(files) {
    return files.filter((file) => !isJunk(file));
}
exports.filterJunk = filterJunk;
function parseProperties(propertiesFile) {
    return new Promise((resolve, reject) => {
        properties.parse(propertiesFile, { path: true }, (error, obj) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(obj);
            }
        });
    });
}
exports.parseProperties = parseProperties;
function formatVersion(version) {
    if (!version) {
        return version;
    }
    const versions = String(version).split(".");
    if (versions.length < 2) {
        versions.push("0");
    }
    if (versions.length < 3) {
        versions.push("0");
    }
    return versions.join(".");
}
exports.formatVersion = formatVersion;
function trim(value) {
    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            value[i] = trim(value[i]);
        }
    }
    else if (typeof value === "string") {
        value = value.trim();
    }
    return value;
}
exports.trim = trim;
function union(a, b, compare) {
    const result = [].concat(a);
    b.forEach((item) => {
        const exist = result.find((element) => {
            return (compare ? compare(item, element) : Object.is(item, element));
        });
        if (!exist) {
            result.push(item);
        }
    });
    return result;
}
exports.union = union;
/**
 * This method pads the current string with another string (repeated, if needed)
 * so that the resulting string reaches the given length.
 * The padding is applied from the start (left) of the current string.
 * @argument {string} sourceString
 * @argument {string} targetLength
 * @argument {string} padString
 */
function padStart(sourceString, targetLength, padString) {
    if (!sourceString) {
        return sourceString;
    }
    if (!String.prototype.padStart) {
        // https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
        padString = String(padString || " ");
        if (sourceString.length > targetLength) {
            return sourceString;
        }
        else {
            targetLength = targetLength - sourceString.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); // append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength) + sourceString;
        }
    }
    else {
        return sourceString.padStart(targetLength, padString);
    }
}
exports.padStart = padStart;
function parseConfigFile(fullFileName, filterComment = true) {
    const result = new Map();
    if (fileExistsSync(fullFileName)) {
        const rawText = fs.readFileSync(fullFileName, "utf8");
        const lines = rawText.split("\n");
        lines.forEach((line) => {
            if (line) {
                line = line.trim();
                if (filterComment) {
                    if (line.trim() && line.startsWith("#")) {
                        return;
                    }
                }
                const separator = line.indexOf("=");
                if (separator > 0) {
                    const key = line.substring(0, separator).trim();
                    const value = line.substring(separator + 1, line.length).trim();
                    result.set(key, value);
                }
            }
        });
    }
    return result;
}
exports.parseConfigFile = parseConfigFile;
function getRegistryValues(hive, key, name) {
    return new Promise((resolve, reject) => {
        try {
            const regKey = new WinReg({
                hive,
                key,
            });
            regKey.valueExists(name, (e, exists) => {
                if (e) {
                    return reject(e);
                }
                if (exists) {
                    regKey.get(name, (err, result) => {
                        if (!err) {
                            resolve(result ? result.value : "");
                        }
                        else {
                            reject(err);
                        }
                    });
                }
                else {
                    resolve("");
                }
            });
        }
        catch (ex) {
            reject(ex);
        }
    });
}
exports.getRegistryValues = getRegistryValues;
function convertToHex(number, width = 0) {
    return padStart(number.toString(16), width, "0");
}
exports.convertToHex = convertToHex;
/**
 * This will accept any Arduino*.app on Mac OS,
 * in case you named Arduino with a version number
 * @argument {string} arduinoPath
 */
function resolveMacArduinoAppPath(arduinoPath) {
    if (/Arduino.*\.app/.test(arduinoPath)) {
        return arduinoPath;
    }
    else {
        return path.join(arduinoPath, "Arduino.app");
    }
}
exports.resolveMacArduinoAppPath = resolveMacArduinoAppPath;

//# sourceMappingURL=util.js.map
