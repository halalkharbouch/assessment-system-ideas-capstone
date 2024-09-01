import { useEffect, useState } from 'react';
import { updateQuestion } from '../../services/aseessment.service';
import Select from 'react-select';

function UpdateQuestionModal({
  isOpen,
  onClose,
  onUpdateQuestion,
  questionData,
}) {
  const [formData, setFormData] = useState({
    question_text: '',
    options: [],
    marks: 1,
    correct_option: null,
    question_type: 'mcq',
    trueOrFalseOption: null,
  });
  const [optionText, setOptionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(formData);
  
  useEffect(() => {
    if (isOpen && questionData) {
      const correctOption = questionData.choices.find(
        (choice) => choice.is_correct,
      );

      setFormData({
        question_text: questionData.question_text || '',
        options:
          questionData.choices.map((choice) => ({
            label: choice.choice_text,
            value: choice.choice_text,
          })) || [],
        marks: questionData.marks || 1,
        correct_option: correctOption
          ? {
              label: correctOption.choice_text,
              value: correctOption.choice_text,
            }
          : null,
        question_type: questionData.question_type || 'mcq',
        trueOrFalseOption:
          questionData.question_type === 'trueFalse'
            ? questionData.is_true
              ? 'true'
              : 'false'
            : null,
      });
    }
  }, [isOpen, questionData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleOptionChange = (e) => {
    setOptionText(e.target.value);
  };

  const handleAddOption = () => {
    if (optionText.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        options: [
          ...prevData.options,
          { label: optionText, value: optionText },
        ],
      }));
      setOptionText('');
    }
  };

  const handleRemoveOption = (index) => {
    setFormData((prevData) => {
      const updatedOptions = prevData.options.filter((_, i) => i !== index);
      return {
        ...prevData,
        options: updatedOptions,
        correct_option:
          prevData.correct_option?.value === prevData.options[index].value
            ? null
            : prevData.correct_option,
      };
    });
  };

  const handleCorrectOptionChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      correct_option: selectedOption,
    }));
  };

  const handleTrueFalseOptionChange = (option) => {
    setFormData((prevData) => ({ ...prevData, trueOrFalseOption: option }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedData = {
      question_text: formData.question_text,
      question_type: formData.question_type,
      marks: formData.marks,
      choices:
        formData.question_type === 'mcq'
          ? formData.options.map((option) => ({
              choice_text: option.label,
              is_correct: formData.correct_option?.value === option.value,
            }))
          : [],
      is_true:
        formData.question_type === 'trueFalse'
          ? formData.trueOrFalseOption === 'true'
          : null,
    };

    try {
      const response = await updateQuestion(questionData.id, updatedData);
      onUpdateQuestion(response.data);
      onClose();
    } catch (error) {
      console.error(error);
      setError('An error occurred while updating the question.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-medium mb-4">Update Question</h2>

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
            {loading ? 'Loading...' : 'Update Question'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateQuestionModal;
