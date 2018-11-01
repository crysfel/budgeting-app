<?php
namespace App\Http\Serializers;

class TagsSerializer extends BaseSerializer {

  protected $ids = [
    'name',
  ];
  
  protected $basic = [
    'count',
  ];
}
