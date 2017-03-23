/**
 * Created by Chance on 17/02/16.
 */

var TAG = "[>>>db_device_info.js]: ";
var COLLECTION = "deviceinfos";
// var INDEXS = {_id: 1};
var INDEXS = {bank: 1, company: 1, machineType: 1};
var mongodb = require("./db");

var MAP = {
    "银行": "bank",
    "厂商": "company",
    "机器型号": "machineType",
    "设备类型": "deviceType",
    "操作系统": "OSVersion",
    "杀毒软件": "antivirus",
    "是否有测试机": "hasTester",
    "SP测试版本": "SPVersion",
    "中间件测试版本": "middlewareVersion",
    "生产使用SP版本": "productSPVersion",
    "生产使用中间件版本": "productMiddlewareVersion",
    "生产设备数量": "deviceNum",
    "银行前置P": "bankPreP",
    "备注": "comment"
};

function DeviceInfo(deviceInfo) {
    this.bank = deviceInfo.bank;
    this.company = deviceInfo.company;
    this.machineType = deviceInfo.machineType;
    this.deviceType = deviceInfo.deviceType;
    this.OSVersion = deviceInfo.OSVersion;
    this.antivirus = deviceInfo.antivirus;
    this.hasTester = deviceInfo.hasTester;
    this.SPVersion = deviceInfo.SPVersion;
    this.middlewareVersion = deviceInfo.middlewareVersion;
    this.productSPVersion = deviceInfo.productSPVersion;
    this.productMiddlewareVersion = deviceInfo.productMiddlewareVersion;
    this.deviceNum = deviceInfo.deviceNum;
    this.bankPreP = deviceInfo.bankPreP;
    this.comment = deviceInfo.comment;
}

DeviceInfo.addInfos = function (deviceInfos, callback) {
    if (Array.isArray(deviceInfos)) {
        for (var i = 0; i < deviceInfos.length; i++)
            deviceInfos[i] = new DeviceInfo(deviceInfos[i]);
    } else {
        deviceInfos = new DeviceInfo(deviceInfos);
    }
    mongodb.insert(COLLECTION, INDEXS, deviceInfos, function (err, result) {
        callback(err, result);
    });
};

DeviceInfo.addInfoFromCSV = function (filename, callback) {
    var fs = require("fs");
    var parse = require("csv-parse");
    var iconv = require('iconv-lite');
    fs.readFile(filename, function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        data = iconv.decode(data, "gbk");
        parse(data, function (err, array) {
            if (err) {
                callback(err);
                return;
            }
            // console.log(array.length);
            if (!array || array.length < 2) return;
            var deviceInfos = [];
            for (var i = 1; i < array.length; i++) {
                var temp = {};
                for (var j = 0; j < array[i].length; j++) {
                    temp[MAP[array[0][j]]] = array[i][j];
                }
                deviceInfos.push(temp);
            }
            // console.log(TAG, deviceInfos);
            mongodb.insert(COLLECTION, INDEXS, deviceInfos, function (err, result) {
                callback(err, result);
            });
        });
    });
};

DeviceInfo.deleteInfo = function (selector, callback) {
    mongodb.remove(COLLECTION, selector, function (err, result) {
        callback(err, result);
    });
};

DeviceInfo.getInfos = function (query, options, callback) {
    mongodb.getMany(COLLECTION, query, options, function (err, result) {
        callback(err, result);
    });
};

DeviceInfo.getInfo = function (query, options, callback) {
    mongodb.getOne(COLLECTION, query, options, function (err, result) {
        callback(err, result);
    });
};

DeviceInfo.getPageInfos = function (query, pageSize, pageNum, callback) {
    mongodb.getPage(COLLECTION, query, pageSize, pageNum, function (err, result, total) {
        callback(err, result, total);
    });
};

DeviceInfo.updateInfo = function (selector, document, callback) {
    mongodb.update(COLLECTION, selector, document, function (err, result) {
        callback(err, result);
    });
};

module.exports = DeviceInfo;