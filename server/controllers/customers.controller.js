var config = require('config.json');
var express = require('express');
var router = express.Router();
var customerService = require('services/customer.service');
var _ = require('lodash');

// routes
router.post('/', create);
router.get('/', getAll);
router.get('/:_id', get);
router.put('/:_id', update);
router.delete('/active/:_id', active);
router.delete('/deactive/:_id', deactive);

module.exports = router;


function create(req, res) {
    customerService.create(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    customerService.getAll(req.query)
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
    customerService.update(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function active(req, res) {
    req.body = _.merge(req.body, { active: true });
    customerService.delete(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deactive(req, res) {
    req.body = _.merge(req.body, { active: false });
    customerService.delete(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}