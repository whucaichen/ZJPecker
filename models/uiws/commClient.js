/**
 * Created by Chance on 16/11/17.
 */

var TAG = "[commClient.js]: ";
var net = require('net');
var crypt = require('../utils/crypt');
var options = {
    port: 60001,
    // host: "10.34.10.223"
    host: "10.34.10.245"
};
function CommData(logindata) {
    this.msgid = logindata.msgid;
    this.msgtype = logindata.msgtype;
    this.processid = logindata.processid;
    this.request = logindata.request || {};

    this.request.loginid = logindata.request.loginid;
    this.request.logoutid = logindata.request.logoutid;

    this.request.destinationid = logindata.request.destinationid;
    this.request.datatype = logindata.request.datatype || "json";
    this.request.data = logindata.request.data;

    this.request.masterkey = logindata.request.masterkey;
    this.request.mastercode = logindata.request.mastercode;
    this.request.mackey = logindata.request.mackey;
    this.request.maccode = logindata.request.maccode;
}

var client = new net.Socket();
// client.setEncoding("hex");
client.connect(options, function () {
    console.log(TAG, 'CONNECTED TO: ' + options.host + ":" + options.port);
    send(loginData);
});
client.on('data', function (data) {
    var iconv = require('iconv-lite');
    var jschardet = require("jschardet");
    data = data.toString("binary").substr(4, data.length - 20);
    var encoding = jschardet.detect(data).encoding;
    try {
        // data = iconv.decode(data, encoding);
        data = iconv.decode(data, "gbk");
        // console.error(encoding, data);
        data = JSON.parse(data);
        (data.processid == "login") && process.send("login");
        (data.processid == "senddata") && process.send(data);
    } catch (e) {
        console.error(e.stack);
    }
    // var str = data.toString("ascii").substr(4);
    // console.error(TAG, str);
    // process.send(str);
});
// 为客户端添加“close”事件处理函数
client.on('close', function () {
    console.log(TAG, 'Connection closed');
    send(logoutData);
});

//监听主线程消息
process.on('message', function (msg) {
    msg.dst ? sendComm(msg.dst, msg.data) : send(msg);    //发送
    //console.log(TAG, msg);
    //if (!msg.body) {
    //    return;
    //}
    //switch (msg.body.processid) {
    //    case "login":
    //    case "senddata":
    //        sendComm(msg.body);
    //        break;
    //    default:
    //        console.log(TAG, "异常的CommServer操作");
    //}
});
// process.send("Comm Server is properly functioning!");

var send = function (data) {
    var uuid = crypt.getUuid(32, 16);
    var chkHex = crypt.Mac_919(uuid, null, crypt.getHexStr(JSON.stringify(data)));
    var srcData = new Buffer(JSON.stringify(data));
    var chkData = new Buffer(chkHex);
    var lenData = crypt.int2byte(srcData.length + chkData.length);

    var dstData = new Buffer(lenData.length + srcData.length + chkData.length);
    lenData.copy(dstData);
    dstData.write(JSON.stringify(data) + chkHex, lenData.length);

    client.write(dstData);
};

var sendComm = function (target, data) {
    var commData = new CommData({
        msgid: crypt.getUuid(32, 16),
        msgtype: "request",
        processid: "senddata",
        request: {
            destinationid: target,
            datatype: "json",
            data: data
        }
    });
    send(commData);
};

var loginData = new CommData({
    msgid: crypt.getUuid(32, 16),
    msgtype: "request",
    processid: "login",
    request: {
        loginid: "Chance",
        masterkey: crypt.getUuid(32, 16),
        mastercode: crypt.getUuid(32, 16),
        mackey: crypt.getUuid(32, 16),
        maccode: crypt.getUuid(32, 16)
    }
});

var logoutData = new CommData({
    msgid: crypt.getUuid(32, 16),
    msgtype: "request",
    processid: "Logout",
    request: {
        logoutid: "Chance"
    }
});

