require('rootpath')();
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
var _ = require('lodash');
var date = require('utils/date_utility');

var schedule = require('schedule/hn.schedule');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use JWT auth to secure the api, the token can be passed in the authorization header or querystring
app.use(expressJwt({
    secret: config.secret,
    getToken: function (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'hn') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}).unless({ path: ['/users/authenticate', '/users/register'] }));

// Middleware to filter query params
app.get('*', function (req, res, next) {
    req.query.include = req.query.hasOwnProperty('include') ? req.query['include'].split(',').reduce((prev, curr) => { prev[curr] = 1; return prev; }, {}) : {};

    req.query.sort = req.query.hasOwnProperty('sort') ? req.query.sort.split(',').reduce((prev, curr) => {
        if (_.startsWith(curr, '+')) {
            prev[_.trimLeft(curr, '+')] = 1
        } else if (_.startsWith(curr, '-')) {
            prev[_.trimLeft(curr, '-')] = -1
        } else {
            prev[_.trim(curr)] = 1
        }
        return prev;
    }, {}) : { "createdOn": -1 }

    if (req.query.hasOwnProperty("filters")) {
        filterObj = JSON.parse(req.query.filters).reduce((prev, curr) => {
            if (curr['tableColumn'] !== null && curr['operation'] !== null && curr['filterValue'] !== null) {
                let tableColumn = curr['tableColumn'],
                    operation = curr['operation'],
                    filterValue = operation === '$in' || operation === '$nin' ? curr['filterValue'].split(','): curr['filterValue'];
                newObj = curr['operation'] === '$regex' ? { $options: 'i' } : {}; newObj[curr['operation']] = filterValue;
                prev[tableColumn] = newObj;
            }
            return prev;
        }, {});
        req.query = Object.assign(req.query, filterObj);
    }

    req.query.query = _.omit(req.query, ['skip', 'limit', 'include', 'sort', 'filters']);

    if (req.query.query.hasOwnProperty("active"))
        req.query.query["active"] = req.query["active"] === "true";

    next();
})

// Middleware to add created on & created by
app.post('*', function (req, res, next) {
    req.body = _.merge(req.body, { createdBy: req.user, createdOn: date.currentDate(), active: true });
    next();
})

// Middleware to add updated on & updated by
app.put('*', function (req, res, next) {
    req.body = _.merge(req.body, { updatedBy: req.user, updatedOn: date.currentDate() })
    next();
})

// Middleware to add updated on & updated by
app.delete('*', function (req, res, next) {
    req.body = _.merge(req.body, { updatedBy: req.user, updatedOn: date.currentDate() });
    next();
})

// routes
app.use('/users', require('./controllers/users.controller'));
app.use('/customers', require('./controllers/customers.controller'));
app.use('/menus', require('./controllers/menus.controller'));
app.use('/orders', require('./controllers/orders.controller'));
app.use('/companies', require('./controllers/companies.controller'));
app.use('/mess-members', require('./controllers/mess-members.controller'));
app.use('/dine', require('./controllers/dine.controller'));
app.use('/timeing', require('./controllers/timeing.controller'));

// start server
var port = process.env.NODE_ENV === 'production' ? 80 : 4000;
var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});