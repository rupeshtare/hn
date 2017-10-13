var moment = require('moment');

var date = {};

date.hours = hours;
date.startOfDay = startOfDay;
date.currentDate = currentDate;
date.dateInString = dateInString;

module.exports = date;

function hours() {
    return moment().hours();
}

function startOfDay(date) {
    return typeof date !== 'undefined' ? moment(date, 'ddd MMM DD YYYY hh:mm:ss ZZ').startOf('day').toDate() : moment().startOf('day').toDate();
}

function currentDate() {
    return moment().toDate();
}

function dateInString(date) {
    return typeof date !== 'undefined' ? moment(date).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY");
}

function yestreday() {
    return moment().subtract(1, "days").toDate();
}

function yestredayStartOfDay() {
    return startOfDay(moment().subtract(1, "days"));
}