var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var date = require('utils/date_utility');
var db = require('utils/db_utility');

var service = {};

service.createOrUpdate = createOrUpdate;
service.remove = remove;
service.getCurrent = getCurrent;

module.exports = service;

var collection = "dine";

function generateId() {
    let id = undefined;
    let hours = date.hours();
    if (hours >= config.morning[0] && hours <= config.morning[1])
        id = date.dateInString() + "_lunch";
    if (hours >= config.evening[0] && hours <= config.evening[1])
        id = date.dateInString() + "_dinner";
    return id;
}

function createOrUpdate(req) {
    var deferred = Q.defer();
    let dineParam = req.body;
    let id = generateId();

    db.findById(collection, undefined, id)
        .then((data) => {
            if (data) {
                updateDineMember(data)
            } else {
                createDineMember();
            }
        })
        .catch((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });

    function updateDineMember(data) {
        // fields to update
        data.members.push(dineParam)
        var set = {
            members: data.members
        };

        db.update(collection, { _id: id }, { $set: set })
            .then((doc) => {
                deferred.resolve();
            })
            .catch((err) => {
                deferred.reject(err.name + ': ' + err.message);
            });
    }

    function createDineMember() {
        dineParam = { _id: id, members: [dineParam], active: true }
        db.insert(collection, dineParam)
            .then((doc) => {
                deferred.resolve();
            })
            .catch((err) => {
                deferred.reject(err.name + ': ' + err.message);
            });
    }

    return deferred.promise;

}


function remove(req) {
    var deferred = Q.defer();
    let dineParam = req.body;
    let id = generateId();

    db.findById(collection, undefined, id)
        .then((data) => {
            updateDineMember(data)
        })
        .catch((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });

    function updateDineMember(data) {
        // fields to update
        _.remove(data.members, members => members._id === dineParam._id);

        var set = {
            members: data.members
        };


        db.update(collection, { _id: id }, { $set: set })
            .then((doc) => {
                deferred.resolve();
            })
            .catch((err) => {
                deferred.reject(err.name + ': ' + err.message);
            });
    }

    return deferred.promise;

}

function getCurrent(params) {
    let deferred = Q.defer();

    let id = generateId();

    db.findById(collection, undefined, id)
        .then((data) => {
            deferred.resolve({ data: data });
        })
        .catch((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });

    return deferred.promise;
}
