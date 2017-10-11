var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var date = require('utils/date_utility');
var db = require('utils/db_utility');

var service = {};

service.getAll = getAll;
service.getOrders = getOrders;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

var collection = "order";

function getAll(params) {
    customer = params.customer ? params.query["customer._id"] = params.customer : null;
    startDate = params.startDate ? date.startOfDay(params.startDate) : date.startOfDay();
    endDate = params.endDate ? date.startOfDay(params.endDate) : date.currentDate();
    params.query = _.omit(params.query, ["startDate", "endDate", "customer"])
    _.merge(params.query, { "createdOn": { "$gte": startDate, "$lte": endDate } })

    var deferred = Q.defer();

    db.find(collection, query = params.query, fields = params.include, sort = { "createdOn": -1 }, skip = params.skip, limit = params.limit)
        .toArray(function (err, order) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            db.count(collection, query = params.query)
                .then((count) => {
                    deferred.resolve({ total: count, data: order });
                })
                .catch((err) => {
                    deferred.reject(err.name + ': ' + err.message);
                });
        });

    return deferred.promise;
}

function getOrders(params) {
    var deferred = Q.defer();
    let _filter = {};
    company = params.company ? params.company : null;
    db.distinct("customer", "_id", { "company._id": company })
        .then((customers) => {
            customers = customers.map((key) => { return key.toString(); })
            _.merge(_filter, { "customer._id": { "$in": customers } });
            startDate = params.startDate ? date.startOfDay(params.startDate) : date.startOfDay();
            endDate = params.endDate ? date.startOfDay(params.endDate) : date.currentDate();
            _.merge(_filter, { "createdOn": { "$gte": startDate, "$lte": endDate } })

            let _id = { customer: '$customer._id', firstName: '$customer.firstName', lastName: '$customer.lastName' }
            let _sum = "$order.bill"
            db.aggregate(collection, _id, _filter, _sum)
                .toArray(function (err, orders) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    deferred.resolve({ data: orders });
                });
        })
        .catch((err) => {
            customers = [];
        })

    return deferred.promise;
}


function getById(_id) {
    var deferred = Q.defer();

    db.findById(collection, _id)
        .then((order) => {
            if (order) deferred.resolve(order);

            deferred.resolve();
        })
        .catch((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });

    return deferred.promise;
}

function create(req) {
    var deferred = Q.defer();
    let orderParam = req.body;
    let customerKeys = ["_id", "firstName", "lastName"];
    let customer = Object.keys(orderParam.customer).reduce((prev, curr) => {
        if (customerKeys.includes(curr)) prev[curr] = orderParam.customer[curr]; return prev;
    }, {});
    let orderKeys = ["menu", "quantity"];
    let menuKeys = ["_id", "name", "price"]
    let orders = orderParam.orders.filter(order => {
        if (order.menu !== null) return order;
    }).map(order => {
        return Object.keys(order).reduce((prev, curr) => {
            if (curr !== "menu") {
                if (orderKeys.includes(curr)) prev[curr] = order[curr];
            }
            else {
                Object.keys(order[curr]).forEach(function (element) {
                    if (menuKeys.includes(element)) prev[element] = order["menu"][element];
                });
                prev["bill"] = prev["price"] * order["quantity"];
            }
            return prev;
        }, {})
    }
        );

    if (orders.length === 0)
        deferred.reject("Please select at least one menu.");

    orders.forEach(order => {
        createOrder({ customer: customer, order: order, createdBy: req.user, createdOn: date.currentDate() });
    });

    function createOrder(orderParam) {
        db.insert(collection, orderParam)
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
    let orderParam = req.body;
    let _id = req.params._id

    // validation
    db.findById(collection, _id)
        .then((order) => {
            if (order.name !== orderParam.name) {
                // order has changed so check if the new order is already taken
                db.findOne(collection, { name: orderParam.name })
                    .then((order) => {
                        if (order) {
                            // ordername already exists
                            deferred.reject('Order "' + order.name + '" is already taken')
                        } else {
                            updateOrder();
                        }
                    })
                    .catch((err) => {
                        deferred.reject(err.name + ': ' + err.message);
                    });
            } else {
                updateOrder();
            }
        })
        .catch((err) => {
            deferred.reject(err.name + ': ' + err.message);
        });

    function updateOrder() {
        // fields to update
        var set = {
            updatedBy: orderParam.updatedBy,
            updatedOn: orderParam.updatedOn,
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
    let set = {
        active: orderParam.active,
        updatedBy: orderParam.updatedBy,
        updatedOn: orderParam.updatedOn,
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