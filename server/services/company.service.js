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

var collection = "company";

function getAll(params) {
    var deferred = Q.defer();

    db.find(collection, query = params.query, fields = params.include, sort = params.sort, skip = params.skip, limit = params.limit)
        .toArray(function (err, company) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            db.count(collection, query = params.query)
                .then((count) => {
                    deferred.resolve({ total: count, data: company });
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
        .then((company) => {
            if (company) deferred.resolve(company);
            deferred.resolve();
        })
        .catch((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });

    return deferred.promise;
}

function create(req) {
    var deferred = Q.defer();
    let companyParam = req.body;

    // validation
    db.findOne(collection, { name: companyParam.name })
        .then((company) => {
            if (company) {
                // company name already exists
                deferred.reject('Company "' + companyParam.name + '" is already taken');
            } else {
                createCompany();
            }
        })
        .catch((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });

    function createCompany() {
        db.insert(collection, companyParam)
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
    let companyParam = req.body;
    let _id = req.params._id

    // validation
    db.findById(collection, _id)
        .then((company) => {
            if (company.name !== companyParam.name) {
                // company has changed so check if the new company is already taken
                db.findOne(collection, { name: companyParam.name })
                    .then((company) => {
                        if (company) {
                            // companyname already exists
                            deferred.reject('Company "' + company.name + '" is already taken')
                        } else {
                            updateCompany();
                        }
                    })
                    .catch((err) => {
                        deferred.reject(err.name + ': ' + err.message);
                    });
            } else {
                updateCompany();
            }
        })
        .catch((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });

    function updateCompany() {
        // fields to update
        var set = {
            name: companyParam.name,
            updatedBy: companyParam.updatedBy,
            updatedOn: companyParam.updatedOn,
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
    let companyParam = req.body;
    let _id = req.params._id;
    let set = {
        active: companyParam.active,
        updatedBy: companyParam.updatedBy,
        updatedOn: companyParam.updatedOn,
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