var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var date = require('utils/date_utility');
var mongo = require('mongoskin');

var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('mess_member');

var service = {};

service.getAllCurrent = getAllCurrent;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getAllCurrent(params) {
    var deferred = Q.defer();
    var _filter = { "active": true };

    var hours = date.hours();
    if (hours >= config.morning[0] && hours <= config.morning[1])
        _filter = _.merge(_filter, { "timeing": { "$in": ["Lunch", "Both"] } });
    else if (hours >= config.evening[0] && hours <= config.evening[1])
        _filter = _.merge(_filter, { "timeing": { "$in": ["Dinner", "Both"] } });
    else
        deferred.resolve({ total: 0, data: [] });

    var today = date.currentDate();
    _filter = _.merge(_filter, { "startDate": { "$lte": today }, "endDate": { "$gte": today } })

    db.mess_member.find(_filter, params.include, params.query).sort({ "createdOn": -1 }).toArray(function (err, messMember) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        db.mess_member.count(_filter, function (err, count) {
            deferred.resolve({ total: count, data: messMember });
        })
    });

    return deferred.promise;
}

function getAll(params) {
    var deferred = Q.defer();

    db.mess_member.find(params._filter, params.include, params.query).sort({ "createdOn": -1 }).toArray(function (err, messMember) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        db.mess_member.count(params._filter, function (err, count) {
            deferred.resolve({ total: count, data: messMember });
        })
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.mess_member.findById(_id, function (err, messMember) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (messMember) deferred.resolve(messMember);

        deferred.resolve();
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
    db.mess_member.findOne(
        _filter,
        function (err, messMember) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (messMember) {
                // messMembername already exists
                deferred.reject('Mess member ' + messMember.customer.firstName + ' is already added for ' + messMember.timeing);
            } else {
                createMessMember();
            }
        });

    messMemberParam = _.merge(messMemberParam, {
        "startDate": date.startOfDay(messMemberParam.startDate),
        "endDate": date.startOfDay(messMemberParam.endDate),
    });
    function createMessMember() {
        db.mess_member.insert(
            messMemberParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(req) {
    var deferred = Q.defer();

    let messMemberParam = req.body;
    let _id = req.params._id

    // validation
    db.mess_member.findById(_id, function (err, messMember) {
        if (err) deferred.reject(err.name + ': ' + err.message);

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

            db.mess_member.findOne(_filter,
                function (err, messMember) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (messMember) {
                        // messMembername already exists
                        deferred.reject('Mess member ' + messMember.customer.firstName + ' is already added for ' + messMember.timeing);
                    } else {
                        updateMessMember();
                    }
                });
        } else {
            updateMessMember();
        }
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

        db.mess_member.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(req) {
    var deferred = Q.defer();

    let _id = req.params._id;
    let messMemberParam = req.body
    console.log(messMemberParam);
    let set = {
        active: messMemberParam.active,
        updatedBy: messMemberParam.updatedBy,
        updatedOn: messMemberParam.updatedOn,
    };

    db.mess_member.update(
        { _id: mongo.helper.toObjectID(_id) },
        { $set: set },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}