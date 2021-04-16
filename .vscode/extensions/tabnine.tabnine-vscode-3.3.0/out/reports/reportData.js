"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const systeminformation = require("systeminformation");
const date_fns_1 = require("date-fns");
const UNKNOWN_SPEED = -1;
const UNKNOWN_CORES_AMOUNT = -1;
const UNKNOWN_MEMORY_SIZE = -1;
const byteToGigabyte = (bytes) => bytes / 1e9;
function currentDateTimeUTC() {
    const date = new Date();
    return date_fns_1.format(date_fns_1.addMinutes(date, date.getTimezoneOffset()), "yyyy-MM-dd HH:mm:ss");
}
let specsCache;
async function getSpecs() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const [cpuData, osData, memoryData] = await Promise.all([
        systeminformation.cpu(),
        systeminformation.osInfo(),
        systeminformation.mem(),
    ]);
    return {
        os: {
            platform: (_a = osData === null || osData === void 0 ? void 0 : osData.platform) !== null && _a !== void 0 ? _a : "unknown-platform",
            distro: (_b = osData === null || osData === void 0 ? void 0 : osData.distro) !== null && _b !== void 0 ? _b : "unknown-distro",
            arch: (_c = osData === null || osData === void 0 ? void 0 : osData.arch) !== null && _c !== void 0 ? _c : "unknown-arch",
            kernel: (_d = osData === null || osData === void 0 ? void 0 : osData.kernel) !== null && _d !== void 0 ? _d : "unknown-kernel",
        },
        cpu: {
            manufacturer: (_e = cpuData === null || cpuData === void 0 ? void 0 : cpuData.manufacturer) !== null && _e !== void 0 ? _e : "unknown-manufacturer",
            brand: (_f = cpuData === null || cpuData === void 0 ? void 0 : cpuData.brand) !== null && _f !== void 0 ? _f : "unknown-brand",
            speed_ghz: (_g = cpuData === null || cpuData === void 0 ? void 0 : cpuData.speed) !== null && _g !== void 0 ? _g : UNKNOWN_SPEED,
            cores: (_h = cpuData === null || cpuData === void 0 ? void 0 : cpuData.cores) !== null && _h !== void 0 ? _h : UNKNOWN_CORES_AMOUNT,
        },
        memory_gb: (memoryData === null || memoryData === void 0 ? void 0 : memoryData.total)
            ? Math.round(byteToGigabyte(memoryData.total))
            : UNKNOWN_MEMORY_SIZE,
    };
}
async function getSpecsCache() {
    if (!specsCache) {
        specsCache = getSpecs();
    }
    return specsCache;
}
async function getReportData() {
    try {
        const specs = await getSpecsCache();
        return {
            timestamp: currentDateTimeUTC(),
            platform: `${specs.os.platform}`,
            distro: `${specs.os.distro}`,
            arch: `${specs.os.arch}`,
            kernel: `${specs.os.kernel}`,
            cpu_manufacturer: `${specs.cpu.manufacturer}`,
            cpu_brand: `${specs.cpu.brand}`,
            cores: `${specs.cpu.cores}`,
            speed_ghz: `${specs.cpu.speed_ghz}`,
            memory_gb: `${specs.memory_gb}`,
        };
    }
    catch (e) {
        console.log(`Could not fetch specs data, skipping: ${e}`);
        return undefined;
    }
}
exports.default = getReportData;
//# sourceMappingURL=reportData.js.map