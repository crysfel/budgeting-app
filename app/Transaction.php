<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cartalyst\Tags\TaggableTrait;
use Cartalyst\Tags\TaggableInterface;
use Illuminate\Support\Facades\DB;
use Log;

class Transaction extends Model implements TaggableInterface
{
    use TaggableTrait;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['description', 'amount', 'is_expense'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'is_expense' => 'boolean',
    ];

    /**
     * Get the author of this post.
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }

    /**
     * Returns the latest transactions by the given options:
     *  - expenses: `true` Returns only the expenses transactions
     *  - income: `true` Returns only the income transactions 
     *  - user_id: The user id to return transactions for
     */
    public function scopeLatest($query, $options = []) {
        $result = $query;

        // Returns only the expenses transactions
        if (isset($options['expenses'])) {
            $result = $result->where('is_expense', true);
        } else if (isset($options['income'])) {
            // Returns only income but only if expenses is not present
            $result = $result->where('is_expense', false);
        }
        
        // Returns only by selected user_id
        if (isset($options['user_id'])) {
            $result = $result->where('user_id', $options['user_id']);
        }

        return $result->orderBy('created_at', 'DESC');
    }

    /**
     * Returns the total income/expense between two dates
     *  - from: The date from
     *  - to: The date limit
     *  - user_id: The user to calculate the income from
     *  - is_expense: Whether to return expenses or income, defaults to false
     */
    public function scopeTotal($query, $options) {
        $isExpense = true;

        if (isset($options['is_expense'])) {
            $isExpense = $options['is_expense'];
        }

        return $query->select(DB::raw('sum(transactions.amount) as total'))
                    ->where('transactions.is_expense', $isExpense)
                    ->where('transactions.user_id', $options['user_id'])
                    ->whereBetween('transactions.created_at', [$options['from'], $options['to']]);
    }

    /**
     * Returns the total income/expense between two dates grouped by
     * year, month or day.
     *  - from: The date from
     *  - to: The date limit
     *  - user_id: The user to calculate the income from
     *  - grouped: day, month, year. The group type
     */
    public function scopeTotalGrouped($query, $options) {
        $isExpense = true;

        if (isset($options['is_expense'])) {
            $isExpense = $options['is_expense'];
        }

        return $query->select(DB::raw('
                        YEAR(transactions.created_at) as grouped_year, MONTH(transactions.created_at) as grouped_month, DAY(transactions.created_at) as grouped_day,
                        sum(transactions.amount) as total
                    '))
                    ->where('transactions.is_expense', $isExpense)
                    ->where('transactions.user_id', $options['user_id'])
                    ->whereBetween('transactions.created_at', [$options['from'], $options['to']])
                    ->groupBy(DB::raw('YEAR(transactions.created_at)'), DB::raw('MONTH(transactions.created_at)'), DB::raw('DAY(transactions.created_at)'));
    }

    /**
     * Returns the total income/expense between two dates grouped by tags
     *  - from: The date from
     *  - to: The date limit
     *  - user_id: The user to calculate the income from
     *  - is_expense: true | false
     */
    public function scopeTotalTags($query, $options) {
        $isExpense = true;

        if (isset($options['is_expense'])) {
            $isExpense = $options['is_expense'];
        }

        return $query->select(DB::raw('tags.id, tags.name, SUM(transactions.amount) as total'))
                    ->from('tags')
                    ->join('tagged', 'tags.id', 'tagged.tag_id')
                    ->join('transactions', 'transactions.id', 'tagged.taggable_id')
                    ->where('transactions.is_expense', $isExpense)
                    ->where('transactions.user_id', $options['user_id'])
                    ->whereBetween('transactions.created_at', [$options['from'], $options['to']])
                    ->groupBy('tags.id', 'tags.name')
                    ->orderBy('total', 'desc');
    }
}
