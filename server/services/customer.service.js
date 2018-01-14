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

var collection = "customer";

function getAll(params) {
    var deferred = Q.defer();

    db.find(collection, query = params.query, fields = params.include, sort = params.sort, skip = params.skip, limit = params.limit)
        .toArray(function (err, customer) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            db.count(collection, query = params.query)
                .then((count) => {
                    deferred.resolve({ total: count, data: customer });
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
        .then((customer) => {
            if (customer) deferred.resolve(customer);
            deferred.resolve();
        })
        .catch((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });

    return deferred.promise;
}

function create(req) {
    var deferred = Q.defer();
    let customerParam = req.body;

    // validation
    db.findOne(collection,
        {
            'company._id': customerParam.company._id,
            'firstName': customerParam.firstName,
            'lastName': customerParam.lastName
        })
        .then((customer) => {
            if (customer) {
                // customername already exists
                deferred.reject('Customer "' + customerParam.firstName + '" is already taken');
            } else {
                createCustomer();
            }
        })
        .catch((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });

    function createCustomer() {
        db.insert(collection, customerParam)
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
    let customerParam = req.body;
    let _id = req.params._id

    // validation
    db.findById(collection, _id)
        .then((customer) => {
            if (customer.company._id !== customerParam.company._id ||
                customer.firstName !== customerParam.firstName ||
                customer.lastName !== customerParam.lastName) {
                // customer has changed so check if the new customer is already taken
                db.findOne(collection,
                    {
                        'company._id': customerParam.company._id,
                        'firstName': customerParam.firstName,
                        'lastName': customerParam.lastName
                    })
                    .then((customer) => {
                        if (customer) {
                            // customername already exists
                            deferred.reject('Customer "' + customer.firstName + '" is already taken')
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
            company: customerParam.company,
            mobile: customerParam.mobile,
            firstName: customerParam.firstName,
            middleName: customerParam.middleName,
            lastName: customerParam.lastName,
            dob: customerParam.dob,
            email: customerParam.email,
            employeeType: customerParam.employeeType,
            updatedBy: customerParam.updatedBy,
            updatedOn: customerParam.updatedOn,
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
    let customerParam = req.body;
    let _id = req.params._id;
    let set = {
        active: customerParam.active,
        updatedBy: customerParam.updatedBy,
        updatedOn: customerParam.updatedOn,
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