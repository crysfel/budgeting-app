<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['action', 'user_id', 'reference_type', 'reference_id'];

    /**
     * Get the author of this activity.
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }

    /**
     * Get all of the owning activity models.
     */
    public function activitable()
    {
        return $this->morphTo();
    }
}
