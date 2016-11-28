var fs = require('fs');
var select = require('xpath');
var DOMParser = require('xmldom').DOMParser;
var stack = require('./stack.js');
var queue = require('./queue.js');

function isValidValue(varValue) {
    if ((varValue == null) || (varValue == undefined)) {
        return false;
    }
    return true;
}

function wsapworkflow() {

    this.bService = false;			//是否为服务标识，默认为false    //??????????????????????????
    this.varFlowXml = null;			//工作流引擎
    this.varStateFile = '';			//工作量名称

    this.subFlow = null;			//运行子流程
    this.runNode = null;			//运行状态点

    this.flowName = '';			//流程名称
    this.nodeName = '';			//状态点

    //定义上下文结构体
    var ContextItem = function () {    //??????????????????????????
        this.nodeName = '';					//状态点实例名称
        this.runNode = null;				//状态点
        this.subFlow = null;				//流程状态点
        this.inParam = new Array();			//输入参数
        this.outParam = new Array();		//输出参数
    };
    this.runContext = new Array();	//运行上下文    //??????????????????????????

    //服务相关变量
    this.serviceResult = null;							//服务执行结果
    this.bExeService = false;							//是否正在执行服务
    this.serviceName = '';								//服务名称

    this.getScriptData = function (varName) {
        return Data.getValue(varName);    //??????????????????????????
    };
    this.setScriptData = function (varName, varValue) {
        return Data.setValue(varName, varValue);
    }

    this.setScriptInParam = function (varIndex, varValue) {
        var varParam = 'inparam' + varIndex;    //??????????????????????????
        var varRet = Data.setValue(varParam, varValue);
        return varRet;
    };
    this.getScriptOutParam = function (varIndex) {
        var varParam = 'outparam' + varIndex;
        var varRet = Data.getValue(varParam);
        return varRet;
    }
    /*
     功能：
     1.状态点切换
     参数：
     varResult-当前状态点运行结果
     */
    this.switchState = function (varResult) {
        console.log("status switchState varResult: " + varResult.toString());

        if (!isValidValue(this.runNode == undefined)) {    //??????????????????????????
            console.log('current runNode is not valid');
            return false;
        }
        if (!isValidValue(this.runNode[0])) {
            console.log('current runNode[0] is not valid');
            return false;
        }

        this.dealOutParam();

        var varContextResult = varResult;
        var varContextNodeName = '';
        while (true) {
            //状态点信息
            var varXPath = 'transition[@result=\'' + varContextResult.toString() + '\']';
            //console.log('varXPath : ' + varXPath);
            //console.log('this.runContext.runNode : ' + this.runNode[0]);
            if (!isValidValue(this.runNode[0])) {
                console.log('this.runNode[0] is not valid');
                return false;
            }
            var varNodes = select(this.runNode[0], varXPath.toString());
            if (varNodes.length == 0) {
                console.log('next node not exist,varXPath:' + varXPath + ',current node:' + this.runNode[0]);
                return false;
            }
            var varContextNodeName = varNodes[0].getAttribute('targetstate');
            if (varContextNodeName != 'END') {    //??????????????????????????
                break;
            }
            var varTargetAssit = varNodes[0].getAttribute('assit');
            var varSize = this.runContext.length;
            if (varSize <= 0) {
                if (this.bService != false) {
                    this.serviceResult = varTargetAssit;    //??????????????????????????
                    this.bExeService = false;
                }
                console.log('this.runContext varSize <= 0');
                return false;
            }
            if (this.stackReWind() == false) {
                console.log('this.stackReWind() failed');
                return false;
            }
            varContextResult = varTargetAssit;
        }

        //选择下一个状态点运行
        var varXPath = 'state[@id=\'' + varContextNodeName.toString() + '\']';
        this.runNode = select(this.subFlow[0], varXPath.toString());
        this.nodeName = varContextNodeName;

        while (true) {
            var varProperty = this.getProperty("property");
            if (!isValidValue(varProperty)) {
                console.log('this.switchState get property failed');
                return false;
            }
            if (varProperty == 'logic') {
                var varSubFlowName = this.getProperty("subflow");
                console.log('this.switchSubFlow:' + varSubFlowName);
                if (!this.switchSubFlow(varSubFlowName)) {    //??????????????????????????
                    console.log('this.switchSubFlow:' + varSubFlowName + 'failed');
                    return false;
                }
            }
            else {
                break;
            }
        }

        //构造输入参数
        this.dealInParam();
        //清理脚本输出参数数据
        this.clearScriptOutParam();

        return true;
    };

    this.stackReWind = function () {    //退回上一状态点
        if (this.runContext.length == 0) {
            return true;
        }
        var varContextSize = this.runContext.length;
        var varContext = this.runContext[varContextSize - 1];

        this.runNode = varContext.runNode;
        this.subFlow = varContext.subFlow;

        var varNodeOutParam = new queue();
        for (var varIndex = 0; varIndex < varContext.outParam.length; varIndex++) {
            varNodeOutParam.push(varContext.outParam[varIndex]);
        }
        this.popStack();

        //处理上一状态点输出
        var varNodes = select(this.runNode[0], 'outparam');
        for (var varIndex = 0; varIndex < varNodes.length; varIndex++) {
            var varData = varNodeOutParam[lIndex];

            var varNodeText = varNodes[0].getAttribute('value');
            if ((varNodeText.length >= 1) && (varNodeText.substring(0, 0) == '$')) {
                var varName = varNodeText.substring(1);
                var varFlag = 'outparam';
                var varPos = varName.indexOf(varData);
                if (varPos != 0) {
                    this.setScriptData(varName, varData);
                }
                else {
                    var nIndex = parseInt(varName.substring(varPos + varFlag.length));
                    this.setStackOutParam(nIndex - 1, varData);
                }
            }
        }
        return true;
    };

    this.getValue = function (varListParam, varIndex) {
        var varRet = '';
        return varRet;
    };


    this.popStack = function () {
        if (this.runContext.length == 0) {
            return;
        }
        var curContext = this.runContext.pop();
        console.log('this.popStack curContext:' + curContext.nodeName);
    };

    /*
     功能：
     1.加载对应的流程文件

     2.bService为False，则加载首次运行节点
     3.bService为True，则等待应用切换环境    //??????????????????????????
     参数：
     varName-流程文件路径
     bService-是否为服务
     */
    this.loadWorkFlow = function (varName, bService) {    //单个状态点加载
        try {
            //console.log("status loadWorkFlow varName: " + varName.toString() + ", bService:" + bService.toString());

            var varContent = fs.readFileSync(varName, 'utf-8');
            this.varFlowXml = new DOMParser().parseFromString(varContent);

            var varPos = varName.lastIndexOf('/');
            var varDotPos = varName.lastIndexOf('.');
            //console.log('loadWorkFlow varName:' + varName + ',varPos:' + varPos + ',varDotPos:' + varDotPos);
            if (varPos >= 0) {
                this.varStateFile = varName.slice(varPos + 1, varDotPos);
                //console.log('this.varStateFile : ' + this.varStateFile);
            }

            this.bService = bService;
            if (this.bService != false) {
                return true;
            }

            this.subFlow = select(this.varFlowXml, "/statechart");
            //console.log("varCurNode: " + varCurNode);
            this.nodeName = this.subFlow[0].getAttribute('defaultstate');
            //console.log("status loadWorkFlow this.nodeName: " + this.nodeName.toString());
            var varXPath = '/statechart/state[@id=\'' + this.nodeName.toString() + '\']';
            //console.log("status loadWorkFlow varXPath: " + varXPath.toString());
            this.runNode = select(this.varFlowXml, varXPath.toString());
            //console.log("status loadWorkFlow this.runNode: " + this.runNode);

            while (true) {
                var varProperty = this.getProperty("property");
                if (!isValidValue(varProperty)) {
                    console.log('status loadWorkFlow getProperty failed');
                    return false;
                }
                //console.log("status loadWorkFlow varProperty: " + varProperty.toString());
                if (varProperty == "logic") {
                    var varSubFlow = this.getProperty("subflow");
                    if (!this.switchSubFlow(varSubFlow)) {
                        return false;
                    }
                }
                else {
                    this.dealInParam();
                    this.clearScriptOutParam();
                    break;
                }
            }
            return true;
        }
        catch (e) {
            return false;
        }
    };

    this.getStack = function () {    //获取运行上下文
        //console.log('getStack begin');
        var varRet = '';
        var varSize = this.runContext.length;
        for (var varIndex = varSize - 1; varIndex >= 0; varIndex--) {
            if (this.runContext[varIndex].nodeName != '') {
                if (varRet == '') {
                    //console.log('getStack : ' + this.runContext[varIndex].nodeName);
                    varRet = this.runContext[varIndex].nodeName;
                }
                else {
                    //console.log('getStack : ' + this.runContext[varIndex].nodeName);
                    varRet = this.runContext[varIndex].nodeName + '\\' + varRet;
                }
            }
        }

        if (varRet == '') {
            varRet = this.varStateFile + ':\\' + this.nodeName;
        }
        else {
            varRet = this.varStateFile + ':\\' + varRet + '\\' + this.nodeName;
        }
        //console.log('getStack end:' + this.varStateFile);
        return varRet;    //??????????????????????????
    };

    this.getNodeName = function () {
        return this.nodeName;
    };

    /*
     功能：
     1.获取当前节点的属性
     参数：
     varName-属性名称
     */
    this.getProperty = function (varName) {
        if (!isValidValue(this.runNode[0])) {
            return undefined;
        }

        var varProperty = this.runNode[0].getAttribute(varName);

        return varProperty;

    };

    this.switchSubFlow = function (varSubName) {    //??????????????????????????
        try {
            //console.log("status switchSubFlow: " + varSubName.toString());

            this.pushStack();

            //构造流程参数
            this.flowName = varSubName;

            //状态点迁移
            var varXPath = '/statechart/state[@id=\'' + this.flowName.toString() + '\'][@property=\'sub\']';    //?????????????????????????? logic sub
            this.subFlow = select(this.varFlowXml, varXPath);
            this.nodeName = this.subFlow[0].getAttribute('defaultstate');

            //转到默认点
            var varXPath = '/statechart/state[@id=\'' + this.flowName.toString() + '\']/state[@id=\'' + this.nodeName.toString() + '\']';    //??????????????????????????
            this.runNode = select(this.varFlowXml, varXPath.toString());

            //console.log(this.runNode);
            return true;
        }
        catch (e) {
            return false;
        }
    };

    this.dealInParam = function () {    //处理 $ 引用
        //console.log("status dealInParam ");
        var varNodes = select(this.runNode[0], 'inparam');
        //console.log("status dealInParam varNodes:" + varNodes);
        for (var varIndex = 0; varIndex < varNodes.length; varIndex++) {
            var varNodeIndex = varNodes[varIndex].getAttribute('id');
            var varNodeText = varNodes[varIndex].getAttribute('value');
            //console.log("status dealInParam varNodeText:" + varNodeText + ',varNodeIndex:' + varNodeIndex);
            if ((varNodeText.length >= 1) && (varNodeText.substring(0, 1) == '$')) {
                var varName = varNodeText.substring(1);
                var varFlag = 'inparam';
                var varPos = varName.indexOf(varFlag);
                var varData = '';
                if (varPos != 0) {
                    varFlag = 'outparam';
                    varPos = varName.indexOf(varFlag);
                    if (varPos != 0) {
                        varData = this.getScriptData(varName);
                    }
                    else {
                        var nIndex = parseInt(varName.substring(varPos + varFlag.length));
                        varData = this.getStackOutParam(nIndex - 1);
                    }
                }
                else {
                    var nIndex = parseInt(varName.substring(varPos + varFlag.length));
                    varData = this.getStackInParam(nIndex - 1);
                }
                this.setScriptInParam(varNodeIndex, varData);
            }
            else {
                //console.log('this.setScriptInParam varNodeIndex:' + varNodeIndex + ',varNodeText:' + varNodeText);
                this.setScriptInParam(varNodeIndex, varNodeText);
            }
        }
    };

    this.dealOutParam = function () {    //处理 $ 引用
        //console.log('dealOutParam begin');
        var varNodes = select(this.runNode[0], 'outparam');
        for (var varIndex = 0; varIndex < varNodes.length; varIndex++) {
            var varData = this.getScriptOutParam(varNodeIndex);

            var varNodeIndex = varNodes[varIndex].getAttribute('id');
            var varNodeText = varNodes[varIndex].getAttribute('value');

            if ((varNodeText.length >= 1) && (varNodeText.substring(0, 1) == '$')) {
                var varName = varNodeText.substring(1);
                var varFlag = 'outparam';
                var varPos = varName.indexOf(varFlag);
                if (varPos != 0) {
                    varFlag = 'inparam';
                    varPos = varName.indexOf(varFlag);
                    if (varPos != 0) {
                        this.setScriptData(varName, varData);
                    }
                    else {
                        var nIndex = parseInt(varName.substring(varPos + varFlag.length));
                        this.setStackInParam(nIndex - 1, varData);
                    }
                }
                else {
                    var nIndex = parseInt(varName.substring(varPos + varFlag.length));
                    this.setStackOutParam(nIndex - 1, varData);
                }
            }
        }
    };

    this.getStackInParam = function (varIndex) {
        var varRet = '';
        if (this.runContext.length == 0) {
            return varRet;
        }
        var varContextSize = this.runContext.length;
        if (varIndex > this.runContext[varContextSize - 1].inParam.length - 1) {
            return varRet;
        }

        szRet = this.runContext[varContextSize - 1].inParam[varIndex];    //??????????????????????????
        return varRet;
    };

    this.setStackInParam = function (varIndex, varData) {
        if (this.runContext.length == 0) {
            return false;
        }
        var varContextSize = this.runContext.length;

        var varSize = this.runContext[varContextSize - 1].inParam.length;
        if (varIndex > (varSize - 1)) {
            var varRemain = varIndex - (this.runContext[varContextSize - 1].inParam.GetSize() - 1);
            for (var varCurIndex = 0; varCurIndex < varRemain; varCurIndex++) {
                this.runContext[varContextSize - 1].inParam.push('');
            }
        }

        this.runContext[varContextSize - 1].inParam[varIndex] = varData;
        return true;
    };

    this.setStackOutParam = function (varIndex, varData) {
        if (this.runContext.length == 0) {
            return false;
        }

        var varContextSize = this.runContext.length;
        var varSize = this.runContext[varContextSize - 1].outParam.GetSize();
        if (varIndex > (varSize - 1)) {
            var varRemain = varIndex - (varSize - 1);
            for (var varCurIndex = 0; varCurIndex < varRemain; varCurIndex++) {
                this.runContext[varContextSize - 1].outParam.push('');
            }
        }

        this.runContext[varContextSize - 1].outParam[varIndex] = varData;
        return true;
    };

    this.getStackOutParam = function (varIndex) {

        if (this.runContext.length == 0) {
            return '';
        }
        var varContextSize = this.runContext.length;

        if (varIndex > this.runContext[varContextSize - 1].outParam.GetSize() - 1) {
            return '';
        }

        return this.runContext[varContextSize - 1].outParam[varIndex];
    };

    this.clearScriptOutParam = function () {
        //console.log('status clearScriptOutParam ');

        var varNodes = select(this.runNode[0], 'outparam');
        //console.log("status clearScriptOutParam varNodes:" + varNodes);
        for (var varIndex = 0; varIndex < varNodes.length; varIndex++) {
            var varNodeIndex = varNodes[varIndex].getAttribute('id');
            var varName = "outparam" + varNodeIndex.toString();

            //console.log("status clearScriptOutParam varName:" + varName);
            this.setScriptData(varName, '');
        }
    };

    this.pushStack = function () {    //??????????????????????????
        //console.log("pushStack begin");

        //压栈
        var varContext = new ContextItem();
        varContext.nodeName = this.nodeName;
        varContext.subFlow = this.subFlow;
        varContext.runNode = this.runNode;

        console.log('pushStack this.nodeName:' + this.nodeName);

        //构造输入参数
        var varNodes = select(this.runNode[0], 'inparam');
        for (var varIndex = 0; varIndex < varNodes.length; varIndex++) {
            var varNodeText = varNodes[varIndex].getAttribute('value');
            if ((varNodeText.length >= 1) && (varNodeText.substring(0, 0) == '$')) {
                var varName = varNodeText.substring(1);
                var varFlag = 'inparam';
                var varPos = varName.indexOf(varFlag);
                var varData = '';
                if (varPos != 0) {
                    varData = this.getScriptData(varName);
                }
                else {
                    var nIndex = parseInt(varName.substring(varPos + varFlag.length));
                    varData = this.getStackInParam(nIndex - 1);
                }
                varContext.inParam.push(varData);
            }
            else {
                varContext.inParam.push(varNodeText);
            }
        }

        varNodes = select(this.runNode[0], 'outparam');
        for (var varIndex = 0; varIndex < varNodes.length; varIndex++) {
            varContext.outParam.push('');    // dealoutparam来处理 $
        }

        this.runContext.push(varContext);
    };

    this.resetToRootNode = function (varRootNodeName) {    //?????????????????????????? 子流程结束退回？subflow varRootNodeName
        console.log("status resetToRootNode varRootNodeName:" + varRootNodeName.toString());

        if (this.runContext.length <= 0) {
            return true;
        }
        while (true) {
            var varSize = this.runContext.length;
            if (varSize < 1) {
                return false;
            }
            else if (varSize == 1) {
                break;
            }
            this.popStack();
        }

        //状态点迁移
        this.subFlow = select(this.varFlowXml, '/statechart');

        //选择目标状态点运行
        var varXPath = 'state[@id=\'' + varRootNodeName.toString() + '\']';
        this.runNode = select(this.subFlow[0], varXPath);
        if (this.runNode.length == 0) {
            return false;
        }
        this.nodeName = varRootNodeName;

        while (true) {
            var varProperty = this.getProperty('property');
            if (varProperty == 'logic') {
                var varSubFlowName = this.getProperty('subflow');
                if (!this.switchSubFlow(varSubFlowName)) {    //??????????????????????????
                    return false;
                }
            }
            else {
                break;
            }
        }

        //构造输入参数
        this.dealInParam();
        //清理脚本输出参数数据
        this.clearScriptOutParam();

        return true;
    };

    this.getSeviceInParamCount = function (varServiceName) {
        //console.log("status getSeviceInParamCount varServiceName:" + varServiceName.toString());

        if (this.bService == false) {
            return 0;
        }

        try {
            var varXPath = '/statechart/state[@id=\'' + varServiceName.toString() + '\'][@property=\'sub\']';
            var varNodes = select(this.varFlowXml, varXPath);
            if (varNodes.length == 0) {
                return 0;
            }

            var varInParamNodes = select(this.varNodes[0], 'inparam');
            return varInParamNodes.length;
        }
        catch (e) {
            return false;
        }
    };

    this.getSeviceOutParamCount = function (varServiceName) {
        //console.log("status getSeviceOutParamCount varServiceName:" + varServiceName.toString());
        if (this.bService == false) {
            return 0;
        }

        try {
            var varXPath = '/statechart/state[@id=\'' + varServiceName.toString() + '\'][@property=\'sub\']';
            var varNodes = select(this.varFlowXml, varXPath);
            if (varNodes.length == 0) {
                return 0;
            }
            var varInParamNodes = select(this.varNodes[0], 'outparam');
            return varInParamNodes.length;
        }
        catch (e) {
            return false;
        }
    };

    this.switchService = function (varServiceName, varInParam, varDomainName, varSrcStateName) {
        //console.log("status switchService varServiceName:" + varServiceName.toString());

        if (this.bService == false) {
            return false;
        }

        try {
            var varInParamNum = this.getSeviceInParamCount(varServiceName);
            var varOutParamNum = this.getSeviceOutParamCount(varServiceName);

            //构造流程参数
            this.flowName = varServiceName;
            this.serviceName = varServiceName;

            //状态点迁移
            var varXPath = '/statechart/state[@id=\'' + varServiceName.toString() + '\'][@property=\'sub\']';
            this.subFlow = select(this.varFlowXml, varXPath);
            this.nodeName = subFlow[0].getAttribute('defaultstate');

            //转到默认点
            varXPath = '/statechart/state[@id=\'' + this.flowName.toString() + '\']/state[@id=\'' + this.nodeName.toString() + '\']';
            this.runNode = select(this.subFlow[0], varXPath);

            //清除调用堆栈
            this.runContext.MakeEmpty();    //??????????????????????????

            //构造首层堆栈
            var varContext = new ContextItem();
            varContext.nodeName = varServiceName;
            if (varInParamNum <= varInParam.GetSize()) {
                for (var varIndex = 0; varIndex < varInParamNum; varInParamNum++) {
                    varContext.inParam.push(varInParam[varIndex]);
                }
            }
            else {
                var varRemain = varInParamNum - varInParam.GetSize();
                for (var varIndex = 0; varIndex < varInParam.GetSize(); varIndex++) {
                    varContext.inParam.push(varInParam[varIndex]);
                }
                for (varIndex = 0; varIndex < varRemain; varIndex++) {
                    varContext.inParam.push('');
                }
            }

            for (var varIndex = 0; varIndex < varOutParamNum; varIndex++) {
                varContext.outParam.push('');
            }

            this.runContext.push(varContext);

            if (varDomainName != '') {
                if (!this.setAppDomain(varDomainName, varSrcStateName)) {
                    return false;
                }
            }

            while (true) {
                var varProperty = this.getProperty('property');
                if (varProperty == 'logic') {
                    var varSubFlow = this.getProperty('subflow');
                    if (!this.switchSubFlow(varSubFlow)) {    //??????????????????????????
                        return false;
                    }
                }
                else {
                    this.dealInParam();
                    this.clearScriptOutParam();
                    break;
                }
            }
            this.bExeService = true;    //??????????????????????????
            return true;
        }
        catch (e) {
            return false;
        }
    };

    this.setAppDomain = function (varDomainName, varSrcStateName) {    //??????????????????????????
        return true;
    }

    this.retriveServiceResult = function (varServiceName) {
        //console.log("status switchService varServiceName:" + varServiceName.toString());

        if (this.bService = false) {    //??????????????????????????
            return null;
        }
        if (this.runContext.length == 0) {
            return null;
        }

        var varContextSize = this.runContext.length;
        if (this.runContext[varContextSize - 1].nodeName != varServiceName) {
            return null;
        }

        return this.serviceResult;
    };

    this.retriveServiceOutParam = function (varServiceName) {
        //console.log("status switchService varServiceName:" + varServiceName.toString());

        if (this.bService = false) {
            return null;
        }
        if (this.runContext.length == 0) {
            return null;
        }

        var varContextSize = this.runContext.length;
        if (this.runContext[varContextSize - 1].nodeName != varServiceName) {
            return null;
        }

        return this.runContext[varContextSize - 1].outParam;
    };

    this.isService = function () {
        return this.bService;
    };

    this.isSeriveFinish = function () {
        return this.bExeService;
    };
}

module.exports = wsapworkflow;