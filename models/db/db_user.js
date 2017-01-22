/**
 * Created by Chance on 16/11/10.
 */

var TAG = "[>>>db_user.js]: ";
var COLLECTION = "users";
var INDEXS = {userid: 1};
var mongodb = require("./db");

function User(user) {
    this.username = user.username;
    this.userid = user.userid;
    this.password = user.password;
    this.roles = user.roles; //Arrays
    this.useradddate = user.useradddate || new Date().toLocaleString();
    this.userstatus = user.userstatus;
}

//添加用户
User.addUser = function (user, callback) {
    if (!(user.userid && user.password)) {
        console.log(TAG, "userid or password undefined!");
        return;
    }
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(COLLECTION, function (err, collection) {  //users为用户表
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne({userid: user.userid}, function (err, result) {
                if (err || result) {  //确认是否有相同用户存在, 如果出现错误或者用户存在就立即返回错误
                    mongodb.close();
                    console.log(TAG, user.userid + " exists or dbError!");
                    return callback(err, result);
                }
                collection.insert(user, {safe: true}, function (err, result) { //插入用户信息
                    mongodb.close();
                    if (err) {
                        console.log(TAG, err);
                        return callback(err);
                    }
                    console.log(TAG, "addUser finished!");
                    return callback(null, result.result);
                });
            });
        });
    });
};
User.addUser2 = function (users, callback) {
    if (Array.isArray(users)) {
        for (var i = 0; i < users.length; i++)
            users[i] = new User(users[i]);
    } else {
        users = new User(users);
    }
    mongodb.insert(COLLECTION, INDEXS, users, function (err, result) {
        callback(err, result);
    });
};

////批量添加用户
//User.addUsers = function (users, callback) {
//    var batchAddUser = function (users, index, callback) {
//        if (index >= users.length) return;
//        User.addUser(users[index], function (err, result) {
//            callback(err, result);
//            batchAddUser(users, ++index, callback);
//        });
//    };
//    batchAddUser(users, 0, callback);
//};

////添加用户
//User.prototype.addUser = function (callback) {
//    var user = this;    //this为User实例
//    if (!(user.userid && user.password)) {
//        console.log(TAG, "userid or password undefined!");
//        return;
//    }
//    mongodb.open(function (err, db) {
//        if (err) {
//            return callback(err);
//        }
//        db.collection(COLLECTION, function (err, collection) {  //users为用户表
//            if (err) {
//                mongodb.close();
//                return callback(err);
//            }
//            collection.findOne({userid: user.userid}, function (err, result) {
//                if (err || result) {  //确认是否有相同用户存在, 如果出现错误或者用户存在就立即返回错误
//                    mongodb.close();
//                    console.log(TAG, user.userid + " exists or dbError!");
//                    return callback(err);
//                }
//                collection.insert(user, {safe: true}, function (err, result) { //插入用户信息
//                    mongodb.close();
//                    if (err) {
//                        console.log(TAG, err);
//                        return callback(err);
//                    }
//                    console.log(TAG, "addUser finished!");
//                    return callback(null, result.result);
//                });
//            });
//        });
//    });
//};

//删除指定用户
User.deleteUser = function (userid, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(COLLECTION, function (err, collection) {  //users为用户表
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //如果remove没有任何的参数，则删除全部。
            collection.remove({userid: userid}, {safe: true}, function (err, result) {
                mongodb.close();
                if (err) {
                    console.log(TAG, err);
                    return callback(err);
                }
                console.log(TAG, "deleteUser finished!");
                callback(null, result.result);
            });
        });
    });
};
User.deleteUser2 = function (selector, callback) {
    mongodb.remove(COLLECTION, selector, function (err, result) {
        callback(err, result);
    });
};

//获取所有用户信息
User.getUsers = function (filter, out, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(COLLECTION, function (err, collection) {  //users为用户表
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.find(filter, out).toArray(function (err, result) {
                mongodb.close();
                if (err) {
                    console.log(TAG, err);
                    return callback(err);
                }
                console.log(TAG, "getUsers finished!");
                callback(null, result);
            });
        });
    });
};
User.getUsers2 = function (query, options, callback) {
    mongodb.getMany(COLLECTION, query, options, function (err, result) {
        callback(err, result);
    });
};

//获取指定用户信息（user为部分用户信息）
User.getUser = function (user, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(COLLECTION, function (err, collection) {  //users为用户表
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne(user, function (err, result) {
                mongodb.close();
                if (err) {
                    console.log(TAG, err);
                    return callback(err);
                }
                console.log(TAG, "getUser finished!");
                callback(null, result);
            });
        });
    });
};
User.getUser2 = function (query, options, callback) {
    mongodb.getOne(COLLECTION, query, options, function (err, result) {
        callback(err, result);
    });
};

////获取指定用户信息
//User.getUser = function (userid, callback) {
//    mongodb.open(function (err, db) {
//        if (err) {
//            return callback(err);
//        }
//        db.collection(COLLECTION, function (err, collection) {  //users为用户表
//            if (err) {
//                mongodb.close();
//                return callback(err);
//            }
//            collection.findOne({userid: userid}, function (err, result) {
//                mongodb.close();
//                if (err) {
//                    console.log(TAG, err);
//                    return callback(err);
//                }
//                console.log(TAG, "getUser finished!");
//                callback(null, result);
//            });
//        });
//    });
//};

User.getPageUsers2 = function (query, pageSize, pageNum, callback) {
    mongodb.getPage(COLLECTION, query, pageSize, pageNum, function (err, result, total) {
        callback(err, result, total);
    });
};

//更新指定用户信息
User.updateUser = function (user, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(COLLECTION, function (err, collection) {  //users为用户表
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.update({userid: user.userid},
                {$set: {username: user.username, password: user.password, roles: user.roles}},
                function (err, result) {
                    mongodb.close();
                    if (err) {
                        console.log(TAG, err);
                        return callback(err);
                    }
                    console.log(TAG, "updateUser finished!");
                    callback(null, result.result);
                });
        });
    });
};
User.updateUser2 = function (selector, document, callback) {
    mongodb.update(COLLECTION, selector, document, function (err, result) {
        callback(err, result);
    });
};

module.exports = User;