<?php
namespace App\Http\Serializers;

class BaseSerializer {
  protected $ids = [];
  protected $basic = [];
  protected $full = [];
  protected $private = [];

  public function list($users, $options = []) {
    return collect($users)->map(function($user) use ($options) {
      return $this->one($user, $options);
    });
  }

  public function one($model, $options = []) {
    $json = [];

    // By default returns only the IDs
    foreach ($this->ids as $field) {
      $config = $this->getField($model, $field);
      $json[$config['name']] = $config['value'];
    }

    // Basic information for this model
    if (in_array('basic', $options)) {
      foreach ($this->basic as $field) {
        $config = $this->getField($model, $field);
        $json[$config['name']] = $config['value'];
      }
    }

    // Return full model's information if required by the options
    if (in_array('full', $options)) {
      foreach ($this->full as $field) {
        $config = $this->getField($model, $field);
        $json[$config['name']] = $config['value'];
      }
    }

    // Return private information if in options
    if (in_array('private', $options)) {
      foreach ($this->private as $field) {
        $config = $this->getField($model, $field);
        $json[$config['name']] = $config['value'];
      }
    }

    return $json;
  }

  public function paginator($data) {
    return [
      'count'=> $data->count(),
      'current' => $data->currentPage(),
      'perPage' => $data->perPage(),
      'total'=> $data->total(),
    ];
  }

  /**
   * Receives a model and a field configuration as a parameter.
   * Returns an array with name of the field and value for the current field.
   */
  private function getField($model, $field) {
    $result = [];

    if (is_array($field)) {
      $parseMethod = 'parse'.ucfirst($field['mapping']);
      $customField = $field['mapping'];

      if (isset($field['name'])) {
        $customField = $field['name'];
      }

      $result['name'] = $customField;
      if (method_exists($this, $parseMethod)) {
        $result['value'] = $this->{$parseMethod}($model);
      } else {
        $result['value'] = $model->{$field['mapping']};
      }
    } else {
      $parseMethod = 'parse'.ucfirst($field);

      $result['name'] = $field;
      if (method_exists($this, $parseMethod)) {
        $result['value'] = $this->{$parseMethod}($model);
      } else {
        $result['value'] = $model->{$field}; 
      }
    }

    return $result;
  }
}
