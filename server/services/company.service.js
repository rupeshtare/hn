var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('company');

var service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;


function getAll(params) {
    var deferred = Q.defer();
    db.company.find(params._filter, params.include, params.query).sort({ "createdOn": -1 }).toArray(function (err, company) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        db.company.count(params._filter, function (err, count) {
            deferred.resolve({ total: count, data: company });
        })
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.company.findById(_id, function (err, company) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (company) deferred.resolve(company);

        deferred.resolve();
    });

    return deferred.promise;
}

function create(req) {
    var deferred = Q.defer();

    let companyParam = req.body;

    // validation
    db.company.findOne(
        { name: companyParam.name },
        function (err, company) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (company) {
                // companyname already exists
                deferred.reject('Company "' + companyParam.name + '" is already taken');
            } else {
                createCompany();
            }
        });

    function createCompany() {
        db.company.insert(
            companyParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(req) {
    var deferred = Q.defer();

    let companyParam = req.body;
    let _id = req.params._id

    // validation
    db.company.findById(_id, function (err, company) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (company.name !== companyParam.name) {
            // company has changed so check if the new company is already taken
            db.company.findOne(
                { name: companyParam.name },
                function (err, company) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (company) {
                        // companyname already exists
                        deferred.reject('Company "' + company.name + '" is already taken')
                    } else {
                        updateCompany();
                    }
                });
        } else {
            updateCompany();
        }
    });

    function updateCompany() {
        // fields to update
        var set = {
            name: companyParam.name,
            updatedBy: companyParam.updatedBy,
            updatedOn: companyParam.updatedOn,
        };

        db.company.update(
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

    let companyParam = req.body;
    let _id = req.params._id;
    let set = {
        active: companyParam.active,
        updatedBy: companyParam.updatedBy,
        updatedOn: companyParam.updatedOn,
    };

    db.company.update(
        { _id: mongo.helper.toObjectID(_id) },
        { $set: set },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}