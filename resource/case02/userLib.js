//interface
var UserNameList = {
    "atmClientId" : "atmclient",
    "atmManagerId" : "atmmanager",
    "ZJPeckerClientId" : "client1",
    "ZJPeckerServerId" : "ZJPecker",
    "ZJSPReadCardId" : "ZJSIMIDC",
    "ZJSPPINId" : "ZJSIMPIN",
    "ZJSPDepositId" : "ZJSIMCIM",
    "ZJSPDrawId" : "ZJSIMCDM",
    "ZJSPSIUId" : "ZJSIMSIU",
    "ZJSPSlipId" : "ZJSIMRPR",
    "ZJSPLogId" : "ZJSIMJPR"
};

var PublicTools = {
    log : function(content){
        console.log(content);
        Global.LogFile().log(content);
    },

    errorCheck : function(callback){
        var timerHandle = "";
        var timeoutFlag = false;
        var timerDevice = function(){
            timerHandle = setTimeout(function(){
                timeoutFlag = true;
                normalCallback();
            },90000);
        };

        var clearCallback = function(){
            normalCallback = function(){};
            errorCallback = function(){};
            timeoutCallback = function(){};
        };

        var normalCallback = function(){
            clearCallback();
            clearTimeout(timerHandle);
            callback(true);
        };

        var errorCallback = function(){
            clearCallback();
            clearTimeout(timerHandle);
            callback(false);
        };

        var timeoutCallback = function(){
            clearCallback();
            clearTimeout(timerHandle);
            callback("timeout");
        };

        var pageCheck = function(){
            ZJPeckerComm.sendCommMsg(UserNameList.ZJPeckerClientId, ZJPageTools.getHtmlRequest(destination));
            ZJPeckerComm.onCommMsg(UserNameList.ZJPeckerClientId, function(resData){
                PublicTools.log("[INFO] [userLib.js] [PublicTools.pageCheck] [receive,begin,resData="+JSON.stringify(resData)+"]");
                if(!timeoutFlag){
                    try{
                        if(resData!="TIMEOUT"){
                            var resInfo = JSON.parse(resData.request.data);
                            var srcdata = JSON.parse(resInfo.srcdata);
                            pageHandle(srcdata);
                        }else{
                            PublicTools.log("[INFO] [userLib.js] [PublicTools.pageCheck] [receive,timeout]");
                            timeoutCallback();
                        }
                    }catch(ex){
                        PublicTools.log("[INFO] [userLib.js] [PublicTools.pageCheck] [receive,catch error,ex="+ex+"]");
                    }
                }
            },100000000);
        };

        var pageHandle = function(data){
            PublicTools.log("[INFO] [userLib.js] [PublicTools.pageHandle] [begin]");

            if(data.body.resData.indexOf("请取走卡片")!=-1){
                normalCallback();
            }else if(data.body.resData.indexOf("卡已吞")!=-1){
                errorCallback();
            }else{
                if(!timeoutFlag){
                    clearTimeout(timerHandle);
                    timerHandle = setTimeout(function(){pageCheck()},1000);
                }
            }
        };

        var spCheck = function(){
            ZJPeckerComm.onCommMsg("ZJSIMIDC", function(resData){
                PublicTools.log("[INFO] [userLib.js] [PublicTools.spCheck] [reveive,begin]");
                if(!timeoutFlag){
                    try{
                        if(resData!="TIMEOUT"){
                            PublicTools.log("[INFO] [userLib.js] [PublicTools.spCheck] [reveive,success,cardtype="+cardtype+"]");
                            var resInfo = JSON.parse(resData.request.data);
                            var srcdata = JSON.parse(resInfo.srcdata);
                            if(srcdata.cmddata.actionname=="CardEjected"){
                                normalCallback();
                            }else if(srcdata.cmddata.actionname=="CardRetain"){
                                errorCallback();
                            }
                        }else{
                            PublicTools.log("[INFO] [userLib.js] [PublicTools.spCheck] [reveive,timeout]");
                            timeoutCallback();
                        }
                    }catch(ex){
                        PublicTools.log("[INFO] [userLib.js] [PublicTools.spCheck] [reveive,catch ex="+ex+"]");
                    }
                }
            },1000000);
        };

        pageCheck();
        spCheck();
    }
};

var ZJPageTools = {

    getHtmlRequest: function(destination){
        var reqMsgObj = {
            "head":{
                "cmdCode": "010001",
                "requestId": Global.UUID(),
                "tranTime": (new Date()).toLocaleString()
            },
            "body":{
                "type": "1",
                "fromId": "ZJPecker",
                "destination": destination,
                "action": "getHtml"
            }
        };
        return JSON.stringify(reqMsgObj);
    },

    clickRequest: function(destination,clickName){
        var reqMsgObj = {
            "head":{
                "cmdCode": "010001",
                "requestId": Global.UUID(),
                "tranTime": (new Date()).toLocaleString()
            },
            "body":{
                "type": "1",
                "fromId": "ZJPecker",
                "destination": destination,
                "action": "click",
                "clickName": clickName
            }
        };
        return JSON.stringify(reqMsgObj);
    },

    pageCheck : function(destination,timeInterval,times,paramArray,callback){
        PublicTools.log("[INFO] [userLib.js] [ZJPageTools.pageCheck] [destination="+destination+",timeInterval="+timeInterval+",times="+times+",paramArray="+paramArray.join(",")+"]");
        var cycleTimes = times;

        var clearCallback = function(){
            normalCallback = function(){};
            errorCallback = function(){};
            timeoutCallback = function(){};
        };

        var normalCallback = function(){
            clearCallback();
            clearTimeout(timerHandle);
            callback(true);
        };

        var errorCallback = function(){
            clearCallback();
            clearTimeout(timerHandle);
            callback(false);
        };

        var timeoutCallback = function(){
            clearCallback();
            clearTimeout(timerHandle);
            callback("timeout");
        };

        var pageHandle = function(data){
            PublicTools.log("[INFO] [userLib.js] [ZJPageTools.pageCheck] [pageHandle,destination="+destination+",timeInterval="+timeInterval+",cycleTimes="+cycleTimes+",times="+times+",paramArray="+paramArray.join(",")+"]");

            var flag = 0;
            for(var i in paramArray){
                if(data.body.resData.indexOf(paramArray[i])!=-1){
                    flag ++;
                }
            }

            if(flag==paramArray.length){
                PublicTools.log("[INFO] [userLib.js] [ZJPageTools.pageCheck] [pageHandle,receive,page exist]");
                normalCallback();
            }else{
                PublicTools.log("[INFO] [userLib.js] [ZJPageTools.pageCheck] [pageHandle,receive,cycleTimes="+cycleTimes+"]");
                if((cycleTimes--)<=1){
                    PublicTools.log("[INFO] [userLib.js] [ZJPageTools.pageCheck] [pageHandle,receive,page not exist]");
                    errorCallback();
                    return;
                }else{
                    setTimeout(function(){
                        PublicTools.log("[INFO] [InitStateCheck.js] [ZJPageTools.pageCheck] [pageHandle,receive,page not exist,sendCommMsg,cycleTimes="+cycleTimes+"]");
                        commHandle();
                    },timeInterval);
                }
            }
        };

        var commHandle = function(){
            ZJPeckerComm.sendCommMsg(UserNameList.ZJPeckerClientId, ZJPageTools.getHtmlRequest(destination));
            ZJPeckerComm.onCommMsg(UserNameList.ZJPeckerClientId, function(resData){
                PublicTools.log("[INFO] [userLib.js] [ZJPageTools.pageCheck] [receive,begin,resData="+JSON.stringify(resData)+"]");
                try{
                    if(resData!="TIMEOUT"){
                        var resInfo = JSON.parse(resData.request.data);
                        var srcdata = JSON.parse(resInfo.srcdata);
                        pageHandle(srcdata);
                    }else{
                        PublicTools.log("[INFO] [userLib.js] [ZJPageTools.pageCheck] [receive,timeout]");
                        timeoutCallback();
                    }
                }catch(ex){
                    PublicTools.log("[INFO] [userLib.js] [ZJPageTools.pageCheck] [receive,catch error,ex="+ex+"]");
                }
            },100000000);
        };

        commHandle();
    },

    click : function(destination,clickName,callback){
        PublicTools.log("[INFO] [userLib.js] [ZJPageTools.click] [destination="+destination+",clickName="+clickName+"]");
        var reqMsgObj = {
            "head":{
                "cmdCode": "010001",
                "requestId": Global.UUID(),
                "tranTime": (new Date()).toLocaleString()
            },
            "body":{
                "type": "1",
                "fromId": "ZJPecker",
                "destination": destination,
                "action": "click",
                "clickName": clickName
            }
        };
        var reqMsgStr = JSON.stringify(reqMsgObj);
        ZJPeckerComm.sendCommMsg(UserNameList.ZJPeckerClientId, reqMsgStr);
        PublicTools.log("[INFO] [userLib.js] [ZJPageTools.click] [send end]");
        ZJPeckerComm.onCommMsg(UserNameList.ZJPeckerClientId, function(resData){
            PublicTools.log("[INFO] [userLib.js] [ZJPageTools.click] [receive begin]");
            try{
                if(resData!="TIMEOUT"){
                    PublicTools.log("[INFO] [userLib.js] [ZJPageTools.click] [receive success]");
                    var resInfo = JSON.parse(resData.request.data);
                    var srcdata = JSON.parse(resInfo.srcdata);
                    if(srcdata.body.resData=="0"){
                        PublicTools.log("[INFO] [InsertCard.js] [InsertCardClick] [start checkNextPage_temp2]");
                        callback(true);
                    }else{
                        PublicTools.log("[ERROR] [TakeCard.js] [InsertCardClick] [InsertCardError]");
                        callback(false);
                    }
                }else{
                    PublicTools.log("[ERROR] [userLib.js] [ZJPageTools.click] [receive error, timeout]");
                    callback("timeout");
                }
            }catch(ex){
                PublicTools.log("[INFO] [userLib.js] [ZJPageTools.click] [receive, catch ex="+ex+"]");
            }
        },1000000);
    },

    screenCapture : function(destination,filePath,fileName,callback){
        var logContent = "[INFO] [public.js] [ZJPageTools.screenCapture] [destination="+destination+",filePath="+filePath+",fileName="+fileName+"]";
        console.log(logContent);
        Global.LogFile().log(logContent);
        var reqMsgObj = {
            "head":{
                "cmdCode": "910001",
                "requestId": Global.UUID(),
                "tranTime": (new Date()).toLocaleString()
            },
            "body":{
                "type": "1",
                "captureId": destination,
                "filePath": filePath,
                "fileName": fileName
            }
        };
        var reqMsgStr = JSON.stringify(reqMsgObj);
        ZJPeckerComm.sendCommMsg("client", reqMsgStr);
        ZJPeckerComm.onCommMsg("client", function(resData){
            if(resData!="TIMEOUT"){
                var logContent = "[INFO] [public.js] [ZJPageTools.screenCapture] [screenCapture success]";
                console.log(logContent);
                Global.LogFile().log(logContent);
                var resInfo = JSON.parse(resData);
                callback(resInfo.body.resData);
            }else{
                var logContent = "[ERROR] [public.js] [ZJPageTools.screenCapture] [screenCapture error, timeout]";
                console.log(logContent);
                Global.LogFile().log(logContent);
                callback("TIMEOUT");
            }
        });
    },

    fileHandle : function(filePath,callback){
        var logContent = "[INFO] [public.js] [ZJPageTools.fileHandle] [filePath="+filePath+"]";
        console.log(logContent);
        Global.LogFile().log(logContent);
        var reqMsgObj = {
            "head":{
                "cmdCode": "910002",
                "requestId": Global.UUID(),
                "tranTime": (new Date()).toLocaleString()
            },
            "body":{
                "type": "1",
                "filePath": filePath
            }
        };
        var reqMsgStr = JSON.stringify(reqMsgObj);
        ZJPeckerComm.sendCommMsg("client", reqMsgStr);
        ZJPeckerComm.onCommMsg("client", function(resData){
            if(resData!="TIMEOUT"){
                var logContent = "[INFO] [public.js] [ZJPageTools.fileHandle] [fileHandle success]";
                console.log(logContent);
                Global.LogFile().log(logContent);
                var resInfo = JSON.parse(resData);
                callback(resInfo.body.resData);
            }else{
                var logContent = "[ERROR] [public.js] [ZJPageTools.fileHandle] [fileHandle error, timeout]";
                console.log(logContent);
                Global.LogFile().log(logContent);
                callback("TIMEOUT");
            }
        });
    },

    fileUpload : function(filePath,callback){
        var logContent = "[INFO] [public.js] [ZJPageTools.fileUpload] [filePath="+filePath+"]";
        console.log(logContent);
        Global.LogFile().log(logContent);
        var reqMsgObj = {
            "head":{
                "cmdCode": "910003",
                "requestId": Global.UUID(),
                "tranTime": (new Date()).toLocaleString()
            },
            "body":{
                "type": "1",
                "fileType": "0",
                "filePath": filePath,
                "fileName": ""
            }
        };
        var reqMsgStr = JSON.stringify(reqMsgObj);
        ZJPeckerComm.sendCommMsg("client", reqMsgStr);
        ZJPeckerComm.onCommMsg("client", function(resData){
            if(resData!="TIMEOUT"){
                var logContent = "[INFO] [public.js] [ZJPageTools.fileUpload] [fileUpload success]";
                console.log(logContent);
                Global.LogFile().log(logContent);
                var resInfo = JSON.parse(resData);
                callback(resInfo.body.resData);
            }else{
                var logContent = "[ERROR] [public.js] [ZJPageTools.fileUpload] [fileUpload error, timeout]";
                console.log(logContent);
                Global.LogFile().log(logContent);
                callback("TIMEOUT");
            }
        });
    }
};

var ZJSPTools = {

    sendCommMsg: function(sendId,msgContent){
        ZJPeckerComm.sendCommMsg(sendId, msgContent);
    },

    waitResponse : function(eventType,callback){
        ZJPeckerComm.onCommMsg(UserNameList.ZJPeckerClientId, function(resData){
            PublicTools.log("[INFO] [userLib.js] [ZJSPTools.waitResponse] [reveive,begin]");
            try{
                if(resData!="TIMEOUT"){
                    PublicTools.log("[INFO] [userLib.js] [ZJSPTools.waitResponse] [reveive,success]");
                    var resInfo = JSON.parse(resData.request.data);
                    var srcdata = JSON.parse(resInfo.srcdata);
                    if(srcdata.resultdata.eventtype=="end"){
                        if(srcdata.resultdata.eventid==eventType){
                            callback(true);
                        }else{
                            callback(false);
                        }
                    }
                    //callback(resInfo.resultdata.eventid);
                }else{
                    PublicTools.log("[INFO] [userLib.js] [ZJSPTools.waitResponse] [reveive,timeout]");
                    callback("timeout");
                }
            }catch(ex){
                PublicTools.log("[INFO] [userLib.js] [ZJSPTools.waitResponse] [reveive,catch ex="+ex+"]");
            }
        },1000000);
    },

    waitNotice : function(listenId,eventType,callback){
        ZJPeckerComm.onCommMsg(listenId, function(resData){
            PublicTools.log("[INFO] [userLib.js] [ZJSPTools.waitNotice] [reveive,begin]");
            try{
                if(resData!="TIMEOUT"){
                    PublicTools.log("[INFO] [userLib.js] [ZJSPTools.waitNotice] [reveive,success]");
                    var resInfo = JSON.parse(resData.request.data);
                    var srcdata = JSON.parse(resInfo.srcdata);
                    if(srcdata.cmddata.actionname==eventType){
                        callback(true);
                    }
                    //callback(resInfo.resultdata.eventid);
                }else{
                    PublicTools.log("[INFO] [userLib.js] [ZJSPTools.waitNotice] [reveive,timeout]");
                    callback("timeout");
                }
            }catch(ex){
                PublicTools.log("[INFO] [userLib.js] [ZJSPTools.waitNotice] [reveive,catch ex="+ex+"]");
            }
        },1000000);
    },

    insertCardRequest : function(cardtype){
        PublicTools.log("[INFO] [userLib.js] [ZJSPTools.insertCardRequest] [cardtype="+cardtype+"]");
        var reqMsgObj = {
            "head": {
                "appid": "ZJPecker",
                "cmdcode": "010001",
                "requestid": Global.UUID()
            },
            "cmddata": {
                "actionname": "InsertCardByType",
                "actiondata": {
                    "cardtype": cardtype
                }
            }
        };
        return JSON.stringify(reqMsgObj);
    },

    insertCard : function(cardtype,eventType,callback){
        PublicTools.log("[INFO] [userLib.js] [ZJSPTools.insertCard] [cardtype="+cardtype+"]");
        var reqMsgObj = {
            "head": {
                "appid": "ZJPecker",
                "cmdcode": "010001",
                "requestid": Global.UUID()
            },
            "cmddata": {
                "actionname": "InsertCardByType",
                "actiondata": {
                    "cardtype": cardtype
                }
            }
        };
        var reqMsgStr = JSON.stringify(reqMsgObj);
        var commHandle = function(){
            ZJPeckerComm.sendCommMsg("ZJSIMIDC", reqMsgStr);
            PublicTools.log("[INFO] [userLib.js] [ZJSPTools.insertCard] [send,begin]");
            ZJPeckerComm.onCommMsg("ZJSIMIDC", function(resData){
                PublicTools.log("[INFO] [userLib.js] [ZJSPTools.insertCard] [reveive,begin]");
                try{
                    if(resData!="TIMEOUT"){
                        PublicTools.log("[INFO] [userLib.js] [ZJSPTools.insertCard] [reveive,success,cardtype="+cardtype+"]");
                        var resInfo = JSON.parse(resData.request.data);
                        var srcdata = JSON.parse(resInfo.srcdata);
                        if(srcdata.resultdata.eventtype=="end"){
                            if(srcdata.resultdata.eventid=="CardInsert_OK"){
                                callback(true);
                            }else{
                                callback(false);
                            }
                        }
                    }else{
                        PublicTools.log("[INFO] [userLib.js] [ZJSPTools.insertCard] [reveive,timeout]");
                        callback(false);
                    }
                }catch(ex){
                    PublicTools.log("[INFO] [userLib.js] [ZJSPTools.insertCard] [reveive,catch ex="+ex+"]");
                }
            },1000000);
        };

        commHandle();
    },

    insertCardRequest : function(cardtype){
        var reqMsgObj = {
            "head": {
                "appid": "ZJPecker",
                "cmdcode": "010001",
                "requestid": Global.UUID()
            },
            "cmddata": {
                "actionname": "InsertCardByType",
                "actiondata": {
                    "cardtype": cardtype
                }
            }
        };
        return JSON.stringify(reqMsgObj);
    },

    takeCard : function(callback){
        PublicTools.log("[INFO] [userLib.js] [ZJSPTools.takeCard] [begin]");
        var reqMsgObj = {
            "head": {
                "appid": "ZJPecker",
                "cmdcode": "010001",
                "requestid": Global.UUID()
            },
            "cmddata": {
                "actionname": "TakeCard"
            }
        };
        var reqMsgStr = JSON.stringify(reqMsgObj);
        ZJPeckerComm.sendCommMsg("ZJSIMIDC", reqMsgStr);
        ZJPeckerComm.onCommMsg("ZJSIMIDC", function(resData){
            if(resData!="TIMEOUT"){
                PublicTools.log("[INFO] [userLib.js] [ZJSPTools.takeCard] [success]");
                var resInfo = JSON.parse(resData.request.data);
                var srcdata = JSON.parse(resInfo.srcdata);
                if(srcdata.resultdata.actionname=="TakeCard"){
                    if(srcdata.resultdata.eventid=="end"){
                        callback(true);
                    }else{
                        callback(false);
                    }
                }
            }else{
                PublicTools.log("[ERROR] [userLib.js] [ZJSPTools.takeCard] [error, timeout]");
                callback(false);
            }
        });
    },

    takeCardRequest : function(){
        PublicTools.log("[INFO] [userLib.js] [ZJSPTools.takeCardRequest] [begin]");
        var reqMsgObj = {
            "head": {
                "appid": "ZJPecker",
                "cmdcode": "010001",
                "requestid": Global.UUID()
            },
            "cmddata": {
                "actionname": "TakeCard"
            }
        };
        return JSON.stringify(reqMsgObj);
    },

    inputPWD : function(keyValue,callback){
        PublicTools.log("[INFO] [userLib.js] [ZJSPTools.inputPWD] [keyValue="+keyValue+"]");
        var reqMsgObj = {
            "head": {
                "appid": "ZJPecker",
                "cmdcode": "010001",
                "requestid": Global.UUID()
            },
            "cmddata": {
                "actionname": "InputPassword",
                "actiondata": {
                    "encdata": keyValue
                }
            }
        };
        var reqMsgStr = JSON.stringify(reqMsgObj);
        ZJPeckerComm.sendCommMsg("ZJSIMPIN", reqMsgStr);
        ZJPeckerComm.onCommMsg("ZJSIMPIN", function(resData){
            PublicTools.log("[INFO] [userLib.js] [ZJSPTools.inputPWD] [receive begin]");
            try{
                if(resData!="TIMEOUT"){
                    PublicTools.log("[INFO] [userLib.js] [ZJSPTools.inputPWD] [receive,success]");
                    var resInfo = JSON.parse(resData.request.data);
                    var srcdata = JSON.parse(resInfo.srcdata);
                    if(srcdata.resultdata.eventtype=="end"){
                        if(srcdata.resultdata.eventid=="InputPassword_Ok"){
                            callback(true);
                        }
                    }
                }else{
                    PublicTools.log("[ERROR] [userLib.js] [ZJSPTools.inputPWD] [receive,error, timeout]");
                    callback(false);
                }
            }catch(ex){
                PublicTools.log("[ERROR] [userLib.js] [ZJSPTools.inputPWD] [receive, catch ex="+ex+"]");
            }
        },1000000);
    },

    inputPWDRequest : function(keyValue){
        PublicTools.log("[INFO] [userLib.js] [ZJSPTools.inputPWD] [keyValue="+keyValue+"]");
        var reqMsgObj = {
            "head": {
                "appid": "ZJPecker",
                "cmdcode": "010001",
                "requestid": Global.UUID()
            },
            "cmddata": {
                "actionname": "InputPassword",
                "actiondata": {
                    "encdata": keyValue
                }
            }
        };
        return JSON.stringify(reqMsgObj);
    },

    takeCash : function(callback){
        PublicTools.log("[INFO] [userLib.js] [ZJSPTools.takeCash] [begin]");
        var reqMsgObj = {
            "head": {
                "appid": "ZJPecker",
                "cmdcode": "010001",
                "requestid": Global.UUID()
            },
            "cmddata": {
                "actionname": "TakeAwayCash"
            }
        };
        var reqMsgStr = JSON.stringify(reqMsgObj);
        ZJPeckerComm.sendCommMsg("ZJSIMIDC", reqMsgStr);
        ZJPeckerComm.onCommMsg("ZJSIMIDC", function(resData){
            PublicTools.log("[INFO] [userLib.js] [ZJSPTools.takeCash] [receive, begin]");
            try{
                if(resData!="TIMEOUT"){
                    PublicTools.log("[INFO] [userLib.js] [ZJSPTools.takeCash] [receive, success]");
                    var resInfo = JSON.parse(resData.request.data);
                    var srcdata = JSON.parse(resInfo.srcdata);
                    if(srcdata.cmddata.actionname=="TakeAwayCash_Ok"){
                        callback(true);
                    }
                }else{
                    PublicTools.log("[ERROR] [userLib.js] [ZJSPTools.takeCash] [error, timeout]");
                    callback(false);
                }
            }catch(ex){
                PublicTools.log("[INFO] [userLib.js] [ZJSPTools.takeCash] [receive, catch ex="+ex+"]");
            }
        },1000000);
    }
};
