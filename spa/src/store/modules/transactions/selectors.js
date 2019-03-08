import { createSelector } from 'reselect';
import getDaysInMonth from 'date-fns/get_days_in_month';

const today = new Date();

export const getActiveTransaction = state => state.transactions.active;

export const getLatestTransactions = state => state.transactions.latest;

export const getTotals = state => state.transactions.totals;

export const getGrouped = state => state.transactions.grouped;

export const getTags = state => state.transactions.tags;

// Group the latest transactions by date
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

// Generates the data for the overview chart
export const getOverviewData = createSelector(
  getGrouped,
  (grouped) => {
    const income = [];
    const expenses = [];
    const current = [];
    const days = getDaysInMonth(today);
    let result = 0;
    
    for (let i = 1; i <= days; i++) {
      const incomeDay = grouped.income.find(item => item.grouped_day === i);
      const expenseDay = grouped.expenses.find(item => item.grouped_day === i);

      if (incomeDay) {
        income.push({ x: i, y: incomeDay.total });
        result += incomeDay.total;
      } else {
        income.push({ x: i, y: 0 });
      }

      if (expenseDay) {
        expenses.push({ x: i, y: expenseDay.total });
        result -= expenseDay.total;
      } else {
        expenses.push({ x: i, y: 0 });
      }
      
      current.push({ x: i, y: result });
    }

    return {
      income,
      expenses,
      current,
    };
  }
);