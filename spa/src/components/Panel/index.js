import React from 'react';
import classNames from 'classnames';

export default function Panel({ children, className, title }) {
  return (
    <div className={classNames('bg-white py-8 px-4 border-t-4 border-orange', className)}>
      {title && <h3 className="mb-4">{title}</h3> }
      {children}
    </div>
  );
}
