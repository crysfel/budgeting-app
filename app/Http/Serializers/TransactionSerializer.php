<?php
namespace App\Http\Serializers;

class TransactionSerializer extends BaseSerializer {

  /**
   * Injects dependencies for serializing other objects
   */
  public function __construct(UserSerializer $userSerializer, TagsSerializer $tagsSerializer)
  {
    $this->userSerializer = $userSerializer;
    $this->tagsSerializer = $tagsSerializer;
  }

  protected $ids = [
    'id',
  ];

  protected $basic = [
    'description',
    'amount',
    'tags',
    ['name' => 'time', 'mapping' => 'created_at'],
    ['name' => 'user', 'mapping' => 'user_id'],
    ['name' => 'isExpense', 'mapping' => 'is_expense'],
  ];

  protected function parseUser_id($transaction) {
    return $this->userSerializer->one($transaction->user, ['basic']);
  }

  protected function parseTags($transaction) {
    return $this->tagsSerializer->list($transaction->tags);
  }
}
