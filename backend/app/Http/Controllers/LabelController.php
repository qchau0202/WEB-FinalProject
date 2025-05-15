<?php

namespace App\Http\Controllers;

use App\Models\Label;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class LabelController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $labels = Label::where('user_id', $user->uuid)
            ->withCount('notes')
            ->orderBy('name')
            ->get();

        return response()->json($labels);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'color' => 'required|string|size:7|regex:/^#[0-9A-F]{6}$/i'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        
        $label = Label::create([
            'user_id' => $user->uuid,
            'name' => $request->name,
            'color' => $request->color
        ]);

        return response()->json([
            'message' => 'Label created successfully',
            'label' => $label
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'color' => 'string|size:7|regex:/^#[0-9A-F]{6}$/i'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        $label = Label::findOrFail($id);

        if ($label->user_id !== $user->uuid) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $label->update([
            'name' => $request->name ?? $label->name,
            'color' => $request->color ?? $label->color
        ]);

        return response()->json([
            'message' => 'Label updated successfully',
            'label' => $label
        ]);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $label = Label::findOrFail($id);

        if ($label->user_id !== $user->uuid) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $label->delete();

        return response()->json(['message' => 'Label deleted successfully']);
    }
} 