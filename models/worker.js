var TAG = "[worker.js]: ";
var vm = require("vm");
var fs = require("fs");
var path = require("path");
var child = require("child_process");
var wait = require('wait.for');
var logFile = require("./utils/logFile");

var Utils = function () {
    var i = 1;
    this.forkBug = function (worker, varArgs) {
        var debug = typeof v8debug === "object";
        debug && process.execArgv.push("--debug=" + (process.debugPort + i++));
        return child.fork(worker, varArgs);
    };
    return this;
}();

var stateMachine = require('./flow/stateMachine.js');

//进程参数信息
logFile.log("==================================================");
console.log("work process.argv.id: " + process.argv[2]);
logFile.log("work process.argv.id: " + process.argv[2]);
console.log("work process.argv.action: " + process.argv[3]);
logFile.log("work process.argv.action: " + process.argv[3]);
console.log("work process.argv.statechart: " + process.argv[4]);
logFile.log("work process.argv.statechart: " + process.argv[4]);
console.log("work process.argv.path: " + process.argv[6]);
logFile.log("work process.argv.path: " + process.argv[6]);

var varStatId = process.argv[2];					//状态机名称
var varAction = process.argv[3];					//脚本文件名称
var varStatechart = process.argv[4];				//状态文件名称
var varWsapService = process.argv[5];
var varPath = process.argv[6];				//状态文件路径

var bService = false;								//是否为服务，默认为false
if (varWsapService == 'true') {
    bService = true;
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
            }, 100);
            break;
    }
});

global.Global = {};
global.Global.UUID = function (len) {
    return require("./utils/crypt").getUuid(len || 16, 16);
};
global.Global.LogFile = function () {
    return require("./utils/logFile");
};
global.Global.Include = function (file) {
    var url = null;
    if (typeof file != "string") {
        Global.LogFile().log(file.toString() + " not exists");
        return;
    }
    if (file.substring(0, 12) == "appPublicLib") {  //公共库
        url = path.join(__dirname, "../resource", "libs", file);
    } else if (file == "userLib.js") {
        url = path.join(__dirname, "../resource", varPath, file);
    }
    // console.log(url);
    url && fs.existsSync(url) && vm.runInThisContext(fs.readFileSync(url, 'utf-8'));
};

var isLogin = false;
var commMsg = null;
var commClient = null;
global.ZJPeckerComm = {};
global.ZJPeckerComm.sendCommMsg = function (target, msg) {
    isLogin = false;
    commClient = Utils.forkBug("./uiws/commClient.js");
    commMsg = msg;
    // while (true) {
    //     if (isLogin) {
    //         commClient.send({dst: target, data: msg});
    //         break;
    //     }
    //     wait.for(callbackOnTimer, 200);
    // }
    var timer = setInterval(function () {
        if (isLogin) {
            try {
                commClient.send({dst: target, data: msg});
            } catch (e) {
                console.error(e);
            }
            clearInterval(timer);
        }
    }, 200);
};
global.ZJPeckerComm.onCommMsg = function (target, callback, timeout) {
    if (!commClient) commClient = Utils.forkBug("./uiws/commClient.js");
    console.error(TAG, global.nodeName, commMsg);
    var isTimeout = true;
    commClient.on("message", function (msg) {
        isTimeout = false;
        // msg.request.data = JSON.parse(msg.request.data);
        // console.error(TAG + JSON.stringify(msg));
        (msg == "login") && (isLogin = true);
        (typeof callback === "function") && (callback(msg));
        return;
    });
    setTimeout(function () {
        isTimeout && (typeof callback === "function") && (callback("TIMEOUT"));
        return;
    }, timeout || 5000);
};

global.ZJPeckerData = {};
global.ZJPeckerData.peckerData = {};
global.ZJPeckerData.getData = function (key) {
    return ZJPeckerData.peckerData[key];
};
global.ZJPeckerData.setData = function (key, value) {
    ZJPeckerData.peckerData[key] = value;
};

var ObjectID = require('mongodb').ObjectID;
var ProjectCase = require("./db/db_project_case");
global.ZJPeckerTrace = {};
global.ZJPeckerTrace.appTrace = function (traceLevel, traceContent, callback) {
    var traceObj = {};
    traceObj.logger = "APP";
    traceObj.logTime = new Date().toLocaleString();
    traceObj.logLevel = traceLevel;
    traceObj.content = traceContent;

    var caseId = helper(varStatId);
    ProjectCase.getProjectCase2({_id: ObjectID(caseId)}, {}, function (err, result) {
        if (err) {
            (typeof callback === "function") && (callback(err, result));
            return;
        }
        var traceArray = result.testTrace;
        if (!traceArray) {
            traceArray = [];
        }
        traceArray.push(traceObj);
        ProjectCase.updateProjectCase2({_id: ObjectID(caseId)}, {$set: {testTrace: traceArray}}, function (err, result) {
            (typeof callback === "function") && (callback(err, result));
        });
    });
};

global.ZJPeckerTestCase = {};
global.ZJPeckerTestCase.setCaseResult = function (caseResult, callback) {
    var caseId = helper(varStatId);
    ProjectCase.updateProjectCase2({_id: ObjectID(caseId)}, {$set: {"testInfo.result": caseResult}}, function (err, result) {
        (typeof callback === "function") && (callback(err, result));
    });
};

var helper = function (i) {
    return function () {
        return i;
    }();
};
function callbackOnTimer(ms, sleepCallback) {
    setTimeout(function () {
        return sleepCallback();
    }, ms);
}