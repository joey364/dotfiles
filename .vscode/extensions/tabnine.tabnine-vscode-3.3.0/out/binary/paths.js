"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWindows = exports.getUpdateVersionFileUrl = exports.getActivePath = exports.getRootPath = exports.getDownloadVersionUrl = exports.getBundlePath = exports.versionPath = exports.setBinaryRootPath = void 0;
const path = require("path");
const fs_1 = require("fs");
const consts_1 = require("../consts");
let binaryRootPath;
const ARCHITECTURE = getArch();
const SUFFIX = getSuffix();
const BUNDLE_SUFFIX = getBundleSuffix();
async function setBinaryRootPath(updatedPath) {
    binaryRootPath = path.join(updatedPath.fsPath, "binaries");
    try {
        await fs_1.promises.mkdir(binaryRootPath, { recursive: true });
    }
    catch (err) {
        // Exception is thrown if the path already exists, so ignore error.
    }
}
exports.setBinaryRootPath = setBinaryRootPath;
function versionPath(version) {
    if (!binaryRootPath) {
        throw new Error("Binary root path not set");
    }
    return path.join(binaryRootPath, version, `${ARCHITECTURE}-${SUFFIX}`);
}
exports.versionPath = versionPath;
function getBundlePath(version) {
    if (!binaryRootPath) {
        throw new Error("Binary root path not set");
    }
    return path.join(binaryRootPath, version, `${ARCHITECTURE}-${BUNDLE_SUFFIX}`);
}
exports.getBundlePath = getBundlePath;
function getDownloadVersionUrl(version) {
    return `${consts_1.BINARY_UPDATE_URL}/${version}/${ARCHITECTURE}-${BUNDLE_SUFFIX}`;
}
exports.getDownloadVersionUrl = getDownloadVersionUrl;
function getRootPath() {
    if (!binaryRootPath) {
        throw new Error("Binary root path not set");
    }
    return binaryRootPath;
}
exports.getRootPath = getRootPath;
function getActivePath() {
    if (!binaryRootPath) {
        throw new Error("Binary root path not set");
    }
    return path.join(binaryRootPath, ".active");
}
exports.getActivePath = getActivePath;
function getUpdateVersionFileUrl() {
    return consts_1.BINARY_UPDATE_VERSION_FILE_URL;
}
exports.getUpdateVersionFileUrl = getUpdateVersionFileUrl;
function getSuffix() {
    switch (process.platform) {
        case "win32":
            return "pc-windows-gnu/TabNine.exe";
        case "darwin":
            return "apple-darwin/TabNine";
        case "linux":
            return "unknown-linux-musl/TabNine";
        default:
            throw new Error(`Sorry, the platform '${process.platform}' is not supported by TabNine.`);
    }
}
function isWindows() {
    return process.platform === "win32";
}
exports.isWindows = isWindows;
function getBundleSuffix() {
    return `${SUFFIX.replace(".exe", "")}.zip`;
}
function getArch() {
    if (process.platform === "darwin" && process.arch === "arm64") {
        return "aarch64";
    }
    if (process.arch === "x32" || process.arch === "ia32") {
        return "i686";
    }
    if (process.arch === "x64") {
        return "x86_64";
    }
    throw new Error(`Sorry, the architecture '${process.arch}' is not supported by TabNine.`);
}
//# sourceMappingURL=paths.js.map