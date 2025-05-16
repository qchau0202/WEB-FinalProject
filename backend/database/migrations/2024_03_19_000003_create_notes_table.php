<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notes', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->uuid('user_id');
            $table->string('title');
            $table->text('content');
            $table->boolean('is_public')->default(false);
            $table->boolean('is_pinned')->default(false);
            $table->timestamp('pinned_at')->nullable();
            $table->boolean('lock_feature_enabled')->default(false);
            $table->boolean('is_locked')->default(false);
            $table->string('password')->nullable();
            $table->timestamp('last_edited_at')->nullable();
            $table->uuid('last_edited_by')->nullable();
            $table->timestamps();

            $table->foreign('user_id')
                ->references('uuid')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('last_edited_by')
                ->references('uuid')
                ->on('users')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
}; 