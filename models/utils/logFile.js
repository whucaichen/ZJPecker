/**
 * Created by Chance on 16/12/08.
 */

var fs = require('fs');
var path = require("path");

module.exports = function () {
    this.setFile = function (name) {
        fileName = name;
        return this;
    };
    this.log = function (data) {
        logFile(data);
    };
    return this;
}();

var url = path.join(__dirname, "../../temp/logFiles/");
var fileName = "LogFile.txt";
var logFile = function (data) {
    var tempDir = url + new Date().toLocaleDateString();
    !fs.existsSync(tempDir) && fs.mkdirSync(tempDir);
    if (!fs.existsSync(url + fileName)) {
        fs.writeFileSync(tempDir + "/" + fileName, getTime() + data + "\n");
    } else {
        fs.appendFileSync(tempDir + "/" + fileName, getTime() + data + "\n");
    }
};

// module.exports = function () {
//     this.setFile = function (name) {
//         fileName = name;
//         return this;
//     };
//     this.log = function (data) {
//         logFile(data, function (err) {
//             err && console.log(err);
//         });
//     };
//     return this;
// }();
//
// var url = path.join(__dirname, "../../temp/");
// var fileName = "LogFile(" + new Date().toLocaleDateString() + ").txt";
// var logFile = function (data, callback) {
//     if (!fs.existsSync(url + fileName)) {
//         fs.writeFile(url + fileName, getTime() + data + "\n", function (err) {
//             callback(err);
//         });
//     } else {
//         fs.appendFile(url + fileName, getTime() + data + "\n", function (err) {
//             callback(err);
//         });
//     }
// };

var getTime = function () {
    var d = new Date();
    return "(" + d.toLocaleTimeString() + ":" + d.getMilliseconds() + "): ";
};