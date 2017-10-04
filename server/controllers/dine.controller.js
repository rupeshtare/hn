var config = require('config.json');
var express = require('express');
var router = express.Router();
var dineService = require('services/dine.service');

// routes
router.post('/', create);
router.get('/', getAll);
router.post('/createOrUpdate', createOrUpdate);
router.get('/current', getCurrent);
router.get('/:_id', get);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;


function create(req, res) {
    dineService.create(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function createOrUpdate(req, res) {
    dineService.createOrUpdate(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    dineService.getCurrent(req.query)
        .then(function (customers) {
            res.send(customers);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    dineService.getAll(req.query)
        .then(function (customers) {
            res.send(customers);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function get(req, res) {
    dineService.getById(req.params._id)
        .then(function (messMember) {
            if (messMember) {
                res.send(messMember);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    dineService.update(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    dineService.delete(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}