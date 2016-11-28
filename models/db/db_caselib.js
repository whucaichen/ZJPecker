/**
 * Created by Chance on 16/11/10.
 */

var TAG = "[>>>db_caselib.js]: ";
var COLLECTION = "caselibs";
var INDEXS = {caseLibName: 1};
var mongodb = require("./db");

function CaseLib(caselib) {
    this.caseLibName = caselib.caseLibName;
    this.caseLibType = caselib.caseLibType;
    this.importTime = caselib.importTime;
    this.importUser = caselib.importUser;
    this.casedeveloper = caselib.casedeveloper;
}

//添加案例库
CaseLib.addCaseLib = function (caselib, callback) {
    if (!caselib.caseLibName) {
        console.log(TAG + "caseLibName undefined!");
        return;
    }
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(COLLECTION, function (err, collection) {  //caselibs为案例库表
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne({caseLibName: caselib.caseLibName}, function (err, result) {
                if (err || result) {
                    mongodb.close();
                    console.log(TAG + caselib.caseLibName + " exists or dbError!");
                    return callback(err, result);
                }
                collection.insert(caselib, {safe: true}, function (err, result) {
                    mongodb.close();
                    if (err) {
                        console.log(TAG + err);
                        return callback(err);
                    }
                    console.log(TAG + "addCaseLib finished!");
                    return callback(null, result.result);
                });
            });
        });
    });
};
CaseLib.addCaseLib2 = function (caselibs, callback) {
    if (Array.isArray(caselibs)) {
        for (var i = 0; i < caselibs.length; i++)
            caselibs[i] = new CaseLib(caselibs[i]);
    } else {
        caselibs = new CaseLib(caselibs);
    }
    mongodb.insert(COLLECTION, INDEXS, caselibs, function (err, result) {
        callback(err, result);
    });
};

////批量添加案例库
//CaseLib.addCaseLibs = function (caselibs, callback) {
//    var batchAddCaseLib = function (caselibs, index, callback) {
//        if (index >= caselibs.length) return;
//        CaseLib.addCaseLib(caselibs[index], function (err, result) {
//            callback(err, result);
//            batchAddCaseLib(caselibs, ++index, callback);
//        });
//    };
//    batchAddCaseLib(caselibs, 0, callback);
//};

//删除指定案例库
CaseLib.deleteCaseLib = function (caseLibName, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(COLLECTION, function (err, collection) {  //caselibs为案例库表
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //如果remove没有任何的参数，则删除全部。
            collection.remove({caseLibName: caseLibName}, {safe: true}, function (err, result) {
                mongodb.close();
                if (err) {
                    console.log(TAG + err);
                    return callback(err);
                }
                console.log(TAG + "deleteCaseLib finished!");
                callback(null, result.result);
            });
        });
    });
};
CaseLib.deleteCaseLib2 = function (selector, callback) {
    mongodb.remove(COLLECTION, selector, function (err, result) {
        callback(err, result);
    });
};

//获取所有案例库信息
CaseLib.getCaseLibs = function (filter, out, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(COLLECTION, function (err, collection) {  //caselibs为案例库表
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
                console.log(TAG + "getCaseLibs finished!");
                callback(null, result);
            });
        });
    });
};
CaseLib.getCaseLibs2 = function (query, options, callback) {
    mongodb.getMany(COLLECTION, query, options, function (err, result) {
        callback(err, result);
    });
};
//mongodb.getMany(COLLECTION, new CaseLib({caseLibName: 'test0'}), {}, function (err, result) {
//    console.log(result);
//});

//获取指定案例库信息（案例对应的案例库索引id
CaseLib.getCaseLib = function (caselib, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(COLLECTION, function (err, collection) {  //caselibs为案例库表
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne(caselib, function (err, result) {
                mongodb.close();
                if (err) {
                    console.log(TAG + err);
                    return callback(err);
                }
                console.log(TAG + "getCaseLib finished!");
                callback(null, result);
            });
        });
    });
};
CaseLib.getCaseLib2 = function (query, options, callback) {
    mongodb.getOne(COLLECTION, query, options, function (err, result) {
        callback(err, result);
    });
};

CaseLib.getPageCases2 = function (query, pageSize, pageNum, callback) {
    mongodb.getPage(COLLECTION, query, pageSize, pageNum, function (err, result, total) {
        callback(err, result, total);
    });
};

//更新指定案例库信息
CaseLib.updateCaseLib = function (caselib, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(COLLECTION, function (err, collection) {  //caselibs为案例库表
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.update({caseLibName: caselib.caseLibName},
                {
                    $set: {
                        caseLibType: caselib.caseLibType,
                        importTime: caselib.importTime,
                        importUser: caselib.importUser,
                        caseDeveloper: caselib.caseDeveloper
                    }
                }, function (err, result) {
                    mongodb.close();
                    if (err) {
                        console.log(TAG + err);
                        return callback(err);
                    }
                    console.log(TAG + "updateCaseLib finished!");
                    callback(null, result.result);
                });
        });
    });
};
CaseLib.updateCaseLib2 = function (selector, document, callback) {
    mongodb.update(COLLECTION, selector, document, function (err, result) {
        callback(err, result);
    });
};

module.exports = CaseLib;