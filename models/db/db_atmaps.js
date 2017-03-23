/**
 * Created by Chance on 17/03/03.
 */

var TAG = "[>>>db_atmaps.js]: ";
var COLLECTION = "atmaps";
var INDEXS = {testClientID: 1};
var mongodb = require("./db");

function Atmap(atmap) {
    this.testClientID = atmap.testClientID;
    this.testClientIP = atmap.testClientIP;
    this.machineType = atmap.machineType;
    this.company = atmap.company;
    this.bank = atmap.bank;
    this.deviceId = atmap.deviceId;
}

//添加案例
Atmap.addAtmap = function (atmap, callback) {
    if (Array.isArray(atmap)) {
        for (var i = 0; i < atmap.length; i++)
            atmap[i] = new Atmap(atmap[i]);
    } else {
        atmap = new Atmap(atmap);
    }
    mongodb.insert(COLLECTION, INDEXS, atmap, function (err, result) {
        callback(err, result);
    });
};

Atmap.deleteAtmap = function (selector, callback) {
    mongodb.remove(COLLECTION, selector, function (err, result) {
        callback(err, result);
    });
};

Atmap.getAtmaps = function (query, options, callback) {
    mongodb.getMany(COLLECTION, query, options, function (err, result) {
        callback(err, result);
    });
};

Atmap.getAtmap = function (query, options, callback) {
    mongodb.getOne(COLLECTION, query, options, function (err, result) {
        callback(err, result);
    });
};

Atmap.getPageAtmap = function (query, pageSize, pageNum, callback) {
    mongodb.getPage(COLLECTION, query, pageSize, pageNum, function (err, result, total) {
        callback(err, result, total);
    });
};

Atmap.updateAtmap = function (selector, document, callback) {
    mongodb.update(COLLECTION, selector, document, function (err, result) {
        callback(err, result);
    });
};

module.exports = Atmap;
