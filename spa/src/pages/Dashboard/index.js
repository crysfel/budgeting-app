import React, { Fragment, useState } from 'react';
import { useMappedState } from 'redux-react-hook';
import { format } from 'date-fns'
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
  const css = classNames("list-reset border-l-4", {
    'border-green': transactions.total > 0,
    'border-red': transactions.total < 0
  });

  return (
    <li className={css}>
      <GroupTitle group={transactions} onClick={() => setExpanded(!expanded)} />
      { expanded &&
        <div>
          {transactions.items.map(transaction => 
            <div key={transaction.id} className="flex p-4">
              <div className="flex-1">
                <span className="block mb-1 text-grey-darker capitalize">{transaction.description}</span>
                <small className="block text-grey capitalize">{transaction.tags.join('&bull;')}</small>
              </div>
              <span className="text-grey-darker">{moneyFormatter.format(transaction.amount)}</span>
            </div>  
          )}
        </div>
      }
    </li>
  );
}

function GroupTitle({ group, onClick }) {
  const date = new Date(group.date);
  const formated = format(new Date(date), 'ddd DD, MMM YYYY');
  const day = format(new Date(date), 'dddd');

  return (
    <div className="flex p-4" onClick={onClick}>
      <span className="flex-1">
        <span className="block mb-1 text-black">{group.date === today ? 'Today' : day }</span>
        <small className="block text-grey">{formated} &bull; {group.items.length} Transactions</small>
      </span>
      <span className="text-black">{moneyFormatter.format(group.total)}</span>
    </div>
  );
}
