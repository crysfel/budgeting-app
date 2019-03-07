import React, { Fragment, useState } from 'react';
import classNames from 'classnames';
import parse from 'date-fns/parse';
import format from 'date-fns/format';

import Panel from 'components/Panel';

const today = format(new Date(), 'YYYY-MM-DD');
const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export default function LatestTransactions({ editTransaction, transactions }) {
  return (
    <Panel title="Latest transactions" className="mb-16">
      <ul className="m-0 p-0">
        {transactions.map(group => <TransactionGroup key={group.date} transactions={group} editTransaction={editTransaction} />)}
      </ul>
    </Panel>
  );
}

// Latest transactions
function TransactionGroup({ editTransaction, transactions }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="list-reset">
      <GroupTitle group={transactions} onClick={() => setExpanded(!expanded)} />
      {expanded &&
        <Fragment>
          {transactions.items.map(transaction =>
            <Transaction key={transaction.id} transaction={transaction} onEditTransaction={() => editTransaction(transaction)} />
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
        <span className="block mb-1 text-black">{group.date === today ? 'Today' : day}</span>
        <small className="block text-grey">{formated} &bull; {group.items.length} Transactions</small>
      </span>
      <span className="text-black">{moneyFormatter.format(group.total)}</span>
    </div>
  );
}

function Transaction({ onEditTransaction, transaction }) {
  const css = classNames('flex p-4 pl-6 border-l-4 cursor-pointer hover:bg-grey-lightest', {
    'border-green': !transaction.isExpense,
    'border-red': transaction.isExpense,
  });

  return (
    <div className={css} onClick={onEditTransaction}>
      <div className="flex-1">
        <span className="block mb-1 text-grey-darker capitalize">{transaction.description}</span>
        <small className="block text-grey capitalize">{transaction.tags.join('&bull;')}</small>
      </div>
      <span className="text-grey-darker">{moneyFormatter.format(transaction.amount)}</span>
    </div>
  );
}