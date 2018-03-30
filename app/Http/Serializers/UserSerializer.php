<?php
namespace App\Http\Serializers;

class UserSerializer extends BaseSerializer {
  protected $basic = ['id', 'slug', 'name', 'image', 'about'];
  protected $full = [
    'occupation',
    'website',
    'country',
    'admin',
    'author',
    ['column' => 'created_at', 'field' => 'time'],
  ];
  protected $private = [
    'email',
    'gender',
    'dob',
    ['column' => 'confirmed_at', 'field' => 'confirmed'],
  ];

  protected function parseConfirmed_at($user) {
    return $user->confirmed_at != null;
  }
}
