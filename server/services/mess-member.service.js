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
service.messOrder = messOrder;
service.addRecursiveMessMember = addRecursiveMessMember;

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

    var today = date.startOfDay();
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

    db.find(collection, query = params.query, fields = params.include, sort = params.sort, skip = params.skip, limit = params.limit)
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

    let _filter = {
        "customer._id": messMemberParam.customer._id,
        active: true
    };

    if (messMemberParam.timeing === "Lunch") {
        _filter = _.merge(_filter, { "timeing": { "$in": ["Lunch", "Both"] } })
    } else if (messMemberParam.timeing === "Dinner") {
        _filter = _.merge(_filter, { "timeing": { "$in": ["Dinner", "Both"] } })
    } else {
        _filter = _.merge(_filter, { "timeing": { "$in": ["Lunch", "Dinner", "Both"] } })
    }
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

        messMemberParam["customDays"] = messMemberParam.days === "Other" ? messMemberParam.customDays : 0;

        if (messMemberParam.endDate < date.startOfDay()) {
            deferred.reject('Days should not be less than ' + (date.moment().diff(messMemberParam.startDate, 'days') + 1) + '.');
        } else {
            db.insert(collection, messMemberParam)
                .then((doc) => {
                    deferred.resolve();
                })
                .catch((err) => {
                    deferred.reject(err.name + ': ' + err.message);
                });
        }
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

                if (
                    (messMemberParam.timeing === "Both" && messMember.timeing !== "Both") ||
                    (messMemberParam.timeing !== "Both" && messMember.timeing === "Both")
                ) {
                    deferred.reject('Mess member timeing can not be changed from ' + messMember.timeing + ' to ' + messMemberParam.timeing);
                } else {
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
                }
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
            days: messMemberParam.days,
            customDays: messMemberParam.days === "Other" ? messMemberParam.customDays : 0,
            price: messMemberParam.price,
            recursive: messMemberParam.recursive,
            timeing: messMemberParam.timeing,
            startDate: date.startOfDay(messMemberParam.startDate),
            endDate: date.startOfDay(messMemberParam.endDate),
            updatedBy: messMemberParam.updatedBy,
            updatedOn: messMemberParam.updatedOn,
        };

        if (set.endDate < date.startOfDay()) {
            deferred.reject('Days should not be less than ' + (date.moment().diff(set.startDate, 'days') + 1) + '.');
        } else {

            db.update(collection, { _id: db.objectID(_id) }, { $set: set })
                .then((doc) => {
                    deferred.resolve();
                })
                .catch((err) => {
                    deferred.reject(err.name + ': ' + err.message);
                });
        }
    }

    return deferred.promise;
}

function _delete(req) {
    var deferred = Q.defer();
    let _id = req.params._id;
    let messMemberParam = req.body;

    if (messMemberParam.active === false) {
        messMemberParam.endDate = date.startOfDay();
    }

    db.findById(collection, _id)
        .then((messMember) => {
            let _filter = {
                "customer._id": messMember.customer._id,
                "timeing": messMember.timeing,
                active: messMemberParam.active
            };

            if (messMember.timeing === "Both")
                _filter = _.merge(_filter, { "timeing": { "$in": ["Lunch", "Dinner", "Both"] } })

            db.findOne(collection, _filter)
                .then((messMember2) => {
                    if (messMember2) {
                        // messMembername already exists
                        deferred.reject('Mess member ' + messMember2.customer.firstName + ' is already added for ' + messMember2.timeing);
                    } else {
                        _deleteMessMember(messMember);
                        _deleteMessOrder(_id);
                    }
                })
                .catch((err) => {
                    deferred.reject(err.name + ': ' + err.message);
                });
        })
        .catch((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });

    function _deleteMessMember(messMember) {
        let set = {
            active: messMemberParam.active,
            updatedBy: messMemberParam.updatedBy,
            updatedOn: messMemberParam.updatedOn,
        };

        if (messMemberParam.active === false) {
            let days = date.moment().diff(messMember.startDate, 'days') + 1;
            let new_set = {
                endDate: date.startOfDay(),
                days: 'Other',
                customDays: days,
                price: getPrice(days)
            };
            set = _.merge(set, new_set);
        }

        db.update(collection, { _id: db.objectID(_id) }, { $set: set })
            .then((doc) => {
                messOrder(_id);
                deferred.resolve();
            })
            .catch((err) => {
                deferred.reject(err.name + ': ' + err.message);
            });
    }
    return deferred.promise;
}

function messOrder(_id) {
    var deferred = Q.defer();

    db.findById(collection, _id)
        .then((messMember) => {
            if (messMember.active !== false) {
                deferred.reject('Mess member ' + messMember.customer.firstName + ' should be deactivated.');
            } else {
                let order = {
                    order: {
                        _id: messMember._id.toString(),
                        name: 'mess',
                        bill: messMember.price,
                        quantity: [messMember.days, messMember.customDays],
                        price: messMember.timeing,
                    },
                    customer: _.pick(messMember.customer, ['_id', 'firstName', 'lastName']),
                    createdOn: date.currentDate()
                }
                db.insert('order', order)
                    .then((doc) => {
                        deferred.resolve();
                    })
                    .catch((err) => {
                        deferred.reject(err.name + ': ' + err.message);
                    });
            }
        })
        .catch((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });
    return deferred.promise;
}

function _deleteMessOrder(_id) {
    db.delete('order', { 'order._id': _id })
        .catch(err => console.log(err));
}

function getPrice(days) {
    const amounts = { 5: 300, 15: 600, 30: 1100, 60: 2000 };
    const num = closestHighest(days, _.keys(amounts));
    if (days === num) {
        return amounts[num];
    }
    const perDay = amounts[num] / num;
    const price = _.ceil((perDay * days), 2);
    return price;
}

function closestHighest(days, arr) {
    arr = arr.map(n => parseInt(n, 10));
    let next = Math.max.apply(Math, arr);
    _.forEach(arr, elem => {
        if (elem >= days && elem < next) {
            next = elem;
        }
    });
    return next;
}

function addRecursiveMessMember(_id) {
    var deferred = Q.defer();

    db.findById(collection, _id)
        .then((messMember) => {
            if (messMember.active !== false) {
                deferred.reject('Mess member ' + messMember.customer.firstName + ' should be deactivated.');
            } else {
                let days = messMember.days === "Other" ? messMember.customDays : messMember.days;
                let newMessMember = _.omit(messMember, ['_id', 'active', 'startDate', 'endDate', 'createdOn', 'updatedOn', 'updatedBy']);
                newMessMember.active = true;
                newMessMember.createdOn = date.startOfDay();
                newMessMember.startDate = date.startOfDay();
                newMessMember.endDate = date.addDays(days - 1, newMessMember.startDate);

                db.insert(collection, newMessMember)
                    .then((doc) => {
                        deferred.resolve();
                    })
                    .catch((err) => {
                        deferred.reject(err.name + ': ' + err.message);
                    });
            }
        })
        .catch((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });
    return deferred.promise;
}
