var TAG = function () {
    return "[worker.js](" + new Date().toLocaleTimeString() + "): ";
};
var vm = require("vm");
var fs = require("fs");
var path = require("path");
var child = require("child_process");
var iconv = require('iconv-lite');
var jschardet = require("jschardet");
var ObjectID = require('mongodb').ObjectID;
// var Project = require("./db/db_project");
var ProjectCase = require("./db/db_project_case");
// var logFile = require("./utils/logFile");
// var SETTINGS = fs.readFileSync(path.join(__dirname, "./settings.json"));
// try {
//     SETTINGS = JSON.parse(SETTINGS.toString());
// } catch (e) {
//     console.error(TAG(), e);
// }
// var State_Delay = SETTINGS.State_Delay || 1000;

var Utils = function () {
    var i = 1;
    this.forkBug = function (worker, varArgs) {
        var debug = typeof v8debug === "object";
        debug && process.execArgv.push("--debug=" + (process.debugPort + i++));
        return child.fork(worker, varArgs);
    };
    return this;
}();

//进程参数信息
Global.LogFile().log("==================================================");
console.log("work process.argv.id: " + process.argv[2]);
Global.LogFile().log("work process.argv.id: " + process.argv[2]);
console.log("work process.argv.action: " + process.argv[3]);
Global.LogFile().log("work process.argv.action: " + process.argv[3]);
console.log("work process.argv.statechart: " + process.argv[4]);
Global.LogFile().log("work process.argv.statechart: " + process.argv[4]);
console.log("work process.argv.path: " + process.argv[6]);
Global.LogFile().log("work process.argv.path: " + process.argv[6]);

var varStatId = process.argv[2];					//状态机名称/
var varAction = process.argv[3];					//脚本文件名称
var varStatechart = process.argv[4];				//状态文件名称
var varWsapService = process.argv[5];
var varPath = process.argv[6];				//案例文件路径
var varCaseFilePath = process.argv[7];				//测试文件路径
var caseProjectId = process.argv[8];
var testClientID = process.argv[9]; //测试客户端ID
var PeckerConfigs = process.argv[10];
PeckerConfigs = JSON.parse(PeckerConfigs);
PeckerConfigs.testClientID = testClientID;
// console.error(TAG(), PeckerConfigs);

global.Global = {};
global.Global.getCurrentProjectName = function () {
    var pre = varCaseFilePath.indexOf("/");
    var next = varCaseFilePath.lastIndexOf("/");
    return varCaseFilePath.substring(pre + 1, next);
};
global.Global.getCurrentCaseName = function () {
    var pre = varCaseFilePath.lastIndexOf("/");
    return varCaseFilePath.substring(pre + 1);
};
global.Global.getCurrentProjectID = function () {
    return caseProjectId;
};
global.Global.getCurrentCaseID = function () {
    return varStatId;
};
global.Global.UUID = function (len) {
    return require("./utils/crypt").getUuid(len || 16, 16);
};
global.Global.LogFile = function () {
    var fileName = "LogFile_" + new Date().toLocaleDateString() + "_" + Global.getCurrentProjectName() + ".txt";
    return require("./utils/logFile").setFile(fileName);
};
// global.Global.Include = function (file) {
global.Global.include = function (file) {
    var url = null;
    if (typeof file !== "string") {
        Global.LogFile().log(file.toString() + " not exists");
        return;
    }
    if (file.substring(0, 12) === "appPublicLib") {  //公共库
        url = path.join(__dirname, "../resource", "libs", file);
    } else if (file === "userLib.js") {
        url = path.join(__dirname, "../resource", varPath, file);
    }
    // console.log(url);
    url && fs.existsSync(url) && vm.runInThisContext(fs.readFileSync(url, 'utf-8'));
};
global.Global.readNativeFile = function (caseID, filePath, callback) {
    ProjectCase.getProjectCase2({_id: ObjectID(caseID)}, {}, function (err, result) {
        if (err) {
            console.error(TAG(), err);
            callback(null);
            return;
        }
        var caseFilePath = result.testInfo && result.testInfo.caseFilePath;
        var file = path.join(__dirname, "../temp/caseFiles", caseFilePath, filePath);
        try {
            var fileStr = fs.readFileSync(file);
            var encoding = jschardet.detect(fileStr).encoding;
            (encoding !== "utf8" || encoding !== "utf-8") && (fileStr = iconv.decode(fileStr, "gbk"));
        } catch (e) {
            console.error(TAG(), e.stack);
        } finally {
            callback(fileStr);
        }
    });
};
global.Global.getTestClientID = function () {
    return testClientID;
};
global.Global.getCasePath = function () {
    var p = path.join(__dirname, "../temp/caseFiles", helper(varCaseFilePath));
    // console.error(TAG(), "path", p);
    return p;
};

var commID = 0;
var commNode = null;
var commMsg = null;
var commClient = Utils.forkBug("./uiws/commClient.js", [JSON.stringify(PeckerConfigs)]);
global.ZJPeckerComm = {};
global.ZJPeckerComm.sendCommMsg = function (target, msg) {
    console.log(TAG(), "send", global.nodeName, commNode);
    if (global.nodeName !== commNode) {
        commNode = global.nodeName;
        commID++;
    }
    commMsg = msg;
    try {
        commClient.send({dst: target, data: msg});
    } catch (e) {
        console.error(TAG(), "Socket连接异常: ", e.stack);
        Global.LogFile().log("Socket连接异常: " + e.stack);
    }
};
global.ZJPeckerComm.onCommMsg = function (target, callback, timeout) {
    console.log(TAG(), "on", global.nodeName, commNode);
    if (global.nodeName !== commNode) {
        commNode = global.nodeName;
        commID++;
    }
    var tempID = commID;
    commClient.on("message", function (msg) {
        console.log(TAG(), target, commID, tempID);
        if (commID !== tempID) return;
        console.error(TAG(), target, JSON.stringify(msg));
        try {
            // (typeof msg.request.data === "string") && (msg.request.data = JSON.parse(msg.request.data));
            // (typeof callback === "function") && (msg.request.data.sourceid === target) && (callback(JSON.parse(msg.request.data.srcdata)));
            var msgRet = JSON.parse(msg.request.data);
            if (msgRet.sourceid === target) {
                console.error(TAG(), "msgRet.srcdata", msgRet.srcdata);
                var ret = msgRet.srcdata;
                // var ret = JSON.parse(msgRet.srcdata);
                (typeof ret === "string") && (ret = JSON.parse(ret));
                (typeof callback === "function") && (callback(ret));
                // clearTimeout(timer);
            }
        } catch (e) {
            console.error(TAG(), target, e.stack);
            // (typeof callback === "function") && callback(e.stack);
        }
    });
    // var timer = setTimeout(function () {
    //     (typeof callback === "function") && (callback("TIMEOUT"));
    //     // (typeof callback === "function") && (callback({head: commMsg.head, body: {error: "TIMEOUT"}}));
    // }, timeout || 10000);
};
global.ZJPeckerComm.setTimeout = function (callback, timeout) {
    if (global.nodeName !== commNode) {
        commNode = global.nodeName;
        commID++;
    }
    var tempID = commID;
    setTimeout(function () {
        if (commID !== tempID) return;
        (typeof callback === "function") && (callback("TIMEOUT"));
    }, timeout || 90000);
};
global.ZJPeckerComm.updateLisenter = function () {
    commID++;
};
global.ZJPeckerComm.updateComm = function () {
    commClient = null;
    commClient = Utils.forkBug("./uiws/commClient.js", [JSON.stringify(PeckerConfigs)]);
};

global.ZJPeckerData = {};
global.ZJPeckerData.peckerData = {};
global.ZJPeckerData.stateInParam = {};
global.ZJPeckerData.getData = function (key) {
    return ZJPeckerData.peckerData[key];
};
global.ZJPeckerData.setData = function (key, value) {
    ZJPeckerData.peckerData[key] = value;
};
global.ZJPeckerData.getInParam = function (id) {
    !(id in ZJPeckerData.stateInParam) && Global.LogFile().log("getInParam()错误，不存在id=" + id);
    return ZJPeckerData.stateInParam[id];
};
global.ZJPeckerData.setCaseParamInfo = function (key, param, callback) {
    ProjectCase.getProjectCase2({_id: ObjectID(helper(varStatId))}, {}, function (err, result) {
        if (err) {
            console.error(TAG(), err);
            return
        }
        var temp = result.caseParamKey || {};
        temp[key] = param;
        ProjectCase.updateProjectCase2({_id: ObjectID(helper(varStatId))}, {$set: {caseParamKey: temp}}, function (err, result) {
            (typeof callback === "function") && (callback(err, result));
            process.send("DataUpdate");
        });
    });
};
global.ZJPeckerData.getCaseParamInfo = function (caseID, paramKey, callback) {
    ProjectCase.getProjectCase2({_id: ObjectID(caseID)}, {}, function (err, result) {
        if (err) {
            console.error(TAG(), err);
            callback(null);
            return
        }
        callback(result.caseParamKey && result.caseParamKey[paramKey]);
    });
};
global.ZJPeckerData.getCaseParamsInfo = function (caseID, callback) {
    ProjectCase.getProjectCase2({_id: ObjectID(caseID)}, {}, function (err, result) {
        if (err) {
            console.error(TAG(), err);
            callback(null);
            return
        }
        callback(result.caseParamKey);
    });
};

global.ZJPeckerTrace = {};
global.ZJPeckerTrace.appTrace = function (traceParam, caseID, callback) {
    var caseId = caseID || helper(varStatId);
    var traceParameter = {};
    traceParameter.traceLevel = traceParam.traceLevel;
    traceParameter.traceContent = "[" + new Date().toLocaleString() + "]" + traceParam.traceContent;
    traceParameter.screenPicName = varCaseFilePath + "/" + traceParam.screenPicName;

    ProjectCase.updateProjectCase2({_id: ObjectID(caseId)},
        {$push: {traceParameter: helper(traceParameter)}}, function (err, result) {
            (typeof callback === "function") && (callback(err, result));
            process.send("DataUpdate");
        });
};

global.ZJPeckerTestCase = {};
global.ZJPeckerTestCase.setCaseResult = function (caseResult, caseID, callback) {
    var caseId = caseID || helper(varStatId);
    ProjectCase.updateProjectCase2({_id: ObjectID(caseId)}, {$set: {"testInfo.result": caseResult}}, function (err, result) {
        (typeof callback === "function") && (callback(err, result));
        process.send("DataUpdate");
    });
};
global.ZJPeckerTestCase.getCaseResult = function (caseID, callback) {
    ProjectCase.getProjectCase2({_id: ObjectID(caseID)}, {}, function (err, result) {
        if (err) {
            console.error(TAG(), err);
            callback(null);
            return;
        }
        callback(result.testInfo && result.testInfo.result);
    });
};
global.ZJPeckerTestCase.getAllCaseInfo = function (callback) {
    ProjectCase.getProjectCases2({caseProjectId: ObjectID(caseProjectId)}, {}, function (err, result) {
        if (err) {
            console.error(TAG(), err);
            callback(null);
            return;
        }
        var ret = [];
        result.forEach(function (data) {
            var temp = {
                caseResult: data.testInfo && data.testInfo.result,
                projectName: global.Global.getCurrentProjectName(),
                projectID: data.caseProjectId,
                caseName: data.caseCaption,
                caseId: data._id,
                // caseParamKey: data.caseParamKey
                caseParamInfo: data.caseParamKey
            };
            ret.push(temp);
        });
        callback(ret);
    });
};

var helper = function (i) {
    return function () {
        return i;
    }();
};

var stateMachine = require('./flow/stateMachine.js');

var bService = false;								//是否为服务，默认为false
if (varWsapService === true) {
    bService = true;
}

var userLib = path.join(__dirname, "../resource", varPath, "userLib.js");
try {
    fs.existsSync(userLib) && vm.runInThisContext(fs.readFileSync(userLib, 'utf-8'));
} catch (e) {
    console.error(TAG(), "依赖库加载失败!", e.stack);
    Global.logFile.log("依赖库加载失败!\n" + e.stack);
}
stateMachine.initEnv(varStatId, varAction, varStatechart, bService, varPath);
stateMachine.start();

process.on('message', function (msg) {
    switch (msg) {
        case "SingleStart":
            stateMachine.start();
            break;
        case "SingleExit":
            commClient = null;
            stateMachine = null;
            setTimeout(function () {
                process.exit(0);
            }, PeckerConfigs.State_Delay || 1000);
            break;
    }
});