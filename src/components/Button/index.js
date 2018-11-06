import React from 'react';

export default function Button({ onClick, children}) {
  return (
    <button onClick={onClick} className="py-2 px-4 bg-orange text-white">{children}</button>
  );
}