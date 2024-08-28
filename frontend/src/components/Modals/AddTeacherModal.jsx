import { useEffect, useState } from 'react';
import { addUser, fetchCurrentUser } from '../../services/users.service.js';
import CreatableSelect from 'react-select/creatable';

function AddTeacherModal({
  isOpen,
  onClose,
  onAddTeacher,
  allCourses,
  onCourseUpdate,
}) {
  const [formData, setFormData] = useState({
    user: {
      first_name: '',
      last_name: '',
      email: '',
    },
    courses: [],
    modules: {},
  });

  console.log('The form data', formData);

  const [loading, setLoading] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Reset form data when the modal opens
      setFormData({
        user: {
          first_name: '',
          last_name: '',
          email: '',
        },
        courses: [],
        modules: {},
      });
      setSelectedCourses([]);
    }
  }, [isOpen]);

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
    }
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
          id: module.value || `new-${courseId}-${index}`, // Ensure a unique fallback key
          name: module.label || `Module ${index + 1}`, // Fallback name if missing
          is_new: module.__isNew__ || false,
        })),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newTeacher = await addUser(formData, 'teacher');
      onAddTeacher(newTeacher);
      await onCourseUpdate();
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
        <h2 className="text-xl font-medium mb-4">Add Teacher</h2>
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
          <label htmlFor="courses" className="leading-7 text-sm text-gray-600">
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
              value={formData.modules[course.value]?.map((module) => ({
                value: module.id,
                label: module.name,
              }))}
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
            onClick={handleSubmit}
            className="bg-indigo-500 text-white py-2 px-4 rounded"
          >
            {loading ? 'Loading...' : 'Add Teacher'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTeacherModal;
