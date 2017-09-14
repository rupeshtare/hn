var config = require('config.json');
var express = require('express');
var router = express.Router();
var menuService = require('services/menu.service');

// routes
router.post('/', create);
router.get('/', getAll);
router.get('/:_id', get);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;


function create(req, res) {
    menuService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    menuService.getAll()
        .then(function (customers) {
            res.send(customers);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function get(req, res) {
    menuService.getById(req.params._id)
        .then(function (menu) {
            if (menu) {
                res.send(menu);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    menuService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    menuService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}