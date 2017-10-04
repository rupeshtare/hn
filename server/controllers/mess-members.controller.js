var config = require('config.json');
var express = require('express');
var router = express.Router();
var messMemberService = require('services/mess-member.service');

// routes
router.post('/', create);
router.get('/', getAll);
router.get('/current', getAllCurrent);
router.get('/:_id', get);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;


function create(req, res) {
    messMemberService.create(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllCurrent(req, res) {
    messMemberService.getAllCurrent(req.query)
        .then(function (customers) {
            res.send(customers);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    messMemberService.getAll(req.query)
        .then(function (customers) {
            res.send(customers);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function get(req, res) {
    messMemberService.getById(req.params._id)
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
    messMemberService.update(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    messMemberService.delete(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}