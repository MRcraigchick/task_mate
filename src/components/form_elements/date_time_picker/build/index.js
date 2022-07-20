import { useState, useEffect } from 'react';
import Input from './components/input/input';
import Picker from './components/picker/picker';
import styles from './date_time_picker.module.css';
import theme from '../css_variubles/theme.module.css';
import typography from '../css_variubles/typography.module.css';
import { useDateTime } from './contexts/date_time_context';
import { splitDate, matchDates, getTimeOfDay } from './lib/date_util';

export default function DateTimePicker ({ getValue, dateFormat, hr24, darkMode, dateLimits }) {
  const [openPicker, setOpenPicker] = useState(false);
  const [pickerType, setPickerType] = useState('calendar');
  const [state, dispatch] = useDateTime();

  useEffect(() => {
    setTimeOfDay();
  }, []);

  useEffect(() => {
    const current = splitDate(state.dateTime);
    const min = splitDate(dateLimits.min);
    const max = splitDate(dateLimits.max);

    if (['M', 'AM'].includes(state.timeOfDay) && current.hours >= 12) {
      setHours(current.hours - 12);
      return;
    }
    if (['N', 'PM'].includes(state.timeOfDay) && (current.hours < 12 || current.hours === 0)) {
      setHours(current.hours + 12);
      return;
    }

    if (matchDates(state.dateTime, dateLimits.min)) {
      if (current.hours < min.hours) {
        if (state.timeOfDay === 'AM' && current.hours === 12) {
          setNewDate(dateLimits.min);
          return;
        }
        setNewDate(dateLimits.min);
        return;
      }
      if (current.hours === min.hours) {
        if (current.mins < min.mins) {
          setNewDate(dateLimits.min);
          return;
        }
      }
    }
    if (matchDates(state.dateTime, dateLimits.max)) {
      if (current.hours > max.hours) {
        if (state.timeOfDay === 'PM' && current.hours === 12) {
          setNewDate(dateLimits.max);
          return;
        }
        setNewDate(dateLimits.max);
        return;
      }
      if (current.hours === max.hours) {
        if (current.mins > max.mins) {
          setNewDate(dateLimits.max);
          return;
        }
      }
    }
  }, [state, pickerType]);

  const setTimeOfDay = () => {
    dispatch({
      type: 'set-time-of-day',
      value: getTimeOfDay(state.dateTime, { hr24 }),
    });
  };

  const setNewDate = (date) => {
    dispatch({ type: 'new-date', value: date });
  };

  const setHours = (hours) => {
    dispatch({ type: 'set-date-time', value: { hours: hours } });
  };

  return (
    <>
      <style>
        { `
        body {
          overflow: ${openPicker ? 'hidden' : 'scroll'}
        }
        @media(max-height:600px){
          body {
            overflow: scroll;
            height: 600px;
          }
        }
        `}
      </style>
      <div className={ `${styles.DTPickerContainer} ${typography.typography} ${darkMode ? theme.dark : theme.light} ` }>
        <Input
          openPicker={ openPicker }
          setOpenPicker={ setOpenPicker }
          getValue={ getValue }
          dateFormat={ dateFormat }
          hr24={ hr24 }
        />
        <Picker
          openPicker={ openPicker }
          setOpenPicker={ setOpenPicker }
          pickerType={ pickerType }
          setPickerType={ setPickerType }
          hr24={ hr24 }
          dateLimits={ dateLimits }
        />
      </div>
    </>
  );
}