<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('note_collaborators', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('note_uuid')->constrained('notes', 'uuid')->onDelete('cascade');
            $table->foreignUuid('user_uuid')->constrained('users', 'uuid')->onDelete('cascade');
            $table->foreignUuid('shared_by')->constrained('users', 'uuid')->onDelete('cascade');
            $table->enum('permission', ['read', 'write'])->default('read');
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->timestamp('accepted_at')->nullable();
            $table->timestamps();

            $table->unique(['note_uuid', 'user_uuid']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('note_collaborators');
    }
}; 