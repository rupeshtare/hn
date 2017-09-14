var config = require('config.json');
var express = require('express');
var router = express.Router();
var customerService = require('services/customer.service');

// routes
router.post('/', create);
router.get('/', getAll);
router.get('/:_id', get);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;


function create(req, res) {
    customerService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    customerService.getAll()
        .then(function (customers) {
            res.send(customers);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function get(req, res) {
    customerService.getById(req.params._id)
        .then(function (customer) {
            if (customer) {
                res.send(customer);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    customerService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    customerService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}