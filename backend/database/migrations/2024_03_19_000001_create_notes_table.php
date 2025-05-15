<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notes', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->foreignUuid('user_id')->constrained('users', 'uuid')->onDelete('cascade');
            $table->string('title');
            $table->text('content');
            $table->boolean('is_public')->default(false);
            $table->boolean('is_locked')->default(false);
            $table->string('password')->nullable();
            $table->timestamp('last_edited_at')->nullable();
            $table->string('last_edited_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
}; 