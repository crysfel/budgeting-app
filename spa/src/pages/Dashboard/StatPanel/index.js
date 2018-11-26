import React from 'react';
import classNames from 'classnames';
import styles from './Dashboard.module.scss';

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export default function StatPanel({ color, label, monthly, total, Icon, yearly }) {
  return (
    <div className={classNames(styles.stat, 'px-2 mb-16 flex-1')}>
      <div className={classNames(color, 'border-t-4 bg-white text-grey-darkest md:px-8 pt-8')}>
        <Icon className={styles.icon} />
        <h3 className="text-center md:text-3xl md:py-4 py-2">{moneyFormatter.format(total)}</h3>
      </div>
      <h4 className="text-center bg-white md:pt-2 pb-4">{label}</h4>
      {/* <div className="flex bg-white p-2 pb-4">
        <span className="flex-1 px-2 text-grey-dark">{moneyFormatter.format(monthly)}</span>
        <span className="flex-1 px-2 text-grey-dark text-right">{moneyFormatter.format(yearly)}</span>
      </div> */}
    </div>
  );
}
