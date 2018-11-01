import React from 'react';

export default function Full({ children }) {
  return (
    <div className="h-screen flex items-center justify-center bg-grey-darkest">
      {children}
    </div>
  );
}
