import { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import axiosInstance from '../../api/axios';
import { addQuestion } from '../../services/aseessment.service';

function AddQuestionModal({
  isOpen,
  onClose,
  onAddQuestion,
  assessmentId,
}) {
  const [formData, setFormData] = useState({
    question_text: '',
    options: [],
    marks: 1,
    correct_option: null,
    question_type: 'mcq', // Default question type
    trueOrFalseOption: null,
  });
  const [optionText, setOptionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Reset form data when the modal opens
      setFormData({
        question_text: '',
        options: [],
        marks: 1,
        correct_option: null,
        question_type: 'mcq', // Default question type
        trueOrFalseOption: null,
      });
      setOptionText('');
    }
  }, [isOpen]);

  console.log('Add question form data', formData);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOptionChange = (e) => {
    setOptionText(e.target.value);
  };

  const handleAddOption = () => {
    if (optionText.trim() === '') return;
    setFormData((prevData) => ({
      ...prevData,
      options: [...prevData.options, { label: optionText, value: optionText }],
    }));
    setOptionText('');
  };

  const handleCorrectOptionChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      correct_option: selectedOption,
    }));
  };

  const handleTrueFalseOptionChange = (option) => {
    setFormData((prevData) => ({
      ...prevData,
      trueOrFalseOption: option,
    }));
  };

  const handleRemoveOption = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      options: prevData.options.filter((_, index) => index !== indexToRemove),
      correct_option:
        prevData.correct_option?.value === prevData.options[indexToRemove].value
          ? null
          : prevData.correct_option,
    }));
  };

  const handleQuestionTypeChange = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      question_type: type,
      options: [], // Clear options if switching to True/False
      correct_option: null,
      trueOrFalseOption: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await addQuestion(assessmentId, formData);
      onAddQuestion(response.data.question);
      onClose();
    } catch (error) {
      console.error(error);
      setError('An error occurred while adding the question.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-medium mb-4">Add Question</h2>

        <div className="mb-4 flex justify-around">
          <button
            onClick={() => handleQuestionTypeChange('mcq')}
            className={`py-2 px-4 rounded ${
              formData.question_type === 'mcq'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            MCQ
          </button>
          <button
            onClick={() => handleQuestionTypeChange('trueFalse')}
            className={`py-2 px-4 rounded ${
              formData.question_type === 'trueFalse'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            True/False
          </button>
        </div>

        <div className="mb-4">
          <label
            htmlFor="question_text"
            className="leading-7 text-sm text-gray-600"
          >
            Question Text
          </label>
          <input
            onChange={handleChange}
            value={formData.question_text}
            type="text"
            id="question_text"
            name="question_text"
            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="question_text"
            className="leading-7 text-sm text-gray-600"
          >
            Marks
          </label>
          <input
            onChange={handleChange}
            value={formData.marks}
            type="number"
            id="marks"
            name="marks"
            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
          />
        </div>

        {formData.question_type === 'mcq' && (
          <>
            <div className="mb-4">
              <label
                htmlFor="option"
                className="leading-7 text-sm text-gray-600"
              >
                Option
              </label>
              <input
                onChange={handleOptionChange}
                value={optionText}
                type="text"
                id="option"
                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
              />
              <button
                onClick={handleAddOption}
                className="bg-indigo-500 text-white py-1 px-4 rounded mt-2"
              >
                Add Option
              </button>
            </div>

            <div className="mb-4">
              <label
                htmlFor="correct_option"
                className="leading-7 text-sm text-gray-600"
              >
                Correct Option
              </label>
              <Select
                id="correct_option"
                name="correct_option"
                onChange={handleCorrectOptionChange}
                value={formData.correct_option}
                options={formData.options}
                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300"
                placeholder="Select the correct option"
              />
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-700">Options</h3>
              <ul className="pl-5">
                {formData.options.map((option, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center text-gray-600 relative"
                  >
                    <span className="before:content-['\2022'] before:absolute before:left-0 before:text-gray-700 before:mr-2 before:text-xl ml-6">
                      {option.label}
                    </span>
                    <button
                      onClick={() => handleRemoveOption(index)}
                      className="text-red-500 ml-2"
                    >
                      Clear
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {formData.question_type === 'trueFalse' && (
          <div className="mb-4 flex justify-around">
            <button
              onClick={() => handleTrueFalseOptionChange('true')}
              className={`py-2 px-4 rounded ${
                formData.trueOrFalseOption === 'true'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              True
            </button>
            <button
              onClick={() => handleTrueFalseOptionChange('false')}
              className={`py-2 px-4 rounded ${
                formData.trueOrFalseOption === 'false'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              False
            </button>
          </div>
        )}

        <div className="flex justify-end">
          <button className="text-gray-700 mr-2" onClick={onClose}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-indigo-500 text-white py-2 px-4 rounded"
          >
            {loading ? 'Loading...' : 'Add Question'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddQuestionModal;
