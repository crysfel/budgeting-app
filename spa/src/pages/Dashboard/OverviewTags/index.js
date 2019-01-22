import React from 'react';

import Panel from 'components/Panel';

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export default function OverviewTags({ tags, totals }) {
  const { expenses } = tags;
  const { total } = totals.expense;

  return (
    <Panel title="Tags" className="mb-8">
      {expenses.map((tag) => <Tag key={tag.id} data={tag} total={total} />)}
    </Panel>
  );
}

function Tag({ data, total }) {
  const percentage = Math.ceil((data.total / total ) * 100);

  return (
    <div className="relative mb-4" title={`${percentage}% of total spending`}>
      <div className="flex p-4 z-10 relative">
        <div className="flex-1 capitalize">{data.name}</div>
        <span>{moneyFormatter.format(data.total)}</span>
      </div>
      <div className="absolute bg-red-light pin-t pin-l h-full z-0" style={{ width: `${percentage}%` }} />
    </div>
  );
}
