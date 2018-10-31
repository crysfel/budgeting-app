<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
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
}
