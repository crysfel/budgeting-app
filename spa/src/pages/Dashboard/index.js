import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { navigate } from '@reach/router';
import { getActiveTransaction, getLatestGroupedByDate, getTotals, getTags, getOverviewData } from 'store/modules/transactions/selectors';
import { getPopularTags, putTransaction, refreshDashboard, setActiveTransaction } from 'store/modules/transactions/actions';

import Button from 'components/Button';
import Panel from 'components/Panel';
import TransactionForm from 'components/TransactionForm';
import OverviewChart from './OverviewChart';
import OverviewTags from './OverviewTags';
import LatestTransactions from './LatestTransactions';
import StatPanel from './StatPanel';
import { ReactComponent as IncomeIcon } from 'components/Icon/wallet.svg';
import { ReactComponent as ExpenseIcon } from 'components/Icon/store-front.svg';
import { ReactComponent as CurrentIcon } from 'components/Icon/portfolio.svg';
import ChartImage from './charts.svg';

const mapState = state => ({
  tags: getTags(state),
  latest: getLatestGroupedByDate(state),
  totals: getTotals(state),
  overview: getOverviewData(state),
  transaction: getActiveTransaction(state),
});

export default function Dashboard() {
  const { latest, totals, overview, tags, transaction } = useMappedState(mapState);
  const dispatch = useDispatch();
  const editTransaction = (transaction) => dispatch(setActiveTransaction(transaction));
  const closeTransaction = () => editTransaction({ tags: [] });

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
      <div className="flex">
        <StatPanel total={totals.income.total} label="Income" monthly={5333} yearly={45000} Icon={IncomeIcon} color="border-green-light" />
        <StatPanel total={totals.expense.total} label="Expenses" monthly={4210} yearly={32900} Icon={ExpenseIcon} color="border-red-light" />
        <StatPanel total={totals.current.total} label="Current" monthly={1202} yearly={15200} Icon={CurrentIcon} color="border-indigo-lighter" />
      </div>
      <Panel title="Overview" className="mb-16 pb-16">
        <OverviewChart
          data={overview}
        />
      </Panel>
      <div className="md:flex">
        <div className="md:flex-1 md:mr-4">
          <OverviewTags tags={tags} totals={totals} />
        </div>
        <div className="md:flex-1 md:ml-4">
          <LatestTransactions transactions={latest} editTransaction={editTransaction} />
        </div>
      </div>
      { transaction && transaction.id &&
        <EditTransaction transaction={transaction} tags={tags} closePanel={closeTransaction} />
      }
    </Fragment>
  );
}

function EditTransaction({ closePanel, transaction, tags }) {
  const [trans, setTransaction] = useState(transaction);
  const dispatch = useDispatch();
  useEffect(() => {
    if (tags.popular.length === 0) {
      dispatch(getPopularTags());
    }
  }, [tags.popular]);
  const setValue = (event) => {
    setTransaction({
      ...trans,
      [event.target.name]: event.target.value,
    });
  }
  const updateTransaction = () => dispatch(putTransaction(trans))
    .then((response) => {
      if (response.payload.success) {
        dispatch(refreshDashboard());
        setTransaction({
          ...trans,
          success: true,
        });
        dispatch(closePanel());
      }
    });

  return (
    <div className="fixed flex justify-center align-center pin z-20 px-4 bg-back-lighter">
      <TransactionForm
        className="md:min-w-2xl"
        saveTransaction={updateTransaction}
        cancelTransaction={closePanel}
        setValue={setValue}
        success={trans.success}
        tags={tags}
        title="Edit a transaction"
        transaction={trans}
      />
    </div>
  );
}
