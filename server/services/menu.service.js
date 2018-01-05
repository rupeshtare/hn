var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var db = require('utils/db_utility');

var service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

var collection = "menu";

function getAll(params) {
    var deferred = Q.defer();

    db.find(collection, query = params.query, fields = params.include, sort = params.sort, skip = params.skip, limit = params.limit)
        .toArray(function (err, menu) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            db.count(collection, query = params.query)
                .then((count) => {
                    deferred.resolve({ total: count, data: menu });
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
        .then((menu) => {
            if (menu) deferred.resolve(menu);
            deferred.resolve();
        })
        .catch((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });

    return deferred.promise;
}

function create(req) {
    var deferred = Q.defer();
    let menuParam = req.body;

    // validation
    db.findOne(collection, { name: menuParam.name })
        .then((menu) => {
            if (menu) {
                // menuname already exists
                deferred.reject('Menu "' + menuParam.name + '" is already taken');
            } else {
                createMenu();
            }
        })
        .catch((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });

    function createMenu() {
        menuParam = parseFloat(menuParam.price)
        db.insert(collection, menuParam)
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
    let menuParam = req.body;
    let _id = req.params._id

    // validation
    db.findById(collection, _id)
        .then((menu) => {
            if (menu.name !== menuParam.name) {
                // menu has changed so check if the new menu is already taken
                db.findOne(collection, { name: menuParam.name })
                    .then((menu) => {
                        if (menu) {
                            // menuname already exists
                            deferred.reject('Menu "' + menu.name + '" is already taken')
                        } else {
                            updateMenu();
                        }
                    })
                    .catch((err) => {
                        deferred.reject(err.name + ': ' + err.message);
                    });
            } else {
                updateMenu();
            }
        })
        .catch((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });

    function updateMenu() {
        // fields to update
        var set = {
            name: menuParam.name,
            price: parseFloat(menuParam.price),
            available: menuParam.available,
            category: menuParam.category,
            subCategory: menuParam.subCategory,
            tasteType: menuParam.tasteType,
            subTasteType: menuParam.subTasteType,
            updatedBy: menuParam.updatedBy,
            updatedOn: menuParam.updatedOn,
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
    let menuParam = req.body;
    let set = {
        active: menuParam.active,
        updatedBy: menuParam.updatedBy,
        updatedOn: menuParam.updatedOn,
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