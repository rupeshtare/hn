var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('order');

var service = {};

service.getAll = getAll;
service.getOrders = getOrders;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;


function getAll(query) {
    let search = {}
    customer = query.customer ? search["customer._id"] = query.customer : null;
    startDate = query.startDate ? new Date(query.startDate) : new Date();    
    endDate = query.endDate ? new Date(query.endDate) : new Date();
    search["createdOn"] = {"$gte" :  startDate, "$lte" : endDate};
    var deferred = Q.defer();

    db.order.find(search, null, query).sort({"createdOn": -1}).toArray(function (err, order) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        db.order.count(search, function (err, count){
            deferred.resolve({total: count, data: order});
        })
    });

    return deferred.promise;
}

function getOrders(query) {
    var deferred = Q.defer();
    let key = ['customer._id', 'customer.firstName', 'customer.middleName', 'customer.lastName' ]
    let condition = {}
    let initial = { 'count': 0, 'total': 0 }
    let reduce = 'function(doc, out) { out.count++; out.total += doc.order.bill; }'
    db.order.group(key, {}, initial, reduce, function (err, order) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve({data: order});
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

function create(req) {
    var deferred = Q.defer();

    let orderParam = req.body;

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
        createOrder({customer: customer, order: order, createdBy: req.user, createdOn: new Date()});
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

function update(req) {
    var deferred = Q.defer();

    let orderParam = req.body;
    let _id = req.params._id

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
            updatedBy: req.user,
            updatedOn: new Date(),
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

function _delete(req) {
    var deferred = Q.defer();

    let _id = req.params._id;
    let set = {
        active: false,
        updatedBy: req.user,
        updatedOn: new Date(),
    };

    db.order.update(
        { _id: mongo.helper.toObjectID(_id) },
        { $set: set },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}