/**
 * Created by Chance on 16/11/30.
 */

var TAG = "[App.js]: ";
var child = require("child_process");

var websocket_server = child.fork("./uiws/wsServer.js");
websocket_server.on("message", function (msg) {
    console.log(TAG, msg);
    switch (msg.message) {
        case "StartTest":
            flowStart();
            break;
        case "SuspendTest":
            flowSuspend();
            break;
        case "ResumeTest":
            ResumeTest();
            break;
        case "StopTest":
            flowStop();
            break;
    }
});
websocket_server.on('exit', function (code) {
    if (code !== 0) {
        websocket_server = child.fork("./uiws/wsServer.js");
    }
});

var workflows = []; //工程案例队列
var runNode = 0;    //下一个案例执行位置
var flowWorker = null;  //状态机实例
for (var i = 0; i < 20; i++) { //初始化工程队列
    workflows[i] = [
        i,
        "test" + i + ".js",
        "test" + i + ".xml",
        false
    ];
}

var execWorkflow = function (flows, start) {
    flowWorker = child.fork("./worker.js", flows[start]);
    // flowWorker.send("SingleStart");
    flowWorker.on("message", function (msg) {
        if (msg === "SingleFinished") {
            console.error("[SingleFinished]: " + flows[start]);
            runNode = start + 1;
            flowWorker && flowWorker.send("SingleExit");
        }
    });
    flowWorker.on("exit", function (code) {
        start += 1;
        if (start < flows.length) {
            execWorkflow(flows, start);
        } else {
            runNode = 0;
        }
    })
};

var flowStart = function () {
    if (runNode < workflows.length) {
        execWorkflow(workflows, runNode);
        websocket_server.send({message: "StartTest", retcode: "00"});
    }
};
var flowSuspend = function () {
    flowWorker = null;
    websocket_server.send({message: "SuspendTest", retcode: "00"});
};
var ResumeTest = function () {
    if (runNode < workflows.length) {
        execWorkflow(workflows, runNode);
        websocket_server.send({message: "ResumeTest", retcode: "00"});
    }
};
var flowStop = function () {
    flowWorker = null;
    runNode = 0;
    websocket_server.send({message: "StopTest", retcode: "00"});
};

// StartTest();