/**
 * Created by Chance on 16/11/16.
 */

var TAG = "[App_v1.js]: ";
var child = require("child_process");
var wait = require('wait.for');
var i = 0;
var forkBug = function (worker) {
    i++;
    var debug = typeof  v8debug === "object";
    if (debug) {
        // process.execArgv.push("--debug=" + (10000 + i));
        return child.fork(worker, {execArgv: ['--debug=' + (process.debugPort + i)]});
    } else {
        return child.fork(worker);
    }
};

function callbackOnTimer(ms, sleepCallback) {
    setTimeout(function () {
        return sleepCallback();
    }, ms);
}

// var wsServer = child.fork("./uiws/wsServer.js");
var websocket_server = forkBug("./uiws/wsServer.js");
websocket_server.on("message", function (msg) {
    console.log(TAG, msg);
});
//Server异常重启
websocket_server.on('exit', function (code) {
    if (code !== 0) {
        // wsServer = child.fork("./uiws/wsServer.js");
        websocket_server = forkBug("./uiws/wsServer.js");
    }
});


// var commClient = child.fork("./uiws/commClient.js");
var comm_server = forkBug("./uiws/commClient.js");
//Server异常重启
comm_server.on('exit', function (code) {
    if (code !== 0) {
        comm_server = forkBug("./uiws/commClient.js");
    }
});


global.UUID = function () {
    return require('./utils/crypt').getUuid(len || 16, 16);
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
var DBTool = require("./../db/db_project_case");
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


// //子进程中的主线程global不可用
// var workflow_server = child.fork("./worker_v1.js");
// workflow_server.on("message", function (msg) {
//     console.log(TAG, msg);
// });
// //Server异常重启
// workflow_server.on('exit', function (code) {
//     if (code !== 0) {
//         workflow_server = child.fork("./worker_v1.js");
//     }
// });

var stateMachine = require('./../flow/stateMachine.js');
var runQueue = [
    [0, "test0.js", "test0.xml", false],
    [1, "test1.js", "test1.xml", false],
    [2, "test2.js", "test2.xml", false]
];
global.finishFlag = [];
for(var i = 0; i < runQueue.length; i++){
    finishFlag[i] = false;
}
var testFlag = false;
var start = function () {
    testFlag = true;
    stateMachine.start();
};
var stop = function () {
    testFlag = false;
    stateMachine.stop();
};
start();
// for (var i = 0; i < runQueue.length; i++) {
//     while(true){
//         if(testFlag){
//             break;
//         }
//         wait.for(callbackOnTimer, 1000);
//     }
    stateMachine.initEnv("test", "test.js", "test.xml", false);
//     stateMachine.initEnv(runQueue[i][0], runQueue[i][1], runQueue[i][2], runQueue[i][3]);
//     // while(true){
//     // while(!flowResult){
//     //     // if(flowResult){
//     //     //     break;
//     //     // }
//     //     // wait.for(callbackOnTimer, 1000);
//     // }
// }


var testComm = function () {
    var vm = require("vm");
    var logindata = {
        "msgid": "abcdef0123456789",
        "msgtype": "request",
        "processid": "login",
        "request": {
            "loginid": "Chance"
        }
    };
    var funcSend = "ZJPeckerComm.sendCommMsg(" + JSON.stringify(logindata) + ");";
    // var funcOn = "ZJPeckerComm.onCommMsg(function(data){console.log('[vm]: '+ data)});";
    var funcOn = "ZJPeckerComm.onCommMsg(func);" +
        "function func(data){console.log('[vm]: '+ data)};";
    // vm.runInThisContext(funcSend + funcOn);
    var script = new vm.Script(funcSend + funcOn);
    script.runInThisContext();
};


// process.stdin.setEncoding("utf8");
// process.stdin.on("readable", function () {
//     var chunk = process.stdin.read();
//     if (chunk !== null) {
//         switch (chunk.trim()) {
//             case "0":
//                 process.exit(1);
//             case "1":
//                 testComm();
//                 break;
//             default:
//                 console.log("default");
//         }
//     }
// });

////需要管理员权限执行？
//var startMongoDB = 'net start MongoDB_ZJPecker';
////var startMongoDB = 'mongod --dbpath "D:\\Program Files\\MongoDB\\Server\\3.2\\ZJPecker"';
//child.exec(startMongoDB, function (err, stdout, stderr) {
//    if (err) {
//        console.log("ERROR: " + err);
//        console.log("ERROR: " + stderr);
//    } else {
//        var data = JSON.stringify(stdout);
//        console.log(data);
//    }
//});