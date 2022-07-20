import { useState, useEffect, useRef } from 'react';
import styles from './input.module.css';
import font from './fonts/primary/primary_font.module.css';

export default function Input ({ type, name, placeholder, placholderOutline = false, onChange = (e) => { } }) {
  const [outline, setOutline] = useState('default');
  const [placeholderStyles, setPlaceholderStyles] = useState('inline');
  const [value, setValue] = useState('');

  const inputRef = useRef();

  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  });

  useEffect(() => {
    if (value === '' || value === undefined) {
      setPlaceholderStyles('inline');
      return;
    }
    setPlaceholderStyles('float');
  }, []);

  const handleClick = (e) => {
    let match = false;
    for (let elem of util.elementAndNestedChildren(inputRef.current)) {
      if (e.target === elem) {
        match = true;
        break;
      }
    }
    if (match) {
      return;
    }
    setOutline('default');
    if (value === '' || value === undefined) {
      setPlaceholderStyles('inline');
    }
  };

  return (
    <div
      ref={ inputRef }
      className={ `${styles.inputContainer} ${styles[outline]} ${font.primaryReg}` }
      onClick={ () => {
        setOutline('focused');
        if (value !== '' || value !== undefined) {
          setPlaceholderStyles('float');
        }
      } }
      onMouseDown={ () => {
        setOutline('focused');
      } }
      onMouseOver={ () => {
        return outline !== 'focused' ? setOutline('hover') : setOutline('focused');
      } }
      onMouseLeave={ () => {
        return outline !== 'focused' ? setOutline('default') : setOutline('focused');
      } }>
      <label htmlFor={ name } className={ `${styles.placeholder} ${styles[placeholderStyles]} ${placholderOutline ? placeholderStyles === 'float' ? styles[outline] : '' : styles.noOutline}` }>
        <p>{ placeholder }</p>
      </label>
      <input type={ type } name={ name } onChange={ (e) => {
        setValue(e.target.value);
        onChange(e);
      } } />
      <div className={ styles.inputPaddingRight }></div>
    </div>
  );
}

const util = (() => {
  let nestedChildren = [];
  return {
    elementAndNestedChildren (element) {
      nestedChildren = [...nestedChildren, element];
      for (let child of element.children) {
        this.elementAndNestedChildren(child);
      }
      return nestedChildren;
    },
  };
})();
