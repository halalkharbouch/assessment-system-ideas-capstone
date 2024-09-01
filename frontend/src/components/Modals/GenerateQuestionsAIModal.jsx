import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addQuestion } from '../../services/aseessment.service';

function GenerateQuestionsAIModal({
  isOpen,
  onClose,
  onSubmit,
  assessmentId,
}) {
  const [material, setMaterial] = useState('');
  const [numOfQuestions, setNumOfQuestions] = useState(1);
  const [marksPerQuestion, setMarksPerQuestion] = useState(1);
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const maxChars = 10000;

  const handleMaterialChange = (e) => {
    const input = e.target.value;
    setMaterial(input);
    setCharCount(input.length);
  };

  const handleNumQuestionsChange = (e) => {
    const input = e.target.value;
    setNumOfQuestions(input);
  };

  const handleMarksPerQuestionChange = (e) => {
    const input = e.target.value;
    setMarksPerQuestion(input);
  };

  const handleSubmit = async () => {
    if (charCount > maxChars) {
      toast.error(
        `Please reduce your input to ${maxChars} characters or less.`,
      );
      return;
    }

    setLoading(true);
    try {
      const formData = {
        material,
        from_ai: true,
        questions_num: numOfQuestions,
        marks_per_question: marksPerQuestion,
      };

      // Call the API to add questions
      const response = await addQuestion(assessmentId, formData);

      console.log('Response:', response);

      // Handle success response and pass the generated questions to the parent
      onSubmit(response.data.questions);
      toast.success('Questions generated successfully!');
      onClose();
    } catch (error) {
      // Handle any errors that occur during the API call
      toast.error(
        'An error occurred while generating questions. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setMaterial('');
      setCharCount(0);
      setNumOfQuestions(1);
      setMarksPerQuestion(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">
          Generate Questions with AI
        </h2>
        <p className="mb-4">
          Please paste the material you want to generate questions from. Note
          that the input should not exceed 10000 characters for optimal
          performance. Additionally, please review the generated questions
          before submitting the assessment as AI may make mistakes. It is also
          recommended to generate a minimum of 25 questions at a time.
        </p>
        <textarea
          value={material}
          onChange={handleMaterialChange}
          placeholder="Paste your material here..."
          className="w-full p-2 border border-gray-300 rounded mb-4"
          rows="8"
          disabled={loading}
        ></textarea>
        <div className="mb-4">
          <label htmlFor="email" className="leading-7 text-sm text-gray-600">
            Number Of Questions
          </label>
          <input
            onChange={handleNumQuestionsChange}
            value={numOfQuestions}
            type="number"
            min="1"
            id="questions_num"
            name="questions_num"
            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="leading-7 text-sm text-gray-600">
            Marks Per Question
          </label>
          <input
            onChange={handleMarksPerQuestionChange}
            value={marksPerQuestion}
            type="number"
            min="1"
            id="marks_per_question"
            name="marks_per_question"
            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
          />
        </div>
        <p className={`text-sm ${charCount > maxChars ? 'text-red-500' : ''}`}>
          {charCount}/{maxChars} characters
        </p>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="mr-2 py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="py-2 px-4 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GenerateQuestionsAIModal;
