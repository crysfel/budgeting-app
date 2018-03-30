<?php
namespace App\Http\Serializers;

class BaseSerializer {
  protected $basic = [];
  protected $full = [];
  protected $private = [];

  public function list($users, $options = []) {
    return collect($users)->map(function($user) use ($options) {
      return $this->one($user, $options);
    });
  }

  public function one($model, $options = []) {
    // Basic information for this model
    $json = [];
    foreach ($this->basic as $field) {
      $config = $this->getField($model, $field);
      $json[$config['name']] = $config['value'];
    }

    // Return full model's information if required by the options
    if (isset($options['full'])) {
      foreach ($this->full as $field) {
        $config = $this->getField($model, $field);
        $json[$config['name']] = $config['value'];
      }
    }

    // Return private information if in options
    if (isset($options['private'])) {
      foreach ($this->private as $field) {
        $config = $this->getField($model, $field);
        $json[$config['name']] = $config['value'];
      }
    }

    return $json;
  }

  /**
   * Receives a model and a field configuration as a parameter.
   * Returns an array with name of the field and value for the current field.
   */
  private function getField($model, $field) {
    $result = [];

    if (is_array($field)) {
      $parseMethod = 'parse'.ucfirst($field['column']);
      $customField = $field['column'];

      if (isset($field['field'])) {
        $customField = $field['field'];
      }

      $result['name'] = $customField;
      if (method_exists($this, $parseMethod)) {
        $result['value'] = $this->{$parseMethod}($model);
      } else {
        $result['value'] = $model->{$field['column']};
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
