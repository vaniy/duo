var mongoClient = require('mongodb').MongoClient;
var mogoUrl = 'mongodb://localhost:27017/taduoke';
// var BSON = require('bson');
var viewHandler = require('./viewHandler')

var getUserClock = function(req, res, openId) {
    mongoClient.connect(mogoUrl, function(err, db) {
        var cursor = db.collection('clock').find({ "openId": openId }).toArray(function(err, doc) {
            if (err) {
                res.send({ status: 'failed' });
                db.close();
            } else if (!doc || doc.length == 0) {
                res.send({ status: 'failed' });
                db.close();

            } else {
                res.send({ status: 'succeed', data: doc[0] });
                db.close();
            }
        });
    });
}

module.exports.getUserClock = getUserClock