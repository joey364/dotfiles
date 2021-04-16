"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const editor_1 = require("./editor");
exports.shouldBeConsideredJsFiles = (...files) => {
    const extentionsToBeConsideredJS = editor_1.config().jsFilesExtensions;
    return files.every(file => extentionsToBeConsideredJS.includes(path.extname(file).replace('.', '')));
};
exports.commonJSModuleSystemUsed = () => editor_1.config().jsModuleSystem === 'commonjs';
const isExperimentOn = (experiment) => (editor_1.config().experiments || []).includes(experiment);
exports.hooksSupported = () => true;
exports.esmModuleSystemUsed = () => editor_1.config().jsModuleSystem === 'esm';
exports.shouldSwitchToTarget = () => editor_1.config().switchToTarget;
exports.shouldShowConversionWarning = () => editor_1.config().showConversionWarning;
exports.shouldUseExportDefault = () => editor_1.config().useExportDefault;
//# sourceMappingURL=settings.js.map