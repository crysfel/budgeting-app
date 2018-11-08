import { createSelector } from 'reselect'

export const getLatestTransactions = state => state.transactions.latest;

export const getTotals = state => state.transactions.totals;

export const getLatestGroupedByDate = createSelector(
  getLatestTransactions,
  (transactions) => {
    const groups = {};
    const results = [];

    // Group all the transaction by date
    transactions.forEach((item) => {
      const date = item.time.date.split(' ')[0];
      let index = results.length;

      if (groups[date] !== undefined) {
        index = groups[date];
      } else {
        groups[date] = index;
        results[index] = { date, items: [] };
      }
      const subgroup = results[index];
      subgroup.items.push(item);

      item.tags = item.tags.map(tag => tag.name);
    });

    // Sum all transactions in each group
    return results.map(group => ({
      ...group,
      total: group.items.reduce((sum, item) => {
        if (item.isExpense) {
          return sum - item.amount;
        }

        return sum + item.amount;
      }, 0),
    }));
  }
);