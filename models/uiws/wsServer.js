/**
 * Created by Chance on 16/11/14.
 */

var TAG = "[wsServer.js]: ";
var fs = require('fs');
var path = require("path");
var helper = require("./serverHelper");
var formidable = require('formidable');
var http_server = require('http').createServer(function (req, res) {
    if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
        var form = new formidable.IncomingForm();   //创建上传表单
        // form.encoding = 'utf-8';		//设置编码
        form.uploadDir = "../temp/";	 //缓存路径
        // form.multiples = true;	 //多文件上传
        form.keepExtensions = true;	 //保留后缀
        // form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

        form.parse(req, function (err, fields, files) {
            if (err) {
                console.log(err);
                res.write(err);
                res.end();
                return;
            }
            console.log(TAG, JSON.stringify(files));
            var fileName = files.upload && files.upload.name;
            if (!fileName) {
                res.end("upload data is null");
                return;
            }
            var suffix = fileName.substring(fileName.lastIndexOf("."));

            if (suffix != ".zip") {
                console.log("案例库不为'zip'格式");
                files.upload && fs.unlinkSync(files.upload.path);
                res.write("file type error, upload 'zip' instead.");
                res.end();
                return;
            }
            var newPath = form.uploadDir + fileName;
            fs.renameSync(files.upload.path, newPath);  //重命名

            res.writeHead(200, {'content-type': 'text/plain'});
            res.write("upload successfully");
            res.end();
            return;
        });
        return;
    }
    res.writeHead(200, {'content-type': 'text/html'});
    // var page = fs.readFileSync("./uiws/index.html").toString();
    // res.end(page);
    res.end(
        '<form action="/upload" enctype="multipart/form-data" method="post">' +
        '<input type="file" name="upload" multiple="multiple"><br>' +
        '<input type="submit" value="Upload">' +
        '</form>'
    );
}).listen(8080);

var socket = require('socket.io').listen(http_server);
// var socket = require('socket.io').listen(8080);

var socket_ui = socket.of("/ui")
    .on('connection', function (socket) {
        var client_ip = socket.request.connection.remoteAddress;
        console.log(TAG, getTime() + client_ip + ': ' + socket.id + " connected.");

        socket.on('message', function (data) {
            console.log(TAG, getTime() + client_ip + ': ' + data);
        });
        socket.on('disconnect', function () {
            console.log(TAG, getTime() + client_ip + ': ' + socket.id + " disconnect.");
        });

        socket.on("ImportTestCaseLib", function (params, callback) {
            console.log(TAG, getTime() + "ImportTestCaseLib--------------------------------------------------");
            console.log(params);
            helper.ImportTestCaseLib(params, callback);
        });

        socket.on("QueryCaseLib", function (params, callback) {
            console.log(TAG, getTime() + "QueryCaseLib--------------------------------------------------");
            console.log(params);
            helper.QueryCaseLib(params, callback);
        });

        socket.on("QueryCaseLibP", function (params, callback) {
            console.log(TAG, getTime() + "QueryCaseLibP--------------------------------------------------");
            console.log(params);
            helper.QueryCaseLibP(params, callback);
        });

        socket.on("DeleteCaseLib", function (params, callback) {
            console.log(TAG, getTime() + "DeleteCaseLib--------------------------------------------------");
            console.log(params);
            helper.DeleteCaseLib(params, callback);
        });

        socket.on("QueryCaseLibGroup", function (params, callback) {
            console.log(TAG, getTime() + "QueryCaseLibGroup--------------------------------------------------");
            console.log(params);
            helper.QueryCaseLibGroup(params, callback);
        });

        socket.on("QueryCaseLibDetail", function (params, callback) {
            console.log(TAG, getTime() + "QueryCaseLibDetail--------------------------------------------------");
            console.log(params);
            helper.QueryCaseLibDetail(params, callback);
        });

        socket.on("QueryCases", function (params, callback) {
            console.log(TAG, getTime() + "QueryCases--------------------------------------------------");
            console.log(params);
            helper.QueryCases(params, callback);
        });

        socket.on("QueryCaseDetail", function (params, callback) {
            console.log(TAG, getTime() + "QueryCaseDetail--------------------------------------------------");
            console.log(params);
            helper.QueryCaseDetail(params, callback);
        });

        socket.on("CreateTestProject", function (params, callback) {
            console.log(TAG, getTime() + "CreateTestProject--------------------------------------------------");
            console.log(params);
            helper.CreateTestProject(params, callback);
        });

        socket.on("DeleteTestProject", function (params, callback) {
            console.log(TAG, getTime() + "DeleteTestProject--------------------------------------------------");
            console.log(params);
            helper.DeleteTestProject(params, callback);
        });

        socket.on("QueryTestProject", function (params, callback) {
            console.log(TAG, getTime() + "QueryTestProject--------------------------------------------------");
            console.log(params);
            helper.QueryTestProject(params, callback);
        });

        socket.on("QueryTestProjectDetail", function (params, callback) {
            console.log(TAG, getTime() + "QueryTestProjectDetail--------------------------------------------------");
            console.log(params);
            helper.QueryTestProjectDetail(params, callback);
        });

        socket.on("QueryTestProjectLog", function (params, callback) {
            console.log(TAG, getTime() + "QueryTestProjectLog--------------------------------------------------");
            console.log(params);
            helper.QueryTestProjectLog(params, callback);
        });

        socket.on("Login", function (params, callback) {
            console.log(TAG, getTime() + "Login--------------------------------------------------");
            console.log(params);
            helper.Login(params, callback);
        });

        socket.on("StartTest", function (params, callback) {
            console.log(TAG, getTime() + "StartTest--------------------------------------------------");
            console.log(params);
            StartTest(params, callback);
        });

        socket.on("SuspendTest", function (params, callback) {
            console.log(TAG, getTime() + "SuspendTest--------------------------------------------------");
            console.log(params);
            SuspendTest(params, callback);
        });

        socket.on("ResumeTest", function (params, callback) {
            console.log(TAG, getTime() + "ResumeTest--------------------------------------------------");
            console.log(params);
            ResumeTest(params, callback);
        });

        socket.on("StopTest", function (params, callback) {
            console.log(TAG, getTime() + "StopTest--------------------------------------------------");
            console.log(params);
            StopTest(params, callback);
        });

        socket.on("RestartTest", function (params, callback) {
            console.log(TAG, getTime() + "RestartTest--------------------------------------------------");
            console.log(params);
            RestartTest(params, callback);
        });

        socket.on("TransFile", function (params, callback) {
            console.log(TAG, getTime() + "TransFile--------------------------------------------------");
            console.log(params);
            TransFile(params, callback);
        });
    });
global.socket_ui = socket_ui;

var StartTest = function (params, callback) {
    var projectId = params.body.projectId;
    process.send({message: "StartTest", caseProjectId: projectId});
    (typeof callback === "function") && (
        process.on("message", function (msg) {
            msg && (msg.type === "StartTest") && callback(msg);
        }));
};

var SuspendTest = function (params, callback) {
    var projectId = params.body.projectId;
    process.send({message: "SuspendTest", caseProjectId: projectId});
    (typeof callback === "function") && (
        process.on("message", function (msg) {
            msg && (msg.type === "SuspendTest") && callback(msg);
        }));
};

var ResumeTest = function (params, callback) {
    var projectId = params.body.projectId;
    process.send({message: "ResumeTest", caseProjectId: projectId});
    (typeof callback === "function") && (
        process.on("message", function (msg) {
            msg && (msg.type === "StartTest") && callback(msg);
        }));
};

var StopTest = function (params, callback) {
    var projectId = params.body.projectId;
    process.send({message: "StopTest", caseProjectId: projectId});
    (typeof callback === "function") && (
        process.on("message", function (msg) {
            msg && (msg.type === "StopTest") && callback(msg);
        }));
};

var RestartTest = function (params, callback) {
    var projectId = params.body.projectId;
    process.send({message: "RestartTest", caseProjectId: projectId});
    (typeof callback === "function") && (
        process.on("message", function (msg) {
            msg && (msg.type === "StartTest") && callback(msg);
        }));
};

var TransFile = function (params, callback) {
    var fileName = params.body.fileName;
    var data = params.body.data;
    console.log(fileName);
    if (fileName.substring(0, 12) == "appPublicLib"
        && fileName.substring(fileName.lastIndexOf(".") + 1) == "js") {    //公共依赖库
        fs.writeFile(path.join(__dirname, "../../resource/libs/" + fileName),
            data, function (err) {
                (typeof callback === "function") && (
                    err ? callback({retcode: "01", err: err})
                        : callback({retcode: "00"}));
            });
        return;
    }
    // if (fs.existsSync("../temp/" + fileName)) {
    //     callback({retcode: "02", err: "案例库已存在"});
    //     return;
    // }
    // if (fileName.length == 0 || fileName.substring(fileName.lastIndexOf(".") + 1) != "zip") {
    //     callback({retcode: "03", err: "案例库文件不合法"});
    //     return;
    // }
    fs.writeFile(path.join(__dirname, "../../temp/" + fileName), data, function (err) {
        (typeof callback === "function") && (
            err ? callback({retcode: "01", err: err})
                : callback({retcode: "00"}));
    });
};

process.on("message", function (msg) {
    msg && (msg.type === "DataUpdate") && socket_ui.emit("DataUpdate", msg.data);
});


var getTime = function () {
    return "(" + new Date().toLocaleString() + ")";
};