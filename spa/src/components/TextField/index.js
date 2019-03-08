import React from 'react';
import classNames from 'classnames';
import { func, object, string } from 'prop-types';

export default function TextField({ classes, label, multiline, name, onChange, placeholder, type, value }) {
  const Input = multiline ? 'textarea' : 'input';
  return (
    <div className={classNames(classes.root, 'mb-4')}>
      { label && <label className={classNames(classes.label, 'mb-2 block text-grey-darkest')}>{label}</label> }
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        className={classNames(classes.input, 'p-2 bg-grey-lightest text-grey-darkest border-2 border-grey-light w-full')}
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