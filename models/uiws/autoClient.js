/**
 * Created by Chance on 16/11/17.
 */

var TAG = "[autoClient.js](" + new Date().toLocaleTimeString() + "): ";
var net = require('net');
var ExBuffer = require('ExBuffer');
var iconv = require('iconv-lite');
var jschardet = require("jschardet");
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

var client = null;
var startClient = function () {
    console.log(TAG, loginid, targetid);
    var exBuffer = new ExBuffer();
    client = new net.Socket();
    client.connect(options, function () {
        send(loginData());
        console.log(TAG, 'CONNECTED TO: ' + options.host + ":" + options.port);
    });
    // client.on('data', function (data) {
    //     data = data.toString("binary").substr(4, data.length - 20);
    //     var encoding = jschardet.detect(data).encoding;
    //     // data = iconv.decode(data, encoding);
    //     data = iconv.decode(data, "gbk");
    //     console.error(TAG, encoding, data);
    //     sendComm(targetid, data); //此处为自定义的回复报文
    // });
    client.on('data', function (chunk) {
        exBuffer.put(chunk);
    });
    //当客户端收到完整的数据包时
    exBuffer.on('data', function (buffer) {
        if (buffer.length === 0) return;
        console.log(TAG, "buffer.length", buffer.length);
        var encoding = jschardet.detect(buffer).encoding;
        (encoding !== "utf8" || encoding !== "utf-8") && (buffer = iconv.decode(buffer, "gbk"));
        var data = buffer.toString("binary");
        data = data.substr(0, data.length - 16);
        console.error(TAG, encoding, data);
        // sendComm(targetid, data); //此处为自定义的回复报文
        try {
            data = JSON.parse(data);
        } catch (e) {
            console.error(TAG, e.stack);
        }
    });
    client.on('close', function () {
        console.log(TAG, 'Connection closed');
        send(logoutData());
    });
};

var send = function (data) {
    data = JSON.stringify(data);
    var uuid = crypt.getUuid(32, 16);
    var chkHex = crypt.Mac_919(uuid, null, crypt.getHexStr(data));
    var srcData = iconv.encode(data, "gbk");
    // var srcData = new Buffer(data);
    var chkData = new Buffer(chkHex);
    var lenData = crypt.int2byte(srcData.length + chkData.length);

    var dstData = new Buffer(lenData.length + srcData.length + chkData.length);
    lenData.copy(dstData);
    srcData.copy(dstData, lenData.length);
    chkData.copy(dstData, lenData.length + srcData.length);
    // dstData.write(data + chkHex, lenData.length);

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

var loginid = process.argv[2] || crypt.getUuid(32, 16);
var targetid = process.argv[3] || "Chance";
var loginData = function () {
    return new CommData({
        msgid: crypt.getUuid(32, 16),
        msgtype: "request",
        processid: "login",
        request: {
            loginid: loginid,
            masterkey: crypt.getUuid(32, 16),
            mastercode: crypt.getUuid(32, 16),
            mackey: crypt.getUuid(32, 16),
            maccode: crypt.getUuid(32, 16)
        }
    });
};

var logoutData = function () {
    new CommData({
        msgid: crypt.getUuid(32, 16),
        msgtype: "request",
        processid: "Logout",
        request: {
            logoutid: loginid
        }
    });
};

startClient();

