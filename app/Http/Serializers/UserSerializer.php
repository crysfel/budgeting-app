<?php
namespace App\Http\Serializers;

class UserSerializer extends BaseSerializer {
  protected $ids = ['id', 'slug'];
  protected $basic = ['name', 'image', 'about'];
  protected $full = [
    'occupation',
    'website',
    'country',
    'admin',
    'author',
    ['mapping' => 'created_at', 'name' => 'time'],
  ];
  protected $private = [
    'email',
    'gender',
    'dob',
    ['mapping' => 'confirmed_at', 'name' => 'confirmed'],
  ];

  protected function parseConfirmed_at($user) {
    return $user->confirmed_at != null;
  }
}
