<?php
namespace App\Http\Serializers;

class PostSerializer extends BaseSerializer {

  /**
   * Injects dependencies for serializing other objects
   */
  public function __construct(UserSerializer $userSerializer)
  {
    $this->userSerializer = $userSerializer;
  }

  protected $ids = [
    'id',
    'slug',
  ];

  protected $basic = [
    'title',
    'published',
    ['name' => 'time', 'mapping' => 'created_at'],
    ['name' => 'author', 'mapping' => 'author_id'],
  ];

  protected $full = [
    'content',
    ['name' => 'allowComments', 'mapping' => 'allow_comments'],
  ];

  protected function parseAuthor_id($post) {
    return $this->userSerializer->one($post->author, ['basic']);
  }
}
