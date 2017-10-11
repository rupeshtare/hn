
var MongoClient = require("mongodb").MongoClient;
var ObjectID = require('mongodb').ObjectID;

var db = {};

db.findOne = findOne;
db.find = find;
db.count = count;
db.findById = findById;
db.insert = insert;
db.insertMany = insertMany;
db.update = update;
db.updateMany = updateMany;
db.objectID = ObjectID;
db.distinct = distinct;
db.aggregate = aggregate;

module.exports = db;

var dbObj;

MongoClient.connect("mongodb://localhost:27017/hn", (err, database) => {
    if (err) return console.log(err);
    dbObj = database;
})

function findOne(coll, query, options) {
    return dbObj.collection(coll).findOne(query, options);
}

function find(coll, query, fields, sort, skip, limit) {
    query = query !== undefined ? query : {};
    fields = fields !== undefined ? fields : {};
    sort = sort !== undefined ? sort : {};
    skip = skip !== undefined ? parseInt(skip) : 0;
    limit = limit !== undefined ? parseInt(limit) : 0;

    return dbObj
        .collection(coll)
        .find(query)
        .project(fields)
        .sort(sort)
        .skip(skip)
        .limit(limit);
}

function count(coll, query, sort, skip, limit) {
    query = query !== undefined ? query : {};
    sort = sort !== undefined ? sort : {};
    skip = skip !== undefined ? parseInt(skip) : 0;
    limit = limit !== undefined ? parseInt(limit) : 0;

    return dbObj
        .collection(coll)
        .find(query)
        .project({ "_id": 1 })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .count();
}

function findById(coll, _id, id) {
    var query = _id === undefined ? { _id: id } : { _id: ObjectID(_id) };
    return dbObj.collection(coll).findOne(query);
}

function insert(coll, doc, options) {
    options = options !== undefined ? options : {};
    return dbObj.collection(coll).insertOne(doc, options);
}

function insertMany(coll, docs, options) {
    options = options !== undefined ? options : {};
    return dbObj.collection(coll).insertMany(docs, options);
}

function update(coll, filter, doc, options) {
    options = options !== undefined ? options : {};
    return dbObj.collection(coll).updateOne(filter, doc, options);

}

function updateMany(coll, filter, doc, options) {
    options = options !== undefined ? options : {};
    return dbObj.collection(coll).updateMany(filter, doc, options);

}

function distinct(coll, key, query, options) {
    options = options !== undefined ? options : {};
    return dbObj.collection(coll).distinct(key, query, options);
}

function aggregate(coll, key, _filter, _sum) {
    return dbObj.collection(coll).aggregate([
        {
            $match: _filter
        },
        {
            $group: { _id: key, total: { $sum: _sum } }
        }
    ]);
}