<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    /**
     * {@inheritdoc}
     */
    protected $table = 'tags';

    /**
     * {@inheritdoc}
     */
    public $timestamps = false;

    /**
     * {@inheritdoc}
     */
    protected $fillable = [
        'name',
        'slug',
        'count',
        'namespace',
    ];

    /**
     * Returns the most used tags across the app, even
     * for different users.
     */
    public function scopePopular($query, $namespace) {
      if (isset($namespace)) {
        $query = $query->where('namespace', $namespace);
      }

      return $query->orderBy('tags.count', 'DESC');
    }
}
