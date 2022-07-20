import { useState, useEffect, useRef } from 'react';
import styles from './time_picker.module.css';
import { useDateTime } from '../../../contexts/date_time_context';
import { format } from 'date-fns';

export default function TimePicker ({ pickerType, hr24, dateLimits }) {
  const [state, dispatch] = useDateTime();
  const [timePositions, setTimePositions] = useState([]);
  const [touchDown, setTouchDown] = useState(false);
  const clockRef = useRef();

  useEffect(() => {
    document.addEventListener('mousedown', mousedownHandler);
    return () => {
      document.removeEventListener('mousedown', mousedownHandler);
    };
  }, []);

  useEffect(() => {
    let children = [];
    const clockContainer = clockRef.current.childNodes[0];
    for (let child of clockContainer.childNodes) {
      children = [...children, child];
    }
    setTimePositions(children);
  }, [pickerType]);

  useEffect(() => {
    document.addEventListener('mousemove', mousemoveHandler);
    document.addEventListener('mouseup', mouseupHandler);
    return () => {
      document.removeEventListener('mousemove', mousemoveHandler);
      document.removeEventListener('mouseup', mousedownHandler);
    };
  }, [touchDown]);

  const mousedownHandler = (e) => {
    setTouchDown(true);
  };
  const mousemoveHandler = (e) => {
    if (touchDown && e.target.classList) {
      for (let c of e.target.classList) {
        if (c === styles.hourBtn) {
          const value = Number(e.target.value);
          if (value === 12) {
            dispatch({ type: 'set-date-time', value: { hours: value - 12 } });
            return;
          }
          if (value === 0) {
            dispatch({ type: 'set-date-time', value: { hours: value + 12 } });
            return;
          }
          dispatch({ type: 'set-date-time', value: { hours: value } });
          return;
        }
        if (c === styles.clockArm) {
          const value = Number(e.target.childNodes[0].value);
          if (value === 12) {
            dispatch({
              type: 'set-date-time',
              value: pickerType === 'hours' ? { hours: value - 12 } : { minutes: value },
            });
            return;
          }
          if (value === 0) {
            dispatch({
              type: 'set-date-time',
              value: pickerType === 'hours' ? { hours: value + 12 } : { minutes: value },
            });
            return;
          }
          dispatch({
            type: 'set-date-time',
            value: pickerType === 'hours' ? { hours: value } : { minutes: value },
          });
          return;
        }
        if (c === styles.division || c === styles.wholeNumber) {
          dispatch({ type: 'set-date-time', value: { minutes: e.target.value } });
        }
      }
    }
  };
  const mouseupHandler = (e) => {
    setTouchDown(false);
  };

  const touchMoveHandler = (e) => {
    e.preventDefault();
    const currentPos = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY,
    };
    for (let target of timePositions) {
      const rect = target.children[0].getBoundingClientRect();
      if (
        currentPos.x <= rect.right - 7 &&
        currentPos.x >= rect.left + 7 &&
        currentPos.y <= rect.bottom &&
        currentPos.y >= rect.top
      ) {
        for (let c of target.classList) {
          if (c === styles.hourBtn) {
            const value = Number(target.value);
            if (value === 12) {
              dispatch({ type: 'set-date-time', value: { hours: value - 12 } });
              return;
            }
            if (value === 0) {
              dispatch({ type: 'set-date-time', value: { hours: value + 12 } });
              return;
            }
            dispatch({ type: 'set-date-time', value: { hours: value } });
            return;
          }
          if (c === styles.clockArm) {
            const value = Number(target.childNodes[0].value);
            if (value === 12) {
              dispatch({
                type: 'set-date-time',
                value: pickerType === 'hours' ? { hours: value - 12 } : { minutes: value },
              });
              return;
            }
            if (value === 0) {
              dispatch({
                type: 'set-date-time',
                value: pickerType === 'hours' ? { hours: value + 12 } : { minutes: value },
              });
              return;
            }
            dispatch({
              type: 'set-date-time',
              value: pickerType === 'hours' ? { hours: value } : { minutes: value },
            });
            return;
          }
          if (c === styles.division || c === styles.wholeNumber) {
            dispatch({ type: 'set-date-time', value: { minutes: target.value } });
          }
        }
      }
    }
  };

  return (
    <div className={ styles.timePickerContainer }>
      <div className={ styles.currentFaceContainer } ref={ clockRef }>
        { pickerType === 'hours' ? (
          <>
            <HoursFace
              selectedHour={ Number(format(state.dateTime, 'HH')) }
              hr24={ hr24 }
              onTouchMove={ touchMoveHandler }
              dateLimits={ dateLimits }
            />
            <div className={ styles.timeOfDaySelectors }>
              <button
                type='button'
                className={ `${styles.AMbtn} ${state.timeOfDay === 'AM' || state.timeOfDay === 'M' ? styles.timeOfDayBtnSelected : ''
                  }` }
                onClick={ () => {
                  hr24 ? dispatch({ type: 'set-time-of-day', value: 'M' }) : dispatch({ type: 'set-time-of-day', value: 'AM' });
                } }>
                { hr24 ? 'M' : 'AM' }
              </button>
              <button
                type='button'
                className={ `${styles.PMbtn} ${state.timeOfDay === 'PM' || state.timeOfDay === 'N' ? styles.timeOfDayBtnSelected : ''
                  }` }
                onClick={ () => {
                  hr24 ? dispatch({ type: 'set-time-of-day', value: 'N' }) : dispatch({ type: 'set-time-of-day', value: 'PM' });
                } }>
                { hr24 ? 'N' : 'PM' }
              </button>
            </div>
          </>
        ) : (
          <MinsFace
            selectedMins={ Number(format(state.dateTime, 'mm')) }
            onTouchMove={ touchMoveHandler }
            touchDown={ touchDown }
            dateLimits={ dateLimits }
          />
        ) }
      </div>
    </div>
  );
}

function HoursFace ({ selectedHour, hr24, onTouchMove, dateLimits }) {
  const [state, dispatch] = useDateTime();
  const AM = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
    (h) => (h = { render: hr24 ? (h === 12 ? '00' : h) : h, value: Number(h) })
  );
  const PM = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0].map(
    (h) => (h = { render: hr24 ? (h === 0 ? '12' : h) : h === 0 ? 12 : h - 12, value: Number(h) })
  );

  const hours = state.timeOfDay === 'AM' || state.timeOfDay === 'M' ? AM : PM;
  const fraction = 360 / 12;
  let degCount = fraction;

  useEffect(() => {
  }, [state.timeOfDay]);

  return (
    <div className={ styles.hoursFace } onTouchMove={ onTouchMove }>
      { hours.map(({ render, value }) => {
        const currentDeg = degCount;

        if (state.timeOfDay === 'AM' && value === 12) {
          value = 0;
        }
        else if (state.timeOfDay === 'PM' && value === 0) {
          value = 12;
        }

        const disabled = (
          !(format(state.dateTime, 'dd/MM/yyyy') === format(dateLimits.min, 'dd/MM/yyyy') ?
            (Number(value) < Number(format(dateLimits.min, 'HH'))) : false) ?
            (format(state.dateTime, 'dd/MM/yyyy') === format(dateLimits.max, 'dd/MM/yyyy') ?
              (Number(value) > Number(format(dateLimits.max, 'HH'))) : false) :
            true);

        degCount += fraction;
        return (
          <div
            key={ currentDeg }
            style={ {
              transformOrigin: 'bottom',
              transform: `rotate(${currentDeg}deg) scale(0.9)`,
            } }
            className={ `${styles.clockArm} ${selectedHour === value || selectedHour - 12 === value || selectedHour + 12 === value
              ? styles.selected
              : ''
              }` }>
            <button
              style={ {
                transform: `rotate(${-currentDeg}deg)`,
              } }
              disabled={ disabled }
              value={ value }
              className={ `${disabled ? styles.disabled : ''} ${styles.hourBtn} ${selectedHour === value || selectedHour - 12 === value || selectedHour + 12 === value
                ? styles.selected
                : ''
                } ` }
              onClick={ (e) => {
                e.preventDefault();
                if (Number(e.target.value) === 12) {
                  dispatch({ type: 'set-date-time', value: { hours: e.target.value - 12 } });
                  return;
                }
                if (Number(e.target.value) === 0) {
                  dispatch({ type: 'set-date-time', value: { hours: e.target.value + 12 } });
                  return;
                }
                dispatch({ type: 'set-date-time', value: { hours: e.target.value } });
              } }>
              { render }
            </button>
          </div>
        );
      }) }
      <div className={ styles.center }></div>
    </div>
  );
}

function MinsFace ({ selectedMins, onTouchMove, dateLimits }) {
  const [state, dispatch] = useDateTime();
  const mins = [...Array(60).keys()].map((m) => (m = { render: m === 0 || m % 5 === 0 ? m : '-', value: m }));
  const fraction = 360 / 60;
  let degCount = fraction;

  return (
    <div className={ styles.minsFace } onTouchMove={ onTouchMove }>
      { mins.map(({ render, value }) => {
        const currentDeg = degCount;

        const disabled = (
          !(format(state.dateTime, 'dd/MM/yyyy') === format(dateLimits.min, 'dd/MM/yyyy') ?
            (Number(format(state.dateTime, 'HH')) === Number(format(dateLimits.min, 'HH')) ?
              (Number(value) < Number(format(dateLimits.min, 'mm'))) : false)
            : false) ?
            (format(state.dateTime, 'dd/MM/yyyy') === format(dateLimits.max, 'dd/MM/yyyy') ?
              (Number(format(state.dateTime, 'HH')) === Number(format(dateLimits.max, 'HH')) ?
                (Number(value)) > Number(format(dateLimits.max, 'mm'))
                : false)
              : false)
            : true);

        degCount += fraction;
        return (
          <div
            key={ currentDeg }
            style={
              render === '-'
                ? {
                  transformOrigin: 'bottom',
                  transform: `rotate(${currentDeg}deg) scale(0.9)`,
                }
                : {
                  transformOrigin: 'bottom',
                  transform: `rotate(${currentDeg}deg) scale(0.9)`,
                }
            }
            className={ `${styles.clockArm} ${selectedMins === value ? styles.selected : ''}` }>
            <button
              style={
                render === '-'
                  ? {
                    transform: `rotate(90deg)`,
                  }
                  : {
                    transform: `rotate(${-currentDeg + 6}deg)`,
                  }
              }
              className={ `${disabled ? styles.disabled : ''} ${render === '-' ? styles.division : styles.wholeNumber} ${selectedMins === value ? styles.selected : ''
                }
              `}
              disabled={ disabled }
              value={ value }
              onClick={ (e) => {
                e.preventDefault();
                if (Number(e.target.value) === 59) {
                  dispatch({ type: 'set-date-time', value: { minutes: Number(e.target.value) - 59 } });
                  return;
                }
                if (e.target.textContent === '-') {
                  const onesPlace = Number(String(e.target.value).split('').slice(-1));

                  if (onesPlace <= 2) {
                    dispatch({ type: 'set-date-time', value: { minutes: Math.floor(e.target.value / 5) * 5 } });
                    return;
                  }
                  if (onesPlace >= 3 && onesPlace < 5) {
                    dispatch({ type: 'set-date-time', value: { minutes: Math.round(e.target.value / 5) * 5 } });
                    return;
                  }
                  if (onesPlace <= 7 && onesPlace > 5) {
                    dispatch({ type: 'set-date-time', value: { minutes: Math.floor(e.target.value / 5) * 5 } });
                    return;
                  }
                  if (onesPlace >= 8 && onesPlace < 10) {
                    const value = Math.round(e.target.value / 5) * 5;
                    if (value === 60) {
                      dispatch({ type: 'set-date-time', value: { minutes: value - 59 } });
                      return;
                    }
                    dispatch({ type: 'set-date-time', value: { minutes: value } });
                    return;
                  }
                }
                dispatch({ type: 'set-date-time', value: { minutes: e.target.value } });
              } }
              onTouchStart={ (e) => {
                e.preventDefault();
              } }>
              { render === 0 ? '00' : render }
            </button>
          </div>
        );
      }) }
      <div className={ styles.center }></div>
    </div>
  );
}
