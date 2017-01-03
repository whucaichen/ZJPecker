/**
 * Created by Chance on 16/11/10.
 */

var TAG = "[>>>db_project.js]: ";
var COLLECTION = "projects";
var INDEXS = {projectName: 1};
var mongodb = require("./db");

function Project(project) {
    this.projectName = project.projectName;
    this.caseLibId = project.caseLibId;
    this.caseLibName = project.caseLibName;
    this.deviceType = project.deviceType;
    this.testSite = project.testSite;
    this.projectCreateTime = project.projectCreateTime;
    this.testStartTime = project.testStartTime;
    this.testEndTime = project.testEndTime;
    this.tester = project.tester;
    this.environment = project.environment || {};
    this.environment.SPVersion = project.environment && project.environment.SPVersion;
    this.environment.APVersion = project.environment && project.environment.APVersion;
    this.environment.OSVersion = project.environment && project.environment.OSVersion;
    this.environment.systemPatchVersion = project.environment && project.environment.systemPatchVersion;
    this.projectStatus = project.projectStatus;
}

//添加工程
Project.addProject2 = function (projects, callback) {
    if (Array.isArray(projects)) {
        for (var i = 0; i < projects.length; i++)
            projects[i] = new Project(projects[i]);
    } else {
        projects = new Project(projects);
    }
    mongodb.insert(COLLECTION, INDEXS, projects, function (err, result) {
        callback(err, result);
    });
};

//删除指定工程
Project.deleteProject2 = function (selector, callback) {
    mongodb.remove(COLLECTION, selector, function (err, result) {
        callback(err, result);
    });
};

//获取所有工程信息
Project.getProjects2 = function (query, options, callback) {
    mongodb.getMany(COLLECTION, query, options, function (err, result) {
        callback(err, result);
    });
};

Project.getPageProjects2 = function (query, pageSize, pageNum, callback) {
    mongodb.getPage(COLLECTION, query, pageSize, pageNum, function (err, result, total) {
        callback(err, result, total);
    });
};

//获取指定工程信息
Project.getProject2 = function (query, options, callback) {
    mongodb.getOne(COLLECTION, query, options, function (err, result) {
        callback(err, result);
    });
};

//更新指定工程信息
Project.updateProject2 = function (selector, document, callback) {
    mongodb.update(COLLECTION, selector, document, function (err, result) {
        callback(err, result);
    });
};

module.exports = Project;