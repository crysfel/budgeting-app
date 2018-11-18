<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Http\Serializers\TransactionSerializer;
use Carbon\Carbon;
use Config;
use Gate;
use App\User;
use App\Activity;
use App\Transaction;
use Log;

class DashboardController extends Controller
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
  }

  /**
   * Display totals grouped by day, week or year
   *
   * @return \Illuminate\Http\Response
   */
  public function grouped(Request $request)
  {
    $user = $this->guard()->user();
    $grouped = 'day';
    $now = new Carbon();
    $from = $now->year.'-'.$now->month.'-01 00:00:00';
    $to = $now->year.'-'.$now->month.'-'.$now->day.' 23:59:59';

    if ($request->input('grouped')) {
      $grouped = $request->input('grouped');
    }

    $options = [
      'user_id' => $user->id,
      'grouped' => $grouped,
      'from' => $from,
      'to' => $to,
    ];

    $expenses = Transaction::totalGrouped($options)->get();

    return response()->json([
      'success'   => true,
      'expenses' => $expenses,
    ]);
  }
}
