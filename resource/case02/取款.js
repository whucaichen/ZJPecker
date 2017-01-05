
///////////////////////////////////////////////////////////////////////////
//
//					Self Action Begin 
//
//					自定义控件Action 
//
///////////////////////////////////////////////////////////////////////////

/*[插卡]----------------------------------------------*/
Global.Include("userLib.js");
function EntryAction(){
    PublicTools.log("[INFO] [InsertCard.js] [EntryAction] [begin]");
    ZJSPTools.sendCommMsg("ZJSIMIDC",ZJSPTools,insertCardRequest("VisaCard"));
    ZJSPTools.waitResponse("CardInsert_OK",function(data){
        if(data==true){
            checkNextPage1();
        }else{
            ErrorHandle();
        }
    });

    // ZJSPTools.waitEvent("ZJSIMPIN","WaitForPINInput",function(){
    //     checkNextPage1();
    // });
}

function ErrorHandle(){
    PublicTools.log("[INFO] [InsertCard.js] [ErrorHandle] [begin]");
    ErrorHandle = function(){};
    PublicTools.errorCheck(function(data){
        PublicTools.log("[INFO] [InsertCard.js] [ErrorHandle] [data="+data+"]");
        if(data=="timeout"){
            changeStatus("TimeoutError");
        }else if(data==true){
            ZJSPTools.sendCommMsg("ZJSIMIDC",ZJSPTools,takeCardRequest());
            ZJSPTools.waitResponse("TakeCard",function(data){
                if(data=="timeout"){
                    changeStatus("TimeoutError");
                }else if(data==true){
                    checkInitPage();
                }else if(data==false){
                    changeStatus("FlaseError");
                }
            });
            ZJPageTools.pageCheck(UserNameList.ZJPeckerClientId,2000,5,["友情提示"],function(data){
                PublicTools.log("[INFO] [InsertCard.js] [ErrorHandle] [callback,data="+data+"]");
                if(data=="timeout"){
                    changeStatus("TimeoutError");
                }else if(data==true){
                    checkInitPage();
                }else if(data==false){
                    changeStatus("FlaseError");
                }
            });
        }else if(data==false){
            changeStatus("FlaseError");
        }
    });
}

function checkInitPage(){
    ZJPageTools.pageCheck(UserNameList.ZJPeckerClientId,2000,5,["无卡取款","无卡存款"],function(data){
        PublicTools.log("[INFO] [InsertCard.js] [checkInitPage] [callback,data="+data+"]");
        if(data=="timeout"){
            changeStatus("TimeoutError");
        }else if(data==true){
            changeStatus("TrueError");
        }else if(data==false){
            changeStatus("FlaseError");
        }
    });
}

//友情提示
function checkNextPage1(){
    PublicTools.log("[INFO] [InsertCard.js] [checkNextPage1] [begin]");
    checkNextPage1 = function(){
        PublicTools.log("[INFO] [InsertCard.js] [checkNextPage1] [is null function]");
    };

    ZJPageTools.pageCheck(UserNameList.ZJPeckerClientId,2000,5,["友情提示"],function(data){
        PublicTools.log("[INFO] [InsertCard.js] [checkNextPage1] [callback,data="+data+"]");
        if(data==true){
            InsertCardClick();
        }else{
            ZJPeckerData.setData("InsertCardErrorFlag",true);
            ErrorHandle();
        }
    });
}

function InsertCardClick(){
    PublicTools.log("[INFO] [InsertCard.js] [InsertCardClick] [begin]");
    var flag = true;
    ZJPageTools.click("atmclient","确认",function(data){
        PublicTools.log("[INFO] [InsertCard.js] [InsertCardClick] [callback,data="+data+"]");
        if(flag){
            flag = false;
            if(data==true){
                checkNextPage2();
            }else{
                ErrorHandle();
            }
        }
    });

    ZJSPTools.waitNotice("ZJSIMPIN","WaitForPINInput",function(data){
        if(flag){
            flag = false;
            if(data==true){
                checkNextPage2();
            }
        }
    });
}

function checkNextPage2(){
    checkNextPage2 = function(){};
    ZJPageTools.pageCheck(UserNameList.ZJPeckerClientId,2000,10,["请输入密码"],function(data){
        PublicTools.log("[INFO] [InsertCard.js] [checkNextPage_temp2] [callback,data="+data+"]");
        if(data==true){
            changeStatus("OK");
        }else{
            ErrorHandle();
        }
    });
}
/*[超时错误]----------------------------------------------*/
Global.Include("userLib.js");
function EntryAction(){
    PublicTools.log("[INFO] [TimeoutError.js] [EntryAction] [begin]");
    ZJPeckerTestCase.setCaseResult("NOK");
    changeStatus("DONE");
}
/*[初始化状态检查]----------------------------------------------*/
Global.Include("userLib.js");
function EntryAction(){
    PublicTools.log("[INFO] [InitStateCheck.js] [EntryAction] [begin]");
    ZJPageTools.pageCheck(UserNameList.ZJPeckerClientId,2000,10,["无卡取款","无卡存款"],function(data){
        PublicTools.log("[INFO] [InitStateCheck.js] [EntryAction] [callback,data="+data+"]");
        if(data==true){
            changeStatus("OK");
        }else{
        	ErrorHandler();
        }
    });
}

function ErrorHandler(){
	changeStatus("Error");
}
/*[错误1]----------------------------------------------*/
Global.Include("userLib.js");
function EntryAction(){
    PublicTools.log("[INFO] [TrueError.js] [EntryAction] [begin]");
    ZJPeckerTestCase.setCaseResult("NOK");
    changeStatus("DONE");
}
/*[错误2]----------------------------------------------*/
Global.Include("userLib.js");
function EntryAction(){
    PublicTools.log("[INFO] [FlaseError.js] [EntryAction] [begin]");
    ZJPeckerTestCase.setCaseResult("NOK");
    changeStatus("DONE");
}
/*[输入密码]----------------------------------------------*/
Global.Include("userLib.js");
function EntryAction(){
    PublicTools.log("[INFO] [InputPWD.js] [EntryAction] [begin]");
    ZJSPTools.sendCommMsg("ZJSIMPIN",ZJSPTools,inputPWDRequest("1|1|1|1|1|1"));
    ZJSPTools.waitResponse("InputPassword_Ok",function(data){
        if(data){
            checkNextPage();
        }else{
            ErrorHandle();
        }
    });
}

function checkNextPage(){
    PublicTools.log("[INFO] [InputPWD.js] [checkNextPage] [begin]");
    ZJPageTools.pageCheck(UserNameList.ZJPeckerClientId,2000,10,["取款","存款","查询余额","转账","查询明细"],function(data){
        PublicTools.log("[INFO] [InputPWD.js] [checkNextPage] [callback,data="+data+"]");
        if(data){
            changeStatus("OK");
        }else{
            ErrorHandle();
        }
    });
}

function ErrorHandle(){
    PublicTools.log("[INFO] [InputPWD.js] [ErrorHandle] [begin]");
    ErrorHandle = function(){};
    PublicTools.errorCheck(function(data){
        PublicTools.log("[INFO] [InputPWD.js] [ErrorHandle] [data="+data+"]");
        if(data=="timeout"){
            changeStatus("TimeoutError");
        }else if(data==true){
            ZJSPTools.sendCommMsg("ZJSIMIDC",ZJSPTools,takeCardRequest());
            ZJSPTools.waitResponse("TakeCard",function(data){
                if(data=="timeout"){
                    changeStatus("TimeoutError");
                }else if(data==true){
                    checkInitPage();
                }else if(data==false){
                    changeStatus("FlaseError");
                }
            });
            ZJPageTools.pageCheck(UserNameList.ZJPeckerClientId,2000,5,["友情提示"],function(data){
                PublicTools.log("[INFO] [InputPWD.js] [ErrorHandle] [callback,data="+data+"]");
                if(data=="timeout"){
                    changeStatus("TimeoutError");
                }else if(data==true){
                    checkInitPage();
                }else if(data==false){
                    changeStatus("FlaseError");
                }
            });
        }else if(data==false){
            changeStatus("FlaseError");
        }
    });
}

function checkInitPage(){
    ZJPageTools.pageCheck(UserNameList.ZJPeckerClientId,2000,5,["无卡取款","无卡存款"],function(data){
        PublicTools.log("[INFO] [InputPWD.js] [checkInitPage] [callback,data="+data+"]");
        if(data=="timeout"){
            changeStatus("TimeoutError");
        }else if(data==true){
            changeStatus("TrueError");
        }else if(data==false){
            changeStatus("FlaseError");
        }
    });
}
/*[完成]----------------------------------------------*/
Global.Include("userLib.js");
function EntryAction(){
    PublicTools.log("[INFO] [done.js] [EntryAction] [begin]");
    ZJPeckerTestCase.setCaseResult("OK");
    changeStatus("DONE");
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

