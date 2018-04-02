<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Http\Serializers\UserSerializer;
use Validator;
use Config;
use URL;
use Gate;
use App\User;
use App\Activity;
use Log;

class FollowerController extends Controller
{

  /**
   * Create a new controller instance and initiallize the serializer
   *
   * @return void
   */
  public function __construct(UserSerializer $userSerializer) {
    $this->userSerializer = $userSerializer;
  }

  /**
   * Return the list of followers for the giving user, everyone
   * can see the list of followers of everyone else
   */
  public function followers(Request $request, $user_id) {
    $user = User::find($user_id);

    if ($user) {
      $users = $user->followers()->get();
      $total = $user->followers()->count();

      return response()->json([
        'success'   => true,
        'meta'      => [
            'total' => $total,
        ],
        'followers'     => $this->userSerializer->list($users, ['basic']),
      ]);
    }

    return response()->json([
      'success'   => false,
      'errors'    => ['The given user doesn\'t exist'],
    ], 404);
  }

  /**
   * Return the list of followings for the giving user, everyone
   * can see the list of followings of everyone else
   */
  public function followings(Request $request, $user_id) {
    $user = User::find($user_id);

    if ($user) {
      $users = $user->followings()->get();
      $total = $user->followings()->count();

      return response()->json([
        'success'   => true,
        'meta'      => [
            'total' => $total,
        ],
        'followers'     => $this->userSerializer->list($users, ['basic']),
      ]);
    }

    return response()->json([
      'success'   => false,
      'errors'    => ['The given user doesn\'t exist'],
    ], 404);
  }

  /**
   * Current user follows the giving user
   */
  public function follow(Request $request, $user_id) {
    $current = $this->guard()->user();

    // You can't follow yourself
    if ($current->id != $user_id) {
      $user = User::find($user_id);

      // Check if the user exist
      if ($user) {
        // Check if user is already following, we don't need
        // to create activities and anything else
        if ($current->isFollowing($user)) {
          return response()->json([
            'success'   => true,
            'message'   => "You are now following $user->name",
          ]);
        }
        $current->follow($user);

        // Create activity for the one following
        $activity = new Activity();
        $activity->fill([
            'action'    => 'follow',
            'user_id'   => $current->id,
            'reference_type'    => 'App\\User',
            'reference_id'      => $user->id
        ]);
        $activity->save();

        // Create activity for the one followed
        $activity = new Activity();
        $activity->fill([
            'action'    => 'followed',
            'user_id'   => $user->id,
            'reference_type'    => 'App\\User',
            'reference_id'      => $current->id
        ]);
        $activity->save();

        return response()->json([
          'success'   => true,
          'message'   => "You are now following $user->name",
        ]);
      }

      return response()->json([
        'success'   => false,
        'errors'    => ['The user you want to follow doesn\'t exist'],
      ], 404);
    }
    
    return response()->json([
      'success'   => false,
      'errors'    => ['You can\'t follow yourself'],
    ], 400);
  }

  /**
   * Current user unfollow the given user
   */
  public function unfollow(Request $request, $user_id) {
    $current = $this->guard()->user();

    // You can't follow yourself
    if ($current->id != $user_id) {
      $user = User::find($user_id);

      if ($user) {
        // Check if current user is actually following the given user, we don't need
        // to create activities and anything else if it's not following
        if (!$current->isFollowing($user)) {
          return response()->json([
            'success'   => true,
            'message'   => "You are now unfollowing $user->name",
          ]);
        }

        $current->unfollow($user);
        // Create activity for the one unfollowing
        $activity = new Activity();
        $activity->fill([
            'action'    => 'unfollow',
            'user_id'   => $current->id,
            'reference_type'    => 'App\\User',
            'reference_id'      => $user->id,
        ]);
        $activity->save();

        // Create activity for the one unfollowed
        $activity = new Activity();
        $activity->fill([
            'action'    => 'unfollowed',
            'user_id'   => $user->id,
            'reference_type'    => 'App\\User',
            'reference_id'      => $current->id,
        ]);
        $activity->save();

        return response()->json([
          'success'   => true,
          'message'   => "You are now unfollowing $user->name",
        ]);
      }
      
      return response()->json([
        'success'   => false,
        'errors'    => ['The user you want to unfollow doesn\'t exist'],
      ], 404);
    }

    return response()->json([
      'success'   => false,
      'errors'    => ['You can\'t unfollow yourself'],
    ], 400);
  }
}
