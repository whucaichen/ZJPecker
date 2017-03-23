/**
 * Created by Chance on 16/11/16.
 */

var ObjectId = require('mongodb').ObjectId;
var User = require("./../db/db_user");
var Case = require("./../db/db_case");
var CaseLib = require("./../db/db_caselib");
var Project = require("./../db/db_project");
var ProjectCase = require("./../db/db_project_case");

console.log("请输入你想执行的操作序号：\n",
    "0.退出程序；\n",
    "1.删除指定测试工程；\n",
    "2.重置工程测试状态；\n",
    "3.重置案例测试状态；\n",
    "4.重置案例测试结果；\n",
    "5.清空案例跟踪日志；\n",
    "6.查询测试工程信息；\n",
    "7.删除指定案例库；\n",
    "8.添加用户；\n"
);
process.stdin.setEncoding("utf8");
process.stdin.on("readable", function () {
    var chunk = process.stdin.read();
    if (chunk !== null) {
        var array = chunk.trim().split(/\s+/);
        switch (array[0]) {
            case "0":
                process.exit(1);
            case "1":
                deleteProjects(array.slice(1));
                break;
            case "2":
                resetProStatus();
                break;
            case "3":
                resetCaseStatus();
                break;
            case "4":
                resetCaseResult();
                break;
            case "5":
                emptyCaseTrace();
                break;
            case "6":
                queryProject(array.slice(1));
                break;
            case "7":
                deleteCaseLib(array.slice(1));
                break;
            case "8":
                addUsers(array.slice(1));
                break;
            default:
                console.log("无效的菜单选项.");
        }
    }
});

var deleteProjects = function (projectName) {
    console.log(JSON.stringify(projectName));
    if (projectName.length === 0) return;
    Project.getProjects2({projectName: {$in: projectName}}, {}, function (err, result) {
        if (err || result.length === 0) {
            console.error(err);
            return;
        }
        var caseProjectId = [];
        result && result.forEach(function (data) {
            caseProjectId.push(data._id);
        });
        Project.deleteProject2({projectName: {$in: projectName}}, function (err, result) {
            err && console.error(err);
        });
        ProjectCase.deleteProjectCase2({caseProjectId: {$in: caseProjectId}}, function (err, result) {
            err && console.error(err);
        });
    });
};
var resetProStatus = function () {
    Project.updateProject2({}, {$set: {"projectStatus": "NEW"}}, function (err, result) {
        err && console.error(err);
    });
};
var resetCaseStatus = function () {
    ProjectCase.updateProjectCase2({}, {
        $set: {
            "testInfo.caseStatus": "UNTESTED",
            "testInfo.result": null,
            testTrace: []
        }
    }, function (err, result) {
        err && console.error(err);
    });
};
var resetCaseResult = function () {
    ProjectCase.updateProjectCase2({}, {$set: {"testInfo.result": ""}}, function (err, result) {
        err && console.error(err);
    });
};
var emptyCaseTrace = function () {
    ProjectCase.updateProjectCase2({}, {$set: {testTrace: []}}, function (err, result) {
        err && console.error(err);
    });
};
var queryProject = function (projectName) {
    console.log(JSON.stringify(projectName));
    Project.getProjects2({projectName: {$in: projectName}}, {}, function (err, result) {
        err ? console.error(err) : console.log(result);
    });
};
var deleteCaseLib = function (caseLibName) {
    console.log(JSON.stringify(caseLibName));
    if (caseLibName.length === 0) return;
    CaseLib.getCaseLibs2({caseLibName: {$in: caseLibName}}, {}, function (err, result) {
        if (err || result.length === 0) {
            console.error(err);
            return;
        }
        var caseLibId = [];
        result && result.forEach(function (data) {
            caseLibId.push(data._id);
        });
        CaseLib.deleteCaseLib2({caseLibName: {$in: caseLibName}}, function (err, result) {
            err && console.error(err);
        });
        Case.deleteCase2({caseLibId: {$in: caseLibId}}, function (err, result) {
            err && console.error(err);
        });
    });
};
var addUsers = function (users) {
    if (users.length === 0) return;
    for (var i = 0; i < users.length; i++) {
        users[i] = {username: users[i], userid: users[i], password: users[i]};
    }
    User.addUser2(users, function (err, result) {
        err && console.error(err);
    })
};
var addTime = function () {
    Project.updateProject2({}, {$set: {projectCreateTime: new Date().toLocaleString()}}, function (err, result) {
        err && console.error(err);
    });
};
var addPCLN = function () {
    Project.getProjects2({}, {}, function (err, result) {
        result.forEach(function (pro) {
            CaseLib.getCaseLib2({_id: pro.caseLibId}, {}, function (err, result) {
                Project.updateProject2({caseLibId: pro.caseLibId},
                    {$set: {caseLibName: result.caseLibName}}, function (err, result) {
                        err && console.error(err);
                    });
            });
        });
    });
};
// addPCLN();
var addPCCLN = function () {
    ProjectCase.getProjectCases2({}, {}, function (err, result) {
        result.forEach(function (pro) {
            CaseLib.getCaseLib2({_id: pro.caseLibId}, {}, function (err, result) {
                pro.caseLibName = result.caseLibName;
                // ProjectCase.updateProjectCase2({caseLibId: pro.caseLibId},
                //     {$set: {caseLibName: result.caseLibName}}, function (err, result) {
                //         err && console.error(err);
                //     });
            });
        });
        setTimeout(function () {
            ProjectCase.updateProjectCase2(result, {}, function (err, result) {
                err && console.error(err);
            });
        }, 1000);
    });
};
// addPCCLN();
var deleteField = function () {
    var d = new Date().toLocaleString();
    var traceParameter = [];
    traceParameter.push({traceLevel: d, traceContent: d, screenPicName: d});
    // ProjectCase.updateProjectCase2({}, {$unset: {testTrace: ''}}, function (err, result) {
    ProjectCase.updateProjectCase2({},
        {$set: {traceParameter: traceParameter}},
        function (err, result) {
            err && console.error(err);
        })
};
// deleteField();

/**
 * 等于：{"name":{$eq:"steven"}
 * 不等于：{"name":{$ne:"steven"}}
 * 大于：{"age":{$gt:19}}
 * 大于等于：{"age":{$gte:19}}
 * 小于：{"age":{$lt:20}}
 * 包含于：{"name":{$in:["steven","jack"]}}
 * 不包含：{"name":{$nin:["steven","jack"]}}
 * 或：{"$or" : [{"name":"steven"},{"age":20}]}
 * 并：{"$and" : [{"name":"steven"},{"age":20}]}
 * 非：{"age":{"$not":{"$lt":20}}}
 * 或非：{"$nor" : [{"name":"steven"},{"age":20}]}
 * 存在：{"name":{"$exists":true}}
 * Bson类型：{"name":{"$type":2}} String
 * 正则表达式：{"name" : {$regex:"stev*",$options:"i"}}
 * where：{"$where":function(){
            for(var index in this) {
                if(this[index] == "steven") {
                    return true;
                }
            }
            return false;
        }}
   子集：{"comments":{"$slice":[10,5]}}
 */
// User.getUsers2({username: {$eq: "test"}}, {}, function (err, result) {
//     err ? console.error(err) : console.log(result);
// });
// User.getUsers2({username: {$ne: "test"}}, {}, function (err, result) {
//     err ? console.error(err) : console.log(result);
// });
// User.getUsers2({username: {$in: ["test1", "test2"]}}, {}, function (err, result) {
//     err ? console.error(err) : console.log(result);
// });
// User.getUsers2({username: {$nin: ["test1", "test2"]}}, {}, function (err, result) {
//     err ? console.error(err) : console.log(result);
// });
// User.getUsers2({$or: [{username: "test1"}, {password: "test2"}]}, {}, function (err, result) {
//     err ? console.error(err) : console.log(result);
// });
// User.getUsers2({$and: [{username: "test1"}, {password: "test1"}]}, {}, function (err, result) {
//     err ? console.error(err) : console.log(result);
// });
// User.getUsers2({$nor: [{username: "test1"}, {password: "test2"}]}, {}, function (err, result) {
//     err ? console.error(err) : console.log(result);
// });

// var cases = [];
// for (var i = 0; i < 40; i++) {
//     cases[i] = new Case({
//         caseId: "test" + i,
//         caseCaption: "test" + i,
//         caseLibId: "test" + i,
//         groupName: "test" + i,
//         casedeveloper: "test" + i,
//         serialNo: "test" + i,
//         description: "test" + i,
//         mediaType: "test" + i,
//         expectation: "test" + i,
//         fileTitle: "test" + i
//     });
// }
// var projects = [];
// for (var i = 0; i < 20; i++) {
//     projects[i] = new Project({
//         projectName: "projectName" + i
//     });
// }
// var projectcases = [];
// for (var i = 0; i < 20; i++) {
//     projectcases[i] = new ProjectCase({
//         caseProjectId: ObjectId("582d694b22fbf30768b62636"),
//         caseId: "test" + i,
//         caseCaption: "test" + i,
//         caseLibId: "test" + i,
//         groupName: "test" + i,
//         caseDeveloper: "test" + i,
//         serialNo: "test" + i,
//         description: "test" + i,
//         mediaType: "test" + i,
//         expectation: "test" + i,
//         fileTitle: "test" + i,
//         testInfo: {}
//     });
// }