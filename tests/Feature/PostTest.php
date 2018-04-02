<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\User;
use App\Post;
use App\Activity;
use Log;

class PostTest extends TestCase
{
    use RefreshDatabase;

    private $user2;

    public function setUp() {
        parent::setUp();

        $user = factory(User::class)->create([
            'name' => 'John Doe',
            'author' => true,
        ]);
        $this->user2 = factory(User::class)->create([
            'name' => 'Mary Jane',
            'admin' => true,
        ]);
        $this->authenticate($user);

        $user->posts()->save(factory(Post::class)->make([
            'title' => 'This is a test',
            'content' => 'This is the content',
        ]));
        $this->user2->posts()->save(factory(Post::class)->make([
            'title' => 'Second post',
            'content' => 'More content for this post',
        ]));
    }

    /**
     * Should display the lists of posts with basic information owned only
     * by the current user.
     *
     * @return void
     */
    public function testListOfPostsForCurrentUser()
    {
        $response = $this->withAuthenticationHeaders()
                         ->json('GET', '/api/v1/posts?all=true');
        
        $response->assertStatus(200);
        $response->assertJson([
            "success"   =>  true,
            "posts"     => [
                [
                    "slug"      => "this-is-a-test",
                    "title"     => "This is a test",
                    "published" => false,
                    "author"    => [
                        "slug" => "john-doe",
                        "name" => "John Doe",
                        "image" => "images/avatar.jpg",
                        "about" => null,
                    ],
                    "time" => [
                        "timezone" => "UTC",
                    ],
                ],
            ],
        ]);
    }

    /**
     * Should display the given post owned by the user only
     *
     * @return void
     */
    public function testShowPostCurrentUser()
    {
        $post = $this->user->posts()->save(factory(Post::class)->make([
            'title' => 'My post',
            'content' => 'This is the content',
        ]));

        $response = $this->withAuthenticationHeaders()
                         ->json('GET', '/api/v1/posts/'.$post->id);
        
        $response->assertStatus(200);
        $response->assertJson([
            "success"   =>  true,
            "post"     => [
                "slug"      => "my-post",
                "title"     => "My post",
                "published" => false,
                "author"    => [
                    "slug" => "john-doe",
                    "name" => "John Doe",
                    "image" => "images/avatar.jpg",
                    "about" => null,
                ],
                "time" => [
                    "timezone" => "UTC",
                ],
                "content" => 'This is the content',
                "allowComments" => true,
            ],
        ]);
    }

    /**
     * Should create a new post for authors only
     *
     * @return void
     */
    public function testCreatePost()
    {
        $response = $this->withAuthenticationHeaders()
                         ->json('POST', '/api/v1/posts', [
                             'title'    => 'My new post',
                             'content'  => 'This is the content',
                         ]);
        
        $response->assertStatus(200);
        $response->assertJson([
            "success"  =>  true,
            "message"  => "Your post has been created.",
            "post"     => [
                "slug"  => "my-new-post",
            ]
        ]);
        
        $this->assertDatabaseHas('posts', [
            'slug' => 'my-new-post',
        ]);
    }

    /**
     * Should create a new post for authors only returns errors
     *
     * @return void
     */
    public function testCreatePostReturnsErrors()
    {
        $response = $this->withAuthenticationHeaders()
                         ->json('POST', '/api/v1/posts', []);
        
        $response->assertStatus(400);
        $response->assertJson([
            "success"  =>  false,
            "errors"  => [
                "The title field is required.",
                "The content field is required.",
            ]
        ]);
    }

    /**
     * Should update a post by publishing it and creating an activity
     *
     * @return void
     */
    public function testUpdatePostAndPublish()
    {
        $post = $this->user->posts()->save(factory(Post::class)->make([
            'title' => 'Publishing post',
            'content' => 'This post should be published',
        ]));
        $response = $this->withAuthenticationHeaders()
                         ->json('PUT', '/api/v1/posts/'.$post->id, [
                            'title' => 'Publishing post',
                            'content' => 'This post should be published',
                            'published' => true,
                         ]);
        
        $response->assertStatus(200);
        $response->assertJson([
            "success"  =>  true,
            "message"  => "Your post has been updated.",
            "post"  => [
                "id"    => $post->id,
                "slug"  => $post->slug,
            ]
        ]);
        
        $this->assertDatabaseHas('posts', [
            'slug' => 'publishing-post',
            'published' => true,
        ]);
        // Make sure activity has been created
        $this->assertDatabaseHas('activities', [
            'user_id' => $this->user->id,
            'reference_type' => Post::class,
            'reference_id' => $post->id,
        ]);
    }

    /**
     * Should delete your own post
     *
     * @return void
     */
    public function testDeletePost()
    {
        $post = $this->user->posts()->save(factory(Post::class)->make([
            'title' => 'Delete post',
            'content' => 'This post should be deleted',
        ]));
        $response = $this->withAuthenticationHeaders()
                         ->json('DELETE', '/api/v1/posts/'.$post->id);
        
        $response->assertStatus(200);
        $response->assertJson([
            "success"  =>  true,
            "message"  => "Your post has been deleted.",
        ]);
        
        $this->assertDatabaseMissing('posts', [
            'id' => $post->id,
        ]);
    }

    /**
     * Should not be able to delete other authors posts if not an admin
     *
     * @return void
     */
    public function testDeleteOtherAuthorPost()
    {
        $user3 = factory(User::class)->create([
            'author' => true,
        ]);
        $post = $user3->posts()->save(factory(Post::class)->make([
            'title' => 'Delete forbidden',
            'content' => 'This post should not be deleted',
        ]));
        $response = $this->withAuthenticationHeaders()
                         ->json('DELETE', '/api/v1/posts/'.$post->id);
        
        $response->assertStatus(403);
        $response->assertJson([
            "success"  =>  false,
            "errors"   => [
                "You are not the author of this blog post.",
            ]
        ]);
        
        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
        ]);
    }

    /**
     * Should be able to delete other authors posts if an admin
     *
     * @return void
     */
    public function testDeleteOtherAuthorPostAsAdmin()
    {
        $user3 = factory(User::class)->create([
            'author' => true,
        ]);
        $post = $user3->posts()->save(factory(Post::class)->make([
            'title' => 'Delete as admin',
            'content' => 'This post should be deleted by admin',
        ]));

        $this->authenticate($this->user2);
        $response = $this->withAuthenticationHeaders()
                         ->json('DELETE', '/api/v1/posts/'.$post->id);
        
        $response->assertStatus(200);
        $response->assertJson([
            "success"  =>  true,
            "message"  => "Your post has been deleted.",
        ]);
        
        $this->assertDatabaseMissing('posts', [
            'id' => $post->id,
        ]);
    }

    /**
     * Should display the lists of posts with basic information owned
     * for anyone if user is an admin.
     *
     * @return void
     */
    public function testListOfPostsForAdmin()
    {
        $this->authenticate($this->user2);
        $response = $this->withAuthenticationHeaders()
                         ->json('GET', '/api/v1/posts?all=true');
        
        $response->assertStatus(200);
        $response->assertJson([
            "success"   =>  true,
            "posts"     => [
                [
                    "slug"      => "this-is-a-test",
                    "title"     => "This is a test",
                    "published" => false,
                    "author"    => [
                        "slug" => "john-doe",
                        "name" => "John Doe",
                        "image" => "images/avatar.jpg",
                        "about" => null,
                    ],
                    "time" => [
                        "timezone" => "UTC",
                    ]
                ],
                [
                    "slug"      => "second-post",
                    "title"     => "Second post",
                    "published" => false,
                    "author"    => [
                        "slug" => "mary-jane",
                        "name" => "Mary Jane",
                        "image" => "images/avatar.jpg",
                        "about" => null,
                    ],
                    "time" => [
                        "timezone" => "UTC",
                    ]
                ]
            ],
        ]);
    }
}
