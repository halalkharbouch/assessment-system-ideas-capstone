import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { addUser } from '../../services/users.service.js';

function AddStudentModal({ isOpen, onClose, onAddStudent, allCourses }) {
  const [formData, setFormData] = useState({
    user: {
      first_name: '',
      last_name: '',
      email: '',
    },
    admission_number: '',
    enrolled_course: null, // Initially null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['first_name', 'last_name', 'email'].includes(name)) {
      setFormData({
        ...formData,
        user: {
          ...formData.user,
          [name]: value,
        },
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleCourseChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      enrolled_course: selectedOption, // selectedOption will be an object
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newStudent = await addUser(formData, 'student');
      onAddStudent(newStudent);
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-medium mb-4">Add Student</h2>
        <div className="mb-4">
          <label htmlFor="name" className="leading-7 text-sm text-gray-600">
            First Name
          </label>
          <input
            onChange={handleChange}
            value={formData.user.first_name}
            type="text"
            id="name"
            name="first_name"
            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="leading-7 text-sm text-gray-600">
            Last Name
          </label>
          <input
            onChange={handleChange}
            value={formData.user.last_name}
            type="text"
            id="name"
            name="last_name"
            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="leading-7 text-sm text-gray-600">
            Email
          </label>
          <input
            onChange={handleChange}
            value={formData.user.email}
            type="email"
            id="email"
            name="email"
            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="admission"
            className="leading-7 text-sm text-gray-600"
          >
            Admission No
          </label>
          <input
            onChange={handleChange}
            value={formData.admission_number}
            type="text"
            id="admission"
            name="admission_number"
            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="course" className="leading-7 text-sm text-gray-600">
            Course
          </label>
          <CreatableSelect
            id="course"
            name="enrolled_course"
            onChange={handleCourseChange}
            value={formData.enrolled_course}
            options={allCourses}
            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
            placeholder="Select or create a course"
          />
        </div>
        <div className="flex justify-end">
          <button className="text-gray-700 mr-2" onClick={onClose}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-indigo-500 text-white py-2 px-4 rounded"
          >
            {loading ? 'Loading...' : 'Add Student'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddStudentModal;
