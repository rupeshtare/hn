var config = require('config.json');
var express = require('express');
var router = express.Router();
var timeingService = require('services/timeing.service');

// routes
router.post('/', createOrUpdate);
router.get('/', get);

module.exports = router;


function createOrUpdate(req, res) {
    timeingService.createOrUpdate(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function get(req, res) {
    timeingService.get(req.query)
        .then(function (customers) {
            res.send(customers);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
