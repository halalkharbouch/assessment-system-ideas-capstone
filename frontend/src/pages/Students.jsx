import { useState, useEffect } from 'react';
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';
import AddStudentModal from '../components/Modals/AddStudentModal';
import { fetchUsers, deleteUser } from '../services/users.service.js';
import UpdateStudentModal from '../components/Modals/UpdateStudentModal.jsx';
import { fetchCourses } from '../services/course.service.js';
function Students() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [allCourses, setAllCourses] = useState([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEditModal = (student) => {
    if (student) {
      setSelectedStudent(student);
      setIsEditModalOpen(true);
    }
  };
  const closeEditModal = () => {
    setSelectedStudent(null);
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    const loadStudents = async () => {
      const data = await fetchUsers('students');
      setStudents(data);
    };
    const loadCourses = async () => {
      const data = await fetchCourses();
      const formattedCourses = data.map((course) => ({
        value: course.id,
        label: course.name,
      }));
      setAllCourses(formattedCourses);
    };
    loadCourses();
    loadStudents();
  }, []);

  const handleAddStudent = (newStudent) => {
    setStudents([...students, newStudent]);
  };

  const handleDeleteStudent = async (studentId) => {
    await deleteUser(studentId);
    setStudents(students.filter((student) => student.user.id !== studentId));
  };

  const handleUpdateStudent = (updatedStudent) => {
    console.log('Updated Student is: ', updatedStudent);

    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student,
      ),
    );
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
                  Admission No
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  Course
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  GPA
                </th>
                <th className="w-10 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-4 py-3">
                    {student.user.first_name} {student.user.last_name}
                  </td>
                  <td className="px-4 py-3">{student.user.email}</td>
                  <td className="px-4 py-3">{student.admission_number}</td>
                  <td className="px-4 py-3 text-lg text-gray-900">
                    {student.enrolled_course?.name ?? 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-lg text-gray-900">3.7</td>
                  <td className="px-4 py-3 flex space-x-2 text-gray-900">
                    <FaEdit
                      onClick={() => openEditModal(student)}
                      className="text-green-500 cursor-pointer hover:text-green-600 hover:scale-95 transition duration-150 ease-in-out"
                    />{' '}
                    <FaTrash
                      onClick={() => handleDeleteStudent(student.user.id)}
                      className="text-red-500 cursor-pointer hover:text-red-600 hover:scale-95 transition duration-150 ease-in-out"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex pl-4 mt-4 w-full mx-auto">
          <a className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0 cursor-pointer">
            Import Students
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-4 h-4 ml-2"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a>

          <button
            onClick={openModal}
            className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
          >
            Add Student
          </button>
        </div>
      </div>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddStudent={handleAddStudent}
        allCourses={allCourses}
      />
      {/* Add Student Modal */}
      <UpdateStudentModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        student={selectedStudent}
        onUpdateStudent={handleUpdateStudent}
        allCourses={allCourses}
      />
    </section>
  );
}

export default Students;
