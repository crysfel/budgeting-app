<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password', 60);
            
            $table->string('image'); //save the URL to the image so we can use (Facebook, custom image uploaded to our server using File table)
            $table->text('about')->nullable();
            $table->string('occupation')->nullable();
            $table->string('website')->nullable();
            $table->string('gender')->nullable()->index();
            $table->date('dob')->nullable();

            $table->string('country')->nullable()->index();
            $table->string('postcode')->nullable();
            $table->double('latitude',15, 8)->nullable();
            $table->double('longitude',15, 8)->nullable();

            $table->string('facebook')->nullable();
            $table->string('twitter')->nullable();
            
            $table->boolean('admin')->default(false);
            $table->boolean('author')->default(false);

            $table->string('confirmation_token')->nullable();
            $table->timestamp('confirmation_sent_at')->nullable();
            $table->timestamp('confirmed_at')->nullable();

            $table->string('recovery_token')->unique()->nullable();
            $table->timestamp('recovery_sent_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
