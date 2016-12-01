///////////////////////////////////////////////////////////////////////////
//
//					Self Action Begin 
//
//					自定义控件Action 
//
///////////////////////////////////////////////////////////////////////////

/*[CheckResult]----------------------------------------------*/
var cardNum = ZJPeckerData.getData("cardNum");
console.log("[CheckResult]: " + cardNum);
console.log("OK");
changeStatus("OK");

/*[EjectCard]----------------------------------------------*/

/*[InputPassword]----------------------------------------------*/
var uuid = UUID();
function entryAction() {
    var traceLevel = uuid;
    var traceContent = {
        "msgid": "abcdef0123456789",
        "msgtype": "request",
        "processid": "login",
        "request": {
            "loginid": uuid
        }
    };
    ZJPeckerTrace.appTrace(traceLevel, traceContent, onPINSPMessage);
    changeStatus("RESERVE");
}
function onPINSPMessage(err, resMessage) {
    // var resMsgObj = JSON.parse(resMessage);
    // if (resMsgObj == undefine) {
    //     changeStatus("Comm_Error");
    //     return;
    // }
    // 判断SP 返回
    // if (resMsgObj.resultdata.eventid == "InputPassword_Ok")
    // {
    // 		chageState("InputPassword_Ok");
    // }else if (resMsgObj.resultdata.eventid == "InputPassword_Error" )
    // {
    // 		chageState("InputPassword_Error")
    // }else {
    // 		chageState("Comm_Error")
    // }
    console.log(JSON.stringify(resMessage));
    console.log("InputPassword_Ok");
    changeStatus("InputPassword_Ok");
}
entryAction();

/*[InsertCard]----------------------------------------------*/
var uuid = UUID();
function entryAction() {
    var cardNum = uuid;
    console.log("[InsertCard]: " + cardNum);
    ZJPeckerData.setData("cardNum", cardNum);
    console.log("CardInsert_OK");
    changeStatus("CardInsert_OK");
}
entryAction();

/*[PressInquery]----------------------------------------------*/
var uuid = UUID();
function entryAction() {
    // 查询浏览器前端当前的状态
    var reqMsgObj = {
        "msgid": "abcdef0123456789",
        "msgtype": "request",
        "processid": "login",
        "request": {
            "loginid": uuid
        }
    };
    var reqMsgStr = JSON.stringify(reqMsgObj);
    // ZJPeckerComm.sendData("client", reqMsgStr);
    // ZJPeckerComm.on("zjPeckerClient", onPINSPMessage);
    ZJPeckerComm.sendCommMsg(uuid, reqMsgObj);
    ZJPeckerComm.onCommMsg(uuid, onPINSPMessage);
    changeStatus("RESERVE");
}
function onPINSPMessage(resMessage) {
    // var resMsgObj = JSON.parse(resMessage);
    // if (resMsgObj == undefine) {
    //     changeStatus("Comm_Error");
    //     return;
    // }
    // // 判断SP 返回
    // if (resMsgObj.resdata == "0") {
    //     chageState("clickOk");
    // } else if (resMsgObj.resultdata.eventid == "-1") {
    //     chageState("clickFailed")
    // } else {
    //     chageState("Comm_Error")
    // }
    console.log(JSON.stringify(resMessage));
    console.log("clickOk");
    changeStatus("clickOk");
}
entryAction();

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

