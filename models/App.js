/**
 * Created by Chance on 16/11/30.
 */
var Utils = function () {
    var i = 1;
    this.forkBug = function (worker, varArgs) {
        var debug = typeof v8debug === "object";
        debug && process.execArgv.push("--debug=" + (process.debugPort + i++));
        return child.fork(worker, varArgs);
    };
    return this;
}();

var TAG = "[App.js](" + new Date().toLocaleTimeString() + "): ";
var child = require("child_process");
var ObjectId = require('mongodb').ObjectId;
var CaseLib = require("./db/db_caselib");
var Project = require("./db/db_project");
var ProjectCase = require("./db/db_project_case");

//重置之前测试时关闭Pecker的Project状态
resetProjectStatus();

var wsServer = Utils.forkBug("./uiws/wsServer.js");
// var wsServer = child.fork("./uiws/wsServer.js");
console.log(TAG, "websocket server listen on 8080.");
wsServer.on("message", function (msg) {
    console.log(TAG, msg);
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
        wsServer = Utils.forkBug("./uiws/wsServer.js");
        // wsServer = child.fork("./uiws/wsServer.js");
    }
});

var workProject = null;
var workflows = []; //工程案例队列
var runNode = 0;    //下一个案例执行位置
var isFinish = false;   //当前工程测试状态
var isSuspendTest = false;   //暂停标识
var isSingleTest = false;   //限制只能一个工程在测试中
var isTimeout = false;   //针对单个案例超时处理
var flowWorker = null;  //状态机实例

var execWorkflow = function (flows, start) {
    if (isSuspendTest) {
        console.log(TAG, "暂停测试");
        return;
    }
    flowWorker = Utils.forkBug("./worker.js", flows[start]);
    // flowWorker = child.fork("./worker.js", flows[start]);
    isSingleTest = true;
    Project.updateProject2({_id: ObjectId(workProject)},
        {$set: {testStartTime: new Date().toLocaleString()}}, function (err, result) {
            err && console.error(err);
        });
    changeProjectCaseStatus(flows[start][0], "TESTING");
    // wsServer.send({type: "DataUpdate", data: {type: "ProjectCase", id: flows[start][0]}});
    // flowWorker.send("SingleStart");
    flowWorker.on("message", function (msg) {
        if (msg === "SingleFinished") {
            console.error(">>>>>>>>>> [SingleFinished]: " + flows[start]);
            changeProjectCaseStatus(flows[start][0], "TESTED");
            // wsServer.send({message: "pushProgress", progress: start});
            // wsServer.send({type: "DataUpdate", data: {type: "ProjectCase", id: flows[start][0]}});
            runNode = start + 1;
            flowWorker && flowWorker.send("SingleExit");
        } else if (msg === "DataUpdate") {
            wsServer.send({type: "DataUpdate", data: {type: "ProjectCase", id: flows[start][0]}});
        }
    });
    flowWorker.on("exit", function (code) {
        start += 1;
        if (start < flows.length) {
            execWorkflow(flows, start);
        } else {
            runNode = 0;
            isFinish = true;
            isSingleTest = false;
            Project.updateProject2({_id: ObjectId(workProject)},
                {$set: {testEndTime: new Date().toLocaleString()}}, function (err, result) {
                    err && console.error(err);
                });
            changeProjectStatus(workProject, "TESTED", function (code) {
                // wsServer.send({retcode: code, type: "StopTest"});
            });
        }
    })
};

var flowInit = function (caseProjectId, callback) {
    workProject = caseProjectId;
    flowWorker = null;
    workflows = [];
    isFinish = false;
    runNode = 0;
    ProjectCase.getProjectCases2({caseProjectId: ObjectId(caseProjectId)}, {}, function (err, result) {
        if (err || !result || result.length === 0) {
            callback({code: "01"});
            return;
        }
        var caseLibName = result[0].caseLibName;
        // var caseFilePath = result[0].testInfo.caseFilePath;
        if (!caseLibName) {
            callback({code: "02"});
            console.error(TAG, "案例库名不存在");
            return;
        }
        for (var i = 0; i < result.length; i++) { //初始化工程队列
            workflows[i] = [
                result[i]._id,   //与状态机共用
                result[i].fileTitle + ".js",
                result[i].fileTitle + ".xml",
                false,
                caseLibName,    //指定流程脚本路径
                result[i].testInfo.caseFilePath    //提供给脚本测试文件路径
            ];
        }
        // console.error(JSON.stringify(workflows));
        callback({code: "00"});
    });
};
var StartTest = function (caseProjectId) {
    isSuspendTest = false;
    if (workProject !== caseProjectId) {
        if (isSingleTest) {
            wsServer.send({retcode: "01", type: "StartTest", err: "有其他工程正在测试，请等待其测试完毕再操作"});
            return;
        }
        flowInit(caseProjectId, function (result) {
            if (result.code === "00") {
                if (runNode < workflows.length) {
                    execWorkflow(workflows, runNode);
                    changeProjectStatus(caseProjectId, "TESTING", function (code) {
                        wsServer.send({retcode: code, type: "StartTest"});
                    });
                }
            } else {
                console.error(TAG + "flowInit failed.");
                wsServer.send({retcode: "02", type: "StartTest", err: "工程初始化失败"});
            }
        });
    } else {
        if (runNode < workflows.length) {
            execWorkflow(workflows, runNode);
            changeProjectStatus(caseProjectId, "TESTING", function (code) {
                wsServer.send({retcode: code, type: "StartTest"});
            });
        }
    }
};
var SuspendTest = function (caseProjectId) {
    if (workProject === caseProjectId) {
        isSuspendTest = true;
        changeProjectStatus(caseProjectId, "SUSPEND", function (code) {
            wsServer.send({retcode: code, type: "SuspendTest"});
            flowWorker = null;
        });
        // setTimeout(function () {
        //     flowWorker = null;
        // }, 3000);
    } else {
        wsServer.send({retcode: "01", type: "SuspendTest", err: "有其他工程正在测试，请等待其测试完毕再操作"});
    }
};
var ResumeTest = function (caseProjectId) {
    StartTest(caseProjectId);
};
var StopTest = function (caseProjectId) {
    if (workProject === caseProjectId) {
        // flowWorker.disconnect();
        flowWorker = null;
        isSingleTest = false;
        runNode = 0;
        changeProjectStatus(caseProjectId, "TERMINATED", function (code) {
            wsServer.send({retcode: code, type: "StopTest"});
        });
        // wsServer.send({message:"pushProgress", progress: 0});
    } else {
        wsServer.send({retcode: "01", type: "StopTest", err: "有其他工程正在测试，请等待其测试完毕再操作"});
    }
};
var RestartTest = function (caseProjectId) {
    if (workProject === caseProjectId || !isSingleTest) {
        flowWorker = null;
        runNode = 0;
        ProjectCase.updateProjectCase2({caseProjectId: ObjectId(caseProjectId)},
            {$set: {"testInfo.caseStatus": "UNTESTED", "testInfo.result": null, testTrace: []}},
            function (err, result) {
                err && console.error(err);
                StartTest(caseProjectId);
            });
    } else {
        wsServer.send({retcode: "01", type: "StartTest", err: "有其他工程正在测试，请等待其测试完毕再操作"});
    }
};
var dealTestingRm = function (caseProjectId) {
    if (isSingleTest && caseProjectId === workProject) {
        // flowWorker = null;
        // isSingleTest = false;
        // runNode = 0;
        wsServer.send({retcode: "01", type: "DeleteTestProject"});
    } else {
        wsServer.send({retcode: "00", type: "DeleteTestProject"});
    }
};

var changeProjectStatus = function (caseProjectId, status, callback) {
    Project.updateProject2({_id: ObjectId(caseProjectId)}, {$set: {projectStatus: status}},
        function (err, result) {
            err ? callback("01") : callback("00");
            wsServer.send({type: "DataUpdate", data: {type: "TestProject", id: workProject}});
        });
};
var changeProjectCaseStatus = function (_id, status) {
    ProjectCase.updateProjectCase2({_id: ObjectId(_id)}, {$set: {"testInfo.caseStatus": status}},
        function (err, result) {
            err && console.error(err);
            wsServer.send({type: "DataUpdate", data: {type: "ProjectCase", id: workflows[runNode][0]}});
        });
};

function resetProjectStatus() {
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
}