var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('dine');

var service = {};

service.createOrUpdate = createOrUpdate;
service.getCurrent = getCurrent;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function createOrUpdate(req) {
    var deferred = Q.defer();

    var currentTime = new Date();
    let dineParam = _.merge(req.body, {createdBy: req.user, createdOn: currentTime});
    let id = undefined;

    if(currentTime.getHours() >= 10 && currentTime.getHours() <= 17)
        id = currentTime.toLocaleDateString() + "_lunch";
    if (currentTime.getHours() >= 18 && currentTime.getHours() <= 22)
        id = currentTime.toLocaleDateString() + "_dinner";
    
    db.dine.findById(id, function (err, data) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        
        if (data) {
            updateDineMember(data)
        } else {
            createDineMember();
        }
    });

    function updateDineMember(data) {
        // fields to update
        data.members.push(dineParam)
        var set = {
            members: data.members
        };

        db.dine.update(
            { _id: id },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    function createDineMember() {
        dineParam = {_id: id, members: [dineParam], active: true}
        db.dine.insert(
            dineParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;

}

function getCurrent(query) {
    let deferred = Q.defer();

    let currentTime = new Date();
    let id = undefined;

    if(currentTime.getHours() >= 10 && currentTime.getHours() <= 17)
        id = currentTime.toLocaleDateString() + "_lunch";
    if (currentTime.getHours() >= 18 && currentTime.getHours() <= 22)
        id = currentTime.toLocaleDateString() + "_dinner";

    db.dine.findById(id, function (err, data) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        
        deferred.resolve({data: data});
    });

    return deferred.promise;
}

function getAll(query) {
    var deferred = Q.defer();

    db.dine.find({"active": true}, null, query).sort({"createdOn": -1}).toArray(function (err, messMember) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        db.dine.count({"active": true}, function (err, count){
            deferred.resolve({total: count, data: messMember});
        })
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.dine.findById(_id, function (err, messMember) {
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
    db.dine.findOne(
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
        db.dine.insert(
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
    db.dine.findById(_id, function (err, messMember) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (messMember.customer._id !== messMemberParam.customer._id) {
            // messMember has changed so check if the new messMember is already taken
            db.dine.findOne(
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

        db.dine.update(
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

    db.dine.update(
        { _id: mongo.helper.toObjectID(_id) },
        { $set: set },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}