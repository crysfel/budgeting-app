import React, { useState } from 'react';
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineMarkSeries,
  Hint
} from 'react-vis';

const today = new Date();
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function OverviewChart({ data }) {
  const [value, setValue] = useState(null);
  const [view, setView] = useState('expenses');

  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:hidden">
        <label className="inline-block md:block mr-4 mb-8"><input type="radio" name="view" checked={view === 'income'} onChange={() => setView('income')}/> Income</label>
        <label className="inline-block md:block mr-4 mb-8"><input type="radio" name="view" checked={view === 'expenses'} onChange={() => setView('expenses')}/> Expenses</label>
        <label className="inline-block md:block mr-4 mb-8"><input type="radio" name="view" checked={view === 'current'} onChange={() => setView('current')}/> Current</label>
      </div>
      <div className="flex-1">
        <FlexibleXYPlot height={300}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis title={months[today.getMonth()]} />
          <YAxis />
          <LineMarkSeries
            curve="curveMonotoneX"
            onValueMouseOver={(value) => setValue(value)}
            onValueMouseOut={() => setValue(null)}
            size={2}
            data={data[view]}
          />
          {value && <Hint value={value} format={formatTooltip} />}
        </FlexibleXYPlot>
      </div>
      <div className="hidden md:block md:w-32 md:pt-8">
        <label className="inline-block md:block ml-4 mb-8"><input type="radio" name="view2" checked={view === 'income'} onChange={() => setView('income')} /> Income</label>
        <label className="inline-block md:block ml-4 mb-8"><input type="radio" name="view2" checked={view === 'expenses'} onChange={() => setView('expenses')} /> Expenses</label>
        <label className="inline-block md:block ml-4 mb-8"><input type="radio" name="view2" checked={view === 'current'} onChange={() => setView('current')} /> Current</label>
      </div>
    </div>
  );
}

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

function formatTooltip(value) {
  return [
    { title: 'Date', value: `${months[today.getMonth()]}, ${value.x}` },
    { title: 'Total', value: moneyFormatter.format(value.y) },
  ];
}