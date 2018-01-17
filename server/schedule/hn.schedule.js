var schedule = require('node-schedule');
var date = require('utils/date_utility');
var db = require('utils/db_utility');
var messMemberService = require('services/mess-member.service');

var hn = {}

module.exports = hn;
var time = date.moment();

// Run this job everyday at midnight.
var j = schedule.scheduleJob('0 0 * * *', function () {
  console.log('Running every => ' + date.moment.duration(date.moment().diff(time)).humanize());
  time = date.moment();
  deactivateMessMembers();
});

// Run this job on first day of month at midnight.
var j = schedule.scheduleJob('0 0 1 * *', function () {
  console.log('Running every => ' + date.moment.duration(date.moment().diff(time)).humanize());
  time = date.moment();
  calculateBill();
});

function deactivateMessMembers() {
  let today = date.startOfDay();
  let set = {
    active: false,
    updatedOn: date.currentDate(),
  };

  db.find('mess_member', { 'active': true, 'endDate': { '$lt': today } }, { "_id": 1, 'recursive': 1 })
    .toArray(function (err, messMember) {

      messMember.forEach(function (element) {
        // Deactivate mess member
        db.update('mess_member', element, { $set: set });

        // Check recursive & create mess member
        if (element.hasOwnProperty('recursive') && element.recursive === true) {
          messMemberService.addRecursiveMessMember(element._id);
        }

        // Add billing of mess member
        messMemberService.messOrder(element._id)
          .catch(err => console.log(err));
      });

    });

}

function calculateBill() {
  console.log('Calculating bill')
}
