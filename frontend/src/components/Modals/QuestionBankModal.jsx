import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { fetchCourses } from '../../services/course.service';
import { fetchQuestions } from '../../services/questions.service';
import Loading from '../Loading';
import { addQuestion } from '../../services/aseessment.service';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

const QuestionBankModal = ({
  isOpen,
  onClose,
  onAddQuestions,
  assessmentId,
}) => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  console.log(questions);

  useEffect(() => {
    const loadQuestionsAndCourses = async () => {
      try {
        const [fetchedCourses, fetchedQuestions] = await Promise.all([
          fetchCourses(),
          fetchQuestions(),
        ]);
        setCourses(fetchedCourses);
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadQuestionsAndCourses();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedCourse) {
      setSelectedQuestions([]);
    }
  }, [selectedCourse]);

  const handleQuestionSelection = (questionId) => {
    setSelectedQuestions((prevSelectedQuestions) => {
      if (prevSelectedQuestions.includes(questionId)) {
        return prevSelectedQuestions.filter((id) => id !== questionId);
      } else {
        return [...prevSelectedQuestions, questionId];
      }
    });
  };

  const handleCourseChange = (selectedOption) => {
    setSelectedCourse(selectedOption);
  };

  const handleAddSelectedQuestions = async () => {
    setLoading(true);
    const selected = questions.filter((question) =>
      selectedQuestions.includes(question.id),
    );
    try {
      const response = await addQuestion(assessmentId, {
        questions: selected,
        from_question_bank: true,
      });
      onAddQuestions(response.data.questions);
      toast.success('Questions added successfully!');
    } catch (error) {
      console.error(error);
      setError('An error occurred while adding questions.');
      toast.error('An error occurred while adding questions.');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const filteredQuestions = selectedCourse
    ? questions.filter((question) => question.course_id === selectedCourse.id)
    : questions;

  if (!isOpen) return null;
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl h-[80vh] overflow-auto">
        <div className="modal-header flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Question Bank</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            &times;
          </button>
        </div>
        <div className="modal-body mb-4">
          <div className="mb-4">
            <label
              htmlFor="course-filter"
              className="leading-7 text-sm text-gray-600"
            >
              Filter by Course
            </label>
            <CreatableSelect
              id="course-filter"
              onChange={handleCourseChange}
              value={selectedCourse}
              options={courses}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
              placeholder="Select or create a course"
              getOptionLabel={(option) => option.label || option.name}
              getOptionValue={(option) => option.value || option.id}
            />
          </div>

          <div className="question-list">
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                className="question-item flex items-center mb-2"
              >
                <input
                  type="checkbox"
                  id={`question-${question.id}`}
                  className="mr-2"
                  checked={selectedQuestions.includes(question.id)}
                  onChange={() => handleQuestionSelection(question.id)}
                />
                <label
                  htmlFor={`question-${question.id}`}
                  className="text-gray-700"
                >
                  {question.question_text} ({question.marks} Marks)
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer flex justify-end mt-4">
          <button
            onClick={onClose}
            className="mr-2 py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleAddSelectedQuestions}
            className="py-2 px-4 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            {loading ? (
              <ClipLoader size={20} color={'#fff'} />
            ) : (
              'Add Selected Questions'
            )}
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default QuestionBankModal;
