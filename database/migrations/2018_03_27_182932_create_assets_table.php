<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAssetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('assets', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');

            $table->string('assetable_type')->index();
            $table->integer('assetable_id')->index();
            $table->string('name');
            $table->string('original_name');
            $table->string('content_type');
            $table->integer('size')->nullable();

            $table->text('path');     //The actual location of the file on the server or on S3
            $table->time('duration')->nullable(); //if is an audio or video, save duration
            
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
        Schema::dropIfExists('assets');
    }
}
