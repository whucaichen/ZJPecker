/**
 * Created by Chance on 16/08/30.
 */

var settings = require("./db_settings");
var Db = require('mongodb').Db;
var Mongos = require('mongodb').Mongos;
var Server = require('mongodb').Server;
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/ZJPecker';

//old with some problems
module.exports = new Db(settings.db,
    new Server(settings.host, settings.port),
    {safe: true});

//Deprecated
module.exports.insert = function (collection, indexs, docs, callback) {
    MongoClient.connect(url, function (err, db) {
        var col = db.collection(collection);
        col.ensureIndex(indexs, {"unique": true})
            .then(function (indexName) {
                col.insert(docs, {keepGoing: true, ordered: false}, function (err, result) {
                    log("insert", collection);
                    callback(err, result);
                    db.close();
                });
            });
    });
};
//Inserts an array of documents into MongoDB.
module.exports.insertMany = function (collection, indexs, docs, callback) {
    MongoClient.connect(url, function (err, db) {
        var col = db.collection(collection);
        col.ensureIndex(indexs, {"unique": true})
            .then(function (indexName) {
                col.insertMany(docs, {keepGoing: true, ordered: false}, function (err, result) {
                    log("insertMany", collection);
                    callback(err, result);
                    db.close();
                });
            });
    });
};
//Inserts a single document into MongoDB.
module.exports.insertOne = function (collection, indexs, doc, callback) {
    MongoClient.connect(url, function (err, db) {
        var col = db.collection(collection);
        col.ensureIndex(indexs, {"unique": true})
            .then(function (indexName) {
                col.insertOne(doc, {keepGoing: true, ordered: false}, function (err, result) {
                    log("insertOne", collection);
                    callback(err, result);
                    db.close();
                });
            });
    });
};

//Deprecated
module.exports.remove = function (collection, selector, callback) {
    MongoClient.connect(url, function (err, db) {
        var col = db.collection(collection);
        col.remove(selector, {w: 1}, function (err, result) {
            log("remove", collection, selector);
            callback(err, result);
            db.close();
        });
    });
};
//Delete multiple documents on MongoDB
module.exports.deleteMany = function (collection, filter, callback) {
    MongoClient.connect(url, function (err, db) {
        var col = db.collection(collection);
        col.deleteMany(filter, {w: 1}, function (err, result) {
            log("deleteMany", collection, filter);
            callback(err, result);
            db.close();
        });
    });
};
//Delete a document on MongoDB
module.exports.deleteOne = function (collection, filter, callback) {
    MongoClient.connect(url, function (err, db) {
        var col = db.collection(collection);
        col.deleteOne(filter, {w: 1}, function (err, result) {
            log("deleteOne", collection, filter);
            callback(err, result);
            db.close();
        });
    });
};

//Creates a cursor for a query that can be used to iterate over results from MongoDB
module.exports.getMany = function (collection, query, options, callback) {
    MongoClient.connect(url, function (err, db) {
        var col = db.collection(collection);
        col.find(query, options).toArray(function (err, result) {
            log("getMany", collection, query, options);
            callback(err, result);
            db.close();
        });
    });
};
//Fetches the first document that matches the query
module.exports.getOne = function (collection, query, options, callback) {
    MongoClient.connect(url, function (err, db) {
        var col = db.collection(collection);
        col.findOne(query, options, function (err, result) {
            log("getOne", collection, query, options);
            callback(err, result);
            db.close();
        });
    });
};


//Fetches the first document that matches the query
module.exports.getPage = function (collection, query, pageSize, pageNum, callback) {
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
                    console.log(TAG + err);
                    return callback(err);
                }
                log("getPage", collection, pageSize, pageNum);
                callback(null, docs, total);
            });
        });
    });
};

//The distinct command returns returns a list of distinct values for the given key across a collection.
module.exports.distinct = function (collection, key, query, options, callback) {
    MongoClient.connect(url, function (err, db) {
        var col = db.collection(collection);
        col.distinct(key, query, options, function (err, result) {
            log("distinct", collection, key, query, options);
            callback(err, result);
            db.close();
        });
    });
};

//Deprecated
module.exports.update = function (collection, selector, document, callback) {
    MongoClient.connect(url, function (err, db) {
        var col = db.collection(collection);
        col.update(selector, document, {multi: true, upsert: false}, function (err, result) {
            log("update", collection, selector, document);
            callback(err, result);
            db.close();
        });
    });
};
//Update multiple documents on MongoDB
module.exports.updateMany = function (collection, filter, update, callback) {
    MongoClient.connect(url, function (err, db) {
        var col = db.collection(collection);
        col.updateMany(filter, update, {keepGoing: true}, function (err, result) {
            log("updateMany", collection, filter, update);
            callback(err, result);
            db.close();
        });
    });
};
//Update a single document on MongoDB
module.exports.updateOne = function (collection, filter, update, callback) {
    MongoClient.connect(url, function (err, db) {
        var col = db.collection(collection);
        col.updateOne(filter, update, {keepGoing: true}, function (err, result) {
            log("updateOne", collection, filter, update);
            callback(err, result);
            db.close();
        });
    });
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