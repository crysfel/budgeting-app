import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { format } from 'date-fns'
import { postTransaction, getPopularTags, refreshDashboard } from 'store/modules/transactions/actions';
import { getTags } from 'store/modules/transactions/selectors';
import TransactionForm from 'components/TransactionForm';

const initialState = {
  amount: '',
  tags: '',
  description: '',
  store: '',
  date: format(new Date(), 'YYYY-MM-DD'),
  success: false,
};

const mapState = state => ({
  tags: getTags(state),
});

export default function AddTransaction({ isExpense, transaction }) {
  const [state, setState] = useState(transaction ? transaction : initialState);
  const { tags } = useMappedState(mapState);
  const dispatch = useDispatch();
  const saveTransaction = useCallback(
    () => {
      dispatch(postTransaction({
        ...state,
        is_expense: isExpense,
      }))
      .then((response) => {
        if (response.payload.success) {
          dispatch(refreshDashboard());
          setState({
            ...initialState,
            success: true,
          });
        }
      });
    }, [state, isExpense]);
  useEffect(() => {
    if (tags.popular.length === 0) {
      dispatch(getPopularTags());
    }
  }, [tags.popular]);
  

  const setValue = (event) => setState({ ...state, [event.target.name]: event.target.value });
  const title = isExpense ? 'Expense' : 'Income' ;

  return (
    <TransactionForm
      saveTransaction={saveTransaction}
      setValue={setValue}
      success={state.success}
      tags={tags}
      title={title}
      transaction={state}
    />
  );
}
