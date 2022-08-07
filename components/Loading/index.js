import styles from './style.module.css';

function Loading({ isLoading = false }) {
  return (
    <div
      className={styles.container}
      style={isLoading ? {} : { display: 'none' }}
    >
      <div className={styles.loading}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export { Loading };
