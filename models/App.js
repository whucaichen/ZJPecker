/**
 * Created by Chance on 16/11/30.
 */

var TAG = "[App.js]: ";
var child = require("child_process");

var websocket_server = child.fork("./uiws/Server.js");
websocket_server.on("message", function (msg) {
    console.log(TAG + msg);
});
websocket_server.on('exit', function (code) {
    if (code !== 0) {
        websocket_server = child.fork("./uiws/Server.js");
    }
});

var workflows = []; //工程案例队列
var runNode = 0;    //下一个案例执行位置
var flowWorker = null;  //状态机实例
for (var i = 0; i < 3; i++) { //初始化工程队列
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
            flowWorker.send("SingleExit");
        }
    });
    flowWorker.on("exit", function (code) {
        start += 1;
        if (start < flows.length) {
            execWorkflow(flows, start);
        }
    })
};

var flowStart = function () {
    if (runNode < workflows.length) {
        execWorkflow(workflows, runNode);
    }
};
var flowSuspend = function () {
    flowWorker = null;
};

// flowStart();