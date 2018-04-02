<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use JWTAuth;
use Log;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected $base = '/api/v1';
    protected $bearerToken;
    protected $user;

    /**
     * Generates a token for the given user.
     */
    public function authenticate($user) {
        $this->user = $user;
        $this->bearerToken = JWTAuth::fromUser($user);
    }

    public function withAuthenticationHeaders() {
        return $this->withHeaders([
            'Authorization' => 'Bearer '.$this->bearerToken,
        ]);
    }
}
