import React from 'react';
import classNames from 'classnames';
import styles from './Layouts.module.scss';

export default function Full({ children }) {
  return (
    <div className={classNames(styles.main, 'h-screen w-screen flex items-center justify-center bg-grey-darkest')}>
      {children}
    </div>
  );
}
