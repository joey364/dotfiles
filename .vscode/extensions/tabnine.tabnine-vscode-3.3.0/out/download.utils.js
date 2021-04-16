"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadResource = exports.downloadFileToDestination = exports.downloadFileToStr = void 0;
const https = require("https");
const fs = require("fs");
const url = require("url");
const proxyProvider_1 = require("./proxyProvider");
function downloadFileToStr(urlStr) {
    return downloadResource(urlStr, (response, resolve, reject) => {
        let downloadedData = "";
        response.on("data", (data) => {
            downloadedData += data;
        });
        response.on("error", (error) => {
            reject(error);
        });
        response.on("end", () => {
            resolve(downloadedData);
        });
    });
}
exports.downloadFileToStr = downloadFileToStr;
function downloadFileToDestination(urlStr, destinationPath) {
    return downloadResource(urlStr, (response, resolve, reject) => {
        const createdFile = fs.createWriteStream(destinationPath);
        createdFile.on("finish", () => {
            resolve();
        });
        response.on("error", (error) => {
            reject(error);
        });
        response.pipe(createdFile);
    });
}
exports.downloadFileToDestination = downloadFileToDestination;
function downloadResource(urlStr, callback) {
    return new Promise((resolve, reject) => {
        const parsedUrl = url.parse(urlStr);
        const { agent, rejectUnauthorized } = proxyProvider_1.default();
        const request = https.request({
            host: parsedUrl.host,
            path: parsedUrl.path,
            port: getPortNumber(parsedUrl),
            agent,
            rejectUnauthorized,
            headers: { "User-Agent": "TabNine.tabnine-vscode" },
        }, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                let redirectUrl;
                if (typeof response.headers.location === "string") {
                    redirectUrl = response.headers.location;
                }
                else {
                    if (!response.headers.location || response.headers.location) {
                        return reject(new Error("Invalid download location received"));
                    }
                    [redirectUrl] = response.headers.location;
                }
                return resolve(downloadResource(redirectUrl, callback));
            }
            if (response.statusCode !== 200 && response.statusCode !== 403) {
                return reject(new Error(`Failed request statusCode ${response.statusCode || ""}`));
            }
            callback(response, resolve, reject);
            response.on("error", (error) => {
                reject(error);
            });
            return undefined;
        });
        request.on("error", (error) => {
            reject(error);
        });
        request.end();
    });
}
exports.downloadResource = downloadResource;
function getPortNumber(parsedUrl) {
    return ((parsedUrl.port && Number(parsedUrl.port)) ||
        (parsedUrl.protocol === "https:" ? 443 : 80));
}
//# sourceMappingURL=download.utils.js.map