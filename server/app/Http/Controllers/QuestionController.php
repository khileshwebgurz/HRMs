<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Questions;
use App\Models\Roles;
use App\Models\Employees;
use Illuminate\Support\Facades\Auth;
use App\Models\QuestionOptions;
use Illuminate\Support\Facades\Validator;


class QuestionController extends Controller
{
    public function allQuestions(Request $request)
    {
        $user = Auth::user();
        $role = Roles::find($user->user_role);

        if (!$role || $role->view == '1') {
            return response()->json([
                'status' => false,
                'message' => "You don't have permission to view. Please contact HR.",
                'data' => []
            ], 403);
        }

        $query = Questions::where('status', 1);

        if ($role->view == '2') {
            $query->where('created_by', $user->id);
        } elseif ($role->view == '3') {
            $employeeIds = Employees::where('manager_id', $user->id)->pluck('id');
            $query->whereIn('created_by', $employeeIds);
        } elseif ($role->view == '4') {
            $employeeIds = Employees::where('manager_id', $user->id)
                ->orWhere('id', $user->id)
                ->pluck('id');
            $query->whereIn('created_by', $employeeIds);
        }

        $questions = $query->latest()->get();

        $questionTypes = Questions::$question_type;

        $formatted = $questions->map(function ($q, $i) use ($questionTypes) {
            return [
                'id' => $q->id,
                'index' => $i + 1,
                'question' => nl2br($q->question),
                'question_type' => $questionTypes[$q->question_type] ?? 'N/A',
                'can_edit' => true, // control this via permission if needed
                'can_delete' => true
            ];
        });

        return response()->json([
            'status' => true,
            'data' => $formatted
        ]);
    }

     public function addQuestion()
    {
        $question_type = Questions::$question_type;
        $user = Auth::user();
        $role = Roles::find($user->user_role);

        $assign = [];

        if ($role->add != '2') {
            if ($role->add == '4') {
                $assign = Employees::where('manager_id', $user->id)
                    ->orWhere('id', $user->id)
                    ->get();
            } elseif ($role->add == '5') {
                $all_roles = Roles::where('id', '!=', '2')->pluck('id')->toArray();
                $assign = Employees::whereIn('user_role', $all_roles)->get();
            } else {
                $assign = Employees::where('manager_id', $user->id)->get();
            }
        }

        return response()->json([
            'status' => true,
            'question_types' => $question_type,
            'assignable_employees' => $assign,
            'can_assign' => $role->add != '2',
        ]);
    }

    public function addQuestionPost(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'question' => 'required',
            'question_type' => 'required',
            'option' => 'required|array|min:2',
            'answer_index' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'message' => $validator->errors()->first()
            ]);
        }

        $user = Auth::user();
        $role = Roles::find($user->user_role);

        $created_by = $role->add == '2' ? $user->id : $request->created_by;

        if ($role->add != '2' && empty($created_by)) {
            return response()->json([
                'status' => 422,
                'message' => 'Please select to whom you would assign to'
            ]);
        }

        // Create the question first
        $question = new Questions();
        $question->question = $request->question;
        $question->question_type = $request->question_type;
        $question->created_by = $created_by;
        $question->save();

        // Add options and find the correct answer ID
        $answerOptionId = null;
        $optionCount = 0;

        foreach ($request->option as $index => $text) {
            $text = trim($text);
            if ($text === '') continue;

            $opt = new QuestionOptions();
            $opt->question_id = $question->id;
            $opt->option_name = $text;
            $opt->save();

            if ($optionCount == $request->answer_index) {
                $answerOptionId = $opt->id;
            }

            $optionCount++;
        }

        if (!$answerOptionId) {
            // Rollback the created question if answer is missing
            $question->delete();

            return response()->json([
                'status' => 422,
                'message' => 'Answer could not be matched with a valid option.'
            ]);
        }

        $question->answer = $answerOptionId;
        $question->save();

        return response()->json([
            'status' => 200,
            'message' => 'Question added successfully'
        ]);
    }

    public function editQuestion($question_id)
    {
        $question_type = Questions::$question_type;
        $question = Questions::with('options')->findOrFail($question_id);

        return response()->json([
            'status' => 200,
            'question' => $question,
            'question_types' => $question_type,
        ]);
    }

    public function editQuestionPost(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'question_id' => 'required|exists:questions,id',
            'question' => 'required',
            'question_type' => 'required',
            'option' => 'required|array|min:2',
            'answer_index' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()->first(),
            ]);
        }

        $ques = Questions::findOrFail($request->question_id);
        $ques->question = $request->question;
        $ques->question_type = $request->question_type;
        $ques->save();

        $optArr = [];
        foreach ($request->option as $index => $optVal) {
            $opt = QuestionOptions::where('question_id', $ques->id)
                    ->where('option_name', $optVal)->first();

            if (!$opt) {
                $opt = new QuestionOptions();
            }

            $opt->question_id = $ques->id;
            $opt->option_name = $optVal;
            $opt->save();

            if ((int)$request->answer_index === $index) {
                $ques->answer = $opt->id;
                $ques->save();
            }

            $optArr[] = $opt->id;
        }

        QuestionOptions::where('question_id', $ques->id)
            ->whereNotIn('id', $optArr)
            ->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Question updated successfully.',
        ]);
    }

    public function deleteQuestion($question_id)
    {
        $question = Questions::findOrFail($question_id);
        $question->status = 2;

        if ($question->save()) {
            return response()->json([
                'status' => 200,
                'message' => 'Question deleted.'
            ]);
        } else {
            return response()->json([
                'status' => 500,
                'message' => 'Something went wrong. Try again.'
            ]);
        }
    }

}
