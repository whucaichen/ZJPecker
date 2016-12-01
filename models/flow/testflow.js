/**
 * Created by Chance on 16/11/24.
 */

var child = require("child_process");
var i = 0;
global.forkBug = function (worker, varArgs) {
    i++;
    var debug = typeof  v8debug === "object";
    if (debug) {
        // process.execArgv.push("--debug=" + (10000 + i));
        var port = ['--debug=' + (process.debugPort + i)];
        return child.fork(worker, varArgs, {execArgv: port});
        // return child.fork(worker, {execArgv: varArgs.concat(port)});
    } else {
        return child.fork(worker, varArgs);
    }
};

var varArgs = new Array(4);
varArgs[0] = "test";
varArgs[1] = "CusApp.zjs";
varArgs[2] = "CusApp.zjx";
varArgs[3] = false;

// var varChild = child.fork('./worker_v1.js', varArgs);
var varChild = forkBug('./worker_v1.js', varArgs);