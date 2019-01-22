import React, { Fragment, useCallback, useState, useEffect } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { format } from 'date-fns'
import classNames from 'classnames';
import { postTransaction, getLatestTransactions, getPopularTags } from 'store/modules/transactions/actions';
import { getTags } from 'store/modules/transactions/selectors';
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

const mapState = state => ({
  tags: getTags(state),
});

export default function AddTransaction({ isExpense }) {
  const [state, setState] = useState(initialState);
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
  const tagsPlaceholder = isExpense ? 'food, groceries, fun' : 'Salary, Freelance, Book';
  const description = isExpense ? 'What did you buy?' : 'Company Name, Marketplace, Sells';

  return (
    <Fragment>
      {state.success && <div className="py-4 px-8 mb-4 bg-black text-grey-lighter" onClick={() => setState({ ...state, success: false })}>Succesfully saved!</div>}
      <h1 className="text-grey-darkest mb-8">{title}</h1>
      <Panel>
        <TextField label="Amount" placeholder="00.00" value={state.amount} onChange={(event) => setValue(event, 'amount')} type="number" />
        <TextField label="Tags" placeholder={tagsPlaceholder} value={state.tags} onChange={(event) => setValue(event, 'tags')} />
        <div className="mb-4 overflow-auto" style={{ maxHeight: '90px' }}>
          {
            tags.popular.map(tag => <Tag key={tag.slug} tag={tag} selections={state.tags} onPress={addOrRemoveTag} />)
          }
        </div>
        <TextField label="Description" placeholder={description} value={state.description} onChange={(event) => setValue(event, 'description')} multiline />
        {/* { isExpense && <TextField label="Store" placeholder="Target, Walmart, Amazon" value={state.store} onChange={(event) => setValue(event, 'store')} /> }
        <TextField label="When" value={state.date} onChange={(event) => setValue(event, 'date')} type="date" /> */}
        <Button onClick={saveTransaction}>Save</Button>
      </Panel>
    </Fragment>
  );
}

function Tag({ tag, selections, onPress}) {
  const selected = !!(selections && (selections.toLowerCase().indexOf(tag.name.toLowerCase()) > -1));

  return (
    <button 
      className={
        classNames(
          'px-3 py-1 mb-1 mr-1 rounded-lg capitalize overflow-auto', {
          'bg-grey-light text-grey-darkest': !selected,
          'bg-orange text-white': selected,
        })
      }
      style={{ maxHeight: '90px' }}
      onClick={() => onPress(tag.name)}
    >
      {tag.name}
    </button>
  );
}
