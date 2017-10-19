var schedule = require('node-schedule');
var date = require('utils/date_utility');
var db = require('utils/db_utility');
var messMemberService = require('services/mess-member.service');

var hn = {}

module.exports = hn;
var time = date.moment();

var j = schedule.scheduleJob('*/1 * * * *', function () {
  console.log('Running every => ' + date.moment.duration(date.moment().diff(time)).humanize());
  time = date.moment();
  deactivateMessMembers();
});

function deactivateMessMembers() {
  let today = date.startOfDay();
  let set = {
    active: false,
    updatedOn: date.currentDate(),
  };

  db.find('mess_member', { 'active': true, 'endDate': { '$lt': today } }, { "_id": 1 })
    .toArray(function (err, messMember) {

      messMember.forEach(function (element) {
        db.update('mess_member', element, { $set: set });
        messMemberService.messOrder(element._id)
          .catch(err => console.log(err));
      });

    });

}

