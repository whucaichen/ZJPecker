/**
 * Created by Chance on 16/11/16.
 */

var TAG = "[App.js]: ";
//var comm = require("./uiws/Comm.js");
var child = require("child_process");
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

// var websocket_server = child.fork("./uiws/Server.js");
var websocket_server = forkBug("./uiws/Server.js");
websocket_server.on("message", function (msg) {
    console.log(TAG + msg);
});
//Server异常重启
websocket_server.on('exit', function (code) {
    if (code !== 0) {
        // websocket_server = child.fork("./uiws/Server.js");
        websocket_server = forkBug("./uiws/Server.js");
    }
});


// var comm_server = child.fork("./uiws/Comm.js");
var comm_server = forkBug("./uiws/Comm.js");
//comm_server.on("message", function (msg) {
//    console.log(TAG + msg);
//});
//Server异常重启
comm_server.on('exit', function (code) {
    if (code !== 0) {
        // comm_server = child.fork("./uiws/Comm.js");
        comm_server = forkBug("./uiws/Comm.js");
    }
});

global.sendCommMsg = function (msg) {
    comm_server.send(msg);
};
global.onCommMsg = function (callback) {
    comm_server.on("message", function (msg) {
        var result = msg.toString("ascii");
        result = result.substr(0, result.length - 16);
        console.log(TAG + result);
        var jsonResult = JSON.parse(result);
        // console.log(TAG + jsonResult.msgid);
        callback(jsonResult);
    });
};

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
    var funcSend = "sendCommMsg(" + JSON.stringify(logindata) + ");";
    var funcOn = "onCommMsg(function(data){console.log('[vm]: '+ data)});";
    vm.runInThisContext(funcSend + funcOn);
    //vm.runInThisContext(funcSend);
};
//vm.runInThisContext("sendCommMsg1");


process.stdin.setEncoding("utf8");
process.stdin.on("readable", function () {
    var chunk = process.stdin.read();
    if (chunk !== null) {
        switch (chunk.trim()) {
            case "0":
                process.exit(1);
            case "1":
                testComm();
                break;
            default:
                console.log("default");
        }
    }
});

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