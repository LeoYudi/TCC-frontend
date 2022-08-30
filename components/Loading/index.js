import style from './style.module.css';

function Loading({ isLoading = false }) {
  return (
    <div
      className={style.container}
      style={isLoading ? {} : { display: 'none' }}
    >
      <div className={style.loading}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export { Loading };
