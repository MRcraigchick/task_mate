import Component from './build/index';
import { DateTimeContextProvider } from './build/contexts/date_time_context';
import { addYears } from 'date-fns';

const dNow = new Date();
const minDate = new Date(dNow.getFullYear(), dNow.getMonth(), 22, 8, 23, 0, 0);
const maxDate = addYears(minDate, 1);

export default function DateTimePicker ({ getValue = ({ inputValue, dateInstance }) => console.log(dateInstance), dateFormat = "dd/MM/yyyy", hr24 = false, darkMode = false, dateLimits = { min: minDate, max: maxDate } }) {

    return (
        <DateTimeContextProvider>
            <Component getValue={ getValue } dateFormat={ dateFormat } hr24={ hr24 } darkMode={ darkMode } dateLimits={ dateLimits } />
        </DateTimeContextProvider>);
};
