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
        Schema::create('note_labels', function (Blueprint $table) {
            $table->id();
            $table->uuid('note_uuid');
            $table->foreignId('label_id')->constrained('labels')->onDelete('cascade');
            $table->timestamps();

            $table->foreign('note_uuid')
                ->references('uuid')
                ->on('notes')
                ->onDelete('cascade');

            $table->unique(['note_uuid', 'label_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('note_labels');
    }
};
