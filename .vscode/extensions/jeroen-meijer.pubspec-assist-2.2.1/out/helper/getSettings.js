"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = void 0;
const vscode = require("vscode");
exports.getSettings = () => {
    var _a, _b, _c, _d;
    const getSettingByKey = (keyName) => vscode.workspace.getConfiguration().get(`pubspec-assist.${keyName}`);
    return {
        autoAddPackage: (_a = getSettingByKey("autoAddPackage")) !== null && _a !== void 0 ? _a : true,
        useCaretSyntax: (_b = getSettingByKey("useCaretSyntax")) !== null && _b !== void 0 ? _b : true,
        sortDependencies: (_c = getSettingByKey("sortDependencies")) !== null && _c !== void 0 ? _c : false,
        useLegacyParser: (_d = getSettingByKey("useLegacyParser")) !== null && _d !== void 0 ? _d : false,
    };
};
//# sourceMappingURL=getSettings.js.map