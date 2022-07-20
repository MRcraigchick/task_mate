import { useEffect, useState } from 'react';
import styles from './new_task.module.css';
import DateTimePicker from '../../components/form_elements/date_time_picker/date_time_picker';
import Input from '../../components/form_elements/input/input';

export default function NewTask ({ darkMode }) {
  const [formData, setFormData] = useState({
    task: '',
    dateTime: ''
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div className={ styles.pageContainer }>
      <form className={ styles.formBody }>
        <Input type='text' name='task' placeholder='Task' onChange={ (e) => setFormData({ ...formData, task: e.target.value }) } />
        <DateTimePicker
          hr24={ false }
          dateTimeLimit={ new Date() }
          yearRange={ [new Date().getFullYear(), 2100] }
          dateFormat='dd/MM/yyyy'
          darkMode={ darkMode }
          getValue={ ({ inputValue, dateInstance }) => {
            setFormData({ ...formData, dateTime: dateInstance });
          } }
        />
      </form>
    </div>
  );
}
