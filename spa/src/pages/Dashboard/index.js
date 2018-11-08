import React, { Fragment, useState } from 'react';
import { useMappedState } from 'redux-react-hook';
import { navigate } from '@reach/router';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import classNames from 'classnames';
import { getLatestGroupedByDate, getTotals } from 'store/modules/transactions/selectors';

import Button from 'components/Button';
import Panel from 'components/Panel';
import { ReactComponent as IncomeIcon } from 'components/Icon/wallet.svg';
import { ReactComponent as ExpenseIcon } from 'components/Icon/store-front.svg';
import { ReactComponent as CurrentIcon } from 'components/Icon/portfolio.svg';
import ChartImage from './charts.svg';
import styles from './Dashboard.module.scss';

const today = format(new Date(), 'YYYY-MM-DD');
const moneyFormatter= new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});
const mapState = state => ({
  latest: getLatestGroupedByDate(state),
  totals: getTotals(state),
});

export default function Dashboard() {
  const { latest, totals } = useMappedState(mapState);

  if (latest.length === 0) {
    return (
      <Fragment>
        <h1 className="text-grey-darkest mb-8">Dashboard</h1>
        <div className="max-w-lg mx-auto">
          <img src={ChartImage} alt="Empty Dashboad" className="my-8" />
          <p className="text-grey-darker text-center text-xl mb-8">You don't have any transaction yet, start adding some expenses!</p>
          <p className="text-center "><Button onClick={() => navigate('/app/transactions/add/expense')}>Add Expense</Button></p>
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <h1 className="text-grey-darkest mb-8">Dashboard</h1>
      <div className="md:flex md:flex-row">
        <StatPanel total={totals.income.total} label="Income" monthly={5333} yearly={45000} Icon={IncomeIcon} color="border-green-light" />
        <StatPanel total={totals.expense.total} label="Expenses" monthly={4210} yearly={32900} Icon={ExpenseIcon} color="border-red-light" />
        <StatPanel total={totals.current.total} label="Current" monthly={1202} yearly={15200} Icon={CurrentIcon} color="border-indigo-lighter" />
      </div>
      <Panel title="Latest transactions">
        <ul className="m-0 p-0">
        { latest.map(group => <TransactionGroup key= {group.date} transactions={group} />) }
        </ul>
      </Panel>
    </Fragment>
  );
}

// Stats
// TODO: Add it to the dashboard once the API works
function StatPanel({ color, label, monthly, total, Icon, yearly }) {
  return (
    <div className={classNames(styles.stat, 'md:px-2 mb-16 md:flex-1')}>
      <div className={classNames(color, 'border-t-4 bg-white text-grey-darkest px-8 pt-8')}>
        <Icon className={styles.icon} />
        <h3 className="text-center text-3xl py-4">{moneyFormatter.format(total)}</h3>
      </div>
      <h4 className="text-center bg-white pt-2 pb-4">{label}</h4>
      {/* <div className="flex bg-white p-2 pb-4">
        <span className="flex-1 px-2 text-grey-dark">{moneyFormatter.format(monthly)}</span>
        <span className="flex-1 px-2 text-grey-dark text-right">{moneyFormatter.format(yearly)}</span>
      </div> */}
    </div>
  );
}

// Latest transactions
function TransactionGroup({ transactions }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="list-reset">
      <GroupTitle group={transactions} onClick={() => setExpanded(!expanded)} />
      {expanded &&
        <Fragment>
          {transactions.items.map(transaction =>
            <Transaction key={transaction.id} transaction={transaction} />
          )}
        </Fragment>
      }
    </li>
  );
}

function GroupTitle({ group, onClick }) {
  const date = parse(group.date);
  const formated = format(date, 'ddd DD, MMM YYYY');
  const day = format(date, 'dddd');
  const css = classNames('flex p-4 border-l-4', {
    'border-green': group.total > 0,
    'border-red': group.total < 0
  });

  return (
    <div className={css} onClick={onClick}>
      <span className="flex-1">
        <span className="block mb-1 text-black">{group.date === today ? 'Today' : day }</span>
        <small className="block text-grey">{formated} &bull; {group.items.length} Transactions</small>
      </span>
      <span className="text-black">{moneyFormatter.format(group.total)}</span>
    </div>
  );
}

function Transaction({ transaction }) {
  const css = classNames('flex p-4 pl-6 border-l-4', {
    'border-green': !transaction.isExpense,
    'border-red': transaction.isExpense,
  });

  return (
    <div className={css}>
      <div className="flex-1">
        <span className="block mb-1 text-grey-darker capitalize">{transaction.description}</span>
        <small className="block text-grey capitalize">{transaction.tags.join('&bull;')}</small>
      </div>
      <span className="text-grey-darker">{moneyFormatter.format(transaction.amount)}</span>
    </div>
  );
}
