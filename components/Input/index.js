import { useState, useEffect } from 'react';

import style from './style.module.css';

function Input({ placeholder, onChange }) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChange(inputValue);
    }, 500);

    return () => { clearTimeout(timeoutId) };
  }, [inputValue, onChange])

  return (
    <div className={style.container}>
      <input
        placeholder={placeholder}
        value={inputValue}
        type='number'
        onChange={event => {
          setInputValue(event.target.value);
        }}
      />
    </div>
  );
}

export { Input };