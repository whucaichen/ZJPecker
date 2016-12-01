/**
 * Created by Chance on 16/11/17.
 */

var TAG = "[Comm.js]: ";
var net = require('net');
var Mac_919 = require('../encrypt/Mac_919');
var encrypt = new Mac_919();
var options = {
    port: 60001,
    //host: "10.32.4.15"
    host: "10.34.10.223"
    //host: "10.34.10.130"
};
function LoginData(logindata) {
    this.msgid = logindata.msgid;
    this.msgtype = logindata.msgtype;
    this.processid = logindata.processid;
    this.request = logindata.request || {};
    this.request.loginid = logindata.request.loginid;
    this.request.destinationid = logindata.request.destinationid;
    this.request.datatype = logindata.request.datatype || "json";
    this.request.loginid = logindata.request.loginid;

    this.request.masterkey = logindata.request.masterkey;
    this.request.mastercode = logindata.request.mastercode;
    this.request.mackey = logindata.request.mackey;
    this.request.maccode = logindata.request.maccode;
};

var client = new net.Socket();
client.connect(options, function () {
    console.log(TAG + 'CONNECTED TO: ' + options.host + ":" + options.port);
    //send(logindata);
});
client.on('data', function (data) {
    // console.log(TAG + 'DATA: ' + data);
    // process.send(data);
    var str = data.toString("ascii").substr(4);
    // console.log(TAG + str);
    process.send(str);
});
// 为客户端添加“close”事件处理函数
client.on('close', function () {
    console.log(TAG + 'Connection closed');
});

//监听主线程消息
process.on('message', function (msg) {
    //console.log(TAG + msg);
    send(msg);
    //if (!msg.body) {
    //    return;
    //}
    //switch (msg.body.processid) {
    //    case "login":
    //    case "senddata":
    //        sendComm(msg.body);
    //        break;
    //    default:
    //        console.log(TAG + "异常的CommServer操作");
    //}
});
process.send("Comm Server is properly functioning!");

var send = function (data) {
    var uuid = encrypt.getUuid(32, 16);
    var chkHex = encrypt.Mac_919(uuid, null, encrypt.getHexStr(JSON.stringify(data)));
    var srcData = new Buffer(JSON.stringify(data));
    var chkData = new Buffer(chkHex);
    var lenData = encrypt.int2byte(srcData.length + chkData.length);

    var dstData = new Buffer(lenData.length + srcData.length + chkData.length);
    lenData.copy(dstData);
    dstData.write(JSON.stringify(data) + chkHex, lenData.length);

    client.write(dstData);
};

var sendComm = function (data) {
    var logindata = new LoginData({
        msgid: logindata.msgid || encrypt.getUuid(32, 16),
        msgtype: logindata.msgtype || "request",
        processid: logindata.processid,
        request: {
            loginid: logindata.request.loginid,
            destinationid: logindata.request.destinationid,
            datatype: logindata.request.datatype || "json",
            loginid: logindata.request.loginid,
            masterkey: logindata.request.masterkey,
            mastercode: logindata.request.mastercode,
            mackey: logindata.request.mackey,
            maccode: logindata.request.maccode
        }
    });
    send(logindata);
};

//process.stdin.setEncoding("utf8");
//process.stdin.on("readable", function () {
//    var chunk = process.stdin.read();
//    if (chunk !== null) {
//        switch (chunk.trim()) {
//            case "0":
//                process.exit(1);
//            case "1":
//                send(logindata);
//                break;
//            case "2":
//                send(commData);
//                break;
//            default:
//                console.log("default");
//        }
//    }
//});
//var logindata = new LoginData({
//    "msgid": encrypt.getUuid(32, 16),
//    "msgtype": "request",
//    "processid": "login",
//    "request": {
//        "loginid": "Chance"
//    }
//});
//var commData = {
//    "msgid": encrypt.getUuid(32, 16),
//    "msgtype": "request",
//    "processid": "senddata",
//    "request": {
//        "destinationid": "sfsdfasd",
//        "datatype": "json",
//        data: "我是Chance"
//        //data: {srcdata: "I'm Chance", funcname: "SendData", sourceid: "Chance"}
//    }
//};

