/**
 * Created by Chance on 16/11/10.
 */

var TAG = "[>>>db_case.js]: ";
var COLLECTION = "cases";
var INDEXS = {caseId: 1, caseLibId: 1};
var mongodb = require("./db");

function Case(_case) {
    this.caseId = _case.caseId;
    this.caseCaption = _case.caseCaption;
    this.caseLibId = _case.caseLibId;
    this.groupName = _case.groupName;
    this.caseDeveloper = _case.caseDeveloper;
    this.serialNo = _case.serialNo;
    this.description = _case.description;
    this.mediaType = _case.mediaType;
    this.expectation = _case.expectation;
    this.fileTitle = _case.fileTitle;
}

//添加案例
Case.addCase2 = function (cases, callback) {
    if (Array.isArray(cases)) {
        for (var i = 0; i < cases.length; i++)
            cases[i] = new Case(cases[i]);
    } else {
        cases = new Case(cases);
    }
    mongodb.insert(COLLECTION, INDEXS, cases, function (err, result) {
        callback(err, result);
    });
};

//删除指定案例
Case.deleteCase2 = function (selector, callback) {
    mongodb.remove(COLLECTION, selector, function (err, result) {
        callback(err, result);
    });
};

//获取所有案例信息
Case.getCases2 = function (query, options, callback) {
    mongodb.getMany(COLLECTION, query, options, function (err, result) {
        callback(err, result);
    });
};

//获取指定案例信息
Case.getCase2 = function (query, options, callback) {
    mongodb.getOne(COLLECTION, query, options, function (err, result) {
        callback(err, result);
    });
};

//分页获取指定数量案例信息
Case.getPageCases2 = function (query, pageSize, pageNum, callback) {
    mongodb.getPage(COLLECTION, query, pageSize, pageNum, function (err, result, total) {
        callback(err, result, total);
    });
};

//更新指定案例信息
Case.updateCase2 = function (selector, document, callback) {
    mongodb.update(COLLECTION, selector, document, function (err, result) {
        callback(err, result);
    });
};

module.exports = Case;