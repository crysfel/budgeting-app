<?php

namespace App\Policies;

use App\User;
use App\Transaction;
use Illuminate\Auth\Access\HandlesAuthorization;

class TransactionPolicy
{
    use HandlesAuthorization;

    public function before($user, $ability)
    {
        if ($user->admin) {
            return true;
        }
    }
    /**
     * Determine whether the user can view the post.
     *
     * @param  \App\User  $user
     * @param  \App\Transaction  $transaction
     * @return mixed
     */
    public function index(User $user, Transaction $trans)
    {
        return $user->id == $trans->user_id;
    }

    /**
     * Determine whether the user can view the post.
     *
     * @param  \App\User  $user
     * @param  \App\Transaction  $transaction
     * @return mixed
     */
    public function view(User $user, Transaction $trans)
    {
        return $user->id === $trans->user_id;
    }

    /**
     * Determine whether the user can create posts.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can update the post.
     *
     * @param  \App\User  $user
     * @param  \App\Transaction  $transaction
     * @return mixed
     */
    public function update(User $user, Transaction $transaction)
    {
        return $user->id == $transaction->user_id;
    }

    /**
     * Determine whether the user can delete the post.
     *
     * @param  \App\User  $user
     * @param  \App\Transaction  $transaction
     * @return mixed
     */
    public function delete(User $user, Transaction $transaction)
    {
        return $user->id == $transaction->user_id;
    }
}
