var mongoClient = require('mongodb').MongoClient;
var mogoUrl = 'mongodb://localhost:27017/taduoke';
// var BSON = require('bson');
var viewHandler = require('./viewHandler')

var checkUserExists = function(openId, data, req, res, callBack) {
    mongoClient.connect(mogoUrl, function(err, db) {
        var cursor = db.collection('user').find({ "openId": openId }).toArray(function(err, doc) {
            if (err) {
                db.close();
            } else if (!doc || doc.length == 0) {
                callBack(data, req, res);
                db.close();

            } else {
                callBack(null, req, res);
                db.close();
            }
        });
    });
}

var createUser = function(data, preLevel, req, res) {
    var time = new Date().toLocaleDateString();
    var arr = time.split('/');
    var day = arr.length === 3 ? arr[2] + '-' + arr[0] + '-' + arr[1] : arr[0];
    if (preLevel && preLevel.length > 0) {
        mongoClient.connect(mogoUrl, function(err, db) {
            var cursor = db.collection('user').find({ "openId": preLevel }).toArray(function(err, doc) {
                if (err) {
                    db.collection('user').insertOne({
                        "userId": "uid" + data.openid,
                        "openId": data.openid,
                        "preLevel": preLevel || "",
                        "name": data.nickname,
                        'avator': data.headimgurl,
                        "createTime": day,
                        // "phone": "",
                        // "idCard": "",
                        // "photo": [

                        // ],
                        // "initialWeight": "77",
                        // "waist": "23",
                        // "hipline": "33",
                        // "arm": "44",
                        "city": data.province
                    }, function() {
                        db.close();
                        res.redirect('/' + req.query.url);
                    })
                } else if (!doc || doc.length == 0) {
                    db.collection('user').insertOne({
                            "userId": "uid" + data.openid,
                            "openId": data.openid,
                            "preLevel": preLevel || "",
                            "name": data.nickname,
                            'avator': data.headimgurl,
                            "createTime": day,
                            // "phone": "",
                            // "idCard": "",
                            // "photo": [

                            // ],
                            // "initialWeight": "77",
                            // "waist": "23",
                            // "hipline": "33",
                            // "arm": "44",
                            "city": data.province
                        }, function() {
                            db.close();
                            res.redirect('/' + req.query.url);
                        })
                        // db.close();

                } else {
                    console.log('data', data)
                    db.collection('user').insertOne({
                            "userId": "uid" + data.openid,
                            "openId": data.openid,
                            "preLevel": preLevel || "",
                            "preName": doc[0].name,
                            "name": data.nickname,
                            'avator': data.headimgurl,
                            "createTime": day,
                            // "phone": "",
                            // "idCard": "",
                            // "photo": [

                            // ],
                            // "initialWeight": "77",
                            // "waist": "23",
                            // "hipline": "33",
                            // "arm": "44",
                            "city": data.province
                        }, function() {
                            db.close();
                            res.redirect('/' + req.query.url);
                        })
                        // db.close();
                }
            });
        });
    } else {
        mongoClient.connect(mogoUrl, function(err, db) {
            console.log('data', data)
            db.collection('user').insertOne({
                    "userId": "uid" + data.openid,
                    "openId": data.openid,
                    "preLevel": preLevel || "",
                    "name": data.nickname,
                    'avator': data.headimgurl,
                    "createTime": day,
                    // "phone": "",
                    // "idCard": "",
                    // "photo": [

                    // ],
                    // "initialWeight": "77",
                    // "waist": "23",
                    // "hipline": "33",
                    // "arm": "44",
                    "city": data.province
                }, function() {
                    db.close();
                    res.redirect('/' + req.query.url);
                })
                // db.close();
        });
    }
}

var getUserInfo = function(req, res) {
    mongoClient.connect(mogoUrl, function(err, db) {
        var cursor = db.collection('user').find({ "openId": req.query.openId }).toArray(function(err, doc) {
            if (err) {
                res.send({ status: 'failed' });
                db.close();
            } else if (!doc || doc.length == 0) {
                res.send({ status: 'failed' });
                db.close();

            } else {
                res.send({ status: 'success', data: doc[0] });
                db.close();
            }
        });
    });
}

var updateUser = function(req, res, openId) {
    mongoClient.connect(mogoUrl, function(err, db) {
        db.collection('user').updateOne({ "openId": openId }, {
            $set: {
                phone: req.body.phone,
                name: req.body.name,
                idCard: req.body.idCard,
                initialWeight: parseFloat(req.body.initialWeight),
                waist: parseFloat(req.body.waist),
                arm: parseFloat(req.body.arm)
            },
            $currentDate: { "lastModified": true }
        });
        db.collection('clock').find({ "openId": openId }).toArray(function(err, doc) {
            if (err) {
                res.send({ status: 'failed' });
                db.close();
            } else if (!doc || doc.length == 0) {
                // res.send({ status: 'failed' });
                db.collection('clock').insertOne({
                    "openId": openId,
                    "initialWeight": parseFloat(req.body.initialWeight)
                });
                res.send({ status: 'success' });
                db.close();

            } else {
                res.send({ status: 'success' });
                db.close();
            }
        });
        // db.collection('clock').updateOne({ "openId": openId }, {
        //     $set: {
        //         initialWeight: parseFloat(req.body.initialWeight)
        //     },
        //     $currentDate: { "lastModified": true }
        // });
        // res.send({ status: 'success' })
        // db.close();
    })
}

var getOrder = function(req, res) {
    mongoClient.connect(mogoUrl, function(err, db) {
        var cursor = db.collection('order').find({ "openId": req.query.openId }).toArray(function(err, doc) {
            if (err) {
                res.send({ status: 'failed' });
                db.close();
            } else if (!doc || doc.length == 0) {
                res.send({ status: 'failed' });
                db.close();

            } else {
                res.send({ status: 'success', data: doc });
                db.close();
            }
        });
    });
}

var getPreLevel = function(req, res) {
    mongoClient.connect(mogoUrl, function(err, db) {
        var cursor = db.collection('user').find({ "preLevel": req.query.openId }).toArray(function(err, doc) {
            if (err) {
                res.send({ status: 'failed' });
                db.close();
            } else if (!doc || doc.length == 0) {
                res.send({ status: 'success', data: { currentName: "", firstLevel: [], secondLevel: [], thirdLevel: [] } });
                db.close();

            } else {
                var firstLevel = doc;
                var seconds = [];
                var currentName = "";
                doc.map((child, index) => {
                    if (child.openId) {
                        seconds.push({ preLevel: child.openId });
                        currentName = child.preName;
                    }
                })
                db.collection('user').find({ $or: seconds }).toArray(function(err, doc) {
                    if (err) {
                        res.send({ status: 'failed' });
                        db.close();
                    } else if (!doc || doc.length == 0) {
                        res.send({ status: 'success', data: { currentName, firstLevel, secondLevel: [], thirdLevel: [] } });
                        db.close();

                    } else {
                        var secondLevel = doc;
                        var thirds = [];
                        doc.map((child, index) => {
                            if (child.openId) {
                                thirds.push({ preLevel: child.openId });
                            }
                        })
                        db.collection('user').find({ $or: thirds }).toArray(function(err, doc) {
                            if (err) {
                                res.send({ status: 'failed' });
                                db.close();
                            } else if (!doc || doc.length == 0) {
                                res.send({ status: 'success', data: { currentName, firstLevel, secondLevel, thirdLevel: [] } });
                                db.close();

                            } else {
                                res.send({ status: 'success', data: { currentName, firstLevel, secondLevel, thirdLevel: doc } });
                                db.close();
                            }
                        });
                        // res.send({ status: 'success', data: doc });
                        // db.close();
                    }
                });
                // res.send({ status: 'success', data: doc });
            }
        });
    });
}

var getBenfits = function(req, res) {
    mongoClient.connect(mogoUrl, function(err, db) {
        var cursor = db.collection('benfits').find({ "person": req.query.openId }).toArray(function(err, doc) {
            if (err) {
                res.send({ status: 'failed' });
                db.close();
            } else if (!doc || doc.length == 0) {
                res.send({ status: 'failed' });
                db.close();

            } else {
                res.send({ status: 'success', data: doc });
                db.close();
            }
        });
    });
}


var getUserClock = function(req, res, openId, persons, count) {
    mongoClient.connect(mogoUrl, function(err, db) {
        var cursor = db.collection('clock').find({ "openId": openId }).toArray(function(err, doc) {
            if (err) {
                res.send({ status: 'failed' });
                db.close();
            } else if (!doc || doc.length == 0) {
                res.send({ status: 'success', persons, count, data: {} });
                db.close();

            } else {
                res.send({ status: 'success', data: doc[0], persons, count });
                db.close();
            }
        });
    });
}

var getClockIndex = function(req, res, ranking = flase) {
    var time = new Date().toLocaleDateString();
    var arr = time.split('/');
    var day = arr.length === 3 ? arr[2] + '-' + arr[0] + '-' + arr[1] : arr[0];
    mongoClient.connect(mogoUrl, function(err, db) {
        var cursor = db.collection('clock').find({ "clockCount": { $gt: 0 }, "clockTime": day }).sort({ reduceWeight: -1 }).toArray(function(err, doc) {
            if (err) {
                res.send({ status: 'failed' });
                db.close();
            } else if (!doc || doc.length == 0) {
                // res.send({ status: 'success', count: 0, persons: [] });
                getUserClock(req, res, req.query.openId, [], 0);
                db.close();
            } else {
                var persons = [];
                doc.map((child, index) => {
                    if (child.avator) {
                        persons.push(child.avator);
                    }
                });
                getUserClock(req, res, req.query.openId, ranking ? doc : persons.splice(0, 19), doc.length);
                // res.send({ status: 'success', count: doc.length, persons });
                db.close();
            }
        });
    });
}

var updateClock = function(req, res, openId) {
    if (req.body.id === '01') {
        mongoClient.connect(mogoUrl, function(err, db) {
            var cursor = db.collection('user').find({ "openId": openId }).toArray(function(err, doc) {
                if (err) {
                    res.send({ status: 'failed' });
                    db.close();
                } else if (!doc || doc.length == 0) {
                    res.send({ status: 'failed' });
                    db.close();

                } else {
                    var user = doc[0];
                    db.collection('clock').find({ "openId": openId }).toArray(function(err, doc) {
                        if (err) {
                            res.send({ status: 'failed' });
                            db.close();
                        } else if (!doc || doc.length == 0) {
                            db.collection('clock').insertOne({
                                "openId": openId,
                                "name": user.name,
                                "clockId": "cid_" + openId,
                                "initialWeight": user.initialWeight,
                                "clockCount": 1,
                                "avator": user.avator,
                                "clockTime": req.body.day.replace(/\//g, '-'),
                                "preWeight": user.initialWeight,
                                "currentWeight": parseFloat(req.body.weight) > 0 ? parseFloat(req.body.weight) : user.initialWeight,
                                "reduceWeight": parseFloat(req.body.weight) > 0 ? user.initialWeight - parseFloat(req.body.weight) : 0,
                                "clock": [{
                                    "id": req.body.id,
                                    "day": req.body.day.replace(/\//g, '-'),
                                    "weight": parseFloat(req.body.weight) > 0 ? parseFloat(req.body.weight) : user.initialWeight,
                                    "reduceWeight": parseFloat(req.body.weight) > 0 ? user.initialWeight - parseFloat(req.body.weight) : 0,
                                    "breadfast": req.body.breadfast,
                                    "launch": req.body.launch,
                                    "dinner": req.body.dinner,
                                    "drink": req.body.drink,
                                    "sleep": req.body.sleep,
                                    "health": req.body.health && req.body.health.trim() === '是' ? true : false
                                }]
                            })
                            res.send({ status: 'success' });
                            db.close();

                        } else {
                            db.collection('clock').updateOne({ "openId": openId }, {
                                $set: {
                                    "openId": openId,
                                    "name": user.name,
                                    "clockId": "cid_" + openId,
                                    "initialWeight": user.initialWeight,
                                    "clockCount": 1,
                                    "avator": user.avator,
                                    "clockTime": req.body.day.replace(/\//g, '-'),
                                    "preWeight": user.initialWeight,
                                    "currentWeight": parseFloat(req.body.weight) > 0 ? parseFloat(req.body.weight) : user.initialWeight,
                                    "reduceWeight": parseFloat(req.body.weight) > 0 ? user.initialWeight - parseFloat(req.body.weight) : 0,
                                    "clock": [{
                                        "id": req.body.id,
                                        "day": req.body.day.replace(/\//g, '-'),
                                        "weight": parseFloat(req.body.weight) > 0 ? parseFloat(req.body.weight) : user.initialWeight,
                                        "reduceWeight": parseFloat(req.body.weight) > 0 ? user.initialWeight - parseFloat(req.body.weight) : 0,
                                        "breadfast": req.body.breadfast,
                                        "launch": req.body.launch,
                                        "dinner": req.body.dinner,
                                        "drink": req.body.drink,
                                        "sleep": req.body.sleep,
                                        "health": req.body.health && req.body.health.trim() === '是' ? true : false
                                    }]
                                }
                            });

                            res.send({ status: 'success' });
                            db.close();
                        }
                    });
                    // res.send({ status: 'success' });
                    // db.close();
                }
            });
        });
    } else {
        mongoClient.connect(mogoUrl, function(err, db) {
            var cursor = db.collection('clock').find({ "openId": openId }).toArray(function(err, doc) {
                if (err) {
                    res.send({ status: 'failed' });
                    db.close();
                } else if (!doc || doc.length == 0) {
                    res.send({ status: 'failed' });
                    db.close();

                } else {
                    var user = Object.assign({}, doc[0]);
                    user.clockTime = req.body.day.replace(/\//g, '-');
                    user.preWeight = user.currentWeight;
                    user.currentWeight = parseFloat(req.body.weight) > 0 ? parseFloat(req.body.weight) : user.currentWeight,
                        user.reduceWeight = user.preWeight - user.currentWeight;
                    user.clock.push({
                        "id": req.body.id,
                        "day": req.body.day.replace(/\//g, '-'),
                        "weight": parseFloat(req.body.weight) > 0 ? parseFloat(req.body.weight) : user.currentWeight,
                        "reduceWeight": user.preWeight - user.currentWeight,
                        "breadfast": req.body.breadfast,
                        "launch": req.body.launch,
                        "dinner": req.body.dinner,
                        "drink": req.body.drink,
                        "sleep": req.body.sleep,
                        "health": req.body.health && req.body.health.trim() === '是' ? true : false
                    })
                    user.clockCount = user.clock.length;
                    db.collection('clock').updateOne({ "openId": openId }, {
                        $set: user
                    });
                    // db.collection('clock').insertOne({
                    //     "openId": openId,
                    //     "name": user.name,
                    //     "clockId": "cid_" + openId,
                    //     "initialWeight": user.initialWeight,
                    //     "clockCount": 1,
                    //     "avator": user.avator,
                    //     "clockTime": req.body.day,
                    //     "preWeight": user.initialWeight,
                    //     "currentWeight": parseFloat(req.body.weight) > 0 ? parseFloat(req.body.weight) : user.initialWeight,
                    //     "reduceWeight": parseFloat(req.body.weight) > 0 ? user.initialWeight - parseFloat(req.body.weight) : 0,
                    //     "clock": [{
                    //         "id": req.body.id,
                    //         "day": req.body.day,
                    //         "weight": parseFloat(req.body.weight) > 0 ? parseFloat(req.body.weight) : user.initialWeight,
                    //         "reduceWeight": parseFloat(req.body.weight) > 0 ? user.initialWeight - parseFloat(req.body.weight) : 0,
                    //         "breadfast": req.body.breadfast,
                    //         "launch": req.body.launch,
                    //         "dinner": req.body.dinner,
                    //         "drink": req.body.drink,
                    //         "sleep": req.body.sleep,
                    //         "health": req.body.health && req.body.health.trim() === '是' ? true : false
                    //     }]
                    // })

                    res.send({ status: 'success' });
                    db.close();
                }
            });
        });
    }
    // mongoClient.connect(mogoUrl, function(err, db) {
    //     db.collection('clock').updateOne({ "openId": openId }, {
    //         $set: {
    //             initialWeight: parseFloat(req.body.initialWeight)
    //         },
    //         $currentDate: { "lastModified": true }
    //     });
    //     res.send({ status: 'success' })
    //     db.close();
    // })
}

var createOrder = function() {

}

module.exports.getUserClock = getUserClock;
module.exports.createUser = createUser;
module.exports.getUserInfo = getUserInfo;
module.exports.checkUserExists = checkUserExists;
module.exports.updateUser = updateUser;
module.exports.getOrder = getOrder;
module.exports.getPreLevel = getPreLevel;
module.exports.getBenfits = getBenfits;
module.exports.getClockIndex = getClockIndex;
module.exports.updateClock = updateClock;