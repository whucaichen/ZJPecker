/**
 * Created by Chance on 16/12/08.
 */

var fs = require('fs');
var path = require("path");

var url = path.join(__dirname, "../../temp/");
var fileName = "stateMachine.txt";
var logFile = function (data, callback) {
    if (!fs.existsSync(url + fileName)) {
        fs.writeFile(url + fileName, getTime() + data + "\n", function (err) {
            callback(err);
        });
    } else {
        fs.appendFile(url + fileName, getTime() + data + "\n", function (err) {
            callback(err);
        });
    }
};
var getTime = function () {
    return "(" + new Date().toLocaleString() + "): ";
};

module.exports = function () {
    this.setFile = function (name) {
        fileName = name;
        return this;
    };
    this.log = function (data) {
        logFile(data, function (err) {
            err && console.log(err);
        });
    };
    return this;
}();