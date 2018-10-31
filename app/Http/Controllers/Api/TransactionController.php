<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Http\Serializers\TransactionSerializer;
use Validator;
use Carbon\Carbon;
use Config;
use Gate;
use App\User;
use App\Activity;
use App\Transaction;
use Log;

class TransactionController extends Controller
{
  /**
   * Create a new controller instance.
   *
   * @param  TaskRepository  $tasks
   * @return void
   */
  public function __construct(TransactionSerializer $transactionSerializer)
  {
    $this->transactionSerializer = $transactionSerializer;

    // Validations for this resource
    $this->validations = [
      'description'  => 'required|min:3|max:255',
      'amount'       => 'required|numeric',
    ];
  }

  /**
   * Display a listing of transactions.
   *
   * @return \Illuminate\Http\Response
   */
  public function index(Request $request)
  {
    $user = $this->guard()->user();

    if ($user->can('index', Transaction::class)) {
      

      return response()->json([
        'success'   => true,
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
    // $user = $this->guard()->user();

    // if ($user->can('view', $post)) {
      return response()->json([
        'success'   => true,
      ]);
    // }

    // return response()->json([
    //   'success'   => false,
    //   'errors'    => ['You are not the author of this post.']
    // ], 403);
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

    $validator = Validator::make($request->all(), $this->validations);

    if ($validator->fails()) {
      return response()->json([
        'success'=> false,
        'errors' => $validator->errors()->all(),
      ], 400);
    }

    $record = new Transaction();
    $record->fill($request->all());
    $record->user_id = $user->id;
    $record->save();


    $activity = new Activity();
    $activity->fill([
        'action'    => 'published-post',
        'user_id'   => $user->id,
        'reference_type'    => Transaction::class,
        'reference_id'      => $record->id,
    ]);
    $activity->save();

    return response()->json([
        'success'   => true,
        'message'   => 'Your transaction has been created.',
        'transaction' => $this->transactionSerializer->one($record),
    ]);
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
    // $user = $this->guard()->user();
    // $post = Post::find($id);
    // $createActivity = false;

    // if ($user->can('update', $post)) {
    //   $validator = Validator::make($request->all(), $this->validations);

    //   if ($validator->fails()) {
    //     return response()->json([
    //       'success'=> false,
    //       'errors' => $validator->errors()->all(),
    //     ], 400);
    //   }

    //   $post->fill($request->all());
    //   $post->allow_comments = $request->input('allow_comments') != false;

    //   if($post->published == false && $request->input('published') == true){
    //     $post->published    = true;
    //     $post->created_at   = Carbon::now();

    //     $createActivity = true;
    //   }else{
    //     $post->published = $request->input('published') == true;
    //   }

    //   $post->save();

    //   if($createActivity){
    //     $activity = new Activity();
    //     $activity->fill([
    //       'action'         => 'published-post',
    //       'user_id'        => $user->id,
    //       'reference_type' => Post::class,
    //       'reference_id'   => $post->id,
    //     ]);
    //     $activity->save();
    //   }

      return response()->json([
        'success'   => true,
        // 'message'   => 'Your post has been updated.',
        // 'post'      => $this->postSerializer->one($post),
      ]);

    // }
        
    // return response()->json([
    //   'success'   => false,
    //   'errors'    => ['You are not the author of this blog post.']
    // ], 403);
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function destroy($id)
  {
    // $user = $this->guard()->user();
    // $post = Post::find($id);

    // if ($user->can('delete', $post)) {
    //   // @TODO Delete all dependencies if any
    //   $post->delete();

      return response()->json([
          'success'   => true,
          // 'message'   => 'Your post has been deleted.'
      ]);
    // }

    // return response()->json([
    //   'success'   => false,
    //   'errors'    => ['You are not the author of this blog post.']
    // ], 403);
  }
}
