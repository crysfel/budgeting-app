<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\User;

class AuthTest extends TestCase
{
    /**
     * Should authenticate user into the system
     *
     * @return void
     */
    public function testAuthenticateUser()
    {
        $user = factory(User::class)->create([
            'name'  => 'John Doe',
            'email' => 'john@test.com',
        ]);

        $response = $this->json('POST', $this->base.'/auth/login', [
            'email'     => 'john@test.com',
            'password'  => 'secret',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            "success"   =>  true,
            "user"      => [
                "id"    => $user->id,
                "slug" => "john-doe",
                "name" => "John Doe",
                "image" => "images/avatar.jpg",
                "about" => null,
                "occupation" => null,
                "website" => null,
                "country" => null,
                "admin" => false,
                "author" => false,
                "time" => [
                    "timezone_type" => 3,
                    "timezone" => "UTC"
                ],
                "email" => "john@test.com",
                "gender" => null,
                "dob" => null,
                "confirmed" => false
            ],
        ]);
    }

    /**
     * Should return an error if invalid credentials
     *
     * @return void
     */
    public function testAuthenticateUserInvalidCredentials()
    {
        $user = factory(User::class)->create([
            'name'  => 'John Doe',
            'email' => 'invalid@test.com',
        ]);

        $response = $this->json('POST', $this->base.'/auth/login', [
            'email'     => 'invalid@test.com',
            'password'  => 'secretfail',
        ]);

        $response->assertStatus(401);
        $response->assertJson([
            "success"   =>  false,
            "errors"    => [
                "Invalid credentials, please try again."
            ]
        ]);
    }

    /**
     * Should signup a new user into the system
     *
     * @return void
     */
    public function testSignup()
    {
        $response = $this->json('POST', $this->base.'/auth/signup', [
            'name'      => 'Sarah Michelle',
            'email'     => 'sarah@test.com',
            'password'  => 'mypassword',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            "success"   =>  true,
            "user"    => [
                "slug" => "sarah-michelle",
                "name" => "Sarah Michelle",
                "image" => "https://www.gravatar.com/avatar/554eb16314c32b81df99c17af23b449e?d=http%3A%2F%2Flocalhost%2Fimages%2Favatar.png&s=400",
                "about" => null,
                "occupation" => null,
                "website" => null,
                "country" => "United States",
                "admin" => null,
                "author" => null,
                "time" => [
                    "timezone_type" => 3,
                    "timezone" => "UTC"
                ],
                "email" => "sarah@test.com",
                "gender" => null,
                "dob" => null,
                "confirmed" => false
            ]
        ]);
    }

    /**
     * Should return validation errors
     *
     * @return void
     */
    public function testSignupValidations()
    {
        $response = $this->json('POST', $this->base.'/auth/signup', []);

        $response->assertStatus(400);
        $response->assertJson([
            "success"   =>  false,
            "errors"    => [
                "The name field is required.",
                "The email field is required.",
                "The password field is required."
            ]
        ]);
    }

    /**
     * Should return error if user already exist
     *
     * @return void
     */
    public function testSignupUserExist()
    {
        $user = factory(User::class)->create([
            'name'  => 'Will Smith',
            'email' => 'will@test.com',
        ]);
        $response = $this->json('POST', $this->base.'/auth/signup', [
            'name'      => 'Will Smith',
            'email'     => 'will@test.com',
            'password'  => 'test123',
        ]);

        $response->assertStatus(400);
        $response->assertJson([
            "success"   =>  false,
            "errors"    => [
                "The email has already been taken.",
            ]
        ]);
    }
}
