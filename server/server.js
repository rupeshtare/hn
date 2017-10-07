require('rootpath')();
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
var _ = require('lodash');
var date = require('utils/date_utility');

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

    req.query._filter = _.omit(req.query, ['skip', 'limit', 'include']);

    if(req.query._filter.hasOwnProperty("active"))
        req.query._filter["active"] = req.query["active"] === "true";

    req.query.query = _.pick(req.query, ['skip', 'limit'])

    next();
})

// Middleware to add created on & created by
app.post('*', function (req, res, next) {
    req.body = _.merge(req.body, { createdBy: req.user, createdOn: date.currentDate(), active: true });
    next();
})

// Middleware to add updated on & updated by
app.put('*', function (req, res, next) {
    req.body = _.merge(req.body, { updatedBy: req.user, updatedOn: date.currentDate() });
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

// start server
var port = process.env.NODE_ENV === 'production' ? 80 : 4000;
var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});