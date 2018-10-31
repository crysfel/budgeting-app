<?php
namespace App\Http\Serializers;

class TransactionSerializer extends BaseSerializer {

  /**
   * Injects dependencies for serializing other objects
   */
  public function __construct(UserSerializer $userSerializer)
  {
    $this->userSerializer = $userSerializer;
  }

  protected $ids = [
    'id',
  ];

  protected $basic = [
    'description',
    'amount',
    ['name' => 'time', 'mapping' => 'created_at'],
    ['name' => 'user', 'mapping' => 'user_id'],
    ['name' => 'isExpense', 'mapping' => 'is_expense'],
  ];

  protected function parseUser_id($post) {
    return $this->userSerializer->one($post->user, ['basic']);
  }
}
