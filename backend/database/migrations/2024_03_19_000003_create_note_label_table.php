<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('note_label', function (Blueprint $table) {
            $table->foreignUuid('note_uuid')->constrained('notes', 'uuid')->onDelete('cascade');
            $table->foreignId('label_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->primary(['note_uuid', 'label_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('note_label');
    }
}; 