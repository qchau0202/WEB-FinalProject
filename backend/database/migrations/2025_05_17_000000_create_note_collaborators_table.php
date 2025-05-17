<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('note_collaborators', function (Blueprint $table) {
            $table->id();
            $table->string('note_uuid');
            $table->string('user_uuid');
            $table->string('shared_by')->nullable(); // user_uuid of the inviter
            $table->enum('permission', ['read', 'edit'])->default('read');
            $table->string('status')->default('pending'); // pending, accepted, declined, revoked
            $table->timestamp('accepted_at')->nullable();
            $table->timestamps();

            $table->foreign('note_uuid')->references('uuid')->on('notes')->onDelete('cascade');
            $table->foreign('user_uuid')->references('uuid')->on('users')->onDelete('cascade');
            $table->foreign('shared_by')->references('uuid')->on('users')->onDelete('set null');
            $table->unique(['note_uuid', 'user_uuid']); // Prevent duplicate invites
        });
    }

    public function down()
    {
        Schema::dropIfExists('note_collaborators');
    }
};