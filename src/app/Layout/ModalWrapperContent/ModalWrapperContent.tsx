import classNames from 'classnames';
import React, { PropsWithChildren, useEffect, useRef } from 'react';

import styles from './ModalWrapperContent.module.scss';

export const ModalWrapperContent = ({ children }: PropsWithChildren) => {
  const refModalWrapper = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (request) {
      if (request.actions === 'isShowModal') {
        if (request.payload) {
          refModalWrapper.current.classList.add(styles.modalWrapper__active);
        } else {
          refModalWrapper.current.classList.remove(styles.modalWrapper__active);
        }
      }
    });
  }, []);
  return (
    <div
      ref={refModalWrapper}
      className={classNames(styles.modalWrapper, styles.modalWrapper__active)}
    >
      {children}
    </div>
  );
};
