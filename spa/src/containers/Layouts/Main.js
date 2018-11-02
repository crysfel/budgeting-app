import React from 'react';
import { Link } from "@reach/router";
import { useMappedState } from 'redux-react-hook';
import classNames from 'classnames';

import { ReactComponent as ChartIcon } from 'components/Icon/chart-bar.svg';
import { ReactComponent as ExpenseIcon } from 'components/Icon/store-front.svg';
import { ReactComponent as IncomeIcon } from 'components/Icon/wallet.svg';

import Full from 'containers/Layouts/Full';
import Login from 'pages/Auth/Login';
import styles from './Layouts.module.scss';

const mapState = state => ({
  isAuthenticated: !!state.auth.token,
})

export default function Main({ children }) {
  const { isAuthenticated } = useMappedState(mapState);

  if (isAuthenticated) {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-orange-light flex">
          <NavLink to="/app/dashboard" label="Dashboard" Icon={ChartIcon} />
          <NavLink to="/app/transactions/add/expense" label="Add Expense" Icon={ExpenseIcon} />
          <NavLink to="/app/transactions/add/income" label="Add Income" Icon={IncomeIcon} />
        </div>
        <div className="flex-1 p-4 overflow-auto">
          {children}
        </div>
      </div>
    );
  }

  return (
    <Full>
      <Login />
    </Full>
  );
}

function NavLink({ Icon, label, to }) {
  const baseCss = 'block text-center no-underline flex-1 px-4 py-2 text-xs text-white';

  return (
    <Link
      to={to}
      getProps={({ isCurrent }) => {
        return {
          className: isCurrent ? `${baseCss} bg-orange` : baseCss,
        };
      }}
    >
      <Icon className={classNames(styles.navIcon, 'mb-2')} />
      {label}
    </Link>
  );
}
