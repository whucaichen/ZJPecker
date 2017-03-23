/**
 * Created by Chance on 16/11/30.
 */

var TAG = function () {
    return "[App.js](" + new Date().toLocaleTimeString() + "): ";
};
var Utils = function () {
    var i = 1;
    this.forkBug = function (worker, varArgs) {
        var debug = typeof v8debug === "object";
        debug && process.execArgv.push("--debug=" + (process.debugPort + i++));
        return child.fork(worker, varArgs);
    };
    return this;
}();
var fs = require("fs");
var SETTINGS = fs.readFileSync("./settings.json");
try {
    SETTINGS = JSON.parse(SETTINGS.toString());
} catch (e) {
    console.error(TAG(), e);
}
global.PeckerConfigs = {
    DB_HOST: SETTINGS.DB_HOST,
    CommServer_IP: SETTINGS.CommServer_IP,
    Pecker_LoginID: SETTINGS.Pecker_LoginID,
    State_Delay: SETTINGS.State_Delay,
    WebSocket_Port: SETTINGS.WebSocket_Port
};

var child = require("child_process");
var ObjectId = require('mongodb').ObjectId;
var CaseLib = require("./db/db_caselib");
var Project = require("./db/db_project");
var ProjectCase = require("./db/db_project_case");

//重置之前测试时关闭Pecker的Project状态
var resetProjectStatus = function () {
    Project.getProjects2({"$nor": [{"projectStatus": "NEW"}, {"projectStatus": "TESTED"}]},
        {}, function (err, result) {
            if (err || result.length === 0) {
                err && console.error(err);
                return;
            }
            var caseProjectId = [];
            result && result.forEach(function (data) {
                caseProjectId.push(data._id);
            });
            Project.updateProject2({_id: {$in: caseProjectId}},
                {$set: {projectStatus: "NEW", testStartTime: null, testEndTime: null}},
                function (err, result) {
                    err && console.error(err);
                });
            ProjectCase.updateProjectCase2({caseProjectId: {$in: caseProjectId}},
                {$set: {"testInfo.caseStatus": "UNTESTED", "testInfo.result": null, testTrace: []}},
                function (err, result) {
                    err && console.error(err);
                });
        });
};
resetProjectStatus();

var wsServer = Utils.forkBug("./uiws/wsServer.js", [global.PeckerConfigs.WebSocket_Port]);
console.log(TAG(), "websocket server listening.");
wsServer.on("message", function (msg) {
    console.log(TAG(), msg);
    switch (msg.message) {
        case "StartTest":
            StartTest(msg.caseProjectId);
            break;
        case "SuspendTest":
            SuspendTest(msg.caseProjectId);
            break;
        case "ResumeTest":
            ResumeTest(msg.caseProjectId);
            break;
        case "StopTest":
            StopTest(msg.caseProjectId);
            break;
        case "RestartTest":
            RestartTest(msg.caseProjectId);
            break;
        case "DeleteTestProject":
            dealTestingRm(msg.caseProjectId);
            break;
    }
});
wsServer.on('exit', function (code) {
    if (code !== 0) {
        wsServer = Utils.forkBug("./uiws/wsServer.js", [global.PeckerConfigs.WebSocket_Port]);
    }
});

var TestProjects = {};
var isClientTesting = {};
// var workProject = null;
// var workflows = []; //工程案例队列
// var runNode = 0;    //下一个案例执行位置
// var isFinish = false;   //当前工程测试状态
// var isSuspendTest = false;   //暂停标识
// var flowWorker = null;  //状态机实例

var execWorkflow = function (projectTarget, start) {
    if (projectTarget.isSuspendTest) {
        console.log(TAG(), "暂停测试");
        return;
    }
    projectTarget.flowWorker = Utils.forkBug("./worker.js", projectTarget.workflows[start]);
    Project.updateProject2({_id: ObjectId(projectTarget.workProject)},
        {$set: {testStartTime: new Date().toLocaleString()}}, function (err, result) {
            err && console.error(err);
        });
    changeProjectCaseStatus(projectTarget.workflows[start][0], "TESTING", projectTarget.workProject);
    projectTarget.flowWorker.on("message", function (msg) {
        if (msg === "SingleFinished") {
            console.error(">>>>>>>>>> [SingleFinished]: " + projectTarget.workflows[start]);
            changeProjectCaseStatus(projectTarget.workflows[start][0], "TESTED", projectTarget.workProject);
            projectTarget.runNode = start + 1;
            try {
                projectTarget.flowWorker && projectTarget.flowWorker.send("SingleExit");
            } catch (e) {
                console.error(TAG(), e.stack);
            }
        } else if (msg === "DataUpdate") {
            wsServer.send({
                type: "DataUpdate", data: {
                    type: "ProjectCase", projectCaseId: projectTarget.workflows[start][0],
                    projectId: projectTarget.workProject
                }
            });
        }
    });
    projectTarget.flowWorker.on("exit", function (code) {
        start += 1;
        if (start < projectTarget.workflows.length) {
            execWorkflow(projectTarget, start);
        } else {
            projectTarget.runNode = 0;
            projectTarget.isFinish = true;
            isClientTesting[projectTarget.workflows[0][7]] = false;
            Project.updateProject2({_id: ObjectId(projectTarget.workProject)},
                {$set: {testEndTime: new Date().toLocaleString()}}, function (err, result) {
                    err && console.error(err);
                    Project.getProject2({_id: ObjectId(projectTarget.workProject)}, {}, function (err, result) {
                        //生成报表
                        require("./utils/report").generateReport(result);
                    })
                });
            changeProjectStatus(projectTarget.workProject, "TESTED", function (code) {
            });
        }
    })
};

var flowInit = function (caseProjectId, callback) {
    TestProjects[caseProjectId] = {};
    TestProjects[caseProjectId].workProject = caseProjectId;
    TestProjects[caseProjectId].flowWorker = null;
    TestProjects[caseProjectId].workflows = [];
    TestProjects[caseProjectId].runNode = 0;
    TestProjects[caseProjectId].isFinish = false;
    TestProjects[caseProjectId].isSuspendTest = false;
    Project.getProject2({_id: ObjectId(caseProjectId)}, {}, function (err, result) {
        if (err || !result || result.length === 0 || isClientTesting[result.testClientID]) {
            callback({code: "03"});
            return;
        }
        var testClientID = result.testClientID;
        ProjectCase.getProjectCases2({caseProjectId: ObjectId(caseProjectId)}, {}, function (err, result) {
            if (err || !result || result.length === 0) {
                callback({code: "01"});
                return;
            }
            var caseLibName = result[0].caseLibName;
            if (!caseLibName) {
                callback({code: "02"});
                console.error(TAG(), "案例库名不存在");
                return;
            }
            for (var i = 0; i < result.length; i++) { //初始化工程队列
                TestProjects[caseProjectId].workflows[i] = [
                    result[i]._id,   //与状态机共用
                    result[i].fileTitle + ".js",
                    result[i].fileTitle + ".xml",
                    false,
                    caseLibName,    //指定流程脚本路径
                    result[i].testInfo.caseFilePath,    //提供给脚本测试文件路径
                    caseProjectId,
                    testClientID,
                    JSON.stringify(global.PeckerConfigs)
                ];
            }
            isClientTesting.testClientID = true;
            callback({code: "00"});
        });
    });
};
var StartTest = function (caseProjectId) {
    if ((TestProjects[caseProjectId] && TestProjects[caseProjectId].workProject) !== caseProjectId) {
        flowInit(caseProjectId, function (result) {
            if (result.code === "00") {
                if (TestProjects[caseProjectId].runNode < TestProjects[caseProjectId].workflows.length) {
                    execWorkflow(TestProjects[caseProjectId], TestProjects[caseProjectId].runNode);
                    changeProjectStatus(caseProjectId, "TESTING", function (code) {
                        wsServer.send({retcode: code, type: "StartTest"});
                    });
                }
            } else {
                console.error(TAG() + "flowInit failed.");
                wsServer.send({retcode: "02", type: "StartTest", err: "工程初始化失败"});
            }
        });
    } else {
        if (isClientTesting[TestProjects[caseProjectId].workflows[0][7]]) {
            console.error(TAG() + "目标客户端正在执行工程测试");
            wsServer.send({retcode: "03", type: "StartTest", err: "目标客户端正在执行工程测试"});
        }
        TestProjects[caseProjectId].isSuspendTest = false;
        if (TestProjects[caseProjectId].runNode < TestProjects[caseProjectId].workflows.length) {
            isClientTesting[TestProjects[caseProjectId].workflows[0][7]] = true;
            execWorkflow(TestProjects[caseProjectId], TestProjects[caseProjectId].runNode);
            changeProjectStatus(caseProjectId, "TESTING", function (code) {
                wsServer.send({retcode: code, type: "StartTest"});
            });
        }
    }
};
var SuspendTest = function (caseProjectId) {
    if ((TestProjects[caseProjectId] && TestProjects[caseProjectId].workProject) === caseProjectId) {
        TestProjects[caseProjectId].isSuspendTest = true;
        changeProjectStatus(caseProjectId, "SUSPEND", function (code) {
            wsServer.send({retcode: code, type: "SuspendTest"});
            isClientTesting[TestProjects[caseProjectId].workflows[0][7]] = false;
            TestProjects[caseProjectId].flowWorker = null;
        });
    } else {
        wsServer.send({retcode: "01", type: "SuspendTest", err: "工程不存在或未开始测试"});
    }
};
var ResumeTest = function (caseProjectId) {
    StartTest(caseProjectId);
};
var StopTest = function (caseProjectId) {
    if ((TestProjects[caseProjectId] && TestProjects[caseProjectId].workProject) === caseProjectId) {
        isClientTesting[TestProjects[caseProjectId].workflows[0][7]] = false;
        TestProjects[caseProjectId].flowWorker = null;
        TestProjects[caseProjectId].runNode = 0;
        TestProjects[caseProjectId].isFinish = true;
        changeProjectStatus(caseProjectId, "TERMINATED", function (code) {
            wsServer.send({retcode: code, type: "StopTest"});
        });
    } else {
        wsServer.send({retcode: "01", type: "StopTest", err: "工程不存在或未开始测试"});
    }
};
var RestartTest = function (caseProjectId) {
    // if ((TestProjects[caseProjectId] && TestProjects[caseProjectId].workProject) === caseProjectId) {
    TestProjects[caseProjectId] && (TestProjects[caseProjectId].flowWorker = null);
    TestProjects[caseProjectId] && (TestProjects[caseProjectId].isFinish = false);
    TestProjects[caseProjectId] && (TestProjects[caseProjectId].runNode = 0);
    ProjectCase.updateProjectCase2({caseProjectId: ObjectId(caseProjectId)},
        {$set: {"testInfo.caseStatus": "UNTESTED", "testInfo.result": null, traceParameter: []}},
        function (err, result) {
            err && console.error(err);
            StartTest(caseProjectId);
        });
    // } else {
    //     wsServer.send({retcode: "01", type: "StartTest", err: "工程不存在或未开始测试"});
    // }
};
var dealTestingRm = function (caseProjectId) {
    if (TestProjects[caseProjectId] && TestProjects[caseProjectId].runNode) {
        wsServer.send({retcode: "01", type: "DeleteTestProject"});
    } else {
        wsServer.send({retcode: "00", type: "DeleteTestProject"});
    }
};

var changeProjectStatus = function (caseProjectId, status, callback) {
    Project.updateProject2({_id: ObjectId(caseProjectId)}, {$set: {projectStatus: status}},
        function (err, result) {
            err ? callback("01") : callback("00");
            wsServer.send({type: "DataUpdate", data: {type: "TestProject", projectId: caseProjectId}});
        });
};
var changeProjectCaseStatus = function (caseId, status, projectId) {
    ProjectCase.updateProjectCase2({_id: ObjectId(caseId)}, {$set: {"testInfo.caseStatus": status}},
        function (err, result) {
            err && console.error(err);
            wsServer.send({
                type: "DataUpdate",
                data: {type: "ProjectCase", projectCaseId: caseId, projectId: projectId}
            });
        });
};

function tagTime() {
    return "(" + new Date().toLocaleTimeString() + "): ";
}