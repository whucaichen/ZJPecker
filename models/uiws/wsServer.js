/**
 * Created by Chance on 16/11/14.
 */

var TAG = function () {
    return "[wsServer.js](" + new Date().toLocaleTimeString() + "): ";
};
var fs = require('fs');
var url = require("url");
var path = require("path");
var util = require('util');
global.IsCrypted = process.argv[3] || false;
var helper = require("./serverHelper");
var ObjectID = require('mongodb').ObjectId;
var DeviceInfo = require("../db/db_device_info");
var formidable = require('formidable');
var mime = require("../utils/mime").mime;
var root = path.join(__dirname, "../../temp/caseFiles");
if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
}
var http_server = require('http').createServer(function (req, res) {
    try {
        if (req.url === '/httpupload' && req.method.toLowerCase() === 'post') {
            var form = formidable.IncomingForm(); //实例化formidable对象，然后调用该对象下的IncomingForm()方法
            form.uploadDir = root; //调用form.uploadDir属性设置文件上传的路径
            form.parse(req, function (err, fields, files) { //调用form.parse()方法表单提交的所有数据，字段、文件等
                if (err) { //如果出错则终止程序并抛出错误
                    throw err;
                } else {
                    //console.log(fields,files);
                    var fileFolder = root + "/" + fields.name;
                    if (mkdirsSync(fileFolder)) {
                        var oldpath = files.files.path; //files.files.path与form.uploadDir相关

                        var newpath = fileFolder + '/' + files.files.name;
                        fs.rename(oldpath, newpath, function (err) {
                            //如果出错则终止程序并抛出错误
                            if (err) {
                                throw Error("upload error");
                            }
                            //设置MIME类型
                            res.writeHead(200, {"Content-Type": "text/html;charset=UTF-8"});
                            //打印检查信息
                            res.end(util.inspect({fields: fields, files: files}));
                            //响应结束，输出结果信息
                            res.end("success");
                        });
                    } else {
                        console.log("mk dir error");
                        res.writeHead(400, {"Content-Type": "text/html;charset=UTF-8"});
                        //打印检查信息
                        res.end(util.inspect({fields: fields, files: files}));
                        //响应结束，输出结果信息
                        res.end("success");
                    }
                }
            });
            return;
        }
    } catch (ex) {
        console.log("server.on(request) error,ex=" + ex);
    }

    //将url地址的中的%20替换为空格，不然Node.js找不到文件
    var pathname = url.parse(req.url).pathname.replace(/%20/g, ' '),
        re = /(%[0-9A-Fa-f]{2}){3}/g;
    //能够正确显示中文，将三字节的字符转换为utf-8编码
    pathname = pathname.replace(re, function (word) {
        var buffer = new Buffer(3),
            array = word.split('%');
        array.splice(0, 1);
        array.forEach(function (val, index) {
            buffer[index] = parseInt('0x' + val, 16);
        });
        return buffer.toString('utf8');
    });
    if (pathname == '/') {
        listDirectory(root, req, res);
    } else {
        filename = path.join(root, pathname);
        fs.exists(filename, function (exists) {
            if (!exists) {
                console.error('找不到文件' + filename);
                write404(req, res);
            } else {
                fs.stat(filename, function (err, stat) {
                    if (stat.isFile()) {
                        showFile(filename, req, res);
                    } else if (stat.isDirectory()) {
                        listDirectory(filename, req, res);
                    }
                });
            }
        });
    }
}).listen(process.argv[2] || 8080);

var socket = require('socket.io').listen(http_server);
// var socket = require('socket.io').listen(8080);

var socket_ui = socket.of("/ui")
    .on('connection', function (socket) {
        var client_ip = socket.request.connection.remoteAddress;
        console.log(TAG(), client_ip + ': ' + socket.id + " connected.");

        socket.on('message', function (data) {
            console.log(TAG(), client_ip + ': ' + data);
        });
        socket.on('disconnect', function () {
            console.log(TAG(), client_ip + ': ' + socket.id + " disconnect.");
        });

        socket.on("ImportTestCaseLib", function (params, callback) {
            console.log(TAG(), "ImportTestCaseLib--------------------------------------------------");
            console.log(params);
            helper.ImportTestCaseLib(params, callback);
        });

        socket.on("QueryCaseLib", function (params, callback) {
            console.log(TAG(), "QueryCaseLib--------------------------------------------------");
            console.log(params);
            helper.QueryCaseLib(params, callback);
        });

        socket.on("QueryCaseLibP", function (params, callback) {
            console.log(TAG(), "QueryCaseLibP--------------------------------------------------");
            console.log(params);
            helper.QueryCaseLibP(params, callback);
        });

        socket.on("DeleteCaseLib", function (params, callback) {
            console.log(TAG(), "DeleteCaseLib--------------------------------------------------");
            console.log(params);
            helper.DeleteCaseLib(params, callback);
        });

        socket.on("QueryCaseLibGroup", function (params, callback) {
            console.log(TAG(), "QueryCaseLibGroup--------------------------------------------------");
            console.log(params);
            helper.QueryCaseLibGroup(params, callback);
        });

        socket.on("QueryCaseLibDetail", function (params, callback) {
            console.log(TAG(), "QueryCaseLibDetail--------------------------------------------------");
            console.log(params);
            helper.QueryCaseLibDetail(params, callback);
        });

        socket.on("QueryCases", function (params, callback) {
            console.log(TAG(), "QueryCases--------------------------------------------------");
            console.log(params);
            helper.QueryCases(params, callback);
        });

        socket.on("QueryCaseDetail", function (params, callback) {
            console.log(TAG(), "QueryCaseDetail--------------------------------------------------");
            console.log(params);
            helper.QueryCaseDetail(params, callback);
        });

        socket.on("CreateTestProject", function (params, callback) {
            console.log(TAG(), "CreateTestProject--------------------------------------------------");
            console.log(params);
            helper.CreateTestProject(params, callback);
        });

        socket.on("DeleteTestProject", function (params, callback) {
            console.log(TAG(), "DeleteTestProject--------------------------------------------------");
            console.log(params);
            // helper.DeleteTestProject(params, callback);
            var projectId = params.body && params.body.projectId;
            if (!projectId) {
                callback({retcode: "02", err: "报文参数不合法"});
                return;
            }
            process.send({message: "DeleteTestProject", caseProjectId: projectId});
            (typeof callback === "function") && (
                process.on("message", function (msg) {
                    // msg && (msg.type === "DeleteTestProject") && helper.DeleteTestProject(params, callback);
                    msg && (msg.type === "DeleteTestProject") && (msg.retcode === "00"
                        ? helper.DeleteTestProject(params, callback) : callback({retcode: "04", err: "工程正在测试中"}));
                }));
        });

        socket.on("QueryTestProject", function (params, callback) {
            console.log(TAG(), "QueryTestProject--------------------------------------------------");
            console.log(params);
            helper.QueryTestProject(params, callback);
        });

        socket.on("QueryTestProjectDetail", function (params, callback) {
            console.log(TAG(), "QueryTestProjectDetail--------------------------------------------------");
            console.log(params);
            helper.QueryTestProjectDetail(params, callback);
        });

        socket.on("QueryTestProjectLog", function (params, callback) {
            console.log(TAG(), "QueryTestProjectLog--------------------------------------------------");
            console.log(params);
            helper.QueryTestProjectLog(params, callback);
        });

        socket.on("Login", function (params, callback) {
            console.log(TAG(), "Login--------------------------------------------------");
            console.log(params);
            helper.Login(params, callback);
        });

        socket.on("QueryCaseFiles", function (params, callback) {
            console.log(TAG(), "QueryCaseFiles--------------------------------------------------");
            console.log(params);
            helper.QueryCaseFiles(params, callback);
        });

        socket.on("AddAtmap", function (params, callback) {
            console.log(TAG(), "AddAtmap--------------------------------------------------");
            console.log(params);
            helper.AddAtmap(params, callback);
        });

        socket.on("DropAtmap", function (params, callback) {
            console.log(TAG(), "DropAtmap--------------------------------------------------");
            console.log(params);
            helper.DropAtmap(params, callback);
        });

        socket.on("QueryAtmap", function (params, callback) {
            console.log(TAG(), "QueryAtmap--------------------------------------------------");
            console.log(params);
            helper.QueryAtmap(params, callback);
        });

        socket.on("QueryPageAtmap", function (params, callback) {
            console.log(TAG(), "QueryPageAtmap--------------------------------------------------");
            console.log(params);
            helper.QueryPageAtmap(params, callback);
        });

        socket.on("UpdateAtmap", function (params, callback) {
            console.log(TAG(), "UpdateAtmap--------------------------------------------------");
            console.log(params);
            helper.UpdateAtmap(params, callback);
        });

        socket.on("StartTest", function (params, callback) {
            console.log(TAG(), "StartTest--------------------------------------------------");
            console.log(params);
            StartTest(params, callback);
        });

        socket.on("SuspendTest", function (params, callback) {
            console.log(TAG(), "SuspendTest--------------------------------------------------");
            console.log(params);
            SuspendTest(params, callback);
        });

        socket.on("ResumeTest", function (params, callback) {
            console.log(TAG(), "ResumeTest--------------------------------------------------");
            console.log(params);
            ResumeTest(params, callback);
        });

        socket.on("StopTest", function (params, callback) {
            console.log(TAG(), "StopTest--------------------------------------------------");
            console.log(params);
            StopTest(params, callback);
        });

        socket.on("RestartTest", function (params, callback) {
            console.log(TAG(), "RestartTest--------------------------------------------------");
            console.log(params);
            RestartTest(params, callback);
        });

        socket.on("TransFile", function (params, callback) {
            console.log(TAG(), "TransFile--------------------------------------------------");
            console.log(params);
            TransFile(params, callback);
        });

        socket.on("UploadPublicLib", function (params, callback) {
            console.log(TAG(), "UploadPublicLib--------------------------------------------------");
            console.log(params);
            UploadPublicLib(params, callback);
        });

        socket.on("UploadReportTemplate", function (params, callback) {
            console.log(TAG(), "UploadReportTemplate--------------------------------------------------");
            console.log(params);
            UploadReportTemplate(params, callback);
        });

        socket.on("UploadDeviceCsv", function (params, callback) {
            console.log(TAG(), "UploadDeviceCsv--------------------------------------------------");
            console.log(params);
            UploadDeviceCsv(params, callback);
        });

        socket.on("QueryDeviceInfos", function (params, callback) {
            console.log(TAG(), "QueryDeviceInfos--------------------------------------------------");
            console.log(params);
            // QueryDeviceCsv(params, callback);
            var query = params.body._id && {_id: ObjectID(params.body._id)} || {};
            DeviceInfo.getInfos(query, {}, function (err, result) {
                if (typeof callback !== "function") return;
                err ? callback({retcode: "01", err: err}) : callback({retcode: "00", infos: result});
            });
        });
    });
global.socket_ui = socket_ui;

var StartTest = function (params, callback) {
    var projectId = params.body && params.body.projectId;
    if (!projectId) {
        callback({retcode: "02", err: "报文参数不合法"});
        return;
    }
    process.send({message: "StartTest", caseProjectId: projectId});
    (typeof callback === "function") && (
        process.on("message", function (msg) {
            msg && (msg.type === "StartTest") && callback(msg);
        }));
};

var SuspendTest = function (params, callback) {
    var projectId = params.body && params.body.projectId;
    if (!projectId) {
        callback({retcode: "02", err: "报文参数不合法"});
        return;
    }
    process.send({message: "SuspendTest", caseProjectId: projectId});
    (typeof callback === "function") && (
        process.on("message", function (msg) {
            msg && (msg.type === "SuspendTest") && callback(msg);
        }));
};

var ResumeTest = function (params, callback) {
    var projectId = params.body && params.body.projectId;
    if (!projectId) {
        callback({retcode: "02", err: "报文参数不合法"});
        return;
    }
    process.send({message: "ResumeTest", caseProjectId: projectId});
    (typeof callback === "function") && (
        process.on("message", function (msg) {
            msg && (msg.type === "StartTest") && callback(msg);
        }));
};

var StopTest = function (params, callback) {
    var projectId = params.body && params.body.projectId;
    if (!projectId) {
        callback({retcode: "02", err: "报文参数不合法"});
        return;
    }
    process.send({message: "StopTest", caseProjectId: projectId});
    (typeof callback === "function") && (
        process.on("message", function (msg) {
            msg && (msg.type === "StopTest") && callback(msg);
        }));
};

var RestartTest = function (params, callback) {
    var projectId = params.body && params.body.projectId;
    if (!projectId) {
        callback({retcode: "02", err: "报文参数不合法"});
        return;
    }
    process.send({message: "RestartTest", caseProjectId: projectId});
    (typeof callback === "function") && (
        process.on("message", function (msg) {
            msg && (msg.type === "StartTest") && callback(msg);
        }));
};

var TransFile = function (params, callback) {
    var fileName = params.body && params.body.fileName;
    var data = params.body && params.body.data;
    if (!(fileName && data)) {
        callback({retcode: "01", err: "报文参数不合法"});
        return;
    }
    console.log(fileName);
    if (fileName.substring(fileName.lastIndexOf(".")) !== ".zip") {
        (typeof callback === "function") && callback({retcode: "03", err: "文件名不合法"});
        return;
    }
    fs.writeFile(path.join(__dirname, "../../temp/upload/" + fileName), data, function (err) {
        (typeof callback === "function") && (
            err ? callback({retcode: "03", err: err})
                : callback({retcode: "00"}));
        // if (typeof callback != "function") return;
        // if (err) {
        //     callback({retcode: "03", err: err});
        //     return
        // }
        // callback({retcode: "00"});
    });
};

var UploadPublicLib = function (params, callback) {
    var fileName = params.body && params.body.fileName;
    var data = params.body && params.body.data;
    if (!(fileName && data)) {
        callback({retcode: "01", err: "报文参数不合法"});
        return;
    }
    console.log(fileName);
    if (fileName.substring(0, 12) === "appPublicLib"
        && fileName.substring(fileName.lastIndexOf(".") + 1) === "js") {    //公共依赖库
        fs.writeFile(path.join(__dirname, "../../resource/libs/" + fileName),
            data, function (err) {
                (typeof callback === "function") && (
                    err ? callback({retcode: "02", err: err})
                        : callback({retcode: "00"}));
            });
    } else {
        (typeof callback === "function") && callback({retcode: "03", err: "文件名错误"});
    }
};

var UploadReportTemplate = function (params, callback) {
    var fileName = params.body && params.body.fileName;
    var data = params.body && params.body.data;
    if (!(fileName && data)) {
        callback({retcode: "01", err: "报文参数不合法"});
        return;
    }
    console.log(fileName);
    if (fileName === "report.docx" || fileName === "report.json") { //测试报表模板
        fs.writeFile(path.join(__dirname, "../../models/res/" + fileName),
            data, function (err) {
                (typeof callback === "function") && (
                    err ? callback({retcode: "02", err: err})
                        : callback({retcode: "00"}));
            });
    } else {
        (typeof callback === "function") && callback({retcode: "03", err: "文件名错误"});
    }
};

var UploadDeviceCsv = function (params, callback) {
    var fileName = params.body && params.body.fileName;
    var data = params.body && params.body.data;
    if (!(fileName && data)) {
        callback({retcode: "01", err: "报文参数不合法"});
        return;
    }
    console.log(fileName);
    if (fileName.substring(fileName.lastIndexOf(".")) === ".csv") { //设备信息表
        fs.writeFile(path.join(__dirname, "../../temp/upload/" + fileName), data, function (err) {
            DeviceInfo.addInfoFromCSV(path.join(__dirname, "../../temp/upload/" + fileName),
                function (err, result) {
                    err && console.error(TAG(), "设备信息表存在错误或重复");
                    (typeof callback === "function") && callback({retcode: "00"});
                });
        });
    } else {
        (typeof callback === "function") && callback({retcode: "03", err: "文件名错误"});
    }
};

process.on("message", function (msg) {
    msg && (msg.type === "DataUpdate") && socket_ui.emit("DataUpdate", msg.data);
});

//显示文件夹下面的文件
function listDirectory(parentDirectory, req, res) {
    fs.readdir(parentDirectory, function (error, files) {
        var body = formatBody(parentDirectory, files);
        res.writeHead(200, {
            "Content-Type": "text/html;charset=utf-8",
            "Content-Length": Buffer.byteLength(body, 'utf8'),
            "Server": "NodeJs(" + process.version + ")"
        });
        res.write(body, 'utf8');
        res.end();
    });

}
//显示文件内容
function showFile(file, req, res) {
    fs.readFile(filename, 'binary', function (err, file) {
        var contentType = mime.lookupExtension(path.extname(filename));
        filename.substring(filename.lastIndexOf(".")) === ".docx" && (contentType = "application/msword");
        res.writeHead(200, {
            "Content-Type": contentType,
            "Content-Length": Buffer.byteLength(file, 'binary'),
            "Server": "NodeJs(" + process.version + ")"
        });
        res.write(file, "binary");
        res.end();
    })
}
//在Web页面上显示文件列表，格式为<ul><li></li><li></li></ul>
function formatBody(parent, files) {
    var res = [],
        length = files.length;
    res.push("<!doctype>");
    res.push("<html>");
    res.push("<head>");
    res.push("<meta http-equiv='Content-Type' content='text/html;charset=utf-8'></meta>");
    res.push("<title>工程案例测试文件服务器</title>");
    res.push("</head>");
    res.push("<body width='100%'>");
    res.push("<ul>");
    files.forEach(function (val, index) {
        var stat = fs.statSync(path.join(parent, val));
        if (stat.isDirectory(val)) {
            val = path.basename(val) + "/";
        } else {
            val = path.basename(val);
        }
        res.push("<li><a href='" + val + "'>" + val + "</a></li>");
    });
    res.push("</ul>");
    res.push("</div>");
    res.push("</body>");
    return res.join("");
}
//如果文件找不到，显示404错误
function write404(req, res) {
    var body = "文件不存在:-(";
    res.writeHead(404, {
        "Content-Type": "text/html;charset=utf-8",
        "Content-Length": Buffer.byteLength(body, 'utf8'),
        "Server": "NodeJs(" + process.version + ")"
    });
    res.write(body);
    res.end();
}

function mkdirsSync(dirpath, mode) {
    try {
        if (!fs.existsSync(dirpath)) {
            var pathtmp;
            dirpath.replace(/\//g, '\\').split(path.sep).forEach(function (dirname) {
                if (pathtmp) {
                    pathtmp = path.join(pathtmp, dirname);
                }
                else {
                    pathtmp = dirname;
                }
                if (!fs.existsSync(pathtmp)) {
                    if (!fs.mkdirSync(pathtmp, mode)) {
                        return false;
                    }
                }
            });
        }
        return true;
    } catch (ex) {
        console.log("mkdirsSync ex=" + ex);
        return false;
    }
}