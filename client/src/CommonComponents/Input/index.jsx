import React from 'react';

const TextInputWithLabel = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  className,
  ...props
}) => (
  <div style={{ marginBottom: '1rem' }} className={className}>
    <label htmlFor={name} style={{ display: 'block', marginBottom: '0.5rem' }}>
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      {...props}
      style={{ padding: '0.5rem', width: '65%' }}

    />
  </div>
);

export default TextInputWithLabel;