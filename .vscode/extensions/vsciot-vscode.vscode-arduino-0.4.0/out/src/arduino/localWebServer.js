"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const path = require("path");
class LocalWebServer {
    constructor(_extensionPath) {
        this._extensionPath = _extensionPath;
        this.app = express();
        this.app.use("/", express.static(path.join(this._extensionPath, "./out/views")));
        this.app.use(bodyParser.json());
        this.server = http.createServer(this.app);
    }
    getServerUrl() {
        return `http://localhost:${this.server.address().port}`;
    }
    getEndpointUri(type) {
        return `http://localhost:${this.server.address().port}/${type}`;
    }
    addHandler(url, handler) {
        this.app.get(url, handler);
    }
    addPostHandler(url, handler) {
        this.app.post(url, handler);
    }
    /**
     * Start webserver.
     * If it fails to listen reject will report its error.
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                // Address and port are available as soon as the server
                // started listening, resolving localhost requires
                // some time.
                this.server.listen(0, "localhost", (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    // tslint:disable-next-line
                    console.log(`Express server listening on port: ${this.server.address().port}`);
                    resolve();
                });
            });
        });
    }
}
exports.default = LocalWebServer;

//# sourceMappingURL=localWebServer.js.map
