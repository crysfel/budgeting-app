<?php

namespace App;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Cviebrock\EloquentSluggable\Sluggable;
use Overtrue\LaravelFollow\Traits\CanFollow;
use Overtrue\LaravelFollow\Traits\CanBeFollowed;
use Overtrue\LaravelFollow\Traits\CanFavorite;
use Overtrue\LaravelFollow\Traits\CanVote;

class User extends Authenticatable implements JWTSubject
{
    use CanFollow, CanBeFollowed, CanFavorite, CanVote;
    use Notifiable;
    use Sluggable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'password', 'country', 'about', 'image', 'occupation', 'website', 'gender', 'dob'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'email', 'password', 'twitter', 'facebook', 'remember_token', 'provider', 'provider_uid', 'latitude', 'longitude', 'postcode', 'recovery_token', 'recovery_sent_at', 'confirmation_token', 'confirmation_sent_at',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'admin' => 'boolean',
        'author' => 'boolean',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
    
    /**
     * Get the activities for the user
     */
    public function activities()
    {
        return $this->hasMany('App\Activity');
    }

    /**
     * Get the posts for the user
     */
    public function posts()
    {
        return $this->hasMany('App\Post', 'author_id');
    }

    /**
     * Get the comments for the user
     */
    public function comments()
    {
        return $this->hasMany('App\Comment');
    }

    /**
     * Get the images for the user
     */
    public function images()
    {
        return $this->morphMany('App\Asset', 'assetable');
    }

    /**
     * Return the sluggable configuration array for this model.
     *
     * @return array
     */
    public function sluggable()
    {
        return [
            'slug' => [
                'source' => 'name',
            ]
        ];
    }

    /**
     * Scope a query for the latest users.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeLatests($query)
    {
        return $query->orderBy('created_at', 'DESC');
    }
}
