var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var date = require('utils/date_utility');
var db = require('utils/db_utility');

var service = {};

service.getAllCurrent = getAllCurrent;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

collection = "mess_member";

function getAllCurrent(params) {
    var deferred = Q.defer();
    _.merge(params.query, { "active": true });

    var hours = date.hours();
    if (hours >= config.morning[0] && hours <= config.morning[1])
        _.merge(params.query, { "timeing": { "$in": ["Lunch", "Both"] } });
    else if (hours >= config.evening[0] && hours <= config.evening[1])
        _.merge(params.query, { "timeing": { "$in": ["Dinner", "Both"] } });
    else
        deferred.resolve({ total: 0, data: [] });

    var today = date.currentDate();
    _.merge(params.query, { "startDate": { "$lte": today }, "endDate": { "$gte": today } })

    db.find(collection, query = params.query, fields = params.include, sort = { "createdOn": -1 }, skip = params.skip, limit = params.limit)
        .toArray(function (err, messMember) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            db.count(collection, query = params.query)
                .then((count) => {
                    deferred.resolve({ total: count, data: messMember });
                })
                .catch((err) => {
                    deferred.reject(err.name + ': ' + err.message);
                });
        });

    return deferred.promise;
}

function getAll(params) {
    var deferred = Q.defer();

    db.find(collection, query = params.query, fields = params.include, sort = { "createdOn": -1 }, skip = params.skip, limit = params.limit)
        .toArray(function (err, messMember) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            db.count(collection, query = params.query)
                .then((count) => {
                    deferred.resolve({ total: count, data: messMember });
                })
                .catch((err) => {
                    deferred.reject(err.name + ': ' + err.message);
                });
        });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.findById(collection, _id)
        .then((messMember) => {
            if (messMember) deferred.resolve(messMember);

            deferred.resolve();
        })
        .catch((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });

    return deferred.promise;
}

function create(req) {
    var deferred = Q.defer();
    let messMemberParam = req.body;

    let _filter = { "customer._id": messMemberParam.customer._id, "timeing": messMemberParam.timeing, active: messMemberParam.active };
    if (messMemberParam.timeing === "Both")
        _filter = _.merge(_filter, { "timeing": { "$in": ["Lunch", "Dinner", "Both"] } })

    // validation
    db.findOne(collection, _filter)
        .then((messMember) => {
            if (messMember) {
                // messMembername already exists
                deferred.reject('Mess member ' + messMember.customer.firstName + ' is already added for ' + messMember.timeing);
            } else {
                createMessMember();
            }
        })
        .then((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });

    messMemberParam = _.merge(messMemberParam, {
        "startDate": date.startOfDay(messMemberParam.startDate),
        "endDate": date.startOfDay(messMemberParam.endDate),
    });
    function createMessMember() {
        db.insert(collection, messMemberParam)
            .then((doc) => {
                deferred.resolve();
            })
            .catch((err) => {
                deferred.reject(err.name + ': ' + err.message);
            });
    }

    return deferred.promise;
}

function update(req) {
    var deferred = Q.defer();
    let messMemberParam = req.body;
    let _id = req.params._id

    // validation
    db.findById(collection, _id)
        .then((messMember) => {
            if (messMember.customer._id !== messMemberParam.customer._id ||
                messMember.timeing !== messMemberParam.timeing) {
                // messMember has changed so check if the new messMember is already taken
                let _filter = {
                    "customer._id": messMemberParam.customer._id,
                    "timeing": messMemberParam.timeing,
                    active: true
                };

                if (messMemberParam.timeing === "Both" && messMember.timeing === "Lunch")
                    _filter = _.merge(_filter, { "timeing": { "$in": ["Dinner", "Both"] } })
                if (messMemberParam.timeing === "Both" && messMember.timeing === "Dinner")
                    _filter = _.merge(_filter, { "timeing": { "$in": ["Lunch", "Both"] } })

                db.findOne(collection, _filter)
                    .then((messMember) => {
                        if (messMember) {
                            // messMembername already exists
                            deferred.reject('Mess member ' + messMember.customer.firstName + ' is already added for ' + messMember.timeing);
                        } else {
                            updateMessMember();
                        }
                    })
                    .catch((err) => {
                        deferred.reject(err.name + ': ' + err.message);
                    });
            } else {
                updateMessMember();
            }
        })
        .catch((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });

    function updateMessMember() {
        // fields to update
        var set = {
            timeing: messMemberParam.timeing,
            startDate: date.startOfDay(messMemberParam.startDate),
            endDate: date.startOfDay(messMemberParam.endDate),
            updatedBy: messMemberParam.updatedBy,
            updatedOn: messMemberParam.updatedOn,
        };

        db.update(collection, { _id: db.objectID(_id) }, { $set: set })
            .then((doc) => {
                deferred.resolve();
            })
            .catch((err) => {
                deferred.reject(err.name + ': ' + err.message);
            });
    }

    return deferred.promise;
}

function _delete(req) {
    var deferred = Q.defer();

    let _id = req.params._id;
    let messMemberParam = req.body
    let set = {
        active: messMemberParam.active,
        updatedBy: messMemberParam.updatedBy,
        updatedOn: messMemberParam.updatedOn,
    };

    db.update(collection, { _id: db.objectID(_id) }, { $set: set })
        .then((doc) => {
            deferred.resolve();
        })
        .catch((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });

    return deferred.promise;
}