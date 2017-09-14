var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('customer');

var service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;


function getAll() {
    var deferred = Q.defer();

    db.customer.find().toArray(function (err, customer) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(customer);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.customer.findById(_id, function (err, customer) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (customer) deferred.resolve(customer);
        
        deferred.resolve();
    });

    return deferred.promise;
}

function create(customerParam) {
    var deferred = Q.defer();

    // validation
    db.customer.findOne(
        { company: customerParam.company,
            firstName: customerParam.firstName,
            middleName: customerParam.middleName,
            lastName: customerParam.lastName },
        function (err, customer) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (customer) {
                // customername already exists
                deferred.reject('Customer "' + customerParam.firstName + '" is already taken');
            } else {
                createMenu();
            }
        });

    function createMenu() {
        db.customer.insert(
            customerParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, customerParam) {
    var deferred = Q.defer();

    // validation
    db.customer.findById(_id, function (err, customer) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (customer.company !== customerParam.company ||
            customer.firstName !== customerParam.firstName ||
            customer.middleName !== customerParam.middleName ||
            customer.lastName !== customerParam.lastName) {
            // customer has changed so check if the new customer is already taken
            db.customer.findOne(
                { company: customerParam.company,
                    firstName: customerParam.firstName,
                    middleName: customerParam.middleName,
                    lastName: customerParam.lastName },
                function (err, customer) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (customer) {
                        // customername already exists
                        deferred.reject('Customer "' + customer.firstName + '" is already taken')
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
            company: customerParam.company,
            mobile: customerParam.mobile,
            firstName: customerParam.firstName,
            middleName: customerParam.middleName,
            lastName: customerParam.lastName,
            dob: customerParam.dob,
            email: customerParam.email,
            employment: customerParam.employment,
        };

        db.customer.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.customer.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}