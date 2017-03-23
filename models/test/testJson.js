/**
 * Created by Chance on 16/11/18.
 */

////json对象（Web传输
//var json = {
//    "caseId": "test0",
//    "caseCaption": "test0",
//    "caseLibId": new Date().toLocaleString()
//};
////json对象转为json形式字符串
//var jsonStr = JSON.stringify(json);
////json字符串转为json对象
// var json2 = JSON.parse(jsonStr);

// try {
//     var json2 = JSON.parse({abc:"abc"}+"ABCDEF");
//     console.log(json2);
// } catch (e) {
//     console.log(e instanceof SyntaxError);
//     console.log(e.message);
//     console.log(e.name);
//     console.log(e.filename);
//     console.log(e.lineNumber);
//     console.log(e.columnNumber);
//     console.log(e.stack);
// }
//
////json对象和打印时会自动转为字符串
//console.log(typeof json);
//console.log(json);
//console.log(typeof jsonStr);
//console.log(jsonStr);
//console.log(typeof json2);
//console.log(json2);
//
////获取json字段的值
//console.log(json.caseId);
////更改json字段的值
//json.caseId = "new";
//console.log(json.caseId);
////添加json字段
//json.newId = "newId";
//console.log(json);
////删除json字段
//delete json.caseLibId;
//console.log(json);
//
//function uuid() {
//    var s = [];
//    var hexDigits = "0123456789abcdef";
//    for (var i = 0; i < 36; i++) {
//        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
//    }
//    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
//    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
//    s[8] = s[13] = s[18] = s[23] = "-";
//
//    var uuid = s.join("");
//    return uuid;
//}
//
//var str = {"caseId": "test0","caseCaption": "test0"};
//var isJson = function (obj) {
//    return typeof(obj) === "object"
//        && Object.prototype.toString.call(obj).toLowerCase() == "[object object]"
//        && !obj.length;
//};
//console.log(isJson(str));

// console.log("haha");
// var vm = require("vm");
// vm.runInThisContext('console.log("haha");');
