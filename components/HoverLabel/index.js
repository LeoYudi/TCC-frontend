
import style from './style.module.css';

function HoverLabel({ text }) {
  return (
    <div
      className={style.hoverLabel}
    >
      {text}
    </div>
  );
}

export { HoverLabel }