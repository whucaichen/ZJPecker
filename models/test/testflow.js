/**
 * Created by Chance on 16/11/24.
 */

var child = require("child_process");
var iPort = 0;
var forkBug = function (worker, varArgs) {
    iPort++;
    var debug = typeof v8debug === "object";
    debug && process.execArgv.push("--debug=" + (process.debugPort + iPort));
    return child.fork(worker, varArgs);
    // if (debug) {
    //     var port = ['--debug=' + (process.debugPort + iPort)];
    //     if (varArgs) {
    //         return child.fork(worker, varArgs, {execArgv: port});
    //     } else {
    //         return child.fork(worker, {execArgv: port});
    //     }
    // } else {
    //     return child.fork(worker, varArgs);
    // }
};

var varArgs = new Array(4);
varArgs[0] = "test";
varArgs[1] = "CusApp.zjs";
varArgs[2] = "CusApp.zjx";
varArgs[3] = false;

// var varChild = child.fork('./worker_v1.js', varArgs);
var varChild = forkBug('../worker.js', varArgs);