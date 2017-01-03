/**
 * Created by Chance on 16/11/18.
 */
var vm = require("vm");
var fs = require("fs");
var rd = require("rd");
var path = require("path");
var unzip = require("unzip");
var AdmZip = require('adm-zip');
var yauzl = require("yauzl");
var zlib = require('zlib');
var iconv = require('iconv-lite');
var jschardet = require("jschardet");
var unzipCN = require('unzip-zhcn');
var unzipMbcs = require("unzip-mbcs");
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

// var p = 5;
// global.p = 11;
// var script = fs.readFileSync("./testJson.js", 'utf-8');
// vm.runInThisContext("console.log('ok', p)");// 显示global下的11
// console.log(p);// 显示5
// vm.runInThisContext(script);
// // console.log(func(1, 2));

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

// var log = new require("../utils/logFile").log("hello");
// console.log(path.join(__dirname, "../../"));
// console.log(path.resolve(__dirname, "../../"));
// var string = "1 projectVCX projectV1 pro1x pro2 prox4 prox3 prox2 prox1";
// var strs = string.trim().split(/\s+/);
// // console.log(strs);
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
// console.log(d.toLocaleString());
// console.log("" + d.getFullYear() + (d.getMonth() + 1) + d.getDate());

// console.log(Math.round(Math.random() * 100 / 10));
// var json = {a: {b: "\tb"}};
// console.log(json.a.b);