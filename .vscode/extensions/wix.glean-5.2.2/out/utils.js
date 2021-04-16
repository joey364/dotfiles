"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
exports.cancelActionIfNeeded = value => value ? value : Promise.reject(false);
//# sourceMappingURL=utils.js.map