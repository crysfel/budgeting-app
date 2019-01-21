<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['middleware' => 'cors'], function () {
    
    Route::group(['prefix' => 'v1'], function () {
        Route::post('auth/signup', 'Api\AuthController@signup');
        Route::post('auth/login', 'Api\AuthController@authenticate');

        Route::group(['middleware' => 'jwt.auth'], function() {
            Route::get('tags/popular', 'Api\TagController@popular');

            Route::get('users', 'Api\UserController@index');
            Route::get('users/current', 'Api\UserController@current');
            Route::get('users/{user_id}/followers', 'Api\FollowerController@followers');
            Route::get('users/{user_id}/followings', 'Api\FollowerController@followings');
            Route::get('users/{user_id}/follow', 'Api\FollowerController@follow');
            Route::get('users/{user_id}/unfollow', 'Api\FollowerController@unfollow');

            Route::get('posts', 'Api\PostController@index');
            Route::post('posts', 'Api\PostController@store');
            Route::put('posts/{id}', 'Api\PostController@update');
            Route::get('posts/{id}', 'Api\PostController@show');
            Route::delete('posts/{id}', 'Api\PostController@destroy');
        });
    });
});
