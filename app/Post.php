<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Cartalyst\Tags\TaggableTrait;
use Cartalyst\Tags\TaggableInterface;

class Post extends Model implements TaggableInterface
{
    use Sluggable;
    use TaggableTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['title', 'content', 'allow_comments'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'allow_comments' => 'boolean',
        'published' => 'boolean',
    ];

    /**
     * Return the sluggable configuration array for this model.
     *
     * @return array
     */
    public function sluggable()
    {
        return [
            'slug' => [
                'source' => 'title',
            ]
        ];
    }

    /**
     * Get the author of this post.
     */
    public function author()
    {
        return $this->belongsTo('App\User');
    }

    /**
     * Get the assigned asset file for this post
     * @TODO: Posts should have an asset attached
     */
    // public function asset()
    // {
    //     return $this->morphOne('App\File', 'fileable');
    // }

    /**
     * Relationship to Comment model
     */
    public function comments() {
        return $this->morphMany('App\Comment', 'commentable');
    }

    /**
     * Returns the latest posts by the given options:
     *  - published: Returns only the ublished posts
     *  - drafts: Returns only unpublished posts, otherwise returns all
     *  - author: Returns posts by the giving author id
     *  - search: Returns posts that match the searched title 
     */
    public function scopeLatest($query, $options = []) {
        $result = $query;

        // Returns only the published posts
        if (isset($options['published'])) {
            $result = $result->where('published', true);
        } else if (isset($options['drafts'])) {
            // Returns only drafts but only if published is not present
            $result = $result->where('published', false);
        }
        
        // Returns only by selected author id
        if (isset($options['author'])) {
            $result = $result->where('author_id', $options['author']);
        }
        
        // Search by title
        if (isset($options['search'])) {
            $result = $result->where('title', 'like', '%'.$options['search'].'%');
        }

        return $result->orderBy('created_at', 'DESC');
    }
}
