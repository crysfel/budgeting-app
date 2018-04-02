<?php

use Illuminate\Database\Seeder;
use App\User;
use App\Post;

class PostsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(User::class, 50)->create(["author" => true])->each(function ($user) {
            $user->posts()->save(factory(Post::class)->make());
            $user->posts()->save(factory(Post::class)->make());
            $user->posts()->save(factory(Post::class)->make());
        });
    }
}
