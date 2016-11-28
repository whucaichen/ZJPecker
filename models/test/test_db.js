/**
 * Created by Chance on 16/11/10.
 */

var User = require("../db/db_user");
//用户表增删查改测试
var users = [];
for (var i = 0; i < 6; i++) {
    users[i] = new User({
        username: "test" + i,
        userid: "test" + i,
        password: "test" + i,
        roles: ["test" + i],
        useradddate: "test" + i,
        userstatus: "test" + i
    });
}

//User.addUser(users[0], function (err, result) {
//    console.log(result);
//});
//
//User.addUsers(users, function (err, result) {
//    console.log(result);
//});
//
//User.deleteUser("test1", function (err, result) {
//    console.log(result);
//});
//
//User.getUsers(function(err, result){
//    console.log(result);
//});
//
//User.getUser({username: "test", userid: "test"}, function (err, result) {
//    console.log(result);
//});
//
//var user2 = new User({
//    username: "test2",
//    userid: "test",
//    password: "test2",
//    roles: ["test2"],
//    useradddate: "test2",
//    userstatus: "test2"
//});
//User.updateUser(user2, function (err, result) {
//    console.log(result);
//});

var CaseLib = require("../db/db_caselib");
//案例库表增删查改测试
var caselibs = [];
for (var i = 0; i < 5; i++) {
    caselibs[i] = new CaseLib({
        caseLibName: "test" + i,
        caseLibType: "test" + i,
        importTime: "test" + i,
        importUser: "test" + i,
        casedeveloper: "test" + i
    });
}

//CaseLib.addCaseLib(caselibs[0], function (err, result) {
//    console.log(result);
//});
//
//CaseLib.addCaseLibs(caselibs, function (err, result) {
//    console.log(result);
//});
//
//CaseLib.deleteCaseLib("test1", function (err, result) {
//    console.log(result);
//});
//
//CaseLib.getCaseLibs(function (err, result) {
//    console.log(result);
//});
//
//CaseLib.getCaseLib({caseLibName: "test", caseLibType: "test"}, function (err, result) {
//    console.log(result);
//});
//
//var caselib2 = new Case({
//    caseLibName: "test",
//    caseLibType: "test2",
//    importTime: "test2",
//    importUser: "test2",
//    casedeveloper: "test2"
//});
//CaseLib.updateCaseLib(caselib2, function (err, result) {
//    console.log(result);
//});

var Case = require("./../db/db_case");
//案例表增删查改测试 ***分页***
var cases = [];
for (var i = 0; i < 20; i++) {
    cases[i] = new Case({
        caseId: "test" + i,
        caseCaption: "test" + i,
        caseLibId: "test" + i,
        groupName: "test" + i,
        casedeveloper: "test" + i,
        serialNo: "test" + i,
        description: "test" + i,
        mediaType: "test" + i,
        expectation: "test" + i,
        fileTitle: "test" + i
    });
}
console.log(Array.isArray(cases));
console.log(Array.isArray(cases[0]));
cases.forEach(function (name) {
    console.log(name);
});

//Case.addCase(cases[0], function (err, result) {
//    console.log(result);
//});
//
//Case.addCases(cases, function (err, result) {
//    console.log(result);
//});
//
//Case.deleteCase("test1", function (err, result) {
//    console.log(result);
//});
//
//Case.getCases({}, {groupName: 1, _id: 0}, function (err, result) {
//    console.log(result);
//});
//
//Case.getCase({}, function (err, result) {
//    console.log(result);
//});
//
//Case.getPageCases(5, 2, function (err, docs, total) {
//    console.log(docs);
//    console.log(total);
//});
//
//var _case2 = new Case({
//    caseId: "test",
//    caseCaption: "test2",
//    caseLibId: "test2",
//    groupName: "test2",
//    casedeveloper: "test2",
//    serialNo: "test2",
//    description: "test2",
//    mediaType: "test2",
//    expectation: "test2",
//    fileTitle: "test2"
//});
//Case.updateCase(_case2,function (err, result) {
//    console.log(result);
//});

var Project = require("../db/db_project");
//案例表增删查改测试 ***分页***
var projects = [];
for (var i = 0; i < 5; i++) {
    projects[i] = new Project({
        projectName: "test" + i,
        caseLibId: "test" + i,
        deviceType: "test" + i,
        testSite: "test" + i,
        testStartTime: "test" + i,
        testEndTime: "test" + i,
        tester: "test" + i,
        envirement: {
            SPVersion: "test" + i,
            APVersion: "test" + i,
            OSVersion: "test" + i,
            systemPatchVersion: "test" + i,
        },
        projectStatus: "test" + i
    });
}

//Project.addProject(projects[0], function (err, result) {
//    console.log(result);
//});
//
//Project.addProjects(projects, function (err, result) {
//    console.log(result);
//});
//
//Project.deleteProject("test1", function (err, result) {
//    console.log(result);
//});
//
//Project.getProjects(function (err, result) {
//    console.log(result);
//});
//
//Project.getProject({}, function (err, result) {
//    console.log(result);
//});
//
//var project2 = new Project({
//    caseId: "test",
//    caseCaption: "test2",
//    caseLibId: "test2",
//    groupName: "test2",
//    casedeveloper: "test2",
//    serialNo: "test2",
//    description: "test2",
//    mediaType: "test2",
//    expectation: "test2",
//    fileTitle: "test2"
//});
//Project.updateProject(project2, function (err, result) {
//    console.log(result);
//});
