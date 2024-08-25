import { useState, useEffect } from 'react';
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';
import AddTeacherModal from '../components/Modals/AddTeacherModal';
import { fetchUsers, deleteUser } from '../services/users.service.js';
import UpdateTeacherModal from '../components/Modals/UpdateTeacherModal.jsx';
import { fetchCourses } from '../services/course.service.js';
import { fetchModules } from '../services/module.service.js';
import axiosInstance from '../api/axios.js';

function Teachers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [allCourses, setAllCourses] = useState([]);
  const [allModules, setAllModules] = useState([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEditModal = (teacher) => {
    if (teacher) {
      setSelectedTeacher(teacher);
      setIsEditModalOpen(true);
    }
  };
  const closeEditModal = () => {
    setSelectedTeacher(null);
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    const loadTeachers = async () => {
      const data = await fetchUsers('teachers');
      setTeachers(data);
    };
    const loadCourses = async () => {
      const data = await fetchCourses();
      setAllCourses(data); // Store original data, not formatted
    };
    const loadModules = async () => {
      const data = await fetchModules();
      setAllModules(data); // Store original data, not formatted
    };
    loadModules();
    loadCourses();
    loadTeachers();
  }, []);

  const handleAddTeacher = (newTeacher) => {
    setTeachers((prevTeachers) => [...prevTeachers, newTeacher]);
  };

  const handleDeleteTeacher = async (teacherId) => {
    await deleteUser(teacherId);
    setTeachers(teachers.filter((teacher) => teacher.user.id !== teacherId));
  };

  const handleUpdateTeacher = (updatedTeacher) => {
    console.log('Updated Teacher is: ', updatedTeacher);

    setTeachers((prevTeachers) =>
      prevTeachers.map((teacher) =>
        teacher.id === updatedTeacher.id ? updatedTeacher : teacher,
      ),
    );
  };

  const updateCourses = async () => {
    const updatedCourses = await fetchCourses();
    setAllCourses(updatedCourses);
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <form className="bg-slate-100 p-3 rounded-lg flex items-center my-5 w-1/2 ml-auto">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent focus:outline-none w-full"
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <div className="w-full mx-auto overflow-auto">
          <table className="table-auto w-full text-left whitespace-no-wrap">
            <thead>
              <tr>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">
                  Full Name
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  Email
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  Courses
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  Modules
                </th>
                <th className="w-10 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="px-4 py-3">
                    {teacher.user.first_name} {teacher.user.last_name}
                  </td>
                  <td className="px-4 py-3">{teacher.user.email}</td>
                  <td className="px-4 py-3 text-lg text-gray-900">
                    {teacher.courses?.length}
                  </td>
                  <td className="px-4 py-3 text-lg text-gray-900">
                    {teacher.modules?.length}
                  </td>
                  <td className="px-4 py-3 flex space-x-2 text-gray-900">
                    <FaEdit
                      onClick={() => openEditModal(teacher)}
                      className="text-green-500 cursor-pointer hover:text-green-600 hover:scale-95 transition duration-150 ease-in-out"
                    />{' '}
                    <FaTrash
                      onClick={() => handleDeleteTeacher(teacher.user.id)}
                      className="text-red-500 cursor-pointer hover:text-red-600 hover:scale-95 transition duration-150 ease-in-out"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex pl-4 mt-4 w-full mx-auto">
          

          <button
            onClick={openModal}
            className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
          >
            Add Teacher
          </button>
        </div>
      </div>

      {/* Add Teacher Modal */}
      <AddTeacherModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddTeacher={handleAddTeacher}
        allCourses={allCourses} // Passing unformatted data
        onCourseUpdate={updateCourses}
      />
      {/* Update Teacher Modal */}
      <UpdateTeacherModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        teacher={selectedTeacher}
        onUpdateTeacher={handleUpdateTeacher}
        allCourses={allCourses} // Passing unformatted data
        onCourseUpdate={updateCourses}
      />
    </section>
  );
}

export default Teachers;
