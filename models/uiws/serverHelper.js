var TAG = "[serverHelper.js]: ";

/**
 * Created by Chance on 16/12/02.
 */

module.exports = function () {
    this.ImportTestCaseLib = function (params, callback) {
        ImportTestCaseLib(params, callback);
    };
    this.QueryCaseLib = function (params, callback) {
        QueryCaseLib(params, callback);
    };
    this.QueryCaseLibP = function (params, callback) {
        QueryCaseLibP(params, callback);
    };
    this.DeleteCaseLib = function (params, callback) {
        DeleteCaseLib(params, callback);
    };
    this.QueryCaseLibGroup = function (params, callback) {
        QueryCaseLibGroup(params, callback);
    };
    this.QueryCaseLibDetail = function (params, callback) {
        QueryCaseLibDetail(params, callback);
    };
    this.QueryCases = function (params, callback) {
        QueryCases(params, callback);
    };
    this.QueryCaseDetail = function (params, callback) {
        QueryCaseDetail(params, callback);
    };
    this.CreateTestProject = function (params, callback) {
        CreateTestProject(params, callback);
    };
    this.DeleteTestProject = function (params, callback) {
        DeleteTestProject(params, callback);
    };
    this.QueryTestProject = function (params, callback) {
        QueryTestProject(params, callback);
    };
    this.QueryTestProjectDetail = function (params, callback) {
        QueryTestProjectDetail(params, callback);
    };
    this.QueryTestProjectLog = function (params, callback) {
        QueryTestProjectLog(params, callback);
    };
    this.Login = function (params, callback) {
        Login(params, callback);
    };
    this.QueryCaseFiles = function (params, callback) {
        QueryCaseFiles(params, callback);
    };
    this.AddAtmap = function (params, callback) {
        AddAtmap(params, callback);
    };
    this.DropAtmap = function (params, callback) {
        DropAtmap(params, callback);
    };
    this.QueryAtmap = function (params, callback) {
        QueryAtmap(params, callback);
    };
    this.QueryPageAtmap = function (params, callback) {
        QueryPageAtmap(params, callback);
    };
    this.UpdateAtmap = function (params, callback) {
        UpdateAtmap(params, callback);
    };
    return this;
}();
var fs = require("fs");
var rd = require("rd");
var path = require("path");
var unzip = require("unzip");
var select = require("xpath.js");
var DOMParser = require("xmldom").DOMParser;
var ObjectId = require("mongodb").ObjectId;
var Case = require("../db/db_case");
var CaseLib = require("../db/db_caselib");
var Project = require("../db/db_project");
var ProjectCase = require("../db/db_project_case");
var User = require("../db/db_user");
var Atmap = require("../db/db_atmaps");
var CASE_FILE_ROOT_PATH = "../../temp/caseFiles/";

//打包案例库文件多个？索引文件多个？
try {
    var readIndexIntoDB = function (index, callback) {
        var caseItems = [];
        var iContent = fs.readFileSync(index, 'utf-8');
        // var iContent = fs.readFileSync("../cfg/index.xml", 'utf-8');
        var iDom = new DOMParser().parseFromString(iContent);

        var caseLib = select(iDom, "/root/CaseLib");
        // for (var i = 0; i < caseLib.length; i++) {
        var caseLibName = caseLib[0].getAttribute("name");
        var caseLibType = caseLib[0].getAttribute("type");
        var caseDeveloper = caseLib[0].getAttribute("developer");
        // console.log(caseLibName, caseLibType, caseDeveloper);
        CaseLib.addCaseLib2({
            caseLibName: caseLibName,
            caseLibType: caseLibType,
            caseDeveloper: caseDeveloper,
            importTime: new Date().toLocaleString()
        }, function (err, result) {
            if (err) {
                callback({retcode: "11", err: err});
                return;
            }
            var caseLibId = result.insertedIds && result.insertedIds[1];

            var caseGroup = select(iDom, "/root/CaseLib/CaseGroup");
            for (var j = 0; j < caseGroup.length; j++) {
                var groupName = caseGroup[j].getAttribute("name");
                // console.log(groupName + "==================================================");
                var cases = select(iDom, "/root/CaseLib/CaseGroup[@name='" + groupName + "']/Case");
                for (var k = 0; k < cases.length; k++) {
                    var caseName = cases[k].getAttribute("name");
                    // var caseId = caseLibName + "_" + caseName;
                    // var fileTitle = caseLibName + "_" + caseName;
                    var caseId = caseName;
                    var fileTitle = caseName;

                    try { // var caseId = cases[k].hasChildNodes("CaseId") &&
                        //     cases[k].getElementsByTagName("CaseId").item(0).firstChild.toString();
                        var caseOrder = cases[k].getElementsByTagName("CaseOrder")[0] &&
                            cases[k].getElementsByTagName("CaseOrder")[0].firstChild;
                        var caseCaption = cases[k].getElementsByTagName("Caption")[0] &&
                            cases[k].getElementsByTagName("Caption")[0].firstChild;
                        var serialNo = cases[k].getElementsByTagName("SerialNo")[0] &&
                            cases[k].getElementsByTagName("SerialNo")[0].firstChild;
                        var mediaType = cases[k].getElementsByTagName("MediaType")[0] &&
                            cases[k].getElementsByTagName("MediaType")[0].firstChild;
                        var description = cases[k].getElementsByTagName("Description")[0] &&
                            cases[k].getElementsByTagName("Description")[0].firstChild;
                        // var fileTitle = cases[k].hasChildNodes("FileTitle") &&
                        //     cases[k].getElementsByTagName("FileTitle").item(0).firstChild.toString();
                        var caseDeveloper = cases[k].getElementsByTagName("Developer")[0] &&
                            cases[k].getElementsByTagName("Developer")[0].firstChild;
                        var expectation = cases[k].getElementsByTagName("Expectation")[0] &&
                            cases[k].getElementsByTagName("Expectation")[0].firstChild;
                        // console.log(caseId, caseCaption, caseDeveloper, serialNo, description, mediaType, fileTitle, expectation);
                    } catch (e) {
                        console.error(TAG, caseId, e.stack);
                    }
                    caseItems.push({
                        caseId: caseId,
                        caseCaption: caseCaption && caseCaption.toString(),
                        caseLibId: caseLibId,
                        groupName: groupName && groupName.toString(),
                        caseDeveloper: caseDeveloper && caseDeveloper.toString(),
                        serialNo: serialNo && serialNo.toString(),
                        description: description && description.toString(),
                        mediaType: mediaType && mediaType.toString(),
                        expectation: expectation && expectation.toString(),
                        fileTitle: fileTitle,
                        caseOrder: caseOrder && caseOrder.toString()
                    });
                }
            }
            Case.addCase2(caseItems, function (err1, result1) {
                if (err1) {
                    console.error(TAG, caseItems);
                    callback({retcode: "12", err: err1});
                    CaseLib.deleteCaseLib2({caseLibName: caseLibName}, function () {
                    });
                    return;
                }
                callback({retcode: "00"});
            });
        });
        // }
    };
    var deleteFolderRecursive = function (path) {
        var files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files && files.forEach(function (file, index) {
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
    var ImportTestCaseLib = function (params, callback) {
        var fileName = params.body && params.body.caseLibFileName;
        if (!fileName) {
            (typeof callback === "function") && (callback({retcode: "01", err: "案例库参数不合法"}));
            return;
        }
        fileName = "../temp/upload/" + fileName;
        if (!fs.existsSync(fileName)) {
            callback({retcode: "02", err: "案例库文件不存在"});
            return;
        }
        var caseLibName = fileName.substring(fileName.lastIndexOf("/") + 1,
            fileName.lastIndexOf(".")); //这里是Windows的，Linux路径分隔符为/
        var tempFile = "../temp/" + caseLibName;
        var caseLibDir = "../resource/" + caseLibName;
        !fs.existsSync(tempFile) && fs.mkdirSync(tempFile);
        !fs.existsSync(caseLibDir) && fs.mkdirSync(caseLibDir);

        fs.createReadStream(fileName).pipe(unzip.Extract({path: tempFile}));
        // var writeStream = fs.createWriteStream(tempFile);
        // fs.createReadStream(fileName).pipe(unzip.Parse()).pipe(writeStream);
        // //读取案例库索引信息插入数据库
        // writeStream.on("close", function () {
        setTimeout(function () {
            if (!fs.existsSync(tempFile + "/" + caseLibName + ".xml")) {
                (typeof callback === "function") && (callback({retcode: "03", err: "找不到案例库索引文件：" + caseLibName}));
                return;
            }
            readIndexIntoDB(tempFile + "/" + caseLibName + ".xml", function (result) {
                if (result.retcode !== "00") {
                    (typeof callback === "function") && (callback(result));
                    return;
                }
                var Wsapcrypt = require("../flow/wsapcrypt.js");
                var wsapcrypt = new Wsapcrypt();
                //拷贝所有案例流程和脚本文件到resource的案例库文件夹下
                rd.eachSync(tempFile, function (f, s) {
                    // console.log('file: %s', f);
                    var type = f.substring(f.lastIndexOf(".") + 1);
                    var name = f.substring(f.lastIndexOf("\\") + 1, f.lastIndexOf("."));
                    if (name === caseLibName) {
                        //不拷贝索引文件
                        // } else if (name == "userLib") { //用户自定义库
                    } else if (type.length > 0) {
                        var file = f.substring(f.lastIndexOf("\\") + 1);
                        if (type === "js" || type === "xml") {
                            fs.createReadStream(f).pipe(fs.createWriteStream(caseLibDir + "/" + file));
                        } else if (type === "zjs" || type === "zjx") {//加密文件
                            // if (global.IsCrypted)
                            var tempType = "";
                            type === "zjs" && (tempType = "js");
                            type === "zjx" && (tempType = "xml");
                            file = file.substring(0, file.lastIndexOf(".") + 1) + tempType;
                            fs.writeFileSync(caseLibDir + "/" + file, wsapcrypt.readFileSync(f));
                        }
                    }
                });
                (typeof callback === "function") && (callback(result));
                global.socket_ui.emit("DataUpdate", {type: "CaseLib"});
            });
            // });
        }, 2000);
        setTimeout(function () {
            //读取完成删除缓存
            deleteFolderRecursive(tempFile);
        }, 10000);
    };

    var QueryCaseLib = function (params, callback) {
        CaseLib.getCaseLibs2({}, {fields: {caseLibName: 1}},
            function (err, result) {
                (typeof callback === "function") && (
                    err ? callback({retcode: "01", err: err})
                        : callback({retcode: "00", caselib: result}));
            });
    };
    var QueryCaseLibP = function (params, callback) {
        var caselib = {};
        params.body && params.body.caseLibName && (caselib.caseLibName = params.body && params.body.caseLibName);
        params.body && params.body.caseLibType && (caselib.caseLibType = params.body && params.body.caseLibType);
        var pageSize = params.body && params.body.pageSize;
        var pageNum = params.body && params.body.pageNum;
        if (!(pageSize && pageNum && pageSize > 0 && pageNum > 0)) {
            (typeof callback === "function") && (callback({retcode: "01", err: "pageSize和pageNum必须大于0"}));
            return;
        }
        CaseLib.getPageCases2(caselib, pageSize, pageNum, function (err, result, total) {
            (typeof callback === "function") && (
                err ? callback({retcode: "02", err: err})
                    : callback({retcode: "00", total: total, caseLibs: result}));
        });
    };
    var DeleteCaseLib = function (params, callback) {
        var caseLibId = params.body && params.body.caseLibId;
        if (!caseLibId) {
            (typeof callback === "function") && (callback({retcode: "01", err: "案例库ID不存在"}));
            return;
        }
        CaseLib.getCaseLibs2({_id: ObjectId(caseLibId)}, {}, function (err, result) {
            if (err) {
                (typeof callback === "function") && (callback({retcode: "02", err: err}));
                return;
            }
            var caseLibName = result[0] && result[0].caseLibName;
            CaseLib.deleteCaseLib2({_id: ObjectId(caseLibId)}, function (err, result) {
                if (err) {
                    (typeof callback === "function") && (callback({retcode: "03", err: err}));
                    return;
                }
                Case.deleteCase2({caseLibId: ObjectId(caseLibId)}, function (err, result1) {
                    if (err) {
                        (typeof callback === "function") && callback({retcode: "04", err: err})
                    } else {
                        (typeof callback === "function") && callback({retcode: "00"});
                        global.socket_ui.emit("DataUpdate", {type: "CaseLib", id: caseLibId});
                    }
                });
            });
            Project.getProject2({caseLibId: ObjectId(caseLibId)}, {}, function (err, result) {
                result && deleteFolderRecursive(path.resolve(__dirname, "../../resource/" + caseLibName));
                // fs.existsSync(path.resolve(__dirname, "../../temp/" + caseLibName + ".zip"))
                // && fs.unlinkSync(path.resolve(__dirname, "../../temp/" + caseLibName + ".zip"));
            });
        });
    };
    var QueryCaseLibGroup = function (params, callback) {
        var caseLibId = params.body && params.body.caseLibId;
        if (!caseLibId) {
            (typeof callback === "function") && (callback({retcode: "01", err: "案例库ID不存在"}));
            return;
        }
        Case.getCases2({_id: ObjectId(caseLibId)},
            {fields: {groupName: 1, _id: 0}}, function (err, result) {
                (typeof callback === "function") && (
                    err ? callback({retcode: "02", err: err})
                        : callback({retcode: "00", caseLibGoups: result}));
            });
    };
    var QueryCaseLibDetail = function (params, callback) {
        var caseLibId = params.body && params.body.caseLibId;
        var groupName = params.body && params.body.groupName;
        if (!(caseLibId && groupName)) {
            (typeof callback === "function") && (callback({retcode: "01", err: "caseLibId和groupName不合法"}));
            return;
        }
        Case.getCases2({caseLibId: caseLibId, groupName: {$in: groupName}}, {}, function (err, result) {
            if (err) {
                (typeof callback === "function") && (callback({retcode: "02", err: err}));
                return;
            }
            var res = [];
            for (var i = 0; i < groupName.length; i++) {
                res[i] = {caseGroupName: groupName[i], caseItems: []};
            }
            // console.log(res);
            result && result.forEach(function (name) {
                if (groupName.indexOf(name.groupName) > -1) {
                    console.log(groupName.indexOf(name.groupName));
                    //res[groupName.indexOf(name.groupName)].caseGroupName = name.groupName;
                    res[groupName.indexOf(name.groupName)].caseItems.push(name);
                }
            });
            (typeof callback === "function") && (callback({retcode: "00", caseLibDetail: res}));
        });
    };
    var QueryCases = function (params, callback) {
        var caseLibId = params.body && params.body.caseLibId;
        if (!caseLibId) {
            (typeof callback === "function") && (callback({retcode: "01", err: "案例库ID不存在"}));
            return;
        }
        Case.getCases2({caseLibId: ObjectId(caseLibId)},
            {groupName: 1, "_id": 0}, function (err, result) {
                if (err) {
                    (typeof callback === "function") && (callback({retcode: "02", err: err}));
                    return;
                }
                var groups = [];
                for (var i = 0; i < result.length; i++) {
                    var exist = false;
                    for (var j = 0; j < groups.length; j++) {
                        if (groups[j].groupName == result[i].groupName) {
                            exist = true;
                            break;
                        }
                    }
                    !exist && groups.push(result[i]);
                }
                // console.error(groups);
                groups && groups.forEach(function (name) {
                    Case.getCases2({caseLibId: ObjectId(caseLibId), groupName: name.groupName},
                        {caseId: 1, caseCaption: 1}, function (err1, result1) {
                            if (err1) {
                                (typeof callback === "function") && (callback({retcode: "03", err: err1}));
                                return;
                            }
                            name.cases = result1;
                        });
                });
                setTimeout(function () {
                    (typeof callback === "function") && (callback({retcode: "00", casetree: groups}));
                }, 500);
            });
    };
    var QueryCaseDetail = function (params, callback) {
        var caseId = params.body && params.body.caseId;
        if (!caseId) {
            (typeof callback === "function") && (callback({retcode: "01", err: "案例库ID不存在"}));
            return;
        }
        Case.getCases2({_id: ObjectId(caseId)}, {}, function (err, result) {
            (typeof callback === "function") && (
                err ? callback({retcode: "02", err: err})
                    : callback({retcode: "00", details: result[0]}));
        });
    };

    var CreateTestProject = function (params, callback) {
        //插入工程表得到工程_id，作为工程案例信息插入工程案例表
        var project = params.body;
        // project.testClientID = "127.0.0.1";
        project.projectStatus = "NEW";
        project.projectCreateTime = new Date().toLocaleString();
        var caseItems = params.body && params.body.caseItems;
        if (!(Array.isArray(caseItems) && caseItems.length > 0 && project.testClientID)) {
            (typeof callback === "function") && (callback({retcode: "01", err: "参数不合法"}));
            return;
        }
        Project.addProject2(project, function (err, result) {
            var caseProjectId = result && result.ops && result.ops[0] && result.ops[0]._id;
            if (err || !caseProjectId) {
                (typeof callback === "function") && (callback({retcode: "02", err: err}));
                return;
            }
            var projectName = result.ops[0].projectName;
            for (var i = 0; i < caseItems.length; i++) {
                caseItems[i] = ObjectId(caseItems[i]._id);
            }
            Case.getCases2({_id: {$in: caseItems}}, {}, function (err, result) {
                if (err || result.length === 0) {
                    Project.deleteProject2({_id: ObjectId(caseProjectId)});
                    (typeof callback === "function") && (callback({retcode: "03", err: err}));
                    return;
                }
                CaseLib.getCaseLib2({_id: result[0].caseLibId}, {}, function (err1, result1) {
                    if (err1 || result1.length) {
                        (typeof callback === "function") && (callback({retcode: "04", err: err1}));
                        return;
                    }
                    var caseLibId = result1.caseLibId;
                    var caseLibName = result1.caseLibName;
                    var cases = [];
                    var finalCases = [];
                    result.forEach(function (res) {
                        res.caseProjectId = caseProjectId;
                        res.testInfo = {
                            caseStatus: "UNTESTED",
                            caseFilePath: "./" + projectName + "/" + res.caseId
                        };
                        res.caseLibName = caseLibName;
                        (res.caseOrder === "FINAL") ? finalCases.push(res) : cases.push(res);
                    });

                    ProjectCase.addProjectCase2(cases.concat(finalCases), function (err2, result2) {
                        if (err2) {
                            (typeof callback === "function") && callback({retcode: "05", err: err2})
                        } else {
                            (typeof callback === "function") && callback({retcode: "00"});
                            global.socket_ui.emit("DataUpdate", {type: "TestProject", id: caseProjectId});
                        }
                    });
                    Project.updateProject2({_id: caseProjectId},
                        {$set: {caseLibId: caseLibId, caseLibName: caseLibName}}, function (err, result) {
                            err && console.error(err);
                        });
                });
            });
        });
    };
    var DeleteTestProject = function (params, callback) {
        var caseProjectId = params.body && params.body.projectId;
        if (!caseProjectId) {
            (typeof callback === "function") && (callback({retcode: "01", err: "工程ID不存在"}));
            return;
        }
        Project.deleteProject2({_id: ObjectId(caseProjectId)}, function (err, result) {
            if (err) {
                (typeof callback === "function") && (callback({retcode: "02", err: err}));
                return;
            }
            ProjectCase.deleteProjectCase2({caseProjectId: ObjectId(caseProjectId)}, function (err, result1) {
                if (err) {
                    (typeof callback === "function") && callback({retcode: "03", err: err})
                } else {
                    (typeof callback === "function") && callback({retcode: "00"});
                    global.socket_ui.emit("DataUpdate", {type: "TestProject", id: caseProjectId});
                }
            });
        });
    };
    var QueryTestProject = function (params, callback) {
        var project = {};
        params.body && params.body.projectName
        && (project.projectName = params.body && params.body.projectName);
        params.body && params.body.tester
        && (project.tester = params.body && params.body.tester);
        var pageSize = params.body && params.body.pageSize;
        var pageNum = params.body && params.body.pageNum;
        if (!(pageSize && pageNum && pageSize > 0 && pageNum > 0)) {
            (typeof callback === "function") && (callback({retcode: "01", err: "pageSize和pageNum必须大于0"}));
            return;
        }
        Project.getPageProjects2(project, pageSize, pageNum, function (err, result, total) {
            (typeof callback === "function") && (
                err ? callback({retcode: "02", err: err})
                    : callback({retcode: "00", total: total, testProjectList: result}));
        });
    };
    var QueryTestProjectDetail = function (params, callback) {
        var projectId = params.body && params.body.projectId;
        if (!projectId) {
            (typeof callback === "function") && (callback({retcode: "01", err: "工程ID不存在"}));
            return;
        }
        Project.getProject2({_id: ObjectId(projectId)}, {}, function (err, result) {
            if (err || !result) {
                (typeof callback === "function") && (callback({retcode: "02", err: err}));
                return;
            }
            ProjectCase.getProjectCases2({caseProjectId: ObjectId(projectId)}, {}, function (err1, result1) {
                // result = result[0];
                try {
                    result.caseItems = result1;
                    result.retcode = "00";
                } catch (e) {
                    console.error(TAG, "QueryTestProjectDetail", result, e.stack);
                }
                // console.error(result);
                (typeof callback === "function") && (
                    err1 ? callback({retcode: "03", err: err1})
                        : callback(result));
            });
        });
    };
    var QueryTestProjectLog = function (params, callback) {
        var projectId = params.body && params.body.projectId;
        if (!projectId) {
            (typeof callback === "function") && (callback({retcode: "01", err: "工程ID不存在"}));
            return;
        }
        ProjectCase.getProjectCases2({caseProjectId: ObjectId(projectId)}, {
            caseCaption: 1, traceParameter: 1, _id: 0
        }, function (err, result) {
            if (err) {
                (typeof callback === "function") && (callback({retcode: "02", err: err}));
                return;
            }
            // result && result.forEach(function (cases) {
            //     cases.traceContent = [];
            //     cases.testTrace && cases.testTrace.forEach(function (trace) {
            //         cases.traceContent.push(trace.content);
            //     });
            //     delete cases.testTrace;
            // });
            (typeof callback === "function") && (callback({retcode: "00", log: result}));
        });
    };

    var Login = function (params, callback) {
        var username = params.body && params.body.username;
        var password = params.body && params.body.password;
        if (!(username && password)) {
            (typeof callback === "function") && (callback({retcode: "01", err: "用户名或密码为空"}));
            return;
        }
        User.getUser2({username: username}, {}, function (err, result) {
            if (err || !result) {
                (typeof callback === "function") && (callback({retcode: "02", err: username + "不存在"}));
                return;
            }
            User.getUser2({username: username, password: password}, {}, function (err, result) {
                (typeof callback === "function") && (
                    !result ? callback({retcode: "03", err: "密码错误"})
                        : callback({retcode: "00"}));
            });
        });
    };
    var AddUser = function (params, callback) {
        var username = params.body && params.body.username;
        var userinfo = params.body && params.body.userinfo;
        if (!(username && userinfo && userinfo.username && userinfo.password)) {
            (typeof callback === "function") && (callback({retcode: "01", err: "用户名或密码为空"}));
            return;
        }
        User.getUser2({username: username}, {}, function (err, result) {
            if (err || !result) {
                (typeof callback === "function") && (callback({retcode: "02", err: username + "不存在"}));
                return;
            }
            var role = result.role;//权限控制 不低于userinfo.role
        });
    };
    var DeleteUser = function (params, callback) {
        var username = params.body && params.body.username;
        var userinfo = params.body && params.body.userinfo;
        if (!(username && userinfo && userinfo.username)) {
            (typeof callback === "function") && (callback({retcode: "01", err: "用户名或密码为空"}));
            return;
        }
        User.getUser2({username: username}, {}, function (err, result) {
            if (err || !result) {
                (typeof callback === "function") && (callback({retcode: "02", err: username + "不存在"}));
                return;
            }
            var role = result.role;//权限控制 不低于userinfo.role
        });
    };
    var QueryUser = function (params, callback) {
        var username = params.body && params.body.username;
        if (!(username)) {
            (typeof callback === "function") && (callback({retcode: "01", err: "用户名或密码为空"}));
            return;
        }
        User.getUser2({username: username}, {}, function (err, result) {
            if (err || !result) {
                (typeof callback === "function") && (callback({retcode: "02", err: username + "不存在"}));
                return;
            }
            var role = result.role;//权限控制 不低于userinfo.role
            User.getUsers2({}, {}, function (err, result) {

            });
        });
    };
    var UpdateUser = function (params, callback) {
        var username = params.body && params.body.username;
        var userinfo = params.body && params.body.userinfo;
        if (!(username && userinfo && userinfo.username && userinfo.password)) {
            (typeof callback === "function") && (callback({retcode: "01", err: "用户名或密码为空"}));
            return;
        }
        User.getUser2({username: username}, {}, function (err, result) {
            if (err || !result) {
                (typeof callback === "function") && (callback({retcode: "02", err: username + "不存在"}));
                return;
            }
            var role = result.role;//权限控制 不低于userinfo.role
        });
    };

    var QueryCaseFiles = function (params, callback) {
        var projectCaseId = params.body && params.body.projectCaseId;
        var url = params.body && params.body.url;
        if (!(projectCaseId && url)) {
            callback({retcode: "01", err: "请求参数不合法"});
            return;
        }
        ProjectCase.getProjectCase2({_id: ObjectId(projectCaseId)}, {}, function (err, result) {
            if (err || result.length === 0) {
                callback({retcode: "02", err: "数据库查询失败"});
                return
            }
            // console.error(TAG, "result", JSON.stringify(result));
            var caseFilePath = result.testInfo && result.testInfo.caseFilePath;
            var realPath = path.resolve(__dirname, CASE_FILE_ROOT_PATH, caseFilePath, url);
            fs.readdir(realPath, function (err, files) {
                if (err) {
                    console.error(err);
                    callback({retcode: "03", err: "文件读取失败"});
                    return;
                }
                console.error(TAG, "files", JSON.stringify(files));
                // var ip = require('os').networkInterfaces().本地连接[0].address;//win7
                // var ip = require('os').networkInterfaces().以太网[0].address;//win10
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var retUrl = path.join(caseFilePath, url, file);
                    retUrl = retUrl.replace(/\\/g, "/");
                    // files[i] = {fileName: file, url: ip + ":8080/" + retUrl};
                    files[i] = {fileName: file, url: retUrl};
                }
                // console.error(TAG, "files1", files);
                callback({retcode: "00", files: files});
            });
        });
    };

    var AddAtmap = function (params, callback) {
        var atmap = params.body;
        if (!(atmap.testClientID && atmap.testClientIP)) {
            callback({retcode: "01", err: "终端ID或者IP为空"});
            return;
        }
        Atmap.addAtmap(atmap, function (err, result) {
            (typeof callback === "function") && (
                err ? callback({retcode: "02", err: err})
                    : callback({retcode: "00", atmaps: result}));
        });
    };
    var DropAtmap = function (params, callback) {
        var _id = params.body && params.body._id;
        if (!_id) {
            callback({retcode: "01", err: "终端ID为空"});
            return;
        }
        Atmap.deleteAtmap({_id: ObjectId(_id)}, function (err, result) {
            err ? callback({retcode: "02", err: err})
                : callback({retcode: "00"});
        });
    };
    var QueryAtmap = function (params, callback) {
        Atmap.getAtmaps({}, {}, function (err, result) {
            (typeof callback === "function") && (
                err ? callback({retcode: "02", err: err})
                    : callback({retcode: "00", atmaps: result}));
        });
    };
    var QueryPageAtmap = function (params, callback) {
        var pageSize = params.body && params.body.pageSize;
        var pageNum = params.body && params.body.pageNum;
        if (!(pageSize && pageNum)) {
            callback({retcode: "01", err: "接口参数不合法"});
            return;
        }
        Atmap.getPageAtmap({}, pageSize, pageNum, function (err, result, total) {
            (typeof callback === "function") && (
                err ? callback({retcode: "02", err: err})
                    : callback({retcode: "00", total: total, atmaps: result}));
        });
    };
    var UpdateAtmap = function (params, callback) {
        var atmap = params.body;
        if (!(atmap.testClientID && atmap.testClientIP)) {
            callback({retcode: "01", err: "终端ID或者IP为空"});
            return;
        }
        Atmap.updateAtmap({testClientID: atmap.testClientID}, {$set: atmap}, function (err, result) {
            (typeof callback === "function") && (
                err ? callback({retcode: "02", err: err})
                    : callback({retcode: "00", atmaps: result}));
        });
    };
} catch (e) {
    console.error(TAG, e.stack);
}