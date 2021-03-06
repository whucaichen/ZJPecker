/**
 * Created by Chance on 16/11/14.
 */

var TAG = "[App_v1.js]: ";
var server = require('http').createServer();
var url = require("url");
var querystring = require("querystring");
var ObjectId = require('mongodb').ObjectId;

server.on('request', function (req, res) {
    //GET的数据放在URL上传输，只有POST才出发，因为POST是提交内容，可能数据很庞大，这些信息不可能全部存放在URL上传输
    req.on('data', function (chunk) {
        console.log(TAG, 'req data');
    });
    //消息接受完毕
    req.on('end', function () {
        console.log(TAG, 'req end');
    });
    var pathname = url.parse(req.url).pathname;
    var query = url.parse(req.url).query;
    var queryObj = querystring.parse(query);
    console.log(TAG, "GET pathname = " + pathname);
    console.log(TAG, "GET query = " + query);
    console.log(TAG, "GET queryObj = " + JSON.stringify(queryObj));
    //发送报文头信息
    res.writeHead(200, {'Content-Type': 'text/html'});
    //Url路由，发送报文具体内容
    if (pathname === "/caselib") {
        queryCaseLib(function (result) {
            res.write(JSON.stringify(result));
            //结束响应，告知客户端所有的消息发送完成
            res.end();
        });
    } else {
        res.write('<h1>Hello World</h1>');
        res.end();
    }
});
server.on('connection', function (req, res) {
    //console.log(TAG, 'http connection');
});

// server.listen(8080);
// console.log(TAG, "HTTP server is listening at port 8080.");
// var socket = require('socket.io').listen(server);
// process.send("WebSocket Server is proper functioning!");
var socket = require('socket.io').listen(8080);
//监听主线程消息
process.on('message', function (msg) {
    console.log(TAG, msg);
});

var socket_test = socket.of("/test")
    .on('connect', function (socket) {
        var client_ip = socket.request.connection.remoteAddress;
        console.log(getTime() + client_ip + ': ' + socket.id + " connected.");
        socket.write("how are you?");

        socket.on('message', function (data) {
            console.log(getTime() + client_ip + ': ' + data);
        });
        socket.on('disconnect', function () {
            console.log(getTime() + client_ip + " disconnect.");
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
    });

var socket_ui = socket.of("/ui")
    .on('connection', function (socket) {
        var client_ip = socket.request.connection.remoteAddress;
        console.log(TAG, getTime() + client_ip + ': ' + socket.id + " connected.");

        socket.on('message', function (data) {
            console.log(TAG, getTime() + client_ip + ': ' + data);
        });
        socket.on('disconnect', function () {
            console.log(TAG, getTime() + client_ip + " disconnect.");
        });

        socket.on("ImportTestCaseLib", function (params, callback) {
            console.log("--------------------------------------------------");
            console.log(params);
            ImportTestCaseLib(params, function (result) {
                callback(JSON.stringify(result));
            });
        });

        socket.on("QueryCaseLib", function (params, callback) {
            console.log(TAG, "--------------------------------------------------");
            console.log(params);
            QueryCaseLib(params, function (result) {
                //callback(JSON.stringify(result));
                callback({retcode: "00", caselib: result});
            });
        });

        socket.on("QueryCaseLibP", function (params, callback) {
            console.log(TAG, "--------------------------------------------------");
            console.log(params);
            QueryCaseLibP(params, function (result, total) {
                //callback(JSON.stringify(result));
                callback({retcode: "00", total: total, caseLibs: result});
            });
        });

        socket.on("QueryCaseLibGroup", function (params, callback) {
            console.log(TAG, "--------------------------------------------------");
            console.log(params);
            QueryCaseLibGroup(params, function (result) {
                //callback(JSON.stringify(result));
                callback({retcode: "00", caseLibGoups: result});
            });
        });

        socket.on("QueryCaseLibDetail", function (params, callback) {
            console.log(TAG, "--------------------------------------------------");
            console.log(params);
            QueryCaseLibDetail(params, function (result) {
                //callback(JSON.stringify(result));
                callback({retcode: "00", caseLibDetail: result});
            });
        });

        socket.on("QueryCases", function (params, callback) {
            console.log(TAG, "--------------------------------------------------");
            console.log(params);
            QueryCases(params, function (result) {
                //callback(JSON.stringify(result));
                callback({retcode: "00", casetree: result});
            });
        });

        socket.on("QueryCaseDetail", function (params, callback) {
            console.log(TAG, "--------------------------------------------------");
            console.log(params);
            QueryCaseDetail(params, function (result) {
                //callback(JSON.stringify(result));
                callback({retcode: "00", details: result});
            });
        });

        socket.on("createTestProject", function (params, callback) {
            console.log(TAG, "--------------------------------------------------");
            console.log(params);
            createTestProject(params, function (result) {
                //callback(JSON.stringify(result));
                callback({retcode: result});
            });
        });

        socket.on("QueryTestProject", function (params, callback) {
            console.log(TAG, "--------------------------------------------------");
            console.log(params);
            QueryTestProject(params, function (result, total) {
                //callback(JSON.stringify(result));
                callback({retcode: "00", total: total, testProjectList: result});
            });
        });

        socket.on("QueryTestProjectDetail", function (params, callback) {
            console.log(TAG, "--------------------------------------------------");
            console.log(params);
            QueryTestProjectDetail(params, function (result) {
                //callback(JSON.stringify(result));
                //callback({retcode: "00", caseLibDetail: result});
                callback(result);
            });
        });

        socket.on("Login", function (params, callback) {
            console.log(TAG, "--------------------------------------------------");
            console.log(params);
            Login(params, function (result) {
                //callback(result);
                callback({retcode: result});
            });
        });
    });

var ImportTestCaseLib = function (params, callback) {
    var fs = require("fs");
    var unzip = require("unzip");

    var fileName = params.body.caseLibFileName;
    fs.createReadStream(fileName).pipe(unzip.Extract({path: './temp'}));
    //读取案例库信息插入数据库，得到案例_id作为案例的信息一部分插入案例
    //CaseLib.insert, Case.insert


    //读取完成删除缓存
    var deleteFolderRecursive = function (path) {
        var files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };
    //deleteFolderRecursive("./temp");
};

var QueryCaseLib = function (params, callback) {
    var CaseLib = require("../db/db_caselib");

    CaseLib.getCaseLibs2({}, {fields: {caseLibName: 1}},
        function (err, result) {
            //console.log(result);
            callback(result);
        });
};
//
var QueryCaseLibP = function (params, callback) {
    var CaseLib = require("../db/db_caselib");

    //var caselib = new CaseLib(params.body);
    var caselib = {};
    if (params.body.caseLibName) {
        caselib.caseLibName = params.body.caseLibName;
    }
    if (params.body.caseLibType) {
        caselib.caseLibType = params.body.caseLibType;
    }
    //CaseLib.getCaseLibs2(caselib, {fields: {caseLibName: 1, caseLibType: 1, importTime: 1, caseDeveloper: 1}},
    //    function (err, result) {
    //        //console.log(result);
    //        callback(result);
    //    });
    var pageSize = params.body.pageSize;
    var pageNum = params.body.pageNum;
    CaseLib.getPageCases2(caselib, pageSize, pageNum, function (err, result, total) {
        callback(result, total);
    });
};

var QueryCaseLibGroup = function (params, callback) {
    var Case = require("../db/db_case");

    var caseLibId = params.body.caseLibId;
    //Case.getCases2({caseLibId: new RegExp(caseLibId)},
    Case.getCases2({_id: caseLibId},
        {fields: {groupName: 1, _id: 0}}, function (err, result) {
            //console.log(result);
            callback(result);
        });
};
//暂时不用
var QueryCaseLibDetail = function (params, callback) {
    var Case = require("../db/db_case");

    var caseLibId = params.body.caseLibId;
    var groupName = params.body.groupName;
    //Case.getCases2({groupName: new RegExp(groupName)}, {},
    Case.getCases2({caseLibId: caseLibId, groupName: {$in: groupName}}, {},
        //{fields: {caseId: 1, caseCaption: 1, caseLibId: 1, _id: 0}},
        function (err, result) {
            var res = [];
            for (var i = 0; i < groupName.length; i++) {
                res[i] = {caseGroupName: groupName[i], caseItems:[]};
            }
            console.log(res);
            result.forEach(function (name) {
                if (groupName.indexOf(name.groupName) > -1) {
                    console.log(groupName.indexOf(name.groupName));
                    //res[groupName.indexOf(name.groupName)].caseGroupName = name.groupName;
                    res[groupName.indexOf(name.groupName)].caseItems.push(name);
                }
            });
            callback(res);
        });
};

var QueryCases = function (params, callback) {
    var Case = require("../db/db_case");

    var caseLibId = params.body.caseLibId;
    caseLibId = ObjectId(caseLibId);
    Case.getCases2({caseLibId: caseLibId},
        {groupName: 1, "_id": 0}, function (err, result) {
            if (err) callback(err);
            var groups = result;
            groups.forEach(function (name) {
                Case.getCases2({caseLibId: caseLibId, groupName: name.groupName},
                    {caseId: 1, caseCaption: 1}, function (err, result) {
                        if (err) callback(err);
                        name.cases = result;
                    });
            });
            setTimeout(function () {
                callback(groups);
            }, 100);
            //console.log(result);
            //callback(result);
        });
};

var QueryCaseDetail = function (params, callback) {
    var Case = require("../db/db_case");

    var caseId = params.body.caseId;
    caseId = ObjectId(caseId);
    // Case.getCases2({caseId: new RegExp(caseId)}, {},
    Case.getCases2({_id: caseId}, {},
        //{fields: {caseCaption: 1, description: 1, expectation: 1, _id: 0}},
        function (err, result) {
            //console.log(result);
            callback(result[0]);
        });
};

var createTestProject = function (params, callback) {
    var Case = require("../db/db_case");
    var Project = require("../db/db_project");
    var ProjectCase = require("../db/db_project_case");
    //插入工程表得到工程_id，作为工程案例信息插入工程案例表

    var projectName = params.body.projectName;
    var cases = params.body.cases;
    Project.addProject2({projectName: projectName}, function (err, result) {
        var _id = result.insertedIds && result.insertedIds[1];
        //if (!_id) return callback(null);
        if (!_id) return callback("01");
        var projectcases = [];
        cases.forEach(function (name) {
            name.caseProjectId = _id;
        });
        ProjectCase.addProjectCase2(cases, function (err, result) {
            //callback(result);
            callback("00");
        });
    });
};

var QueryTestProject = function (params, callback) {
    var Project = require("../db/db_project");

    var project = {};
    if (params.body.projectName) {
        project.projectName = params.body.projectName;
    }
    if (params.body.tester) {
        project.tester = params.body.tester;
    }
    //Project.getProjects2({}, {fields: {caseLibId: 0}},
    //    function (err, result) {
    //        //console.log(result);
    //        callback(result);
    //    });
    var pageSize = params.body.pageSize;
    var pageNum = params.body.pageNum;
    Project.getPageProjects2(project, pageSize, pageNum, function (err, result, total) {
        callback(result, total);
    });
};

var QueryTestProjectDetail = function (params, callback) {
    var Project = require("../db/db_project");
    var ProjectCase = require("../db/db_project_case");

    var projectId = params.body.projectId;
    projectId = ObjectId(projectId);
    Project.getProjects2({_id: projectId}, {},
    //Project.getProjects2({_id: projectId}, {projectName: 1, projectStatus: 1},
        function (err, result) {
            ProjectCase.getProjectCases2({caseProjectId: projectId}, {}, function (err1, result1) {
                //ProjectCase.updateProjectCase2({},{caseProjectId:projectId},function(){});
                result = result[0];
                result.caseItems = result1;
                console.log(result);
                callback(result);
            });
            //console.log(result);
            //callback(result);
        });
};

var Login = function (params, callback) {
    var User = require("../db/db_user");

    var username = params.body.username;
    var password = params.body.password;
    User.getUser2({username: username}, {}, function (err, result) {
        console.log(result);
        if (err || !result) callback("01");
        //if (err || !result) callback({code: "01"});
        User.getUser2({username: username, password: password}, {}, function (err, result) {
            if (result) callback("00");
            //if (result) callback({code: "00"});
            else callback("02");
            //else callback({code: "02"});
        });
    });
};

var getTime = function () {
    return "(" + new Date().toLocaleString() + ")";
};