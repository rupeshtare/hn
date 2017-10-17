var schedule = require('node-schedule');
var date = require('utils/date_utility');
var db = require('utils/db_utility');

var hn = {}

module.exports = hn;
var time = date.moment();

var j = schedule.scheduleJob('*/10 * * * *', function () {
  console.log("Running every => " + date.moment.duration(date.moment().diff(time)).humanize());
  time = date.moment();
  deactivateMessMembers();
});

function deactivateMessMembers() {
  let today = date.currentDate();
  let set = {
    active: false,
    updatedOn: today,
  };

  db.updateMany("mess_member", { "active": true, "endDate": { "$gte": today } }, { $set: set })
}

