var wait = require('wait.for');
var wsapWorkflow = require('./flow/workflow');
var wsapScript = require('./flow/script');
var varScriptEngine = new wsapScript();
var varWorkflow = new wsapWorkflow();

var g_bStart = false;
var g_exeNodeResult = undefined;

function callbackOnTimer(ms,sleepCallback) {
	setTimeout(function() {
		return sleepCallback();
	}, ms);
}

var g_bDealChangeState = false;
function fiberChangeState(varResult){
	g_bDealChangeState = true;
	var varCurResult = '';
	if(varResult != null){
		varCurResult = varResult.toString();
	}
	if(varCurResult.toLowerCase() == 'reserve'){
		g_bDealChangeState = false;
		return;
	}
	if(varWorkflow.switchState(varCurResult) == false){
		//process.send({message:'onFatalError', msgdata:varStatId.toString()});
		console.log('varWorkflow.switchState(' + varCurResult + '), return false');
		g_bDealChangeState = false;
		return;
	}
	console.log(varWorkflow.getStack());

	var varActionName = varWorkflow.getProperty("action");
	if(varActionName != null){
		varScriptEngine.runNode(varActionName);
	}
	g_bDealChangeState = false;
}

function onChangeState(varResult){
	if(g_bDealChangeState){
		console.log('onChangeState\(' + varResult + '\), g_bDealChangeState is in processing discard!');
		return;
	}
	wait.launchFiber(fiberChangeState, varResult);
}

//向主进程发送状态机发送的PostMsgToState消息
function onPostMsgToState(SrcStateName, DesStateName, EventName){
	console.log('onPostMsgToState: ' + SrcStateName + ", " + DesStateName + ", " + EventName);
	process.send({message:'PostMsgToState', src:SrcStateName, dest:DesStateName, event:EventName});
}

//向主进程发送状态机发送的ResetState消息
function onResetState(SrcStateName, DesStateName){
	console.log('onResetState: ' + SrcStateName + ", " + DesStateName);
	process.send({message:'ResetState', src:SrcStateName, dest:DesStateName});
}

//向主进程发送状态机发送的SetATMFlag消息
function onSetATMFlag(varNode, varValue){
	console.log('onSetATMFlag: ' + varNode + ", " + varValue);
	process.send({message:'SetATMFlag', node:varNode, value:varValue});
}
	
function stateRun(varStatId, varAction, varStatechart, bService){
	
	//初始化
	/*
		1.加载模块脚本
		2.加载状态点迁移引擎
		3.运行
	*/
	varScriptEngine.loadAction("./cfg/" + varAction);

	var wsapstatus = require('wsapstatus');
	var wsapStatusObj = new wsapstatus();
	console.log('wsapStatusObj:' + wsapStatusObj);
	global.changeStatus = wsapStatusObj.changeStatus.bind(wsapStatusObj);
	wsapStatusObj.on("changeState", onChangeState);

	// var wsapsysobj = require('wsapsysobj');
	// var wsapSysObj = new wsapsysobj();
	// global.Sysobj = wsapSysObj;
    //
	// Sysobj.on("PostMsgToState", onPostMsgToState);     //接收状态机发送的消息PostMsgToState
	// Sysobj.on("ResetState", onResetState);             //接收状态机发送的消息ResetState
	// Sysobj.on("SetATMFlag", onSetATMFlag);             //接收状态机发送的消息SetATMFlag
	
	
	//等待通知开始任务
	while(true){
		if(g_bStart){
			break;
		}
		wait.for(callbackOnTimer, 500);
	}
	
	if(bService){
		varWorkflow.loadWorkFlow("./cfg/" + varStatechart, bService);
	}
	else{
		varWorkflow.loadWorkFlow("./cfg/" + varStatechart, bService);
	}
	if(bService){
		return;
	}
	console.log(varWorkflow.getStack());

	/*if(varStatId == "客户状态机")
	{
		Webuikit.createWindow(8888, '/frontpage.html', 100,100,400,300);
	}
	var varPage = varWorkflow.getProperty('loadpage');	
	if(varPage != "")
	{
	//	Web.NavigateWebDialog("http://localhost:9998/test.html");
	//	console.log("---------------"+Webuikit.openHtml('', "http://localhost:9998/test.html", '/frontpage.html', 100,100,400,300));
	}*/
//	process.send({message:'loadpage', msgdata:varStatId.toString()})

	var varActionName = varWorkflow.getProperty('action');
	varScriptEngine.runNode(varActionName);

	while(true){
		if(g_exeNodeResult == undefined){
			wait.for(callbackOnTimer, 500);
			continue;
		}
		var varCurResult = '';
		if(g_exeNodeResult != null){
			varCurResult = g_exeNodeResult.toString();
		}
		g_exeNodeResult = undefined;
		if(varCurResult.toLowerCase() == 'reserve'){
			return;
		}
		if(varWorkflow.switchState(varCurResult) == false){
			//process.send({message:'onFatalError', msgdata:varStatId.toString()});
			return;
		}
		console.log(varWorkflow.getStack());
		var varActionName = varWorkflow.getProperty("action");
		if(varActionName != null){
			varScriptEngine.runNode(varActionName);
		}

        // if(flowResult){
        //     break;
        // }
	}
	// setInterval(function() {
	// }, 10000);
}

function initEnv(varStatId, varAction, varStatechart, varWsapService){
	console.log("work varStatId: " + varStatId);
	console.log("work varAction: " + varAction);
	console.log("work varStatechart: " + varStatechart);
	console.log("work varWsapService: " + varWsapService);
	wait.launchFiber(stateRun, varStatId, varAction, varStatechart, varWsapService);
};

function start(){
	g_bStart = true;
}

function stop(){
	g_bStart = false;
}

//接收主进程转发的RecvResetStateMsg消息，并进行状态点重置处理 begin
function onRecvStateMsg(varData)
{
	if(varData.message == 'RecvResetStateMsg')
	{
		if (varWorkflow.nodeName == varData.dest)
			return;
		else
		{
			wait.launchFiber(fiberRecvStateMsg, varData);
		}
		
	}
}

function fiberRecvStateMsg(varData){
	varWorkflow.resetToRootNode(varData.dest);
	var varActionName = varWorkflow.getProperty("action");
	if(varActionName != null){
		varScriptEngine.runNode(varActionName);
	}
}

process.on('message', onRecvStateMsg);
//接收主进程转发的RecvResetStateMsg消息，并进行状态点重置处理 end

exports.initEnv = initEnv;
exports.start = start;
exports.stop = stop;
