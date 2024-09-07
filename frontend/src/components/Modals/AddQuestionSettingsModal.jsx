import { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import { addQuestion } from '../../services/aseessment.service';
import { useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';

function AddQuestionSettingsModal({
  isOpen,
  onClose,
  onAddSettings,
  assessmentId,
}) {
  const [formData, setFormData] = useState({
    numberOfQuestions: '',
    category: null, // Initially null
    difficulty: 'medium',
    question_type: 'multiple',
    marks_per_question: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  console.log(formData);

  // Define options for category, difficulty, and type
  const categories = [
    { value: 18, label: 'Science: Computers' },
    { value: 19, label: 'Science: Mathematics' },
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  const types = [
    { value: 'multiple', label: 'Multiple Choice' },
    { value: 'boolean', label: 'True/False' },
  ];

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        numberOfQuestions: '',
        category: null,
        difficulty: 'medium',
        question_type: 'multiple',
        marks_per_question: 1,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategoryChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      category: selectedOption,
    }));
  };

  const handleDifficultyChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      difficulty: selectedOption ? selectedOption.value : 'medium',
    }));
  };

  const handleTypeChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      question_type: selectedOption ? selectedOption.value : 'multiple',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call your API or service to handle the form data
      // For example: await addSettings(formData);
      const response = await addQuestion(assessmentId, {
        ...formData,
        from_third_party: true,
      });
      onAddSettings(response.data.questions);
      onClose();
    } catch (error) {
      console.log(error);
      setError('An error occurred while submitting the settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-medium mb-4">Add Question Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="numberOfQuestions"
              className="leading-7 text-sm text-gray-600"
            >
              Number of Questions
            </label>
            <input
              onChange={handleChange}
              value={formData.numberOfQuestions}
              type="number"
              max="50"
              id="numberOfQuestions"
              name="numberOfQuestions"
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
              min="1"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="numberOfQuestions"
              className="leading-7 text-sm text-gray-600"
            >
              Marks Per Questions
            </label>
            <input
              onChange={handleChange}
              value={formData.marks_per_question}
              type="number"
              max="5"
              id="marks_per_question"
              name="marks_per_question"
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
              min="1"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="category"
              className="leading-7 text-sm text-gray-600"
            >
              Category
            </label>
            <CreatableSelect
              id="category"
              name="category"
              onChange={handleCategoryChange}
              value={formData.category}
              options={categories}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
              placeholder="Select or create a category"
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="difficulty"
              className="leading-7 text-sm text-gray-600"
            >
              Difficulty
            </label>
            <CreatableSelect
              id="difficulty"
              name="difficulty"
              onChange={handleDifficultyChange}
              value={difficulties.find((d) => d.value === formData.difficulty)}
              options={difficulties}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
              placeholder="Select difficulty"
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="type" className="leading-7 text-sm text-gray-600">
              Type
            </label>
            <CreatableSelect
              id="type"
              name="type"
              onChange={handleTypeChange}
              value={types.find((t) => t.value === formData.question_type)}
              options={types}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
              placeholder="Select type"
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-gray-700 mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-500 text-white py-2 px-4 rounded"
            >
              {loading ? <ClipLoader size={20} color={'#fff'} />  : 'Submit'}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}

export default AddQuestionSettingsModal;
