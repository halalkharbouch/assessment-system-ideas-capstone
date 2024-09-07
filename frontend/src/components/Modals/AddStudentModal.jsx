import { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { addUser } from '../../services/users.service.js';
import ClipLoader from 'react-spinners/ClipLoader.js';

function AddStudentModal({ isOpen, onClose, onAddStudent, allCourses }) {
  const [formData, setFormData] = useState({
    user: {
      first_name: '',
      last_name: '',
      email: '',
      password: 'winter50%', // Make sure to add a field for password
    },
    admission_number: '',
    enrolled_course: null, // Initially null
    modules: [], // Add this field if you're handling modules
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('Add student form data', formData);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        user: {
          first_name: '',
          last_name: '',
          email: '',
          password: 'winter50%', // Make sure to add a field for password
        },
        admission_number: '',
        enrolled_course: null, // Initially null
        modules: [], // Add this field if you're handling modules
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['first_name', 'last_name', 'email', 'password'].includes(name)) {
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
    // Assuming selectedOption will have { value, label, isNew }
    setFormData((prevData) => ({
      ...prevData,
      enrolled_course: selectedOption
        ? {
            value: selectedOption.value,
            label: selectedOption.label,
            is_new: selectedOption.isNew || false, // Add isNew flag
          }
        : null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newStudent = await addUser(formData, 'student');
      onAddStudent(newStudent.data.user);
      onClose();
    } catch (error) {
      console.log(error);
      setError('An error occurred while adding the student.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-medium mb-4">Add Student</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="first_name"
              className="leading-7 text-sm text-gray-600"
            >
              First Name
            </label>
            <input
              onChange={handleChange}
              value={formData.user.first_name}
              type="text"
              id="first_name"
              name="first_name"
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="last_name"
              className="leading-7 text-sm text-gray-600"
            >
              Last Name
            </label>
            <input
              onChange={handleChange}
              value={formData.user.last_name}
              type="text"
              id="last_name"
              name="last_name"
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="enrolled_course"
              className="leading-7 text-sm text-gray-600"
            >
              Course
            </label>
            <CreatableSelect
              id="enrolled_course"
              name="enrolled_course"
              onChange={handleCourseChange}
              value={formData.enrolled_course}
              options={allCourses}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
              placeholder="Select or create a course"
              getOptionLabel={(option) => option.label || option.name}
              getOptionValue={(option) => option.value || option.id}
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
              required
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="leading-7 text-sm text-gray-600"
            >
              Password
            </label>
            <input
              onChange={handleChange}
              value={formData.user.password}
              type="password"
              id="password"
              name="password"
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="admission_number"
              className="leading-7 text-sm text-gray-600"
            >
              Admission No
            </label>
            <input
              onChange={handleChange}
              value={formData.admission_number}
              type="text"
              id="admission_number"
              name="admission_number"
              required
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
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
              {loading ? <ClipLoader size={20} color={'#fff'} />  : 'Add Student'}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}

export default AddStudentModal;
