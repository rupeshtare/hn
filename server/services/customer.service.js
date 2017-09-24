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


function getAll(query) {
    var deferred = Q.defer();

    db.customer.find({}, null, query).sort({"createdOn": -1}).toArray(function (err, customer) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        db.customer.count(function (err, count){
            deferred.resolve({total: count, data: customer});
        })
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

function create(req) {
    var deferred = Q.defer();

    let customerParam = _.merge(req.body, {createdBy: req.user, createdOn: new Date()});

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

function update(req) {
    var deferred = Q.defer();

    let customerParam = req.body;
    let _id = req.params._id

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
            employeeType: customerParam.employeeType,
            active: customerParam.active,
            updatedBy: req.user,
            updatedOn: new Date(),
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

function _delete(req) {
    var deferred = Q.defer();

    let _id = req.params._id;
    let set = {
        active: false,
        updatedBy: req.user,
        updatedOn: new Date(),
    };

    db.customer.update(
        { _id: mongo.helper.toObjectID(_id) },
        { $set: set },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}