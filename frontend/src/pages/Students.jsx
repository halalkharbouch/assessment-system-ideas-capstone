import { useState, useEffect } from 'react';
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';
import AddStudentModal from '../components/Modals/AddStudentModal'; // Import the modal component

function Students() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/students/');
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
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
              <tr>
                <td className="px-4 py-3">Bilyaminu Bawan Allah</td>
                <td className="px-4 py-3">binyaminbgod@gmail.com</td>
                <td className="px-4 py-3">IDEAS/24/29087</td>
                <td className="px-4 py-3 text-lg text-gray-900">
                  Software Engineering
                </td>
                <td className="px-4 py-3 text-lg text-gray-900">3.7</td>
                <td className="px-4 py-3 flex space-x-2 text-gray-900">
                  <FaEdit className="text-green-500 cursor-pointer hover:text-green-600 hover:scale-95 transition duration-150 ease-in-out" />{' '}
                  <FaTrash className="text-red-500 cursor-pointer hover:text-red-600 hover:scale-95 transition duration-150 ease-in-out" />
                </td>
              </tr>
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
      <AddStudentModal isOpen={isModalOpen} onClose={closeModal} />
    </section>
  );
}

export default Students;
