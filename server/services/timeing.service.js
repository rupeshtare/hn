var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var db = require('utils/db_utility');

var service = {};

service.createOrUpdate = createOrUpdate;
service.get = get;

module.exports = service;

var collection = "timeing";

function createOrUpdate(req) {
    var deferred = Q.defer();
    let timeingParam = req.body;
    let id = 'timeing';

    db.findById(collection, undefined, id)
        .then((data) => {
            if (data) {
                updateTimeing(data)
            } else {
                createTimeing();
            }
        })
        .catch((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });

    function updateTimeing(data) {

        var set = data;

        db.update(collection, { _id: id }, { $set: set })
            .then((doc) => {
                deferred.resolve();
            })
            .catch((err) => {
                deferred.reject(err.name + ': ' + err.message);
            });
    }

    function createTimeing() {
        timeingParam['_id'] = id;
        db.insert(collection, timeingParam)
            .then((doc) => {
                deferred.resolve();
            })
            .catch((err) => {
                deferred.reject(err.name + ': ' + err.message);
            });
    }

    return deferred.promise;

}

function get(params) {
    let deferred = Q.defer();

    let id = 'timeing';

    db.findById(collection, undefined, id)
        .then((data) => {
            deferred.resolve({ data: data });
        })
        .catch((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });

    return deferred.promise;
}
