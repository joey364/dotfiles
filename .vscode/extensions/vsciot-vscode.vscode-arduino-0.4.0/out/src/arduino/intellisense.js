"use strict";
// Copyright (c) Elektronik Workshop. All rights reserved.
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
exports.AnalysisManager = exports.makeCompilerParserContext = exports.isCompilerParserEnabled = void 0;
const ccp = require("cocopa");
const os = require("os");
const path = require("path");
const constants = require("../common/constants");
const outputChannel_1 = require("../common/outputChannel");
const workspace_1 = require("../common/workspace");
const deviceContext_1 = require("../deviceContext");
const vscodeSettings_1 = require("./vscodeSettings");
;
/**
 * Returns true if the combination of global enable/disable and project
 * specific override enable the auto-generation of the IntelliSense
 * configuration.
 */
function isCompilerParserEnabled(dc) {
    if (!dc) {
        dc = deviceContext_1.DeviceContext.getInstance();
    }
    const globalDisable = vscodeSettings_1.VscodeSettings.getInstance().disableIntelliSenseAutoGen;
    const projectSetting = dc.intelliSenseGen;
    return projectSetting !== "disable" && !globalDisable ||
        projectSetting === "enable";
}
exports.isCompilerParserEnabled = isCompilerParserEnabled;
/**
 * Creates a context which is used for compiler command parsing
 * during building (verify, upload, ...).
 *
 * This context makes sure that it can be used in those sections
 * without having to check whether this feature is en- or disabled
 * and keeps the calling context more readable.
 *
 * @param dc The device context of the caller.
 *
 * Possible enhancements:
 *
 * * Order of includes: Perhaps insert the internal includes at the front
 *     as at least for the forcedIncludes IntelliSense seems to take the
 *     order into account.
 */
function makeCompilerParserContext(dc) {
    // TODO: callback for local setting: when IG gen is re-enabled file
    //   analysis trigger. Perhaps for global possible as well?
    if (!isCompilerParserEnabled(dc)) {
        return {
            callback: undefined,
            conclude: () => __awaiter(this, void 0, void 0, function* () {
                outputChannel_1.arduinoChannel.info("IntelliSense auto-configuration disabled.");
            }),
        };
    }
    const engines = makeCompilerParserEngines(dc);
    const runner = new ccp.Runner(engines);
    // Set up the callback to be called after parsing
    const _conclude = () => __awaiter(this, void 0, void 0, function* () {
        if (!runner.result) {
            outputChannel_1.arduinoChannel.warning("Failed to generate IntelliSense configuration.");
            return;
        }
        // Normalize compiler and include paths (resolve ".." and ".")
        runner.result.normalize();
        // Remove invalid paths
        yield runner.result.cleanup();
        // Search for Arduino.h in the include paths - we need it for a
        // forced include - users expect Arduino symbols to be available
        // in main sketch without having to include the header explicitly
        const ardHeader = yield runner.result.findFile("Arduino.h");
        const forcedIncludes = ardHeader.length > 0
            ? ardHeader
            : undefined;
        if (!forcedIncludes) {
            outputChannel_1.arduinoChannel.warning("Unable to locate \"Arduino.h\" within IntelliSense include paths.");
        }
        // The C++ standard is set to the following default value if no compiler flag has been found.
        const content = new ccp.CCppPropertiesContentResult(runner.result, constants.C_CPP_PROPERTIES_CONFIG_NAME, ccp.CCppPropertiesISMode.Gcc_X64, ccp.CCppPropertiesCStandard.C11, ccp.CCppPropertiesCppStandard.Cpp11, forcedIncludes);
        // The following 4 lines are added to prevent null.d from being created in the workspace
        // directory on MacOS and Linux. This is may be a bug in intelliSense
        const mmdIndex = runner.result.options.findIndex((element) => element === "-MMD");
        if (mmdIndex) {
            runner.result.options.splice(mmdIndex);
        }
        try {
            const cmd = os.platform() === "darwin" ? "Cmd" : "Ctrl";
            const help = `To manually rebuild your IntelliSense configuration run "${cmd}+Alt+I"`;
            const pPath = path.join(workspace_1.ArduinoWorkspace.rootPath, constants.CPP_CONFIG_FILE);
            const prop = new ccp.CCppProperties();
            prop.read(pPath);
            prop.merge(content, ccp.CCppPropertiesMergeMode.ReplaceSameNames);
            if (prop.write(pPath)) {
                outputChannel_1.arduinoChannel.info(`IntelliSense configuration updated. ${help}`);
            }
            else {
                outputChannel_1.arduinoChannel.info(`IntelliSense configuration already up to date. ${help}`);
            }
        }
        catch (e) {
            const estr = JSON.stringify(e);
            outputChannel_1.arduinoChannel.error(`Failed to read or write IntelliSense configuration: ${estr}`);
        }
    });
    return {
        callback: runner.callback(),
        conclude: _conclude,
    };
}
exports.makeCompilerParserContext = makeCompilerParserContext;
;
/**
 * Assembles compiler parser engines which then will be used to find the main
 * sketch's compile command and parse the infomation from it required for
 * assembling an IntelliSense configuration from it.
 *
 * It could return multiple engines for different compilers or - if necessary -
 * return specialized engines based on the current board architecture.
 *
 * @param dc Current device context used to generate the engines.
 */
function makeCompilerParserEngines(dc) {
    const sketch = path.basename(dc.sketch);
    const trigger = ccp.getTriggerForArduinoGcc(sketch);
    const gccParserEngine = new ccp.ParserGcc(trigger);
    return [gccParserEngine];
}
/**
 * Possible states of AnalysisManager's state machine.
 */
var AnalysisState;
(function (AnalysisState) {
    /**
     * No analysis request pending.
     */
    AnalysisState["Idle"] = "idle";
    /**
     * Analysis request pending. Waiting for the time out to expire or for
     * another build to complete.
     */
    AnalysisState["Waiting"] = "waiting";
    /**
     * Analysis in progress.
     */
    AnalysisState["Analyzing"] = "analyzing";
    /**
     * Analysis in progress with yet another analysis request pending.
     * As soon as the current analysis completes the manager will directly
     * enter the Waiting state.
     */
    AnalysisState["AnalyzingWaiting"] = "analyzing and waiting";
})(AnalysisState || (AnalysisState = {}));
/**
 * Events (edges) which cause state changes within AnalysisManager.
 */
var AnalysisEvent;
(function (AnalysisEvent) {
    /**
     * The only external event. Requests an analysis to be run.
     */
    AnalysisEvent[AnalysisEvent["AnalysisRequest"] = 0] = "AnalysisRequest";
    /**
     * The internal wait timeout expired.
     */
    AnalysisEvent[AnalysisEvent["WaitTimeout"] = 1] = "WaitTimeout";
    /**
     * The current analysis build finished.
     */
    AnalysisEvent[AnalysisEvent["AnalysisBuildDone"] = 2] = "AnalysisBuildDone";
})(AnalysisEvent || (AnalysisEvent = {}));
/**
 * This class manages analysis builds for the automatic IntelliSense
 * configuration synthesis. Its primary purposes are:
 *
 *  * delaying analysis requests caused by DeviceContext setting change
 *      events such that multiple subsequent requests don't cause
 *      multiple analysis builds
 *  * make sure that an analysis request is postponed when another build
 *      is currently in progress
 *
 * TODO: check time of c_cpp_properties.json and compare it with
 * * arduino.json
 * * main sketch file
 * This way we can perhaps optimize this further. But be aware
 * that settings events fire before their corresponding values
 * are actually written to arduino.json -> time of arduino.json
 * is outdated if no countermeasure is taken.
 */
class AnalysisManager {
    /**
     * Constructor.
     * @param isBuilding Provide a callback which returns true if another build
     * is currently in progress.
     * @param doBuild Provide a callback which runs the analysis build.
     * @param waitPeriodMs The delay the manger should wait for potential new
     * analysis request. This delay is used as polling interval as well when
     * checking for ongoing builds.
     */
    constructor(isBuilding, doBuild, waitPeriodMs = 1000) {
        /** The manager's state. */
        this._state = AnalysisState.Idle;
        this._isBuilding = isBuilding;
        this._doBuild = doBuild;
        this._waitPeriodMs = waitPeriodMs;
    }
    /**
     * File an analysis request.
     * The analysis will be delayed until no further requests are filed
     * within a wait period or until any build in progress has terminated.
     */
    requestAnalysis() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.update(AnalysisEvent.AnalysisRequest);
        });
    }
    /**
     * Update the manager's state machine.
     * @param event The event which will cause the state transition.
     *
     * Implementation note: asynchronous edge actions must be called after
     * setting the new state since they don't return immediately.
     */
    update(event) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this._state) {
                case AnalysisState.Idle:
                    if (event === AnalysisEvent.AnalysisRequest) {
                        this._state = AnalysisState.Waiting;
                        this.startWaitTimeout();
                    }
                    break;
                case AnalysisState.Waiting:
                    if (event === AnalysisEvent.AnalysisRequest) {
                        // every new request restarts timer
                        this.startWaitTimeout();
                    }
                    else if (event === AnalysisEvent.WaitTimeout) {
                        if (this._isBuilding()) {
                            // another build in progress, continue waiting
                            this.startWaitTimeout();
                        }
                        else {
                            // no other build in progress -> launch analysis
                            this._state = AnalysisState.Analyzing;
                            yield this.startAnalysis();
                        }
                    }
                    break;
                case AnalysisState.Analyzing:
                    if (event === AnalysisEvent.AnalysisBuildDone) {
                        this._state = AnalysisState.Idle;
                    }
                    else if (event === AnalysisEvent.AnalysisRequest) {
                        this._state = AnalysisState.AnalyzingWaiting;
                    }
                    break;
                case AnalysisState.AnalyzingWaiting:
                    if (event === AnalysisEvent.AnalysisBuildDone) {
                        // emulate the transition from idle to waiting
                        // (we don't care if this adds an additional
                        // timeout - event driven analysis is not time-
                        // critical)
                        this._state = AnalysisState.Idle;
                        yield this.update(AnalysisEvent.AnalysisRequest);
                    }
                    break;
            }
        });
    }
    /**
     * Starts the wait timeout timer.
     * If it's already running, the current timer is stopped and restarted.
     * The timeout callback will then update the state machine.
     */
    startWaitTimeout() {
        if (this._timer) {
            clearTimeout(this._timer);
        }
        this._timer = setTimeout(() => {
            // reset timer variable first - calling update can cause
            // the timer to be restarted.
            this._timer = undefined;
            this.update(AnalysisEvent.WaitTimeout);
        }, this._waitPeriodMs);
    }
    /**
     * Starts the analysis build.
     * When done, the callback will update the state machine.
     */
    startAnalysis() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._doBuild()
                .then(() => {
                this.update(AnalysisEvent.AnalysisBuildDone);
            })
                .catch((reason) => {
                this.update(AnalysisEvent.AnalysisBuildDone);
            });
        });
    }
}
exports.AnalysisManager = AnalysisManager;

//# sourceMappingURL=intellisense.js.map
