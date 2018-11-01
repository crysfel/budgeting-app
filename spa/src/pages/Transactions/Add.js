import React, { Fragment, useCallback, useState } from 'react';
import { useDispatch } from 'redux-react-hook';
import { format } from 'date-fns'
import { postTransaction } from 'store/modules/transactions/actions';
import Button from 'components/Button';
import Panel from 'components/Panel';
import TextField from 'components/TextField';

const initialState = {
  amount: '',
  tags: '',
  description: '',
  store: '',
  date: format(new Date(), 'YYYY-MM-DD'),
  success: false,
};

export default function AddTransaction({ isExpense }) {
  const [state, setState] = useState(initialState);
  const dispatch = useDispatch();
  const saveTransaction = useCallback(
    () => {
      dispatch(postTransaction({
        ...state,
        is_expense: isExpense,
      }))
      .then((response) => {
        if (response.payload.success) {
          setState({
            ...initialState,
            success: true,
          });
        }
      });
    }, [state, isExpense]);
  const setValue = (event, field) => setState({ ...state, [field]: event.target.value });
  const title = isExpense ? 'Expense' : 'Income' ;

  return (
    <Fragment>
      {state.success && <div className="py-4 px-8 mb-4 bg-black text-grey-lighter" onClick={() => setState({ ...state, success: false })}>Succesfully saved!</div>}
      <h1 className="text-grey-darkest mb-8">{title}</h1>
      <Panel>
        <TextField label="Amount" placeholder="00.00" value={state.amount} onChange={(event) => setValue(event, 'amount')} type="number" />
        <TextField label="Tags" placeholder="food, groceries, fun" value={state.tags} onChange={(event) => setValue(event, 'tags')} />
        <TextField label="Description" placeholder="What did you buy?" value={state.description} onChange={(event) => setValue(event, 'description')} multiline />
        <TextField label="Store" placeholder="Target, Walmart, Amazon" value={state.store} onChange={(event) => setValue(event, 'store')} />
        <TextField label="When" value={state.date} onChange={(event) => setValue(event, 'date')} type="date" />
        <Button onClick={saveTransaction}>Save</Button>
      </Panel>
    </Fragment>
  );
}
