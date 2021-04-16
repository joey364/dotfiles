"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardConfigResult = void 0;
/**
 * Return values of calls to IBoard.loadConfig() and IBoard.updateConfig().
 */
var BoardConfigResult;
(function (BoardConfigResult) {
    /**
     * Setting configuration value(s) was successful
     */
    BoardConfigResult[BoardConfigResult["Success"] = 0] = "Success";
    /**
     * Setting configuration value(s) was successful. All or some items
     * were already set to the requested values.
     */
    BoardConfigResult[BoardConfigResult["SuccessNoChange"] = 1] = "SuccessNoChange";
    /**
     * One or more configuration keys were invalid.
     */
    BoardConfigResult[BoardConfigResult["InvalidConfigID"] = 2] = "InvalidConfigID";
    /**
     * One or more options were invalid.
     */
    BoardConfigResult[BoardConfigResult["InvalidOptionID"] = 3] = "InvalidOptionID";
    /**
     * Can only happen when calling IBoard.loadConfig() and when
     * the raw configuration string did contain invalid/unparsable
     * elements.
     */
    BoardConfigResult[BoardConfigResult["InvalidFormat"] = 4] = "InvalidFormat";
})(BoardConfigResult = exports.BoardConfigResult || (exports.BoardConfigResult = {}));

//# sourceMappingURL=package.js.map
