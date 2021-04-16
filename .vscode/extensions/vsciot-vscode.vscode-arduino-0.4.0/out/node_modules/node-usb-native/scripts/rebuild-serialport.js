// Run this script after install node-usb-native in your project
const { exec } = require('child_process');
const path = require("path");
const serialportBindingsPath = path.join(__dirname, "../../@serialport/bindings/");
const command = `cd ${serialportBindingsPath} && node-gyp rebuild --target=11.2.1 --arch=x64 --dist-url=https://atom.io/download/electron`;
exec(command,(error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
        console.log(`exec error: ${error}`);
    }
});