/**
 * Created by Chance on 16/11/14.
 */

var io = require("socket.io-client");
var test = io.connect("http://localhost:8080/test");
var i = 0;
test.on("connect", function () {
    console.log("connect");
});
test.on('message', function (data) {
    console.log(data.toString());
    test.emit("message", "I'm fine, thanks!");
});
test.on('disconnect', function () {
    console.log("disconnect");
});
//
test.on("test2", function (data) {
    console.log(data.hello);
    test.emit("test1", {my: "data" + i});
    i++;
});
////
//test.on("setName", function (name, fn) {
//    console.log(name);
//    fn("李四", "王五");
//});
//
//test.emit("QueryCaseLib", "queryCaseLib", function (result) {
//    console.log(result);
//});

setTimeout(function(){test.disconnect()}, 5000);

//var chat = io.connect('http://localhost:80/chat')
//    , news = io.connect('http://localhost:80/news');
//
//chat.on('connect', function () {
//    //chat.emit('hi!');
//    console.log("connect");
//});
//chat.on('a message', function(data){
//    console.log(data);
//});
//
//news.on('connect',function () {
//    //chat.emit('hi!');
//    console.log("connect");
//});
//news.on('item', function(data){
//    console.log(data);
//});