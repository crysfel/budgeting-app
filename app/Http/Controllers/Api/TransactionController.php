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
      'tags'         => 'required',
    ];
  }

  /**
   * Display a listing of transactions for the current user.
   *
   * @return \Illuminate\Http\Response
   */
  public function index(Request $request)
  {
    $user = $this->guard()->user();
    $options = [
      'user_id' => $user->id,
    ];
    $transactions = Transaction::latest($options)->paginate(100);

    return response()->json([
      'success'   => true,
      'paginator' => $this->transactionSerializer->paginator($transactions),
      'transactions'     => $this->transactionSerializer->list($transactions->items(), ['basic']),
    ]);
  }

  /**
   * Display the totals for income and transaction
   * for the current month.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function totals(Request $request)
  {
    $user = $this->guard()->user();
    $now = Carbon::now('UTC');
    $from = $now->year.'-'.$now->month.'-01 00:00:00';
    $to = $now->year.'-'.$now->month.'-'.$now->day.' 23:59:59';
    
    $income = Transaction::total([
      'user_id' => $user->id,
      'from' => $from,
      'to' => $to,
      'is_expense' => false,
    ])->first();

    $expsense = Transaction::total([
      'user_id' => $user->id,
      'from' => $from,
      'to' => $to,
      'is_expense' => true,
    ])->first();
    
    return response()->json([
      'success'   => true,
      'totals'    => [
        'income'  => [
          'total' => $income->total,
        ],
        'expense'  => [
          'total' => $expsense->total,
        ],
        'current'  => [
          'total' => round($income->total - $expsense->total, 2),
        ],
      ]
    ]);
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
    $record->tag($request->input('tags'));

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
    $user = $this->guard()->user();
    $transaction = Transaction::find($id);

    if ($user->can('update', $transaction)) {
      $validator = Validator::make($request->all(), $this->validations);

      if ($validator->fails()) {
        return response()->json([
          'success'=> false,
          'errors' => $validator->errors()->all(),
        ], 400);
      }

      $transaction->fill($request->all());
      $transaction->save();
      $transaction->setTags($request->input('tags'));

      return response()->json([
        'success'   => true,
        'message'   => 'Your transaction has been updated.',
        'transaction'      => $this->transactionSerializer->one($transaction),
      ]);
    }
        
    return response()->json([
      'success'   => false,
      'errors'    => ['You are not the author of this transaction.']
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
    $transaction = Transaction::find($id);
    
    if ($user->can('delete', $transaction)) {
      $transaction->untag();
      $transaction->delete();

      return response()->json([
          'success'   => true,
          'message'   => 'Your transaction has been deleted.'
      ]);
    }

    return response()->json([
      'success'   => false,
      'errors'    => ['You are not the author of this transaction.']
    ], 403);
  }
}
