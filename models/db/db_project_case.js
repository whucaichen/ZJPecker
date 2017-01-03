/**
 * Created by Chance on 16/11/10.
 *
 * ？工程案例还需要提供单独的testTrace接口
 */

var TAG = "[>>>db_project_case.js]: ";
var COLLECTION = "projectcases";
var INDEXS = {caseProjectId: 1, caseId: 1};
var mongodb = require("./db");

function ProjectCase(projectcase) {
    this.caseProjectId = projectcase.caseProjectId;
    this.caseId = projectcase.caseId;
    this.caseCaption = projectcase.caseCaption;
    this.caseLibId = projectcase.caseLibId;
    this.caseLibName = projectcase.caseLibName;
    this.groupName = projectcase.groupName;
    this.caseDeveloper = projectcase.caseDeveloper;
    this.serialNo = projectcase.serialNo;
    this.description = projectcase.description;
    this.mediaType = projectcase.mediaType;
    this.expectation = projectcase.expectation;
    this.fileTitle = projectcase.fileTitle;
    this.testInfo = projectcase.testInfo || {};
    this.testInfo.caseStatus = projectcase.testInfo && projectcase.testInfo.caseStatus;
    this.testInfo.result = projectcase.testInfo && projectcase.testInfo.result;
    this.testTrace = projectcase.testTrace; //Arrays
}

//添加工程案例
ProjectCase.addProjectCase2 = function (projectcases, callback) {
    if (Array.isArray(projectcases)) {
        for (var i = 0; i < projectcases.length; i++)
            projectcases[i] = new ProjectCase(projectcases[i]);
    } else {
        projectcases = new ProjectCase(projectcases);
    }
    mongodb.insert(COLLECTION, INDEXS, projectcases, function (err, result) {
        callback(err, result);
    });
};

//删除指定工程案例
ProjectCase.deleteProjectCase2 = function (selector, callback) {
    mongodb.remove(COLLECTION, selector, function (err, result) {
        callback(err, result);
    });
};

//获取所有工程案例信息
ProjectCase.getProjectCases2 = function (query, options, callback) {
    mongodb.getMany(COLLECTION, query, options, function (err, result) {
        callback(err, result);
    });
};

//获取指定工程案例信息
ProjectCase.getProjectCase2 = function (query, options, callback) {
    mongodb.getOne(COLLECTION, query, options, function (err, result) {
        callback(err, result);
    });
};

ProjectCase.getPageProjectCases2 = function (query, pageSize, pageNum, callback) {
    mongodb.getPage(COLLECTION, query, pageSize, pageNum, function (err, result, total) {
        callback(err, result, total);
    });
};

//更新指定工程案例信息
ProjectCase.updateProjectCase2 = function (selector, document, callback) {
    mongodb.update(COLLECTION, selector, document, function (err, result) {
        callback(err, result);
    });
};

module.exports = ProjectCase;