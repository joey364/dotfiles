"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubspecMock = void 0;
class PubspecMock {
    constructor(name, source, target) {
        this.name = name;
        this.source = source;
        this.target = target;
    }
    static fromJSON(json) {
        return new PubspecMock(json["name"], json["source"], json["target"]);
    }
}
exports.PubspecMock = PubspecMock;
//# sourceMappingURL=pubspecMock.js.map