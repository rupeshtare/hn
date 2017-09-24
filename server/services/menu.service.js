var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('menu');

var service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;


function getAll(query) {
    var deferred = Q.defer();

    db.menu.find({}, null, query).sort({"createdOn": -1}).toArray(function (err, menu) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        db.menu.count(function (err, count){
            deferred.resolve({total: count, data: menu});
        })
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.menu.findById(_id, function (err, menu) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (menu) deferred.resolve(menu);
        
        deferred.resolve();
    });

    return deferred.promise;
}

function create(req) {
    var deferred = Q.defer();

    let menuParam = _.merge(req.body, {createdBy: req.user, createdOn: new Date()});

    // validation
    db.menu.findOne(
        { name: menuParam.name },
        function (err, menu) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (menu) {
                // menuname already exists
                deferred.reject('Menu "' + menuParam.name + '" is already taken');
            } else {
                createMenu();
            }
        });

    function createMenu() {
        db.menu.insert(
            menuParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(req) {
    var deferred = Q.defer();

    let menuParam = req.body;
    let _id = req.params._id

    // validation
    db.menu.findById(_id, function (err, menu) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (menu.name !== menuParam.name) {
            // menu has changed so check if the new menu is already taken
            db.menu.findOne(
                { name: menuParam.name },
                function (err, menu) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (menu) {
                        // menuname already exists
                        deferred.reject('Menu "' + menu.name + '" is already taken')
                    } else {
                        updateMenu();
                    }
                });
        } else {
            updateMenu();
        }
    });

    function updateMenu() {
        // fields to update
        var set = {
            name: menuParam.name,
            price: menuParam.price,
            available: menuParam.available,
            category: menuParam.category,
            subCategory: menuParam.subCategory,
            tasteType: menuParam.tasteType,
            subTasteType: menuParam.subTasteType,
            active: menuParam.active,
            updatedBy: req.user,
            updatedOn: new Date(),
        };

        db.menu.update(
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

    db.menu.update(
        { _id: mongo.helper.toObjectID(_id) },
        { $set: set },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}