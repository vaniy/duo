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
                var user = doc[0];
                if (user.name) {
                    req.session.user.name = user.name;
                    callBack(null, req, res);
                } else {
                    req.session.user.name = data.nickname;
                    db.collection('user').updateOne({ "openId": openId }, {
                        $set: {
                            "name": data.nickname,
                            'avator': data.headimgurl,
                            "city": data.province
                        },
                        $currentDate: { "lastModified": true }
                    });
                    if (data.subscribe) {
                        res.redirect('/' + req.query.url);
                    } else {
                        res.redirect('/order');
                    }
                }
                db.close();
            }
        });
    });
}

var createUser = function(data, preLevel, req, res) {
    var time = new Date().toLocaleDateString();
    var arr = time.split('/');
    var day = arr.length === 3 ? arr[2] + '-' + arr[0] + '-' + arr[1] : arr[0];
    req.session.user.name = data.name;
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
                        if (data.subscribe) {
                            res.redirect('/' + req.query.url);
                        } else {
                            res.redirect('/order');
                        }
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
                            if (data.subscribe) {
                                res.redirect('/' + req.query.url);
                            } else {
                                res.redirect('/order');
                            }
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
                            if (data.subscribe) {
                                res.redirect('/' + req.query.url);
                            } else {
                                res.redirect('/order');
                            }
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
                    if (data.subscribe) {
                        res.redirect('/' + req.query.url);
                    } else {
                        res.redirect('/order');
                    }
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

var getOrder = function(req, res, getAll = false) {
    mongoClient.connect(mogoUrl, function(err, db) {
        if (getAll) {
            var cursor = db.collection('order').find().toArray(function(err, doc) {
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
        } else {
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
        }
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
                var data = doc;
                db.collection('user').find({ "openId": req.query.openId }).toArray(function(err, doc) {
                    if (err) {
                        res.send({ status: 'failed' });
                        db.close();
                    } else if (!doc || doc.length == 0) {
                        res.send({ status: 'failed' });
                        db.close();

                    } else {
                        res.send({ status: 'success', data: data, benfits: doc[0].myBenfits ? doc[0].myBenfits : 0 });
                        db.close();
                    }
                });
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
                    var rrweight = parseFloat(req.body.weight) > 0 ? parseFloat(req.body.weight) : 0;
                    if (!user.initialWeight || !user.initialWeight > 0) {
                        user.initialWeight = rrweight;
                    }
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
                                "currentWeight": rrweight > 0 ? rrweight : user.initialWeight,
                                "reduceWeight": rrweight > 0 ? user.initialWeight - rrweight : 0,
                                "clock": [{
                                    "id": req.body.id,
                                    "day": req.body.day.replace(/\//g, '-'),
                                    "weight": rrweight > 0 ? rrweight : user.initialWeight,
                                    "reduceWeight": rrweight > 0 ? user.initialWeight - rrweight : 0,
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
                                    "currentWeight": rrweight > 0 ? rrweight : user.initialWeight,
                                    "reduceWeight": rrweight > 0 ? user.initialWeight - rrweight : 0,
                                    "clock": [{
                                        "id": req.body.id,
                                        "day": req.body.day.replace(/\//g, '-'),
                                        "weight": rrweight > 0 ? rrweight : user.initialWeight,
                                        "reduceWeight": rrweight > 0 ? user.initialWeight - rrweight : 0,
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

//1为待发货，2为已发货;1未提现2提现 
var createOrder = function(req, res, openId) {
    var time = new Date().toLocaleDateString();
    var arr = time.split('/');
    var day = arr.length === 3 ? arr[2] + '-' + arr[0] + '-' + arr[1] : arr[0];
    // var name = inputs[0].value;
    // var phone = inputs[1].value;
    // var address = inputs[2].value;
    // var weight = inputs[3].value;
    // var waist = inputs[4].value;
    // var hipline = inputs[5].value;
    // var arm = inputs[6].value;
    mongoClient.connect(mogoUrl, function(err, db) {
        db.collection('order').insertOne({
            "openId": openId,
            "name": req.body.name,
            "phone": req.body.phone,
            "address": req.body.address,
            "orderId": "oid_" + openId,
            "createTime": day,
            "cost": 4200,
            "status": 1
        });
        db.collection('user').find({ openId: openId }).toArray(function(err, doc) {
            if (err) {
                res.send({ status: 'success' });
                db.close();
            } else if (!doc || doc.length === 0) {
                res.send({ status: 'success' })
                db.close();
            } else {
                var customer = doc[0];
                if (customer.preLevel) {
                    db.collection('user').find({ openId: customer.preLevel }).toArray(function(err, doc) {
                        if (err) {
                            res.send({ status: 'success' })
                            db.close();
                        } else if (!doc || doc.length === 0) {
                            res.send({ status: 'success' })
                            db.close();
                        } else {
                            var firstLevel = doc[0];
                            db.collection('benfits').insertOne({
                                "customer": customer.openId,
                                "customerName": customer.name,
                                "customerLevel": "1",
                                "avator": customer.avator,
                                "person": firstLevel.openId,
                                "peronName": firstLevel.name,
                                "benfits": 4200 * 0.24,
                                "time": day,
                                "status": 1
                            });
                            db.collection('user').updateOne({ "openId": firstLevel.openId }, {
                                $set: {
                                    myBenfits: firstLevel.myBenfits ? firstLevel.myBenfits + 4200 * 0.24 : 4200 * 0.24
                                }
                            });
                            if (firstLevel.preLevel) {
                                db.collection('user').find({ openId: firstLevel.preLevel }).toArray(function(err, doc) {
                                    if (err) {
                                        res.send({ status: 'success' })
                                        db.close();
                                    } else if (!doc || doc.length === 0) {
                                        res.send({ status: 'success' })
                                        db.close();
                                    } else {
                                        var secondLevel = doc[0];
                                        db.collection('benfits').insertOne({
                                            "customer": customer.openId,
                                            "customerName": customer.name,
                                            "customerLevel": "1",
                                            "avator": customer.avator,
                                            "person": secondLevel.openId,
                                            "peronName": secondLevel.name,
                                            "benfits": 4200 * 0.12,
                                            "time": day,
                                            "status": 1
                                        });
                                        db.collection('user').updateOne({ "openId": secondLevel.openId }, {
                                            $set: {
                                                myBenfits: secondLevel.myBenfits ? secondLevel.myBenfits + 4200 * 0.12 : 4200 * 0.12
                                            }
                                        });
                                        if (secondLevel.preLevel) {
                                            db.collection('user').find({ openId: secondLevel.preLevel }).toArray(function(err, doc) {
                                                if (err) {
                                                    res.send({ status: 'success' })
                                                    db.close();
                                                } else if (!doc || doc.length === 0) {
                                                    res.send({ status: 'success' })
                                                    db.close();
                                                } else {
                                                    var thirdLevel = doc[0];
                                                    db.collection('benfits').insertOne({
                                                        "customer": customer.openId,
                                                        "customerName": customer.name,
                                                        "customerLevel": "3",
                                                        "avator": customer.avator,
                                                        "person": thirdLevel.openId,
                                                        "peronName": thirdLevel.name,
                                                        "benfits": 4200 * 0.08,
                                                        "time": day,
                                                        "status": 1
                                                    });
                                                    db.collection('user').updateOne({ "openId": thirdLevel.openId }, {
                                                        $set: {
                                                            myBenfits: thirdLevel.myBenfits ? thirdLevel.myBenfits + 4200 * 0.08 : 4200 * 0.08
                                                        }
                                                    });
                                                    res.send({ status: 'success' })
                                                    db.close();
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                } else {
                    res.send({ status: 'success' })
                }
            }
        })

        // db.collection('user').find({ openId: openId }).toArray(function(err, doc) {
        //     if (err) {
        //         res.send({ status: 'success' })
        // db.close();
        //     } else if (!doc || doc.length === 0) {
        //         res.send({ status: 'success' })
        // db.close();
        //     } else {
        //         var customer = doc[0];
        //     }
        // })
    })

    // {
    //     "customer": "123456786",
    //     "customerName": "ggg",
    //     "customerLevel": "3",
    //     "avator": "/images/portrait.png",
    //     "person": "123456789",
    //     "peronName": "aaa",
    //     "benfits": 400,
    //     "time": "2018-01-13",
    //     "status": 1
    // } {
    //     "customer": "123456786",
    //     "customerName": "ggg",
    //     "customerLevel": "2",
    //     "avator": "/images/portrait.png",
    //     "person": "123456788",
    //     "peronName": "eee",
    //     "benfits": 600,
    //     "time": "2018-01-13",
    //     "status": 1
    // } {
    //     "customer": "123456786",
    //     "customerName": "ggg",
    //     "customerLevel": "1",
    //     "avator": "/images/portrait.png",
    //     "person": "123456787",
    //     "peronName": "fff",
    //     "benfits": 1200,
    //     "time": "2018-01-13",
    //     "status": 1
    // }
}

//1进行中，2成功，3失败
var withDraw = function(req, res, openId) {
    var time = new Date().toLocaleDateString();
    var arr = time.split('/');
    var day = arr.length === 3 ? arr[2] + '-' + arr[0] + '-' + arr[1] : arr[0];
    mongoClient.connect(mogoUrl, function(err, db) {
        db.collection('user').find({ openId: openId }).toArray(function(err, doc) {
            if (err) {
                res.send({ status: 'failed' })
                db.close();
            } else if (!doc || doc.length === 0) {
                res.send({ status: 'failed' })
                db.close();
            } else {
                var user = doc[0];
                if (!user.myBenfits || parseFloat(req.body.price) > user.myBenfits) {
                    res.send({ status: 'failed', msg: '账户余额不足' });
                    db.close();
                } else {
                    db.collection('withDraw').insertOne({
                        "openId": openId,
                        "name": req.body.name,
                        "card": req.body.card,
                        "bank": req.body.bank,
                        "price": parseFloat(req.body.price),
                        "time": day,
                        "status": 1
                    });
                    db.collection('user').updateOne({ "openId": openId }, {
                        $set: {
                            myBenfits: user.myBenfits - parseFloat(req.body.price)
                        }
                    });
                    res.send({ status: 'success' })
                    db.close();
                }
            }
        })
    })
}

var checkAdmin = function(req, res) {
    mongoClient.connect(mogoUrl, function(err, db) {
        db.collection('admin').find({ phoneNumber: req.body.phoneNumber }).toArray(function(err, doc) {
            if (err) {
                res.send({ status: 'failed' })
                db.close();
            } else if (!doc || doc.length === 0) {
                res.send({ status: 'failed' })
                db.close();
            } else {
                if (doc[0].password === req.body.password) {
                    req.session.admin = {};
                    req.session.admin.phoneNumber = req.body.phoneNumber
                    res.send({ status: 'success' })
                } else {
                    res.send({ status: 'failed' })
                }
                db.close();
            }
        })
    })
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
module.exports.createOrder = createOrder;
module.exports.withDraw = withDraw;

module.exports.checkAdmin = checkAdmin;