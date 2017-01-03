/**
 * Created by Chance on 16/11/10.
 */

var TAG = "[>>>db_caselib.js]: ";
var COLLECTION = "caselibs";
var INDEXS = {caseLibName: 1};
var mongodb = require("./db");

function CaseLib(caselib) {
    this.caseLibName = caselib.caseLibName;
    this.caseLibType = caselib.caseLibType;
    this.importTime = caselib.importTime;
    this.importUser = caselib.importUser;
    this.casedeveloper = caselib.casedeveloper;
}

//添加案例库
CaseLib.addCaseLib2 = function (caselibs, callback) {
    if (Array.isArray(caselibs)) {
        for (var i = 0; i < caselibs.length; i++)
            caselibs[i] = new CaseLib(caselibs[i]);
    } else {
        caselibs = new CaseLib(caselibs);
    }
    mongodb.insert(COLLECTION, INDEXS, caselibs, function (err, result) {
        callback(err, result);
    });
};

//删除指定案例库
CaseLib.deleteCaseLib2 = function (selector, callback) {
    mongodb.remove(COLLECTION, selector, function (err, result) {
        callback(err, result);
    });
};

//获取所有案例库信息
CaseLib.getCaseLibs2 = function (query, options, callback) {
    mongodb.getMany(COLLECTION, query, options, function (err, result) {
        callback(err, result);
    });
};

//获取指定案例库信息
CaseLib.getCaseLib2 = function (query, options, callback) {
    mongodb.getOne(COLLECTION, query, options, function (err, result) {
        callback(err, result);
    });
};

CaseLib.getPageCases2 = function (query, pageSize, pageNum, callback) {
    mongodb.getPage(COLLECTION, query, pageSize, pageNum, function (err, result, total) {
        callback(err, result, total);
    });
};

//更新指定案例库信息
CaseLib.updateCaseLib2 = function (selector, document, callback) {
    mongodb.update(COLLECTION, selector, document, function (err, result) {
        callback(err, result);
    });
};

module.exports = CaseLib;