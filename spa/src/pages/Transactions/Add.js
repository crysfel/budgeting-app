import React, { Fragment } from 'react';
import Button from 'components/Button';
import Panel from 'components/Panel';
import TextField from 'components/TextField';

export default function AddTransaction({ isExpense }) {
  const title = isExpense ? 'Expense' : 'Income' ;
  
  return (
    <Fragment>
      <h1 className="text-grey-darkest mb-8">{title}</h1>
      <Panel>
        <TextField label="Amount" placeholder="00.00" type="number" />
        <TextField label="Tags" placeholder="food, groceries, fun" />
        <TextField label="Description" placeholder="What did you buy?" multiline />
        <TextField label="Store" placeholder="Target, Walmart, Amazon" />
        <TextField label="When" type="date" />
        <Button>Save</Button>
      </Panel>
    </Fragment>
  );
}
