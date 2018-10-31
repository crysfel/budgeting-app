<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Http\Serializers\PostSerializer;
use Validator;
use Carbon\Carbon;
use Config;
use Gate;
use App\User;
use App\Activity;
use App\Post;
use Log;

class PostController extends Controller
{
  /**
   * Create a new controller instance.
   *
   * @param  PostSerializer  $postSerializer
   * @return void
   */
  public function __construct(PostSerializer $postSerializer)
  {
    $this->postSerializer = $postSerializer;

    // Validations for this resource
    $this->validations = [
      'title'         => 'required|min:3|max:255',
      'content'       => 'required',
    ];
  }

  /**
   * Display a listing of post.
   *
   * @return \Illuminate\Http\Response
   */
  public function index(Request $request)
  {
    $user = $this->guard()->user();

    if ($user->can('index', Post::class)) {
      $options = [
        'drafts'    => $request->input('drafts'),
        'published' => $request->input('published'),
        'search'    => $request->input('search'),
      ];

      // Admins can access their own if requested
      // None admin users can only access their own
      if(($user->admin && !$request->input('all')) || !$user->admin){
        $options['author'] = $user->id;
      }

      $posts = Post::latest($options)->paginate();

      return response()->json([
        'success'   => true,
        'paginator' => $this->postSerializer->paginator($posts),
        'posts'     => $this->postSerializer->list($posts->items(), ['basic']),
      ]);
    }

    return response()->json([
      'success'   => false,
      'errors'    => ['Only authors can access this resource.']
    ], 403);
  }

  /**
   * Display the specified resource.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function show(Request $request, $id)
  {
    $user = $this->guard()->user();
    $post   = Post::find($id);

    if ($user->can('view', $post)) {
      return response()->json([
        'success'   => true,
        'post'      => $this->postSerializer->one($post, ['basic', 'full']),
      ]);
    }

    return response()->json([
      'success'   => false,
      'errors'    => ['You are not the author of this post.']
    ], 403);
  }

  /**
   * Store a newly created post in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    $user = $this->guard()->user();

    if ($user->can('create', Post::class)) {
      $validator = Validator::make($request->all(), $this->validations);

      if ($validator->fails()) {
        return response()->json([
          'success'=> false,
          'errors' => $validator->errors()->all(),
        ], 400);
      }

      $record = new Post();
      $record->fill($request->all());
      $record->author_id = $user->id;
      $record->allow_comments = $request->input('allow_comments') != false;
      $record->published = $request->input('published') == true;
      $record->save();
      $record->tag($request->input('tags'));

      if ($record->published) {
        // Create activity if post is published
        $activity = new Activity();
        $activity->fill([
            'action'    => 'published-post',
            'user_id'   => $current->id,
            'reference_type'    => Post::class,
            'reference_id'      => $record->id,
        ]);
        $activity->save();
      }

      return response()->json([
          'success'   => true,
          'message'   => 'Your post has been created.',
          'post'      => $this->postSerializer->one($record),
      ]);

    }

    return response()->json([
        'success'   => false,
        'errors'    => ['Only authors can create new posts'],
    ], 403);
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, $id)
  {
    $user = $this->guard()->user();
    $post = Post::find($id);
    $createActivity = false;

    if ($user->can('update', $post)) {
      $validator = Validator::make($request->all(), $this->validations);

      if ($validator->fails()) {
        return response()->json([
          'success'=> false,
          'errors' => $validator->errors()->all(),
        ], 400);
      }

      $post->fill($request->all());
      $post->allow_comments = $request->input('allow_comments') != false;
      
      if($post->published == false && $request->input('published') == true){
        $post->published    = true;
        $post->created_at   = Carbon::now();
        
        $createActivity = true;
      }else{
        $post->published = $request->input('published') == true;
      }
      
      $post->save();
      $post->setTags($request->input('tags'));

      if($createActivity){
        $activity = new Activity();
        $activity->fill([
          'action'         => 'published-post',
          'user_id'        => $user->id,
          'reference_type' => Post::class,
          'reference_id'   => $post->id,
        ]);
        $activity->save();
      }

      return response()->json([
        'success'   => true,
        'message'   => 'Your post has been updated.',
        'post'      => $this->postSerializer->one($post),
      ]);

    }
        
    return response()->json([
      'success'   => false,
      'errors'    => ['You are not the author of this blog post.']
    ], 403);
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function destroy($id)
  {
    $user = $this->guard()->user();
    $post = Post::find($id);

    if ($user->can('delete', $post)) {
      // @TODO Delete all dependencies if any
      $post->delete();

      return response()->json([
          'success'   => true,
          'message'   => 'Your post has been deleted.'
      ]);
    }

    return response()->json([
      'success'   => false,
      'errors'    => ['You are not the author of this blog post.']
    ], 403);
  }
}
