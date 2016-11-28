/**
 * Created by Chance on 16/11/10.
 */

var TAG = "[>>>db_project.js]: ";
var COLLECTION = "projects";
var INDEXS = {projectName: 1};
var mongodb = require("./db");

function Project(project) {
    this.projectName = project.projectName;
    this.caseLibId = project.caseLibId;
    this.deviceType = project.deviceType;
    this.testSite = project.testSite;
    this.testStartTime = project.testStartTime;
    this.testEndTime = project.testEndTime;
    this.tester = project.tester;
    this.envirement = project.envirement || {};
    this.envirement.SPVersion = project.envirement && project.envirement.SPVersion;
    this.envirement.APVersion = project.envirement && project.envirement.APVersion;
    this.envirement.OSVersion = project.envirement && project.envirement.OSVersion;
    this.envirement.systemPatchVersion = project.envirement && project.envirement.systemPatchVersion;
    this.projectStatus = project.projectStatus;
}

//添加工程
Project.addProject = function (project, callback) {
    if (!(project.projectName && project.caseLibId)) {
        console.log(TAG + "projectName or caseLibId undefined!");
        return;
    }
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(COLLECTION, function (err, collection) {  //projects为工程表
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne({projectName: project.projectName}, function (err, result) {
                if (err || result) {
                    mongodb.close();
                    console.log(TAG + project.projectName + " exists or dbError!");
                    return callback(err, result);
                }
                collection.insert(project, {safe: true}, function (err, result) {
                    mongodb.close();
                    if (err) {
                        console.log(TAG + err);
                        return callback(err);
                    }
                    console.log(TAG + "addProject finished!");
                    return callback(null, result.result);
                });
            });
        });
    });
};
Project.addProject2 = function (projects, callback) {
    if (Array.isArray(projects)) {
        for (var i = 0; i < projects.length; i++)
            projects[i] = new Project(projects[i]);
    } else {
        projects = new Project(projects);
    }
    mongodb.insert(COLLECTION, INDEXS, projects, function (err, result) {
        callback(err, result);
    });
};

////批量添加工程
//Project.addProjects = function (projects, callback) {
//    var batchAddProject = function (projects, index, callback) {
//        if (index >= projects.length) return;
//        Project.addProject(projects[index], function (err, result) {
//            callback(err, result);
//            batchAddProject(projects, ++index, callback);
//        });
//    };
//    batchAddProject(projects, 0, callback);
//};

//删除指定工程
Project.deleteProject = function (projectName, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(COLLECTION, function (err, collection) {  //projects为工程表
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //如果remove没有任何的参数，则删除全部。
            collection.remove({projectName: projectName}, {safe: true}, function (err, result) {
                mongodb.close();
                if (err) {
                    console.log(TAG + err);
                    return callback(err);
                }
                console.log(TAG + "deleteProject finished!");
                callback(null, result.result);
            });
        });
    });
};
Project.deleteProject2 = function (selector, callback) {
    mongodb.remove(COLLECTION, selector, function (err, result) {
        callback(err, result);
    });
};

//获取所有工程信息
Project.getProjects = function (filter, out, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(COLLECTION, function (err, collection) {  //projects为工程表
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.find(filter, out).toArray(function (err, result) {
                mongodb.close();
                if (err) {
                    console.log(TAG + err);
                    return callback(err);
                }
                console.log(TAG + "getProjects finished!");
                callback(null, result);
            });
        });
    });
};
Project.getProjects2 = function (query, options, callback) {
    mongodb.getMany(COLLECTION, query, options, function (err, result) {
        callback(err, result);
    });
};

Project.getPageProjects2 = function (query, pageSize, pageNum, callback) {
    mongodb.getPage(COLLECTION, query, pageSize, pageNum, function (err, result, total) {
        callback(err, result, total);
    });
};

//获取指定工程信息
Project.getProject = function (project, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(COLLECTION, function (err, collection) {  //projects为工程表
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne(project, function (err, result) {
                mongodb.close();
                if (err) {
                    console.log(TAG + err);
                    return callback(err);
                }
                console.log(TAG + "getProject finished!");
                callback(null, result);
            });
        });
    });
};
Project.getProject2 = function (query, options, callback) {
    mongodb.getOne(COLLECTION, query, options, function (err, result) {
        callback(err, result);
    });
};

//更新指定工程信息
Project.updateProject = function (project, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(COLLECTION, function (err, collection) {  //projects为工程表
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.update({projectName: project.projectName},
                {
                    $set: {
                        caseLibId: project.caseLibId,
                        deviceType: project.deviceType,
                        testSite: project.testSite,
                        testStartTime: project.testStartTime,
                        testEndTime: project.testEndTime,
                        tester: project.tester,
                        envirement: {
                            SPVersion: project.envirement.SPVersion,
                            APVersion: project.envirement.APVersion,
                            OSVersion: project.envirement.OSVersion,
                            systemPatchVersion: project.envirement.systemPatchVersion
                        },
                        projectStatus: project.projectStatus
                    }
                }, function (err, result) {
                    mongodb.close();
                    if (err) {
                        console.log(TAG + err);
                        return callback(err);
                    }
                    console.log(TAG + "updateProject finished!");
                    callback(null, result.result);
                });
        });
    });
};
Project.updateProject2 = function (selector, document, callback) {
    mongodb.update(COLLECTION, selector, document, function (err, result) {
        callback(err, result);
    });
};

module.exports = Project;