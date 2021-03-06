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

//打包案例库文件多个？索引文件多个？
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
                var caseId = caseName;
                var fileTitle = caseName;

                // var caseId = cases[k].hasChildNodes("CaseId") &&
                //     cases[k].getElementsByTagName("CaseId").item(0).firstChild.toString();
                var serialNo = cases[k].getElementsByTagName("SerialNo").item(0) &&
                    cases[k].getElementsByTagName("SerialNo").item(0).firstChild.toString();
                var caseCaption = cases[k].getElementsByTagName("Caption").item(0) &&
                    cases[k].getElementsByTagName("Caption").item(0).firstChild.toString();
                var mediaType = cases[k].getElementsByTagName("MediaType").item(0) &&
                    cases[k].getElementsByTagName("MediaType").item(0).firstChild.toString();
                var description = cases[k].getElementsByTagName("Description").item(0) &&
                    cases[k].getElementsByTagName("Description").item(0).firstChild.toString();
                // var fileTitle = cases[k].hasChildNodes("FileTitle") &&
                //     cases[k].getElementsByTagName("FileTitle").item(0).firstChild.toString();
                var caseDeveloper = cases[k].getElementsByTagName("Developer").item(0) &&
                    cases[k].getElementsByTagName("Developer").item(0).firstChild.toString();
                var expectation = cases[k].getElementsByTagName("Expectation").item(0) &&
                    cases[k].getElementsByTagName("Expectation").item(0).firstChild.toString();
                // console.log(caseId, caseCaption, caseDeveloper, serialNo, description, mediaType, fileTitle, expectation);

                caseItems.push({
                    caseId: caseId,
                    caseCaption: caseCaption,
                    caseLibId: caseLibId,
                    groupName: groupName,
                    caseDeveloper: caseDeveloper,
                    serialNo: serialNo,
                    description: description,
                    mediaType: mediaType,
                    expectation: expectation,
                    fileTitle: fileTitle
                });
            }
        }
        Case.addCase2(caseItems, function (err1, result1) {
            err1 ? callback({retcode: "12", err: err1})
                : callback({retcode: "00"});
        });
    });
    // }
};
// readIndexIntoDB("../cfg/index.xml", function (code) {
//     console.log(code);
// });

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

//fs相关优化
var ImportTestCaseLib = function (params, callback) {
    var fileName = params.body && params.body.caseLibFileName;
    if (!fileName) {
        (typeof callback === "function") && (callback({retcode: "01", err: "案例库参数不合法"}));
        return;
    }
    fileName = "../temp/" + fileName;
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
    //读取案例库索引信息插入数据库
    setTimeout(function () {
        if (!fs.existsSync(tempFile + "/" + caseLibName + ".xml")) {
            (typeof callback === "function") && (callback({retcode: "03", err: "找不到案例库索引文件：" + caseLibName}));
            return;
        }
        readIndexIntoDB(tempFile + "/" + caseLibName + ".xml", function (result) {
            if (result.retcode != "00") {
                (typeof callback === "function") && (callback(result));
                return;
            }
            //拷贝所有案例流程和脚本文件到resource的案例库文件夹下
            rd.eachSync(tempFile, function (f, s) {
                // console.log('file: %s', f);
                var type = f.substring(f.lastIndexOf(".") + 1);
                var name = f.substring(f.lastIndexOf("\\") + 1, f.lastIndexOf("."));
                if (name == caseLibName) {
                    //不拷贝索引文件
                    // } else if (name == "userLib") { //用户自定义库
                } else {    //案例流程和案例脚本
                    if (type === "js" || type === "xml") {
                        var file = f.substring(f.lastIndexOf("\\") + 1);
                        fs.createReadStream(f).pipe(
                            fs.createWriteStream(caseLibDir + "/" + file));
                    }
                }
            });
            (typeof callback === "function") && (callback(result));
            global.socket_ui.emit("DataUpdate", {type: "CaseLib"});
        });
    }, 2000);
    setTimeout(function () {
        //读取完成删除缓存
        deleteFolderRecursive(tempFile);
    }, 10000);
};
// ImportTestCaseLib({body: {caseLibFileName: "jianhang.zip"}});

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
        // deleteFolderRecursive(path.resolve(__dirname, "../../resource/" + caseLibName));
        // fs.existsSync(path.resolve(__dirname, "../../temp/" + caseLibName + ".zip"))
        // && fs.unlinkSync(path.resolve(__dirname, "../../temp/" + caseLibName + ".zip"));
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
    project.projectStatus = "NEW";
    project.projectCreateTime = new Date().toLocaleString();
    var caseItems = params.body && params.body.caseItems;
    var cases = [];
    Project.addProject2(project, function (err, result) {
        var caseProjectId = result.insertedIds && result.insertedIds[1];
        if (err || !caseProjectId) {
            (typeof callback === "function") && (callback({retcode: "01", err: err}));
            return;
        }
        var projectName = result.ops[0].projectName;
        Case.getCases2({}, {}, function (err1, result1) {
            if (err1) {
                Project.deleteProject2({_id: ObjectId(caseProjectId)});
                (typeof callback === "function") && (callback({retcode: "02", err: err1}));
                return;
            }
            (result1.length > 0) && CaseLib.getCaseLib2({_id: result1[0].caseLibId}, {}, function (err2, result2) {
                if (err2) {
                    (typeof callback === "function") && (callback({retcode: "03", err: err2}));
                    return;
                }
                var caseLibId = result1[0].caseLibId;
                var caseLibName = result2.caseLibName;
                caseItems && caseItems.forEach(function (item) {
                    result1 && result1.forEach(function (res) {
                        if (res._id.toString() === item._id) {
                            res.caseProjectId = caseProjectId;
                            res.testInfo = {
                                caseStatus: "UNTESTED",
                                caseFilePath: "./" + projectName + "/" + res.caseId
                            };
                            res.caseLibName = caseLibName;

                            // caseLibId = res.caseLibId;
                            cases.push(res);
                        }
                    });
                });
                ProjectCase.addProjectCase2(cases, function (err2, result2) {
                    if (err2) {
                        (typeof callback === "function") && callback({retcode: "03", err: err2})
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
    Project.getProjects2({_id: ObjectId(projectId)}, {}, function (err, result) {
        if (err || !result) {
            (typeof callback === "function") && (callback({retcode: "02", err: err}));
            return;
        }
        ProjectCase.getProjectCases2({caseProjectId: ObjectId(projectId)}, {}, function (err1, result1) {
            result = result[0];
            result.caseItems = result1;
            result.retcode = "00";
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
        caseCaption: 1, testTrace: 1, _id: 0
    }, function (err, result) {
        if (err) {
            (typeof callback === "function") && (callback({retcode: "02", err: err}));
            return;
        }
        result && result.forEach(function (cases) {
            cases.traceContent = [];
            cases.testTrace && cases.testTrace.forEach(function (trace) {
                cases.traceContent.push(trace.content);
            });
            delete cases.testTrace;
        });
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