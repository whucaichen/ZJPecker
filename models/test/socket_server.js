/**
 * Created by Chance on 16/11/14.
 */

var http = require("http");
var io = require("socket.io");
//var server = http.createServer(function (req, res) {
//    res.writeHead(200, {"Content-type": "text/html"});
//    res.end('<h1>Hello World</h1>');
//});
//server.listen(8080);
//var socket = io.listen(server);
var socket = io.listen(8080);
socket.on("connect", function (socket) {
    var client_ip = socket.request.connection.remoteAddress;
    console.log(client_ip + "(" + new Date().toLocaleString() + ")" + socket.id + " connected.");
    socket.write("how are you?");

    socket.on('message', function (data) {
        console.log(client_ip + "(" + new Date().toLocaleString() + ") :" + data);
    });
    socket.on('disconnect', function () {
        console.log(client_ip + "(" + new Date().toLocaleString() + ") :" + " disconnect.");
    });
    var i = 0;
    socket.emit("test2", {hello: "hello" + i});
    socket.on("test1", function (data) {
        console.log("receive a message: %j", data);
        i++;
        if (i < 5)
            socket.emit("test2", {hello: "hello" + i});
    });
    socket.emit("setName", "张三", function (data1, data2) {
        console.log(data1);
        console.log(data2);
    });
    socket.on("setName1", function (name, fn) {
        console.log(name);
        fn("lisi", "wangwu");
    });
});