import React from 'react';

export default function Panel({ children, title }) {
  return (
    <div className="bg-white py-8 px-4 border-t-4 border-orange">
      {title && <h3 className="mb-4">{title}</h3> }
      {children}
    </div>
  );
}
