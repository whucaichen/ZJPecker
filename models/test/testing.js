/**
 * Created by Chance on 16/11/18.
 */
var vm = require("vm");
var fs = require("fs");
var rd = require("rd");
var path = require("path");
var unzip = require("unzip");
var iconv = require('iconv-lite');
var jschardet = require("jschardet");
var child = require("child_process");

//var crypt = require('./../utils/crypt');
//var utils = new crypt();
//
//var uuid = utils.getUuid(32, 16);
//console.log(uuid);
//var chkHex = utils.crypt(uuid, null, "ABCDEF");
//console.log(chkHex);
// var b = new Buffer("abcdef");
// console.log(b);
// console.log(JSON.stringify(b));
//var h = utils.getHexStr(b);
//console.log(h);
//
//var c = "chance";
//var c1 = JSON.stringify(c);
//console.log(c + " - " + c1);var a = [];
// var a = [];
// var b = "hello";
// console.log(typeof  a);
// console.log(Array.isArray(a));
// console.log(a instanceof Array);
// console.log(typeof  b);
// console.log(Array.isArray(b));
// console.log(b instanceof Array);

// try {
//     var p = 5;
//     global.p = 11;
//     var script = fs.readFileSync("./testJson.js", 'utf-8');
//     vm.runInThisContext("console.log('ok', p)");// 显示global下的11
//     console.log(p);// 显示5
//     vm.runInThisContext(script);
// } catch (e) {
//     console.error(e.stack);
// }
// console.log(func(1, 2));

// var copyfile = function (src, dst) {
//     fs.createReadStream(src).pipe(fs.createWriteStream(dst));
// };
// console.log(typeof copyfile === "function");
// for (var i = 0; i < 40; i++) {
//     copyfile("../cfg/test.js", "../../temp/test" + i + ".js");
//     // copyfile("../cfg/test.xml", "../../temp/test" + i + ".xml");
// }

// var select = require('xpath.js');
// var DOMParser = require('xmldom').DOMParser;
//
// var iContent = fs.readFileSync("../cfg/index.xml", 'utf-8');
// var iDom = new DOMParser().parseFromString(iContent);
//
// var caseLib = select(iDom, "/root/CaseLib");
// var caseLibName = caseLib[0].getAttribute("name");
// var caseLibType = caseLib[0].getAttribute("type");
// var caseDeveloper = caseLib[0].getAttribute("developer");
// console.log(caseLibName, caseLibType, caseDeveloper);
//
// var caseGroup = select(iDom, "/root/CaseLib/CaseGroup");
// for (var i = 0; i < caseGroup.length; i++) {
//     var groupName = caseGroup[i].getAttribute("name");
//     // console.log(groupName);
//     var cases = select(iDom, "/root/CaseLib/CaseGroup[@name='" + groupName + "']/Case");
//     for (var j = 0; j < cases.length; j++) {
//         var CaseId = cases[j].hasChildNodes("CaseId") &&
//             cases[j].getElementsByTagName("CaseId").item(0).firstChild.toString();
//         var serialNo = cases[j].hasChildNodes("SerialNo") &&
//             cases[j].getElementsByTagName("SerialNo").item(0).firstChild.toString();
//         var caseCaption = cases[j].hasChildNodes("Caption") &&
//             cases[j].getElementsByTagName("Caption").item(0).firstChild.toString();
//         var mediaType = cases[j].hasChildNodes("MediaType") &&
//             cases[j].getElementsByTagName("MediaType").item(0).firstChild.toString();
//         var description = cases[j].hasChildNodes("Description") &&
//             cases[j].getElementsByTagName("Description").item(0).firstChild.toString();
//         var fileTitle = cases[j].hasChildNodes("FileTitle") &&
//             cases[j].getElementsByTagName("FileTitle").item(0).firstChild.toString();
//         var caseDeveloper = cases[j].hasChildNodes("Deveploper") &&
//             cases[j].getElementsByTagName("Deveploper").item(0).firstChild.toString();
//         var expectation = cases[j].hasChildNodes("Expectation") &&
//             cases[j].getElementsByTagName("Expectation").item(0).firstChild.toString();
//     }
// }

// var fileName = "E:\\ChanceData\\Desktop\\报文\\建行测试2.zip";
// var caseLibName = fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.lastIndexOf("."));
// console.log(caseLibName);
//
// var f = "E:\\Workspaces\\StormProjects\\ZJPecker\\models\\cfg\\test.js";
// fs.mkdirSync("../../resource/" + caseLibName);
// var name = f.substring(f.lastIndexOf("\\") + 1);
// fs.createReadStream(f).pipe(
//     fs.createWriteStream("../../resource/" + caseLibName + "/" + name));

// fs.writeFile("../../temp/HelloWorld.txt", "HelloWorld.txt", function (err) {
//     err ? console.log("01") : console.log("00");
// });
// fs.appendFile("../../temp/HelloWorld.txt", "\nHelloWorld.txt", function (err) {
//     err ? console.log("01") : console.log("00");
// });

// var logFile = new require("../utils/logFile");
// for (var i = 0; i < 20; i++) {
//     logFile.log("hello, world" + i);
// }
// console.log(path.join(__dirname, "../../"));
// console.log(path.resolve(__dirname, "../../"));
// var string = "1 projectVCX projectV1 pro1x pro2 prox4 prox3 prox2 prox1";
// var strs = string.trim().split(/\s+/);
// console.log(strs);
// console.log(strs.slice(1));

// rd.eachSync("../", function (f, s) {
//     console.log(f.lastIndexOf("."));
//     var folder = f.substring(0, f.lastIndexOf("\\"));
//     folder = folder.substring(folder.lastIndexOf("\\") + 1);
//     console.log(path.resolve(path.join("../", folder)));
//     console.log(folder, f.substring(0, f.lastIndexOf("\\")), f);
// });

// // console.log(undefined || null);
// var testClass = function () {
//     var i = 0;
//     this.add = function () {
//         console.log(++i);
//     };
//     return this;
// }();
// testClass.add();
// testClass.add();
// testClass.add();
// var testChild = child.fork("./testJson.js");
// setTimeout(function () {
//     console.log(testChild);
// }, 3000);


// var formatLen = function (num, length, cover) {
//     !length && (length = 0);
//     !cover && (cover = "0");
//     return ('' + num).length < length
//         ? ((new Array(length + 1)).join(cover) + num).slice(-length)
//         : '' + num;
// };
// var roundLen = function (num, length) {
//     if (typeof num != "number") return;
//     var numStr = "" + num;
//     if (numStr.indexOf(".") == -1) return num;
//     !length && (length = 0);
//     var mult = Math.pow(10, length);
//     return Math.round(num * mult) / mult;
// };
// console.log(formatLen(123, 5));
// console.log(roundLen(12.3456, 2));

// fs.createReadStream("../../temp/紫金.zip").pipe(unzip.Extract({path: "./紫金"}));

// var zip = new AdmZip("../../temp/紫金.zip");
// var zipEntries = zip.getEntries();
// zipEntries.forEach(function (zipEntry) {
//     console.log(zipEntry.name); // outputs zip entries information
//     console.log(fixZipFilename(zipEntry.name, "GB2312"));
// });

// yauzl.open("../../temp/紫金.zip", {lazyEntries: true}, function (err, zipfile) {
//     if (err) throw err;
//     zipfile.readEntry();
//     zipfile.on("entry", function (entry) {
//         if (/\/$/.test(entry.fileName)) {
//             console.log(entry.fileName);
//             zipfile.readEntry();
//             // });
//         } else {
//             console.error(entry.fileName);
//             console.error(entry);
//             zipfile.readEntry();
//         }
//     });
// });

// unzipCN.extractSync("../../temp/紫金.zip", "./紫金/", 'cp936');
// unzipMbcs.extractSync("./紫金.zip", 'cp437');

// var DecompressZip = require('decompress-zip');
// var unzipper = new DecompressZip("../../temp/紫金.zip")
// unzipper.on('error', function (err) {
//     console.log('Caught an error');
// });
// unzipper.on('list', function (files) {
//     console.log('The archive contains:');
//     console.log(files);
// });
// unzipper.list();

// function fixZipFilename(filename, encoding) {
//     encoding = encoding || 'cp437';
//     var str = iconv.decode(filename, encoding);
//     console.error(str);
//     if (str.replace(/[\u4e00-\u9fa5_a-zA-Z0-9\/\-\.]/g, '').length > 0) { //有乱码
//         str = iconv.decode(filename, 'utf-8');
//     }
//     return str;
// }

// var d = new Date();
// console.log(d);
// console.log(d.toLocaleString());
// console.log(d.toLocaleDateString());
// console.log(d.toLocaleTimeString());
// console.log("" + d.getFullYear() + (d.getMonth() + 1) + d.getDate());

// console.log(Math.round(Math.random() * 100 / 10));
// var json = {a: {b: "\tb"}};
// console.log(json.a.b);
// console.log(JSON.stringify("hello"));

// var a = null;
// var b = {a:1};
// // var c = JSON.stringify(b);
// // console.log(c);
// try {
//     console.log(JSON.parse(a));
// } catch (e) {
//     console.error(e.stack);
// }
// console.log(JSON.parse(c));

// var date = function () {
//     return new Date().toLocaleTimeString();
// };
// setInterval(function () {
//     console.log(date());
//     // console.log(new Date().toLocaleTimeString());
//     // console.log(new Date().getMilliseconds());
// }, 1000);

// var os = require('os');
// console.log(os.hostname());
// console.log(os.networkInterfaces().以太网[0].address);
// var IPv4,hostName;
// hostName=os.hostname();
// for(var i=0;i<os.networkInterfaces().eth0.length;i++){
//     if(os.networkInterfaces().en0[i].family=='IPv4'){
//         IPv4=os.networkInterfaces().en0[i].address;
//     }
// }
// console.log('----------local IP: '+IPv4);
// console.log('----------local host: '+hostName);
// console.log("haha\\xixi".replace("\\", "/"));

// var b = "var a = '';" + "console.log(JSON.parse(a));";
// try {
//     vm.runInThisContext(b);
// } catch (e) {
//     console.log(e.stack);
// }
// var m = 0;
// var a = [1, 2, 3, 4, 5];
// for (; m < a.length; m++) {
//     if (a[m] === 0) break;
// }
// console.log(m);

// var DB_HOST = fs.readFileSync("../settings.json", "ascii").toString();
// console.log(JSON.parse(DB_HOST)["DB_HOST"]);

// var jsdom = require("jsdom").jsdom;ion
// var document = jsdom("hello world");
// var window = document.defaultView;
//
// console.log(window.document.documentElement.outerHTML);
// // output: "<html><head></head><body>hello world</body></html>"
// console.log(window.innerWidth);// output: 1024
// console.log(typeof window.document.getElementsByClassName);// outputs: funct

// require("../utils/report").generateReport();
// var mime = require("../utils/mime").mime;
// console.log(mime.lookupExtension(path.extname("haha.doc")));
// console.log("haha.doc".substring("haha.doc".lastIndexOf(".")));

// var parse = require("csv-parse");
// // fs.readFile("../res/deviceInfo.csv", function (err, data) {
// fs.readFile("../res/银行设备信息明细.csv", function (err, data) {
//     data = iconv.decode(data, "gbk");
//     parse(data, function (err, data) {
//         console.log(data.toString().length, data);
//     });
// });

// var DeviceInfo = require("../db/db_device_info");
// DeviceInfo.addInfoFromCSV("../res/deviceInfo.csv", function (err, result) {
//     console.log(err, result);
// });
// DeviceInfo.getInfos({}, {}, function (err, result) {
//     // console.log(err, result);
//     finished = false;
//     return result;
// });
// var Atmap = require("../db/db_atmaps");
// Atmap.addAtmap([
//     {testClientID: "1", testClientIP: "1", machineType: "1", company: "1"},
//     {testClientID: "2", testClientIP: "2", machineType: "2", company: "2"},
//     {testClientID: "3", testClientIP: "3", machineType: "3", company: "3"}
// ], function (err, result) {
//     err && console.error(err);
// });
// Atmap.updateAtmap({testClientID: "1"}, {$set: {testClientIP: "2"}}, function (err, result) {
//     console.log(result);
// });

// var d = new Date();
// console.log(d.getMilliseconds(), d.toLocaleTimeString());
// for (var i = 0; i < 100000000; i++) {
// }
// var d = new Date();
// console.log(d.getMilliseconds(), d.toLocaleTimeString());
// var ObjectID = require('mongodb').ObjectId;
// var ProjectCase = require("../db/db_project_case");
// ProjectCase.getProjectCases2({caseProjectId: ObjectID("58b92ceed4e482212403538a")}, {}, function (err, result) {
//     if (err) {
//         console.error(TAG(), err);
//         // callback(null);
//         return;
//     }
//     var ret = [];
//     result.forEach(function (data) {
//         var temp = {
//             caseResult: data.testInfo && data.testInfo.result,
//             // projectName: global.Global.getCurrentProjectName(),
//             projectID: data.caseProjectId,
//             caseName: data.caseCaption,
//             caseId: data._id,
//             // caseParamKey: data.caseParamKey
//             caseParamInfo: data.caseParamKey
//         };
//         ret.push(temp);
//     });
//     // callback(ret);
//     console.log(ret);
// });


// var a = [1, 2, 3];
// console.log(a.length, JSON.stringify(a));
// delete a[1];
// console.log(a.length, JSON.stringify(a));

// var varCaseFilePath = "./log_test/子流程测试";
// var pre = varCaseFilePath.indexOf("/");
// var next = varCaseFilePath.lastIndexOf("/");
// console.log(varCaseFilePath.substring(pre+1, next));
// console.log(varCaseFilePath.substring(next+1));


// var script = "(function func(){" +
//     "console.log('haha');" +
//     "console.log('haha);" +
//     "console.log('haha');" +
//     "})();";
// try {
//     vm.runInThisContext(script);
// } catch (e) {
//     console.error(e.stack);
// }

// console.log(path.resolve("E:\\Workspaces\\VSProjects\\DesignPattern\\DesignPattern","../"));

// /*[基本控件1]----------------------------------------------*/
// var TAG = "[基本控件1]: ";
// function EntryAction() {
//     var msg = TAG;
//     var clientID = "IDC" + Global.getTestClientID();
//     ZJPeckerComm.sendCommMsg(clientID, msg);
//     ZJPeckerComm.onCommMsg(clientID, onResult);
//     changeStatus("RESERVE");
// }
// function onResult(msg) {
//     if (msg === "e") {
//         console.error(TAG, "error");
//         changeStatus("Error");
//         return;
//     }
//     console.log(TAG, msg);
//     changeStatus("OK");
// }
//
// /*[基本控件2]----------------------------------------------*/
// var TAG = "[基本控件2]: ";
// function EntryAction() {
//     console.log(TAG);
//     changeStatus("OK");
// }

// "" ? console.log("True") : console.log("False");

// var jsonData = {a: "aa", b: "bb", c: "cc"};
// for (var j in jsonData) {
//     console.log(j, jsonData[j]);
// }

// var params = {body:{_id1:"a"}}
// console.log(params.body._id && {_id: params.body._id} || {});
// console.log(global);

// try {
//     var haha = "haha";
//     function p() {
//         try {
//             console.log(JSON.parse(haha));
//         } catch (e) {
//             console.log(1, e.message);
//             throw new Error("案例执行异常");
//         }
//     }
//     p();
// } catch (e) {
//     console.log(2, e.message)
// }

// console.log(1 ? 1 : 0);

// var haha = require("../flow/wsapcrypt.js");
// // fs.writeFileSync("Actionlib.js", new haha().readFileSync("../res/Actionlib.zjs"));
// fs.writeFileSync("basectrl.xml", new haha().readFileSync("../res/basectrl.zjx"));

var t = child.fork("testJson.js");
setTimeout(function () {
    console.log("END");
    t.send("END");
    // process.exit(0);
}, 5000);

var AddUser = {
    "head": {
        "action": "AddUser"
    },
    "body": {
        "username": "SuperAdmin",//超级管理员，可进行所有操作
        "userinfo": {
            "username": "Admin1",
            "password": "Admin1",
            "roles": 1  //管理员，可以管理案例库和工程，增删查改普通用户
        }
    }
};
var DeleteUser = {
    "head": {
        "action": "DeleteUser"
    },
    "body": {
        "username": "SuperAdmin",
        "userinfo": {
            "username": "Admin1"
        }
    }
};
var QueryUser = {
    "head": {
        "action": "QueryUser"
    },
    "body": {
        "username": "SuperAdmin"
    }
};
var UpdateUser = {
    "head": {
        "action": "UpdateUser"
    },
    "body": {
        "username": "SuperAdmin",
        "userinfo": {
            "username": "Admin1",
            "password": "Admin2",
            "roles": 2  //默认，普通用户，只有查看状态和修改个人信息
        }
    }
};
