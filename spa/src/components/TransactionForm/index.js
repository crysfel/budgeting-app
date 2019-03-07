import React, { Fragment } from 'react';
import classNames from 'classnames';
import Button from 'components/Button';
import Panel from 'components/Panel';
import TextField from 'components/TextField';

export default function TransactionForm({ addOrRemoveTag, saveTransaction, setValue, success, tags, title, transaction }) {
  return (
    <Fragment>
      {success && <div className="py-4 px-8 mb-4 bg-black text-grey-lighter">Succesfully saved!</div>}
      <h1 className="text-grey-darkest mb-8">{title}</h1>
      <Panel>
        <TextField label="Amount" placeholder="00.00" value={transaction.amount} onChange={(event) => setValue(event, 'amount')} type="number" />
        <TextField label="Tags" placeholder="Tags" value={transaction.tags} onChange={(event) => setValue(event, 'tags')} />
        <div className="mb-4 overflow-auto" style={{ maxHeight: '90px' }}>
          {
            tags.popular.map(tag => <Tag key={tag.slug} tag={tag} selections={transaction.tags} onPress={addOrRemoveTag} />)
          }
        </div>
        <TextField label="Description" placeholder="Some description for this transaction" value={transaction.description} onChange={(event) => setValue(event, 'description')} multiline />
        {/* { isExpense && <TextField label="Store" placeholder="Target, Walmart, Amazon" value={state.store} onChange={(event) => setValue(event, 'store')} /> }
        <TextField label="When" value={state.date} onChange={(event) => setValue(event, 'date')} type="date" /> */}
        <Button onClick={saveTransaction}>Save</Button>
      </Panel>
    </Fragment>
  );
}

function Tag({ tag, selections, onPress }) {
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
