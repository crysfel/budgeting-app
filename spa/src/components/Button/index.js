import React from 'react';
import { string } from 'prop-types';
import classNames from 'classnames';

export default function Button({ onClick, children, className, variant}) {
  const css = classNames('py-2 px-4', {
    'bg-orange text-white': variant === 'primary',
    'bg-black text-white': variant === 'secondary',
    'bg-transparent text-black hover:bg-black hover:text-white': variant === 'tertiary',
  }, className);
  return (
    <button onClick={onClick} className={css}>{children}</button>
  );
}

Button.propTypes = {
  variant: string,
};

Button.defaultProps = {
  variant: 'primary',
};