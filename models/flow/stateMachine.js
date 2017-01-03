var wait = require('wait.for');
var wsapWorkflow = require('./workflow');
var wsapScript = require('./script');
var path = require("path");
var varScriptEngine = new wsapScript();
var varWorkflow = new wsapWorkflow();

var g_bStart = false;
var g_exeNodeResult = undefined;

function callbackOnTimer(ms, sleepCallback) {
    setTimeout(function () {
        return sleepCallback();
    }, ms);
}

var g_bDealChangeState = false;
function fiberChangeState(varResult) {
    g_bDealChangeState = true;
    var varCurResult = '';
    if (varResult != null) {
        varCurResult = varResult.toString();
    }
    if (varCurResult.toLowerCase() == 'reserve') {
        g_bDealChangeState = false;
        return;
    }
    if (varWorkflow.switchState(varCurResult) == false) {
        //process.send({message:'onFatalError', msgdata:varStatId.toString()});
        console.log('varWorkflow.switchState(' + varCurResult + '), return false');
        g_bDealChangeState = false;
        return;
    }
    console.log(varWorkflow.getStack());

    var varActionName = varWorkflow.getProperty("action");
    if (varActionName != null) {
        varScriptEngine.runNode(varActionName);
    }
    g_bDealChangeState = false;
}

function onChangeState(varResult) {
    if (g_bDealChangeState) {
        console.log('onChangeState\(' + varResult + '\), g_bDealChangeState is in processing discard!');
        return;
    }
    wait.launchFiber(fiberChangeState, varResult);
}

//向主进程发送状态机发送的PostMsgToState消息
function onPostMsgToState(SrcStateName, DesStateName, EventName) {
    console.log('onPostMsgToState: ' + SrcStateName + ", " + DesStateName + ", " + EventName);
    process.send({message: 'PostMsgToState', src: SrcStateName, dest: DesStateName, event: EventName});
}

//向主进程发送状态机发送的ResetState消息
function onResetState(SrcStateName, DesStateName) {
    console.log('onResetState: ' + SrcStateName + ", " + DesStateName);
    process.send({message: 'ResetState', src: SrcStateName, dest: DesStateName});
}

//向主进程发送状态机发送的SetATMFlag消息
function onSetATMFlag(varNode, varValue) {
    console.log('onSetATMFlag: ' + varNode + ", " + varValue);
    process.send({message: 'SetATMFlag', node: varNode, value: varValue});
}

function stateRun(varStatId, varAction, varStatechart, bService, varPath) {

    //初始化
    /*
     1.加载模块脚本
     2.加载状态点迁移引擎
     3.运行
     */
    var url = path.join(__dirname, "../../resource/" + varPath + "/");
    // varScriptEngine.loadAction("./cfg/" + varAction);
    // varScriptEngine.loadAction("../resource/" + varPath + "/" + varAction);
    varScriptEngine.loadAction(url + varAction);

    var wsapstatus = require('wsapstatus');
    var wsapStatusObj = new wsapstatus();
    console.log('wsapStatusObj:' + wsapStatusObj);
    global.changeStatus = wsapStatusObj.changeStatus.bind(wsapStatusObj);
    wsapStatusObj.on("changeState", onChangeState);

    //等待通知开始任务
    while (true) {
        if (g_bStart) {
            break;
        }
        wait.for(callbackOnTimer, 500);
    }

    // 	varWorkflow.loadWorkFlow("./cfg/" + varStatechart, bService);
    // varWorkflow.loadWorkFlow("../resource/" + varPath + "/" + varStatechart, bService);
    varWorkflow.loadWorkFlow(url + varStatechart, bService);
    if (bService) {
        return;
    }
    console.log(varWorkflow.getStack());

//	process.send({message:'loadpage', msgdata:varStatId.toString()})

    var varActionName = varWorkflow.getProperty('action');
    varScriptEngine.runNode(varActionName);

    while (true) {
        if (g_exeNodeResult == undefined) {
            wait.for(callbackOnTimer, 500);
            continue;
        }
        var varCurResult = '';
        if (g_exeNodeResult != null) {
            varCurResult = g_exeNodeResult.toString();
        }
        g_exeNodeResult = undefined;
        if (varCurResult.toLowerCase() == 'reserve') {
            return;
        }
        if (varWorkflow.switchState(varCurResult) == false) {
            //process.send({message:'onFatalError', msgdata:varStatId.toString()});
            return;
        }
        console.log(varWorkflow.getStack());
        var varActionName = varWorkflow.getProperty("action");
        if (varActionName != null) {
            varScriptEngine.runNode(varActionName);
        }

        // if(flowResult){
        //     break;
        // }
    }
    // setInterval(function() {
    // }, 10000);
}

function initEnv(varStatId, varAction, varStatechart, varWsapService, varPath) {
    // console.log("work varStatId: " + varStatId);
    // console.log("work varAction: " + varAction);
    // console.log("work varStatechart: " + varStatechart);
    // console.log("work varWsapService: " + varWsapService);
    wait.launchFiber(stateRun, varStatId, varAction, varStatechart, varWsapService, varPath);
};

function start() {
    g_bStart = true;
}

//接收主进程转发的RecvResetStateMsg消息，并进行状态点重置处理 begin
function onRecvStateMsg(varData) {
    if (varData.message == 'RecvResetStateMsg') {
        if (varWorkflow.nodeName == varData.dest)
            return;
        else {
            wait.launchFiber(fiberRecvStateMsg, varData);
        }

    }
}

function fiberRecvStateMsg(varData) {
    varWorkflow.resetToRootNode(varData.dest);
    var varActionName = varWorkflow.getProperty("action");
    if (varActionName != null) {
        varScriptEngine.runNode(varActionName);
    }
}

process.on('message', onRecvStateMsg);
//接收主进程转发的RecvResetStateMsg消息，并进行状态点重置处理 end

exports.initEnv = initEnv;
exports.start = start;
