import React, { Fragment, useCallback, useState, useEffect } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { format } from 'date-fns'
import { postTransaction, getLatestTransactions, getPopularTags } from 'store/modules/transactions/actions';
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
          dispatch(getLatestTransactions());
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
  const addOrRemoveTag = useCallback((value) => {
    const hasTag = !!(state.tags && (state.tags.toLowerCase().indexOf(value.toLowerCase()) > -1));
    const currentTags = state.tags.split(',').filter(tg => tg !== '');

    if (hasTag) {
      // Remove tag
      setState({
        ...state,
        tags: currentTags.filter(tg => tg !== value).join(','),
      })
    } else {
      // Add Tag
      currentTags.push(value);
      setState({
        ...state,
        tags: currentTags.join(','),
      })
    }
  });

  const setValue = (event, field) => setState({ ...state, [field]: event.target.value });
  const title = isExpense ? 'Expense' : 'Income' ;

  return (
    <TransactionForm
      addOrRemoveTag={addOrRemoveTag}
      saveTransaction={saveTransaction}
      setValue={setValue}
      success={state.success}
      tags={tags}
      title={title}
      transaction={state}
    />
  );
}
