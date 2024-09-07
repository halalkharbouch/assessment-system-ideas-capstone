import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';

function AddAssessmentModal({ isOpen, onClose, onCreate }) {
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

  console.log(formData);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        module: null,
        course: null,
        time_limit: 60,
        total_marks: 100,
        passing_marks: 90,
      });
    }
  }, [isOpen, currentUser.id]);

  // Prepare options from currentUser data
  const courseOptions =
    currentUser?.courses.map((course) => ({
      value: course.id,
      label: course.name,
    })) || [];

  const handleCourseChange = (selectedOption) => {
    setSelectedCourse(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      course: selectedOption ? selectedOption.value : null,
    }));

    // Reset module selection when course changes
    setSelectedModule(null);
  };

  const handleModuleChange = (selectedOption) => {
    console.log(selectedOption);

    setSelectedModule(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      module: selectedOption ? selectedOption.value : null,
      module_is_new: selectedOption && selectedOption.__isNew__ ? true : false,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const dataToSubmit = {
      ...formData,
      start_date: startDateTime,
      end_date: endDateTime,
      created_by: currentUser.id,
    };
    try {
      onCreate(dataToSubmit);
    } catch (error) {
      setError("An error occurred while adding the assessment.");
      console.error(error);
    } finally {
      setLoading(false);
    }
    onCreate(dataToSubmit);
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
            <Select
              id="course"
              name="course"
              isCreatable={false} // Disable creation of new courses
              value={selectedCourse}
              onChange={handleCourseChange}
              options={courseOptions}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
              placeholder="Select or add a course"
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="module" className="leading-7 text-sm text-gray-600">
              Module
            </label>
            <CreatableSelect
              id="module"
              name="module"
              value={selectedModule}
              onChange={handleModuleChange}
              options={
                selectedCourse
                  ? currentUser.courses
                      .find((c) => c.id === selectedCourse.value)
                      ?.modules.map((module) => ({
                        value: module.id,
                        label: module.name,
                      })) || []
                  : []
              }
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
              placeholder="Select or add a module"
              isDisabled={!selectedCourse}
              isCreatable={true} // Allow creation of new modules
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
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color={'#fff'} /> : 'Add Assessment'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}

export default AddAssessmentModal;
