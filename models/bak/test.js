///////////////////////////////////////////////////////////////////////////
//
//					Self Action Begin 
//
//					自定义控件Action 
//
///////////////////////////////////////////////////////////////////////////

/*[CheckResult]----------------------------------------------*/
function EntryAction() {
    var cardNum = ZJPeckerData.getData("cardNum");
    console.log("[CheckResult]: " + cardNum);
    console.log("OK");
    changeStatus("OK");
}

/*[EjectCard]----------------------------------------------*/

/*[InputPassword]----------------------------------------------*/
var uuid = UUID();
function EntryAction() {
    var traceLevel = uuid;
    var traceContent = {
        "msgid": "abcdef0123456789",
        "msgtype": "request",
        "processid": "login",
        "request": {
            "loginid": "ZJPecker"
        }
    };
    ZJPeckerTrace.appTrace(traceLevel, traceContent, onPINSPMessage);
    changeStatus("RESERVE");
}
function onPINSPMessage(err, resMessage) {
    console.log(JSON.stringify(resMessage));
    console.log("InputPassword_Ok");
    changeStatus("InputPassword_Ok");
}

/*[InsertCard]----------------------------------------------*/
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
    ZJPeckerComm.onCommMsg("ZJSIMIDC", onPINSPMessage);
    changeStatus("RESERVE");
}
function onPINSPMessage(resMessage) {
    console.log(JSON.stringify(resMessage));
    console.log("CardInsert_OK");
    changeStatus("CardInsert_OK");
}

/*[PressInquery]----------------------------------------------*/
var uuid = UUID();
function EntryAction() {
    var cardNum = uuid;
    console.log("[PressInquery]: " + cardNum);
    ZJPeckerData.setData("cardNum", cardNum);
    console.log("clickOk");
    changeStatus("clickOk");
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

