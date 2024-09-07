from rest_framework.views import APIView
import requests
from rest_framework.response import Response
from rest_framework import status
from .models import Question
from apps.choices.models import Choice
from apps.assessments.models import Assessment
from .serializer import QuestionSerializer
from django.utils.html import escape
import google.generativeai as genai
from dotenv import load_dotenv
from rest_framework import generics 
from apps.courses.models import Course
from django_backend.permissions import IsStaffUser, IsSuperuser
from rest_framework.permissions import AllowAny, IsAuthenticated
import os
import json
import html


load_dotenv()

api_key = os.getenv('GEMINI_API_KEY')
# Configure your Google Generative AI model
genai.configure(api_key=api_key)

generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-pro",
    generation_config=generation_config,
)

class AddQuestionView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]
    def post(self, request, assessment_id):
        try:
            # Retrieve the assessment object
            assessment = Assessment.objects.get(id=assessment_id)
            course = Course.objects.get(id=assessment.course_id)

            from_ai = request.data.get('from_ai', False)
            from_third_party = request.data.get('from_third_party', False)
            from_question_bank = request.data.get('from_question_bank', False)

            if from_third_party:
                # Fetch questions from Open Trivia Database
                all_questions = []
                category = request.data.get('category', {}).get('value', 18)
                difficulty = request.data.get('difficulty', 'medium')
                question_type = request.data.get('question_type', 'multiple')
                number_of_questions = request.data.get('numberOfQuestions', 5)
                marks_per_question = request.data.get('marks_per_question', 1)

                api_url = f'https://opentdb.com/api.php?amount={number_of_questions}&category={category}&difficulty={difficulty}&type={question_type}'
                response = requests.get(api_url)
                questions = response.json().get('results', [])

                for q in questions:
                    # Decode HTML entities
                    question_text = html.unescape(q.get('question', ''))
                    q_type = q.get('type')

                    # Map OpenTDB types to your my question types
                    if q_type == 'multiple':
                        question_type = 'mcq'
                    elif q_type == 'boolean':
                        question_type = 'trueFalse'

                    # Create the Question object
                    question = Question.objects.create(
                        assessment=assessment,
                        question_text=question_text,
                        question_type=question_type,
                        marks=marks_per_question,
                        course=course
                    )

                    if question_type == 'mcq':
                        # Handle MCQ type questions
                        incorrect_answers = q.get('incorrect_answers', [])
                        correct_answer = html.unescape(q.get('correct_answer', ''))

                        for option in incorrect_answers:
                            Choice.objects.create(
                                question=question,
                                choice_text=html.unescape(option),
                                is_correct=False
                            )
                        Choice.objects.create(
                            question=question,
                            choice_text=correct_answer,
                            is_correct=True
                        )

                    elif question_type == 'trueFalse':
                        # Handle True/False type questions
                        is_true = q.get('correct_answer') == 'True'
                        question.is_true = is_true
                        question.save()

                    all_questions.append(question)

                return Response({"questions": QuestionSerializer(all_questions, many=True).data}, status=status.HTTP_200_OK)

            elif from_ai:
                # Generate questions using the AI model
                material = request.data.get('material', '')
                number_of_questions = request.data.get('questions_num', 5)

                prompt = f"""{material}
                Generate {number_of_questions} multiple-choice questions in the following JSON format: {{
                  "questions": [
                    {{
                      "question": "",
                      "correct_answer": "",
                      "incorrect_answers": ["", "", ""]
                    }},
                    {{
                      "question": "",
                      "correct_answer": "",
                      "incorrect_answers": ["", "", ""]
                    }},
                    {{
                      "question": "",
                      "correct_answer": "",
                      "incorrect_answers": ["", "", ""]
                    }}
                  ]
                }}. Ensure that each question has a 'question' field for the question text, a 'correct_answer' field for the correct answer, and an 'incorrect_answers' field as an array for the wrong options. Do not include any code block formatting or additional text."""

                chat_session = model.start_chat(history=[])
                response = chat_session.send_message(prompt)

                response_str = response.text
                response_json = json.loads(response_str)

                questions = response_json['questions']
                all_questions = []

                for q in questions:
                    question_text = escape(q.get('question', ''))
                    question_type = 'mcq'  # Hard-coded for now

                    # Create the Question object
                    question = Question.objects.create(
                        assessment=assessment,
                        question_text=question_text,
                        question_type=question_type,
                        marks=request.data.get('marks_per_question', 1),
                        course=course

                    )

                    incorrect_answers = q.get('incorrect_answers', [])
                    correct_answer = escape(q.get('correct_answer', ''))

                    for option in incorrect_answers:
                        Choice.objects.create(
                            question=question,
                            choice_text=escape(option),
                            is_correct=False
                        )
                    Choice.objects.create(
                        question=question,
                        choice_text=correct_answer,
                        is_correct=True
                    )

                    all_questions.append(question)

                return Response({"questions": QuestionSerializer(all_questions, many=True).data}, status=status.HTTP_200_OK)

            elif from_question_bank:
                # Handle questions from the question bank
                questions_data = request.data.get('questions', [])
                print("Questions data:", questions_data)
                print("AHA", from_question_bank)

                all_questions = []
                for q in questions_data:
                    question_text = escape(q.get('question_text', ''))
                    question_type = q.get('question_type')
                    marks = q.get('marks', 1)
                    course_id = q.get('course_id')
                    
                    # Create the Question object
                    question = Question.objects.create(
                        assessment=assessment,
                        question_text=question_text,
                        question_type=question_type,
                        marks=marks,
                        course=course
                    )

                    if question_type == 'mcq':
                        # Handle MCQ type questions
                        choices = q.get('choices', [])
                        for choice in choices:
                            Choice.objects.create(
                                question=question,
                                choice_text=escape(choice.get('choice_text', '')),
                                is_correct=choice.get('is_correct', False)
                            )

                    elif question_type == 'trueFalse':
                        is_true = q.get('is_true', False)
                        question.is_true = is_true
                        question.save()

                    all_questions.append(question)

                return Response({"questions": QuestionSerializer(all_questions, many=True).data}, status=status.HTTP_200_OK)

            else:
                # Extract data from the request
                question_text = escape(request.data.get('question_text', ''))
                question_type = request.data.get('question_type')
                marks = request.data.get('marks', 1)

                # Create the Question object
                question = Question.objects.create(
                    assessment=assessment,
                    question_text=question_text,
                    question_type=question_type,
                    marks=marks,
                    course=course
                )

                # Handle MCQ type questions
                if question_type == 'mcq':
                    options = request.data.get('options', [])
                    correct_option = request.data.get('correct_option')

                    for option in options:
                        is_correct = (option['value'] == correct_option['value'])
                        Choice.objects.create(
                            question=question,
                            choice_text=escape(option['label']),
                            is_correct=is_correct
                        )

                # Handle True/False type questions
                elif question_type == 'trueFalse':
                    is_true = request.data.get('trueOrFalseOption') == 'true'
                    question.is_true = is_true
                    question.save()

                return Response({"message": "Question added successfully", "question": QuestionSerializer(question).data}, status=status.HTTP_201_CREATED)

        except Assessment.DoesNotExist:
            return Response({"error": "Assessment not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UpdateQuestionView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]
    def put(self, request, question_id):
        try:
            # Retrieve the question object
            question = Question.objects.get(id=question_id)

            # Extract data from the request
            question_text = request.data.get('question_text', question.question_text)
            question_type = request.data.get('question_type', question.question_type)
            marks = request.data.get('marks', 1)

            # Update question text and type
            question.question_text = question_text
            question.question_type = question_type
            question.marks = marks

            # Handle MCQ type questions
            if question_type == 'mcq':
                question.choices.all().delete()
                options = request.data.get('choices', [])
                for option in options:
                    is_correct = option.get('is_correct', False)
                    Choice.objects.create(
                        question=question,
                        choice_text=option['choice_text'],
                        is_correct=is_correct
                    )

            # Handle True/False type questions
            elif question_type == 'trueFalse':
                is_true = request.data.get('is_true', False)
                question.is_true = is_true

            # Save the updated question
            question.save()

            # Serialize the updated question data
            serializer = QuestionSerializer(question)
            return Response({"message": "Question updated successfully", "question": serializer.data}, status=status.HTTP_200_OK)

        except Question.DoesNotExist:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DeleteQuestionView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]
    def delete(self, request, question_id):
        try:
            # Retrieve the question object
            question = Question.objects.get(id=question_id)

            # Delete the question
            question.delete()

            return Response({"message": "Question deleted successfully"}, status=status.HTTP_200_OK)

        except Question.DoesNotExist:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class QuestionsListView(generics.ListAPIView):
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()