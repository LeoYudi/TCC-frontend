import { Button } from '../Button';

import style from './style.module.css';

function Modal({ show, onClose, children }) {
  return (
    <div
      className={style.container}
      style={show ? {} : { display: 'none' }}
      onClick={onClose}
    >
      <div className={style.modal} onClick={e => e.stopPropagation()}>
        <div className={style.modalContent}>
          {children}
        </div>

        <div className={style.buttonContainer}>
          <div className={style.buttonDelimiter}>
            <Button text={'Ok'} clickHandler={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
}

export { Modal };