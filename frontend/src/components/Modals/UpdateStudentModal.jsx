import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { updateUser } from '../../services/users.service.js';
import { fetchCourses } from '../../services/course.service.js';
import CreatableSelect from 'react-select/creatable';
import ClipLoader from 'react-spinners/ClipLoader.js';

function UpdateStudentModal({
  isOpen,
  onClose,
  student,
  onUpdateStudent,
  allCourses,
}) {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    user: {
      first_name: '',
      last_name: '',
      email: '',
    },
    admission_number: '',
    enrolled_course: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    if (allCourses) setCourses(allCourses);
    if (student) {
      setFormData({
        user: {
          first_name: student.user.first_name || '',
          last_name: student.user.last_name || '',
          email: student.user.email || '',
        },
        admission_number: student.admission_number || '',
        enrolled_course: student.enrolled_course || null,
      });

      if (student.enrolled_course) {
        setSelectedCourses({
          value: student.enrolled_course.id,
          label: student.enrolled_course.name,
        });
      }
    }
  }, [student, allCourses]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      user: {
        ...prevData.user,
        [name]: value,
      },
    }));
  };

  const handleCourseChange = (selectedOption) => {
    setSelectedCourses(selectedOption);

    console.log(selectedOption);

    setFormData((prevData) => ({
      ...prevData,
      enrolled_course: selectedOption
        ? {
            id: selectedOption.value,
            name: selectedOption.label,
            is_new: selectedOption.__isNew__ || false,
          }
        : null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newStudent = await updateUser(formData, student.id, 'student');
      onUpdateStudent(newStudent);
      onClose();
    } catch (error) {
      setError('An error occurred while updating the student.');
      console.error('Failed to update student:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-medium mb-4">Update Student</h2>
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
              isClearable
              options={courses}
              value={selectedCourses}
              onChange={handleCourseChange}
              className="mb-4 w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
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
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
            />
          </div>

          <div className="flex justify-end">
            <button
              className="text-gray-700 mr-2"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-500 text-white py-2 px-4 rounded"
            >
              {loading ? <ClipLoader size={20} color={'#fff'} />  : 'Update Student'}
            </button>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
}

UpdateStudentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateStudent: PropTypes.func.isRequired,
  student: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      email: PropTypes.string,
    }).isRequired,
    admission_number: PropTypes.string,
    enrolled_course: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  }),
};

export default UpdateStudentModal;
