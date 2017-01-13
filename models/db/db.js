/**
 * Created by Chance on 16/08/30.
 */

var TAG = "[db.js]: ";
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/ZJPecker';
// var url = 'mongodb://10.34.10.245:27017/ZJPecker';

//old with some problems
module.exports = new Db("ZJPecker",
    new Server("localhost", 27017),
    {safe: true});

//Deprecated
module.exports.insert = function (collection, indexs, docs, callback) {
    try {
        MongoClient.connect(url, function (err, db) {
            var col = db.collection(collection);
            col.ensureIndex(indexs, {"unique": true})
                .then(function (indexName) {
                    col.insert(docs, {keepGoing: true, ordered: true}, function (err, result) {
                        err && console.error("err", err);
                        log("insert", collection);
                        callback(err, result);
                        db.close();
                    });
                });
        });
    } catch (e) {
        console.error(TAG, e.stack);
    }
};
//Inserts an array of documents into MongoDB.
module.exports.insertMany = function (collection, indexs, docs, callback) {
    try {
        MongoClient.connect(url, function (err, db) {
            var col = db.collection(collection);
            col.ensureIndex(indexs, {"unique": true})
                .then(function (indexName) {
                    col.insertMany(docs, {keepGoing: true, ordered: true}, function (err, result) {
                        err && console.error("err", err);
                        log("insertMany", collection);
                        callback(err, result);
                        db.close();
                    });
                });
        });
    } catch (e) {
        console.error(TAG, e.stack);
    }
};
//Inserts a single document into MongoDB.
module.exports.insertOne = function (collection, indexs, doc, callback) {
    try {
        MongoClient.connect(url, function (err, db) {
            var col = db.collection(collection);
            col.ensureIndex(indexs, {"unique": true})
                .then(function (indexName) {
                    col.insertOne(doc, {keepGoing: true}, function (err, result) {
                        err && console.error("err", err);
                        log("insertOne", collection);
                        callback(err, result);
                        db.close();
                    });
                });
        });
    } catch (e) {
        console.error(TAG, e.stack);
    }
};

//Deprecated
module.exports.remove = function (collection, selector, callback) {
    try {
        MongoClient.connect(url, function (err, db) {
            var col = db.collection(collection);
            col.remove(selector, {w: 1}, function (err, result) {
                err && console.error("err", err);
                log("remove", collection, selector);
                callback(err, result);
                db.close();
            });
        });
    } catch (e) {
        console.error(TAG, e.stack);
    }
};
//Delete multiple documents on MongoDB
module.exports.deleteMany = function (collection, filter, callback) {
    try {
        MongoClient.connect(url, function (err, db) {
            var col = db.collection(collection);
            col.deleteMany(filter, {w: 1}, function (err, result) {
                err && console.error("err", err);
                log("deleteMany", collection, filter);
                callback(err, result);
                db.close();
            });
        });
    } catch (e) {
        console.error(TAG, e.stack);
    }
};
//Delete a document on MongoDB
module.exports.deleteOne = function (collection, filter, callback) {
    try {
        MongoClient.connect(url, function (err, db) {
            var col = db.collection(collection);
            col.deleteOne(filter, {w: 1}, function (err, result) {
                err && console.error("err", err);
                log("deleteOne", collection, filter);
                callback(err, result);
                db.close();
            });
        });
    } catch (e) {
        console.error(TAG, e.stack);
    }
};

//Creates a cursor for a query that can be used to iterate over results from MongoDB
module.exports.getMany = function (collection, query, options, callback) {
    try {
        MongoClient.connect(url, function (err, db) {
            var col = db.collection(collection);
            col.find(query, options).sort({_id: 1}).toArray(function (err, result) {
                // col.find(query, options).toArray(function (err, result) {
                err && console.error("err", err);
                log("getMany", collection, query);
                callback(err, result);
                db.close();
            });
        });
    } catch (e) {
        console.error(TAG, e.stack);
    }
};
//Fetches the first document that matches the query
module.exports.getOne = function (collection, query, options, callback) {
    try {
        MongoClient.connect(url, function (err, db) {
            var col = db.collection(collection);
            col.findOne(query, options, function (err, result) {
                err && console.error("err", err);
                log("getOne", collection, query);
                callback(err, result);
                db.close();
            });
        });
    } catch (e) {
        console.error(TAG, e.stack);
    }
};


//Fetches the first document that matches the query
module.exports.getPage = function (collection, query, pageSize, pageNum, callback) {
    try {
        MongoClient.connect(url, function (err, db) {
            var col = db.collection(collection);
            //var query = {};
            //使用 count 返回特定查询的文档数 total
            col.count(query, function (err, total) {
                //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
                col.find(query, {
                    skip: (pageNum - 1) * pageSize,
                    limit: pageSize
                }).toArray(function (err, docs) {
                    db.close();
                    if (err) {
                        console.error(err);
                        return callback(err);
                    }
                    log("getPage", collection, pageSize, pageNum);
                    callback(null, docs, total);
                });
            });
        });
    } catch (e) {
        console.error(TAG, e.stack);
    }
};

//The distinct command returns returns a list of distinct values for the given key across a collection.
module.exports.distinct = function (collection, key, query, options, callback) {
    try {
        MongoClient.connect(url, function (err, db) {
            var col = db.collection(collection);
            col.distinct(key, query, options, function (err, result) {
                err && console.error("err", err);
                log("distinct", collection, key, query);
                callback(err, result);
                db.close();
            });
        });
    } catch (e) {
        console.error(TAG, e.stack);
    }
};

//Deprecated
module.exports.update = function (collection, selector, document, callback) {
    try {
        MongoClient.connect(url, function (err, db) {
            err && console.error("err", err);
            var col = db.collection(collection);
            col.update(selector, document, {multi: true, keepGoing: true}, function (err, result) {
                err && console.error("err", err);
                log("update", collection, selector);
                callback(err, result);
                db.close();
            });
        });
    } catch (e) {
        console.error(TAG, e.stack);
    }
};
//Update multiple documents on MongoDB
module.exports.updateMany = function (collection, filter, update, callback) {
    try {
        MongoClient.connect(url, function (err, db) {
            var col = db.collection(collection);
            col.updateMany(filter, update, {keepGoing: true}, function (err, result) {
                err && console.error("err", err);
                log("updateMany", collection, filter);
                callback(err, result);
                db.close();
            });
        });
    } catch (e) {
        console.error(TAG, e.stack);
    }
};
//Update a single document on MongoDB
module.exports.updateOne = function (collection, filter, update, callback) {
    try {
        MongoClient.connect(url, function (err, db) {
            var col = db.collection(collection);
            col.updateOne(filter, update, {keepGoing: true}, function (err, result) {
                err && console.error("err", err);
                log("updateOne", collection, filter);
                callback(err, result);
                db.close();
            });
        });
    } catch (e) {
        console.error(TAG, e.stack);
    }
};

var getTime = function () {
    return "(" + new Date().toLocaleString() + ")";
};
var log = function () {
    var str = getTime() + "[" + arguments[0] + "]";
    for (var i = 1; i < arguments.length; i++) {
        if (arguments[i])
            str += " ===== " + JSON.stringify(arguments[i]);
    }
    console.log(str);
};
module.exports.dbLog = log;