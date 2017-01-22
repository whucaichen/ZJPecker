///////////////////////////////////////////////////////////////////////////
//
//					Self Action Begin 
//
//					自定义控件Action 
//
///////////////////////////////////////////////////////////////////////////

/*[测试成功]----------------------------------------------*/
var TAG = "[测试成功]: ";
function EntryAction() {
    ZJPeckerTestCase.setCaseResult("OK", onResult);
    ZJPeckerTrace.appTrace("INFO", "测试成功");
    console.log(TAG + "OK");
    changeStatus("OK");
}
function onResult(err, result) {
    if (err) {
        console.log(err);
        Global.LogFile().log(TAG + "测试状态更新失败");
    }
}

/*[测试错误]----------------------------------------------*/
var TAG = "[测试错误]: ";
function EntryAction() {
    ZJPeckerTestCase.setCaseResult("NG", onResult);
    ZJPeckerTrace.appTrace("INFO", "测试错误");
    console.error(TAG + "OK");
    changeStatus("OK");
}
function onResult(err, result) {
    if (err) {
        console.log(err);
        Global.LogFile().log(TAG + "测试状态更新失败");
    }
}

/*[插卡]----------------------------------------------*/
var TAG = "[插卡]: ";
function EntryAction() {
    var InsertCardByType = {
        "head": {
            "appid": "ZJPecker",
            "cmdcode": "010001",
            "requestid": " FE09875DCA453345FE09875DCA453345"
        },
        "cmddata": {
            "actionname": "InsertCardByType",
            "actiondata": {
                "cardtype": "VisaCard"
            }
        }
    };
    ZJPeckerComm.sendCommMsg("ZJSIMIDC", InsertCardByType);
    ZJPeckerComm.onCommMsg("ZJSIMIDC", onResult);
    changeStatus("RESERVE");
}
function onResult(msg) {
    if (msg === "TIMEOUT") {
        Global.LogFile().log(TAG + "消息超时");
        ZJPeckerTrace.appTrace("INFO", "消息超时[插卡]");
        console.log(TAG + "TIMEOUT");
        changeStatus("Error");
        return;
    }
    console.log(JSON.stringify(msg));
    console.log(TAG + "OK");
    changeStatus("OK");
}

/*[初始化IDC]----------------------------------------------*/
var TAG = "[初始化IDC]: ";
console.error(TAG, Global.getCasePath());
function EntryAction() {
    var SetModuleStatus_IDC = {
        "head": {
            "appid": "ZJPecker",
            "cmdcode": "010001",
            "requestid": " FE09875DCA453345FE09875DCA453345"
        },
        "cmddata": {
            "actionname": "SetModuleStatus",
            "actiondata": {
                "modulename": "IDC",
                "statusdata": {
                    "fwDevice": "WFS_IDC_DEVONLINE",
                    "fwMedia": "WFS_IDC_MEDIAPRESENT",
                    "fwRetainBin": "WFS_IDC_RETAINBINOK",
                    "fwSecurity": "WFS_IDC_SECOPEN",
                    "usCards": 0,
                    "fwChipPower": "WFS_IDC_CHIPONLINE"
                }
            }
        }
    };
    // var SetModuleStatus_IDC = "中文乱码";
    ZJPeckerComm.sendCommMsg("Chance1", SetModuleStatus_IDC);
    ZJPeckerComm.onCommMsg("Chance1", onResult);
    changeStatus("RESERVE");
}
function onResult(msg) {
    if (msg === "TIMEOUT") {
        Global.LogFile().log(TAG + "消息超时");
        ZJPeckerTrace.appTrace("INFO", "消息超时[初始化IDC]");
        console.log(TAG + "TIMEOUT");
        changeStatus("Error");
        // changeStatus("OK");
        return;
    }
    console.error(JSON.stringify(msg));
    console.log(TAG + "OK");
    changeStatus("OK");
}

/*[初始化PIN]----------------------------------------------*/
var TAG = "[初始化PIN]: ";
function EntryAction() {
    var SetModuleStatus_PIN = {
        "head": {
            "appid": "ZJPecker",
            "cmdcode": "010001",
            "requestid": " FE09875DCA453345FE09875DCA453345"
        },
        "cmddata": {
            "actionname": "SetModuleStatus",
            "actiondata": {
                "modulename": "PIN",
                "statusdata": {
                    "fwDevice": "WFS_PIN_DEVONLINE",
                    "fwEncStat": "WFS_PIN_ENCREADY"
                }
            }
        }
    };
    ZJPeckerComm.sendCommMsg("Chance2", SetModuleStatus_PIN);
    ZJPeckerComm.onCommMsg("Chance2", onResult);
    changeStatus("RESERVE");
}
function onResult(msg) {
    if (msg === "TIMEOUT") {
        Global.LogFile().log(TAG + "消息超时");
        ZJPeckerTrace.appTrace("INFO", "消息超时[初始化PIN]");
        console.error(TAG + "TIMEOUT");
        changeStatus("Error");
        return;
    }
    console.log(JSON.stringify(msg));
    console.log(TAG + "OK");
    changeStatus("OK");
}

/*[交易选择]----------------------------------------------*/
var TAG = "[交易选择]: ";
function EntryAction() {
    var click = {
        "head": {
            "cmdCode": "010001",
            "requestId": "1000010101010101010",
            "tranTime": "2016-08-30 14:36:20"
        },
        "body": {
            "type": "1",
            "fromId": "aa",
            "destination": "atmclient",
            "action": "click",
            "clickName": "确认"
        }
    };
    ZJPeckerComm.sendCommMsg("client", click);
    ZJPeckerComm.onCommMsg("client", onResult);
    changeStatus("RESERVE");
}
function onResult(msg) {
    if (msg === "TIMEOUT") {
        Global.LogFile().log(TAG + "消息超时");
        ZJPeckerTrace.appTrace("INFO", "消息超时[交易选择]");
        console.log(TAG + "TIMEOUT");
        changeStatus("Error");
        return;
    }
    console.log(JSON.stringify(msg));
    console.log(TAG + "OK");
    changeStatus("OK");
}

/*[密码输入]----------------------------------------------*/
var TAG = "[密码输入]: ";
function EntryAction() {
    var InputPassword = {
        "head": {
            "appid": "ZJPecker",
            "cmdcode": "010001",
            "requestid": " FE09875DCA453345FE09875DCA453345"
        },
        "cmddata": {
            "actionname": "InputPassword",
            "actiondata": {
                "encdata": "7|5|9|4|F2|3|4"
            }
        }
    };
    ZJPeckerComm.sendCommMsg("ZJSIMPIN", InputPassword);
    ZJPeckerComm.onCommMsg("ZJSIMPIN", onResult);
    changeStatus("RESERVE");
}
function onResult(msg) {
    if (msg === "TIMEOUT") {
        Global.LogFile().log(TAG + "消息超时");
        ZJPeckerTrace.appTrace("INFO", "消息超时[密码输入]");
        console.log(TAG + "TIMEOUT");
        changeStatus("Error");
        return;
    }
    console.log(JSON.stringify(msg));
    console.log(TAG + "OK");
    changeStatus("OK");
}

/*[退卡]----------------------------------------------*/
var TAG = "[退卡]: ";
function EntryAction() {
    var TakeCard = {
        "head": {
            "appid": "ZJPecker",
            "cmdcode": "010001",
            "requestid": " FE09875DCA453345FE09875DCA453345"
        },
        "cmddata": {
            "actionname": "TakeCard",
            "actiondata": {}
        }
    };
    ZJPeckerComm.sendCommMsg("ZJSIMIDC", TakeCard);
    ZJPeckerComm.onCommMsg("ZJSIMIDC", onResult);
    changeStatus("RESERVE");
}
function onResult(msg) {
    if (msg === "TIMEOUT") {
        Global.LogFile().log(TAG + "消息超时");
        ZJPeckerTrace.appTrace("INFO", "消息超时[退卡]");
        console.log(TAG + "TIMEOUT");
        changeStatus("Error");
        return;
    }
    console.log(JSON.stringify(msg));
    console.log(TAG + "OK");
    changeStatus("OK");
}

/*[页面显示]----------------------------------------------*/
var TAG = "[页面显示]: ";
function EntryAction() {
    var getHtml = {
        "head": {
            "cmdCode": "010001",
            "requestId": "1000010101010101010",
            "tranTime": "2016-08-30 14:36:20"
        },
        "body": {
            "type": "1",
            "fromId": "aa",
            "destination": "atmclient",
            "action": "getHtml"
        }
    };
    ZJPeckerComm.sendCommMsg("client", getHtml);
    ZJPeckerComm.onCommMsg("client", onResult);
    changeStatus("RESERVE");
}
function onResult(msg) {
    if (msg === "TIMEOUT") {
        Global.LogFile().log(TAG + "消息超时");
        ZJPeckerTrace.appTrace("INFO", "消息超时[页面显示]");
        console.log(TAG + "TIMEOUT");
        changeStatus("Error");
        return;
    }
    console.log(JSON.stringify(msg));
    console.log(TAG + "OK");
    changeStatus("OK");
}


///////////////////////////////////////////////////////////////////////////
//
//					Assembled Action Begin 
//
//					子流程 Action 
//
///////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////
//
//					Main WorkFlow Action Begin 
//
//					主流程 Action
//
///////////////////////////////////////////////////////////////////////////

