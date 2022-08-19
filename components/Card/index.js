import style from './style.module.css';

function Card({ label, children }) {
  return (
    <div className={style.card}>
      <div className={style.cardLabel}>{label}</div>
      <div className={style.cardContent}>{children}</div>
    </div>
  );
}

export { Card };