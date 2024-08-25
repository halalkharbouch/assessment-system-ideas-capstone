import { useState } from 'react';
import DatePicker from 'react-datepicker';
import CreatableSelect from 'react-select/creatable';
import 'react-datepicker/dist/react-datepicker.css';
import CustomInput from '../CustomInput';

function AddAssessmentModal({ isOpen, onClose }) {
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    module: null,
    course: null,
    created_by: null,
    time_limit: 60,
    total_marks: 100,
    passing_marks: 90,
  });

  const handleSubmit = async () => {
    // add start date and end date to form data before submitting
    await setFormData((prevData) => ({
      ...prevData,
      start_date: startDateTime,
      end_date: endDateTime,
    }));

    console.log(formData);

    // Add your API call here
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-medium mb-4">Add Assessment</h2>
        <div className="mb-4">
          <label htmlFor="name" className="leading-7 text-sm text-gray-600">
            Assessment Name
          </label>
          <input
            value={formData.name}
            onChange={handleChange}
            type="text"
            id="name"
            name="name"
            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="leading-7 text-sm text-gray-600">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={handleChange}
            id="description"
            name="description"
            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
          />
        </div>
        <div className="flex mb-4 space-x-4">
          <div className="w-1/2">
            <label htmlFor="course" className="leading-7 text-sm text-gray-600">
              Course
            </label>
            <CreatableSelect
              id="course"
              name="course"
              //onChange={handleCourseChange}
              //value={formData.enrolled_course}
              options={{ label: 'test', value: 'test' }}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
              placeholder="Select a course"
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="module" className="leading-7 text-sm text-gray-600">
              Module
            </label>
            <CreatableSelect
              id="module"
              name="module"
              //onChange={handleCourseChange}
              //value={formData.enrolled_course}
              options={{ label: 'test', value: 'test' }}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
              placeholder="Select a module"
            />
          </div>
        </div>

        <div className="flex mb-4 space-x-4">
          <div className="w-1/2">
            <label
              htmlFor="startDateTime"
              className="block leading-7 text-sm text-gray-600"
            >
              Start Date and Time
            </label>
            <DatePicker
              id="startDateTime"
              selected={startDateTime}
              onChange={(date) => setStartDateTime(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700 leading-8"
            />
          </div>
          <div className="w-1/2">
            <label
              htmlFor="endDateTime"
              className="block leading-7 text-sm text-gray-600"
            >
              End Date and Time
            </label>
            <DatePicker
              id="endDateTime"
              selected={endDateTime}
              onChange={(date) => setEndDateTime(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={startDateTime}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700 leading-8"
            />
          </div>
        </div>

        <div className="flex mb-4 space-x-4">
          <div className="w-1/3">
            <label
              htmlFor="totalMarks"
              className="leading-7 text-sm text-gray-600"
            >
              Total Marks
            </label>
            <input
              type="number"
              id="total_marks"
              name="total_marks"
              value={formData.total_marks}
              onChange={handleChange}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
            />
          </div>
          <div className="w-1/3">
            <label
              htmlFor="passingMarks"
              className="leading-7 text-sm text-gray-600"
            >
              Passing Marks
            </label>
            <input
              type="number"
              id="passing_marks"
              name="passing_marks"
              value={formData.passing_marks}
              onChange={handleChange}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
            />
          </div>
          <div className="w-1/3">
            <label
              htmlFor="timeLimit"
              className="leading-7 text-sm text-gray-600"
            >
              Time Limit (minutes)
            </label>
            <input
              type="number"
              id="time_limit"
              name="time_limit"
              value={formData.time_limit}
              onChange={handleChange}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button className="text-gray-700 mr-2" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-indigo-500 text-white py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            Add Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddAssessmentModal;
