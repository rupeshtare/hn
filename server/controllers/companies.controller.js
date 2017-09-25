var config = require('config.json');
var express = require('express');
var router = express.Router();
var companyService = require('services/company.service');

// routes
router.post('/', create);
router.get('/', getAll);
router.get('/:_id', get);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;


function create(req, res) {
    companyService.create(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    companyService.getAll(req.query)
        .then(function (customers) {
            res.send(customers);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function get(req, res) {
    companyService.getById(req.params._id)
        .then(function (company) {
            if (company) {
                res.send(company);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    companyService.update(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    companyService.delete(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}