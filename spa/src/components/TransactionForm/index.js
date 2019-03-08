import React from 'react';
import Button from 'components/Button';
import Panel from 'components/Panel';
import TagContainer from 'components/TagContainer';
import TextField from 'components/TextField';

export default function TransactionForm({ cancelTransaction, className, saveTransaction, setValue, success, tags, title, transaction }) {
  return (
    <div className={className} style={{ minWidth: '300px' }}>
      {success && <div className="py-4 px-8 mb-4 bg-black text-grey-lighter">Succesfully saved!</div>}
      <h1 className="text-grey-darkest mb-8">{title}</h1>
      <Panel>
        <TextField label="Amount" placeholder="00.00" value={transaction.amount} name="amount" onChange={setValue} type="number" />
        <TagContainer
          name="tags"
          value={transaction.tags}
          onChange={setValue}
          tags={tags.popular}
        />
        <TextField label="Description" placeholder="Some description for this transaction" value={transaction.description} name="description" onChange={setValue} multiline />
        {/* { isExpense && <TextField label="Store" placeholder="Target, Walmart, Amazon" value={state.store} onChange={(event) => setValue(event, 'store')} /> }
        <TextField label="When" value={state.date} onChange={(event) => setValue(event, 'date')} type="date" /> */}
        <Button onClick={saveTransaction}>Save</Button>
        { cancelTransaction && 
          <Button onClick={cancelTransaction} variant="tertiary" className="ml-2">Cancel</Button>
        }
      </Panel>
    </div>
  );
}
