import styles from './year_picker.module.css';
import { useDateTime } from '../../../../contexts/date_time_context';
import { format } from 'date-fns';

export default function YearPicker ({ dateLimits }) {
  const [state, dispatch] = useDateTime();
  const years = Array.from({ length: Number(format(dateLimits.max, 'yyyy')) + 1 - Number(format(dateLimits.min, 'yyyy')) }, (_, i) => Number(format(dateLimits.min, 'yyyy')) + i);
  let keyCount = 0;

  return (
    <div className={ styles.yearPickerContainer }>
      <div className={ styles.yearsGrid }>
        { years.map((year) => {
          const currentKey = keyCount;
          keyCount += 1;
          return (
            <button
              key={ currentKey }
              type="button"
              className={ `${styles.yearBtn} ${Number(format(state.dateTime, 'yyyy')) === year ? styles.selectedYear : ''
                }` }
              onClick={ (e) => dispatch({ type: 'set-date-time', value: { year: Number(e.target.textContent) } }) }>
              <p className={ styles.year }>{ year }</p>
            </button>
          );
        }) }
      </div>
    </div>
  );
}
