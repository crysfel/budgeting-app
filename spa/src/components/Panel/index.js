import React from 'react';

export default function Panel({ children, title }) {
  return (
    <div className="bg-white p-8 border-t-4 border-orange">
      {title && <h3 className="mb-4">{title}</h3> }
      {children}
    </div>
  );
}
