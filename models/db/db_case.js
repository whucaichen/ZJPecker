/**
 * Created by Chance on 16/11/10.
 */

var TAG = "[>>>db_case.js]: ";
var COLLECTION = "cases";
var INDEXS = {caseId: 1};
var mongodb = require("./db");

function Case(_case) {
    this.caseId = _case.caseId;
    this.caseCaption = _case.caseCaption;
    this.caseLibId = _case.caseLibId;
    this.groupName = _case.groupName;
    this.casedeveloper = _case.casedeveloper;
    this.serialNo = _case.serialNo;
    this.description = _case.description;
    this.mediaType = _case.mediaType;
    this.expectation = _case.expectation;
    this.fileTitle = _case.fileTitle;
}

//添加案例
Case.addCase = function (_case, callback) {
    if (!(_case.caseId && _case.caseLibId)) {
        console.log(TAG + "caseId or caseLibId undefined!");
        return;
    }
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(COLLECTION, function (err, collection) {  //cases为案例表
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne({caseId: _case.caseId}, function (err, result) {
                if (err || result) {
                    mongodb.close();
                    console.log(TAG + _case.caseId + " exists or dbError!");
                    return callback(err, result);
                }
                collection.insert(_case, {safe: true}, function (err, result) {
                    mongodb.close();
                    if (err) {
                        console.log(TAG + err);
                        return callback(err);
                    }
                    console.log(TAG + "addCase finished!");
                    return callback(null, result.result);
                });
            });
        });
    });
};
Case.addCase2 = function (cases, callback) {
    if (Array.isArray(cases)) {
        for (var i = 0; i < cases.length; i++)
            cases[i] = new Case(cases[i]);
    } else {
        cases = new Case(cases);
    }
    mongodb.insert(COLLECTION, INDEXS, cases, function (err, result) {
        callback(err, result);
    });
};

////批量添加案例
//Case.addCases = function (cases, callback) {
//    var batchAddCase = function (cases, index, callback) {
//        if (index >= cases.length) return;
//        Case.addCase(cases[index], function (err, result) {
//            callback(err, result);
//            batchAddCase(cases, ++index, callback);
//        });
//    };
//    batchAddCase(cases, 0, callback);
//};

//删除指定案例
Case.deleteCase = function (selector, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(COLLECTION, function (err, collection) {  //cases为案例表
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //如果remove没有任何的参数，则删除全部。
            collection.remove({caseId: caseId}, {safe: true}, function (err, result) {
                mongodb.close();
                if (err) {
                    console.log(TAG + err);
                    return callback(err);
                }
                console.log(TAG + "deleteCase finished!");
                callback(null, result.result);
            });
        });
    });
};
Case.deleteCase2 = function (selector, callback) {
    mongodb.remove(COLLECTION, selector, function (err, result) {
        callback(err, result);
    });
};

//获取所有案例信息
Case.getCases = function (filter, out, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(COLLECTION, function (err, collection) {  //cases为案例表
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
                console.log(TAG + "getCases finished!");
                callback(null, result);
            });
        });
    });
};
Case.getCases2 = function (query, options, callback) {
    mongodb.getMany(COLLECTION, query, options, function (err, result) {
        callback(err, result);
    });
};

//获取指定案例信息
Case.getCase = function (_case, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(COLLECTION, function (err, collection) {  //cases为案例表
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne(_case, function (err, result) {
                mongodb.close();
                if (err) {
                    console.log(TAG + err);
                    return callback(err);
                }
                console.log(TAG + "getCase finished!");
                callback(null, result);
            });
        });
    });
};
Case.getCase2 = function (query, options, callback) {
    mongodb.getOne(COLLECTION, query, options, function (err, result) {
        callback(err, result);
    });
};

//分页获取指定数量案例信息
Case.getPageCases = function (pageSize, pageNum, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(COLLECTION, function (err, collection) {  //cases为案例表
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            //使用 count 返回特定查询的文档数 total
            collection.count(query, function (err, total) {
                //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
                collection.find(query, {
                    skip: (pageNum - 1) * pageSize,
                    limit: pageSize
                }).toArray(function (err, docs) {
                    mongodb.close();
                    if (err) {
                        console.log(TAG + err);
                        return callback(err);
                    }
                    console.log(TAG + "getPageCases finished!");
                    callback(null, docs, total);
                });
            });
        });
    });
};
Case.getPageCases2 = function (query, pageSize, pageNum, callback) {
    mongodb.getPage(COLLECTION, query, pageSize, pageNum, function (err, result, total) {
        callback(err, result, total);
    });
};

//更新指定案例信息
Case.updateCase = function (_case, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(COLLECTION, function (err, collection) {  //cases为案例表
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.update({caseId: _case.caseId},
                {
                    $set: {
                        caseCaption: _case.caseCaption,
                        caseLibId: _case.caseLibId,
                        groupName: _case.groupName,
                        caseDeveloper: _case.caseDeveloper,
                        serialNo: _case.serialNo,
                        description: _case.description,
                        mediaType: _case.mediaType,
                        expectation: _case.expectation,
                        fileTitle: _case.fileTitle
                    }
                }, function (err, result) {
                    mongodb.close();
                    if (err) {
                        console.log(TAG + err);
                        return callback(err);
                    }
                    console.log(TAG + "updateCase finished!");
                    callback(null, result.result);
                });
        });
    });
};
Case.updateCase2 = function (selector, document, callback) {
    mongodb.update(COLLECTION, selector, document, function (err, result) {
        callback(err, result);
    });
};

module.exports = Case;