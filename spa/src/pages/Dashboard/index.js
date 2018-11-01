import React, { Fragment, useState } from 'react';
import { useMappedState } from 'redux-react-hook';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import classNames from 'classnames';
import { getLatestGroupedByDate } from 'store/modules/transactions/selectors';

import Panel from 'components/Panel';

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

  return (
    <Fragment>
      <h1 className="text-grey-darkest mb-8">Dashboard</h1>
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
  console.log(transaction);
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
