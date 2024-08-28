from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Question
from apps.choices.models import Choice
from apps.assessments.models import Assessment
from .serializer import QuestionSerializer

class AddQuestionView(APIView):
    def post(self, request, assessment_id):
        try:
            # Retrieve the assessment object
            assessment = Assessment.objects.get(id=assessment_id)

            # Extract data from the request
            question_text = request.data.get('question_text')
            question_type = request.data.get('question_type')
            marks = request.data.get('marks', 1)

            # Create the Question object
            question = Question.objects.create(
                assessment=assessment,
                question_text=question_text,
                question_type=question_type,
                marks=marks
            )

            # Handle MCQ type questions
            if question_type == 'mcq':
                options = request.data.get('options', [])
                correct_option = request.data.get('correct_option')
                for option in options:
                    is_correct = (option['value'] == correct_option['value'])
                    Choice.objects.create(
                        question=question,
                        choice_text=option['label'],
                        is_correct=is_correct
                    )

            # Handle True/False type questions
            elif question_type == 'trueFalse':
                is_true = request.data.get('trueOrFalseOption') == 'true'
                question.is_true = is_true
                question.save()

            # serialize question data
            question_serializer = QuestionSerializer(question)

            return Response({"message": "Question added successfully", "question": question_serializer.data}, status=status.HTTP_201_CREATED)

        except Assessment.DoesNotExist:
            return Response({"error": "Assessment not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UpdateQuestionView(APIView):
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