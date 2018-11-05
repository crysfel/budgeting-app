import React, { Fragment, useState } from 'react';
import { useMappedState } from 'redux-react-hook';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import classNames from 'classnames';
import { getLatestGroupedByDate } from 'store/modules/transactions/selectors';

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
});

export default function Dashboard() {
  const { latest } = useMappedState(mapState);

  if (latest.length === 0) {
    return (
      <Fragment>
        <h1 className="text-grey-darkest mb-8">Dashboard</h1>
        <img src={ChartImage} alt="Empty Dashboad" className="mt-8 mb-4" />
        <p className="text-grey-dark">You don't have any transaction yet, start adding some expenses!</p>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <h1 className="text-grey-darkest mb-8">Dashboard</h1>
      <div className="md:flex md:flex-row">
        <StatPanel Icon={IncomeIcon} />
        <StatPanel Icon={ExpenseIcon} />
        <StatPanel Icon={CurrentIcon} />
      </div>
      <Panel title="Latest transactions">
        <ul className="m-0 p-0">
        { latest.map(group => <TransactionGroup key= {group.date} transactions={group} />) }
        </ul>
      </Panel>
    </Fragment>
  );
}

function TransactionGroup({ transactions }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="list-reset">
      <GroupTitle group={transactions} onClick={() => setExpanded(!expanded)} />
      { expanded &&
        <Fragment>
          {transactions.items.map(transaction => 
            <Transaction key={transaction.id} transaction={transaction}/>
          )}
        </Fragment>
      }
    </li>
  );
}

// Stats
function StatPanel({ Icon }) {
  return (
    <div className={classNames(styles.stat, 'px-4 mb-16 md:flex-1')}>
      <div className="border-t-4 border-green-light bg-white text-grey-darkest px-8 pt-8">
        <Icon className={styles.icon} />
        <h3 className="text-center text-3xl py-4">$4,066</h3>
      </div>
      <h4 className="text-center bg-white pt-2">Income</h4>
      <div className="flex bg-white p-2">
        <span className="flex-1">$8,120</span>
        <span className="flex-1 text-right">$52,300</span>
      </div>
    </div>
  );
}

// Latest transactions
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
