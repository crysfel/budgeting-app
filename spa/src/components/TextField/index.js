import React from 'react';
import classNames from 'classnames';
import { func, object, string } from 'prop-types';

export default function TextField({ classes, label, onChange, placeholder, type, value }) {
  return (
    <div className={classNames(classes.root, 'my-4')}>
      { label && <label className={classNames(classes.label, 'mb-2 block text-grey-darkest')}>{label}</label> }
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={classNames(classes.input, 'p-2 bg-grey-lightest text-grey-darkest border-2 border-grey-light')}
      />
    </div>
  );
}

TextField.propTypes = {
  classes: object,
  label: string,
  onChange: func,
  placeholder: string,
  type: string,
  value: string,
};

TextField.defaultProps = {
  classes: {},
  type: 'text',
};