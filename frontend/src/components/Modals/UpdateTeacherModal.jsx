import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { updateUser } from '../../services/users.service.js';
import CreatableSelect from 'react-select/creatable';
import { fetchCourses } from '../../services/course.service.js';

function UpdateTeacherModal({
  isOpen,
  onClose,
  teacher,
  onUpdateTeacher,
  allCourses,
  onCourseUpdate
}) {
  const [formData, setFormData] = useState({
    user: { first_name: '', last_name: '', email: '' },
    courses: [],
    modules: {},
  });
  const [loading, setLoading] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);

  console.log('Selected Courses', selectedCourses);
  console.log('All Courses', allCourses);
  console.log('FormData', formData);

  console.log('Teacher', teacher);

  useEffect(() => {
    if (teacher) {
      setFormData({
        user: {
          first_name: teacher.user.first_name || '',
          last_name: teacher.user.last_name || '',
          email: teacher.user.email || '',
        },
        courses: teacher.courses.map((course) => ({
          id: course.id,
          name: course.name,
          is_new: false,
        })),
        modules: teacher.courses.reduce((acc, course) => {
          // Filter the modules to only include those that the teacher is assigned to
          acc[course.id] = course.modules
            .filter((module) =>
              teacher.modules.some(
                (teacherModule) => teacherModule.id === module.id,
              ),
            )
            .map((module) => ({
              id: module.id,
              name: module.name,
              is_new: false,
            }));
          return acc;
        }, {}),
      });

      setSelectedCourses(
        teacher.courses.map((course) => ({
          value: course.id,
          label: course.name,
        })),
      );
    }
  }, [teacher]);

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

  const handleCourseChange = (selectedCourses) => {
    setSelectedCourses(selectedCourses);
    setFormData((prevData) => ({
      ...prevData,
      courses: selectedCourses.map((course) => ({
        id: course.value || '',
        name: course.label,
        is_new: course.__isNew__ || false,
      })),
      modules: selectedCourses.reduce((acc, course) => {
        acc[course.value] = prevData.modules[course.value] || [];
        return acc;
      }, {}),
    }));
  };

  const handleModuleChange = (courseId, selectedModules) => {
    setFormData((prevData) => ({
      ...prevData,
      modules: {
        ...prevData.modules,
        [courseId]: selectedModules.map((module, index) => ({
          id: module.value || `new-${courseId}-${index}`,
          name: module.label || `Module ${index + 1}`,
          is_new: module.__isNew__ || false,
        })),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedTeacher = await updateUser(formData, teacher.id, 'teacher');
      onUpdateTeacher(updatedTeacher);

      await onCourseUpdate()

      onClose();
    } catch (error) {
      console.error('Failed to update teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-medium mb-4">Update Teacher</h2>
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
              htmlFor="courses"
              className="leading-7 text-sm text-gray-600"
            >
              Courses
            </label>
            <CreatableSelect
              isMulti
              options={allCourses.map((course) => ({
                value: course.id,
                label: course.name,
              }))}
              onChange={handleCourseChange}
              value={selectedCourses}
              placeholder="Select courses or add"
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
            />
          </div>
          {selectedCourses.map((course) => (
            <div className="mb-4" key={course.value}>
              <label
                htmlFor={`modules-${course.value}`}
                className="leading-7 text-sm text-gray-600"
              >
                {course.label} Modules
              </label>
              <CreatableSelect
                isMulti
                options={
                  allCourses
                    .find((c) => c.id === course.value)
                    ?.modules.map((module) => ({
                      value: module.id,
                      label: module.name,
                    })) || []
                }
                onChange={(selectedModules) =>
                  handleModuleChange(course.value, selectedModules)
                }
                value={
                  formData.modules[course.value]?.map((module) => ({
                    value: module.id,
                    label: module.name,
                  })) || []
                }
                placeholder="Select modules or add"
                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
              />
            </div>
          ))}

          <div className="flex justify-end">
            <button className="text-gray-700 mr-2" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-500 text-white py-2 px-4 rounded"
            >
              {loading ? 'Loading...' : 'Update Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

UpdateTeacherModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateTeacher: PropTypes.func.isRequired,
  teacher: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.number,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      email: PropTypes.string,
    }).isRequired,
    courses: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        modules: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
          }),
        ),
      }),
    ),
    modules: PropTypes.arrayOf(PropTypes.string),
  }),
  allCourses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      modules: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
        }),
      ),
    }),
  ).isRequired,
};

export default UpdateTeacherModal;
