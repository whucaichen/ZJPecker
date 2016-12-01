
var TAG = "[worker.js]: ";
var child = require("child_process");

var comm_server = child.fork("./uiws/Comm.js");
comm_server.on('exit', function (code) {
    if (code !== 0) {
        comm_server = child.fork("./uiws/Comm.js");
    }
});

var Mac_919 = require('./encrypt/Mac_919');
global.UUID = function () {
    return new Mac_919().getUuid(16, 16);
};
global.ZJPeckerComm = {};
global.ZJPeckerComm.sendCommMsg = function (target, msg) {
    comm_server.send(msg);
};
global.ZJPeckerComm.onCommMsg = function (target, callback) {
    comm_server.on("message", function (msg) {
        var result = msg.toString("ascii");
        result = result.substr(0, result.length - 16);
        var jsonResult = JSON.parse(result);
        if (jsonResult.response.loginid === target) {
            callback(jsonResult);
        }
    });
};

global.ZJPeckerData = {};
global.ZJPeckerData.peckerData = {};
ZJPeckerData.peckerData.testCaseData = {};
ZJPeckerData.peckerData.testCaseData.caseId = "582d694b22fbf30768b6263a";

global.ZJPeckerData.getData = function (key) {
    return ZJPeckerData.peckerData[key];
};
global.ZJPeckerData.setData = function (key, value) {
    ZJPeckerData.peckerData[key] = value;
};

var ObjectID = require('mongodb').ObjectID;
var DBTool = require("./db/db_project_case");
global.ZJPeckerTrace = {};
global.ZJPeckerTrace.appTrace = function (traceLevel, traceContent, callback) {
    var traceObj = {};
    traceObj.logger = "APP";
    traceObj.logTime = new Date().toLocaleString();
    traceObj.logLevel = traceLevel;
    traceObj.content = traceContent;

    var testCaseData = ZJPeckerData.getData("testCaseData");
    var caseId = ObjectID(testCaseData.caseId);
    DBTool.updateProjectCase2({_id: caseId}, {$set: {testTrace: traceObj}}, function (err, result) {
        callback(err, result);
    });
};

global.ZJPeckerTestCase = {};
global.ZJPeckerTestCase.setCaseResult = function (caseResult, callback) {
    var testCaseData = ZJPeckerData.getData("testCaseData");
    var caseId = ObjectID(testCaseData.caseId);
    DBTool.updateProjectCase2({_id: caseId}, {$set: {"testInfo.result": caseResult}}, function (err, result) {
        callback(err, result);
    });
};


var stateMachine = require('./stateMachine.js');

//进程参数信息
console.log("work process.argv.id: " + process.argv[2]);
console.log("work process.argv.action: " + process.argv[3]);
console.log("work process.argv.statechart: " + process.argv[4]);
console.log("work process.argv.wsapservice: " + process.argv[5]);

var varStatId = process.argv[2];					//状态机名称
var varAction = process.argv[3];					//脚本文件名称
var varStatechart = process.argv[4];				//状态文件名称
var varWsapService = process.argv[5];				//状态文件名称

var bService = false;								//是否为服务，默认为false
if(varWsapService == 'true'){
	bService = true;
}

stateMachine.initEnv(varStatId, varAction, varStatechart, bService);
stateMachine.start();

process.on('message', function (msg) {
    switch (msg){
        case "SingleStart":
            stateMachine.start();
            break;
        case "SingleExit":
            process.exit();
            break;
    }
});

// setInterval(function() {
// }, 10000);