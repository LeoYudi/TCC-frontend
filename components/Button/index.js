import styles from './style.module.css';

function Button({ text, clickHandler, isPrimary }) {
  return (
    <a
      className={`${styles.button} ${isPrimary ? '' : styles.secondaryButton}`}
      onClick={clickHandler}
    >
      <div>{text}</div>
    </a>
  );
}

export { Button };
