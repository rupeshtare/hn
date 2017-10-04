var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('mess_member');

var db2 = mongo.db(config.connectionString, { native_parser: true });
db2.bind('dine');

var service = {};

service.getAllCurrent = getAllCurrent;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getAllCurrent(query) {
    var deferred = Q.defer();
    var filter = {"active": true};

    var currentTime = new Date();
    if(currentTime.getHours() >= 10 && currentTime.getHours() <= 17)
        filter["timeing"] = {"$in": ["Lunch", "Both"]};
    else if (currentTime.getHours() >= 18 && currentTime.getHours() <= 22)
        filter["timeing"] = {"$in": ["Dinner", "Both"]};
    else
        deferred.resolve({total: 0, data: []});

    db.mess_member.find(filter).sort({"createdOn": -1}).toArray(function (err, messMember) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        db.mess_member.count({"active": true}, function (err, count){
            deferred.resolve({total: count, data: messMember});
        })
    });

    return deferred.promise;
}

function getAll(query) {
    var deferred = Q.defer();

    db.mess_member.find({"active": true}, null, query).sort({"createdOn": -1}).toArray(function (err, messMember) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        db.mess_member.count({"active": true}, function (err, count){
            deferred.resolve({total: count, data: messMember});
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

    let messMemberParam = _.merge(req.body, {createdBy: req.user, createdOn: new Date()});

    // validation
    db.mess_member.findOne(
        { "customer._id": messMemberParam.customer._id, active: messMemberParam.active },
        function (err, messMember) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (messMember) {
                // messMembername already exists
                deferred.reject('Mess member "' + messMemberParam.customer.firstName + '" is already taken');
            } else {
                createMessMember();
            }
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

        if (messMember.customer._id !== messMemberParam.customer._id) {
            // messMember has changed so check if the new messMember is already taken
            db.mess_member.findOne(
                { customer: messMemberParam.customer },
                function (err, messMember) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (messMember) {
                        // messMembername already exists
                        deferred.reject('Mess Member "' + messMember.customer.firstName + '" is already taken')
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
            active: messMemberParam.active,
            updatedBy: req.user,
            updatedOn: new Date(),
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
    let set = {
        active: false,
        updatedBy: req.user,
        updatedOn: new Date(),
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