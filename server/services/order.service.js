var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('order');

var service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;


function getAll(query) {
    var deferred = Q.defer();

    db.order.find({}, null, query).toArray(function (err, order) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        db.order.count(function (err, count){
            deferred.resolve({total: count, data: order});
        })
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.order.findById(_id, function (err, order) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (order) deferred.resolve(order);
        
        deferred.resolve();
    });

    return deferred.promise;
}

function create(orderParam) {
    var deferred = Q.defer();

    let customerKeys = ["_id", "firstName", "lastName"];
    let customer = Object.keys(orderParam.customer).reduce((prev, curr)=>{
        if(customerKeys.includes(curr)) prev[curr] = orderParam.customer[curr];return prev;
    },{});
    let orderKeys = ["menu", "quantity"];
    let menuKeys = ["_id", "name", "price"]
    let orders = orderParam.orders.filter(order=>{
        if(order.menu!==null) return order;
    }).map(order=>{
            return Object.keys(order).reduce((prev,curr)=>{
                if(curr!=="menu"){
                    if(orderKeys.includes(curr)) prev[curr] = order[curr];
                }
                else{
                    Object.keys(order[curr]).forEach(function(element) {
                        if(menuKeys.includes(element)) prev[element] = order["menu"][element];
                    });
                    prev["bill"] = prev["price"] * order["quantity"];
                }
                return prev;
            },{})
        }
    );
    
    if(orders.length===0)
        deferred.reject("Please select atleast one menu.");
    
    orders.forEach(order=>{
        createOrder({customer: customer, order: order});
    });

    function createOrder(orderParam) {
        db.order.insert(
            orderParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, orderParam) {
    var deferred = Q.defer();

    // validation
    db.order.findById(_id, function (err, order) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (order.name !== orderParam.name) {
            // order has changed so check if the new order is already taken
            db.order.findOne(
                { name: orderParam.name },
                function (err, order) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (order) {
                        // ordername already exists
                        deferred.reject('Order "' + order.name + '" is already taken')
                    } else {
                        updateOrder();
                    }
                });
        } else {
            updateOrder();
        }
    });

    function updateOrder() {
        // fields to update
        var set = {
            active: orderParam.active,
        };

        db.order.update(
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

    db.order.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}