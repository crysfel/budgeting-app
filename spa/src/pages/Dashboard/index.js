import React, { Fragment } from 'react';
import { useMappedState } from 'redux-react-hook';
import { format } from 'date-fns'
import classNames from 'classnames';
import { getLatestGroupedByDate } from 'store/modules/transactions/selectors';

import Panel from 'components/Panel';

const today = format(new Date(), 'YYYY-MM-DD');
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
  const css = classNames("list-reset flex border-l-4 p-4", {
    'border-green': transactions.total > 0,
    'border-red': transactions.total < 0
  });

  return (
    <li className={css}>
      <GroupTitle group={transactions} />
      <strong>{transactions.total}</strong>
    </li>
  );
}

function GroupTitle({ group }) {
  const date = new Date(group.date);
  const formated = format(new Date(date), 'ddd DD, MMM YYYY');
  const day = format(new Date(date), 'dddd');

  return (
    <span className="flex-1">
      <span className="block mb-1">{group.date === today ? 'Today' : day }</span>
      <small className="block text-grey">{formated} &bull; {group.items.length} Transactions</small>
    </span>
  );
}
