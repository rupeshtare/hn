import * as moment from 'moment';

export class DateUtility {

    hours() {
        return moment().hours();
    }

    startOfDay(date?: any) {
        return typeof date !== 'undefined' ?
            moment(date, ['YYYY-MM-DD hh:mm:ss ZZ', 'ddd MMM DD YYYY hh:mm:ss ZZ']).startOf('day').toDate() :
            moment().startOf('day').toDate();
    }

    currentDate() {
        return moment().toDate();
    }

    dateInString(date?: any) {
        return typeof date !== 'undefined' ?
            moment(date).format('DD/MM/YYYY') :
            moment().format('DD/MM/YYYY');
    }

    yestreday() {
        return moment().subtract(1, 'days').toDate();
    }

    yestredayStartOfDay() {
        return this.startOfDay(moment().subtract(1, 'days'));
    }

    addDays(days?: any, date?: any) {
        days = parseInt(days, 10);
        return typeof date !== 'undefined' ?
            this.startOfDay(moment(date).add(days, 'days')) :
            this.startOfDay(moment().add(days, 'days'));
    }

    subtractDays(days?: any, date?: any) {
        days = parseInt(days, 10);
        return typeof date !== 'undefined' ?
            this.startOfDay(moment(date).subtract(days, 'days')) :
            this.startOfDay(moment().subtract(days, 'days'));
    }

    daysDiff(date1?: any, date2?: any) {
        date1 = date1 !== 'undefined' ? moment(date1) : moment();
        date2 = date2 !== 'undefined' ? moment(date2) : moment();
        return date2.diff(date1, 'days');
    }
}
