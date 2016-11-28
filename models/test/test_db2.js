/**
 * Created by Chance on 16/11/16.
 */

var Case = require("./../db/db_case");
var ObjectId = require('mongodb').ObjectId;
//案例表增删查改测试 ***分页***
var cases = [];
for (var i = 0; i < 40; i++) {
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

//Case.addCase2(cases[30], function (err, result) {
//    console.log(JSON.stringify(result));
//});
//Case.addCase2(cases.slice(38, 40), function (err, result) {
//    console.log(JSON.stringify(result));
//});
//Case.deleteCase2({caseId: "test"}, function (err, result) {
//    console.log(result);
//});
//Case.getCases2({}, {fields: {groupName: 1, caseCaption: 1}}, function (err, result) {
//    console.log(result);
//});
//Case.getCase2({caseId: "test"},{}, function (err, result) {
//    console.log(result);
//});
//Case.getPageCases2(5, 2, function (err, docs, total) {
//    console.log(docs);
//    console.log(total);
//});
// Case.updateCase2({caseId: "test29"}, {$set: {caseCaption: "update"}}, function (err, result) {
//    console.log(result && result.result);
// });
Case.updateCase2({}, {$set: {caseLibId: ObjectId("582559b0bbc3b00564141d2c")}}, function (err, result) {
   console.log(result && result.result);
});

var Project = require("./../db/db_project");
var ProjectCase = require("./../db/db_project_case");
//案例表增删查改测试 ***分页***
var projects = [];
for (var i = 0; i < 20; i++) {
    projects[i] = new Project({
        projectName: "projectName" + i
    });
}

//Project.addProject2(projects.slice(5, 6), function (err, result) {
//    console.log(JSON.stringify(result));
//});
//Project.deleteProject2({}, function (err, result) {
//    console.log(result);
//});
//Project.getProjects2({}, {fields: {_id: 0}}, function (err, result) {
// Project.getProjects2({}, {}, function (err, result) {
//     console.log(result);
//     var _id = result[0]._id;
//     console.log(_id);
//     Project.getProjects2({_id:_id}, {}, function (err, result) {
//         console.log(result);
//     });
// });
//
//ProjectCase.getProjectCases2({},{},function(err, result){
//    console.log(result);
//});
