import { format } from 'date-fns';

export function splitDate (date) {
    return {
        day: Number(format(date, 'dd')),
        month: Number(format(date, 'MM')),
        year: Number(format(date, 'yyyy')),
        hours: Number(format(date, 'HH')),
        mins: Number(format(date, 'mm'))
    };
}

export function matchDates (date1, date2) {
    const matchingFormat = 'dd/MM/yyyy';
    return format(date1, matchingFormat) === format(date2, matchingFormat);
}

export function getTimeOfDay (date, options = { hr24: false }) {
    return format(date, 'HH') < 12 ? (options.hr24 ? 'M' : 'AM') : (options.hr24 ? 'N' : 'PM');
}