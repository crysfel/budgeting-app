<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cartalyst\Tags\TaggableTrait;
use Cartalyst\Tags\TaggableInterface;

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
}
