import React from 'react';
import { Link } from '@reach/router';

import Illustration from './savings.svg';

export default function Home() {
  return (
    <div className="bg-grey-darkest h-screen px-4 py-8 md:pt-32 overflow-auto max-w-3xl mx-auto">
      <div className="md:flex">
        <div className="md:flex-1">
          <h1 className="text-grey-lighter mb-4 md:mb-8">Budgeting App</h1>
          <p className="text-lg text-grey-lighter mb-8 md:mb-16 leading-normal">Do you know how much are you spending every month? Track your expenses and find out where your money goes!</p>
          <Link to="/auth/login" className="hidden md:inline-block px-16 text-white bg-orange p-4 text-center m-4 no-underline">Login</Link>
          <Link to="/auth/signup" className="hidden md:inline-block px-16 text-white bg-grey-darker p-4 text-center m-4 no-underline">Sign Up</Link>
        </div>
        <div className="md:flex-1">
          <img src={Illustration} alt="A man seating on saved money" />
        </div>
      </div>
      <div className="md:hidden">
        <Link to="/auth/login" className="text-white block bg-orange p-4 text-center m-4 no-underline">Login</Link>
        <Link to="/auth/signup" className="text-white block bg-grey-darker p-4 text-center m-4 no-underline">Sign Up</Link>
      </div>
    </div>
  );
}
