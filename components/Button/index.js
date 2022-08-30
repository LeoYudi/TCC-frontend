import style from './style.module.css';

function Button({ text, clickHandler, isPrimary = true }) {
  return (
    <a
      className={`${style.button} ${isPrimary ? '' : style.secondaryButton}`}
      onClick={clickHandler}
    >
      <div>{text}</div>
    </a>
  );
}

export { Button };
