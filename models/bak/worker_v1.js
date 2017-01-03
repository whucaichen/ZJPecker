var stateMachine = require('./../flow/stateMachine.js');

// //进程参数信息
// console.log("work process.argv.id: " + process.argv[2]);
// console.log("work process.argv.action: " + process.argv[3]);
// console.log("work process.argv.statechart: " + process.argv[4]);
// console.log("work process.argv.wsapservice: " + process.argv[5]);
//
// var varStatId = process.argv[2];					//状态机名称
// var varAction = process.argv[3];					//脚本文件名称
// var varStatechart = process.argv[4];				//状态文件名称
// var varWsapService = process.argv[5];				//状态文件名称

var varStatId = "test";					//状态机名称
// var varAction = "CusApp.zjs";					//脚本文件名称
// var varStatechart = "CusApp.zjx";				//状态文件名称
var varAction = "test.js";					//脚本文件名称
var varStatechart = "test.xml";				//状态文件名称
var varWsapService = false;				//状态文件名称

var bService = false;								//是否为服务，默认为false
if(varWsapService == 'true'){
	bService = true;
}

// stateMachine.initEnv(varStatId, varAction, varStatechart, bService);
stateMachine.initEnv(varStatId, varAction, varStatechart, bService);
stateMachine.start();

function onMainMessage(varMessage){
	if(varMessage.message == 'onStart'){
		console.log('onMainMessage onStart');
		stateMachine.start();
	}
}

// process.on('message', onMainMessage);
// process.send({message:'initOk', msgdata:varStatId.toString()});

// setInterval(function() {
// }, 10000);
