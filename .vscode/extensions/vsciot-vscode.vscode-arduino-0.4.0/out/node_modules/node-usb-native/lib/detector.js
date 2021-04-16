
const detectionNodeRelativePath = "usb-detection/build/Release/detection.node";
const detectionNodeDestPath = require("./utils").getPath(detectionNodeRelativePath);
require("./native_loader").load('detector', detectionNodeDestPath);

detector = require("usb-detection");
module.exports = detector;
