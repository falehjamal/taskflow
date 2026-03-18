<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tasks = DB::table('tasks')->whereNotNull('assigned_to')->get();

        foreach ($tasks as $task) {
            DB::table('task_user')->insertOrIgnore([
                'task_id' => $task->id,
                'user_id' => $task->assigned_to,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['assigned_to']);
            $table->dropColumn('assigned_to');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->foreignId('assigned_to')->nullable()->after('due_date')->constrained('users')->nullOnDelete();
        });

        $pivots = DB::table('task_user')->get();
        foreach ($pivots as $pivot) {
            DB::table('tasks')
                ->where('id', $pivot->task_id)
                ->update(['assigned_to' => $pivot->user_id]);
        }
    }
};
