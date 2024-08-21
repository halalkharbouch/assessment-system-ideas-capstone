import React from 'react';
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';

function Assessments() {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex items-center">
          <h1 className="font-semibold text-lg text-gray-900">
            Active Assessments
          </h1>
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
        </div>

        <div className="w-full mx-auto overflow-auto">
          <table className="table-auto w-full text-left whitespace-no-wrap">
            <thead>
              <tr>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">
                  Created By
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  Assessment Name
                </th>

                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  Course
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  Questions
                </th>
                <th className="w-10 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3">Bilyaminu Bawan Allah</td>
                <td className="px-4 py-3">SEE104</td>
                <td className="px-4 py-3">Software Engineering</td>
                <td className="px-4 py-3 text-lg text-gray-900">60</td>

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

          <button className="ml-auto flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
            Add Assessment
          </button>
        </div>

        <div className="flex items-center border-t border-gray-800 mt-10">
          <h1 className="font-semibold text-lg text-gray-900">
            In-Active Assessments
          </h1>
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
        </div>
        <div className="w-full mx-auto overflow-auto">
          <table className="table-auto w-full text-left whitespace-no-wrap">
            <thead>
              <tr>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">
                  Created By
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  Assessment Name
                </th>

                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  Course
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  Questions
                </th>
                <th className="w-10 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3">Bilyaminu Bawan Allah</td>
                <td className="px-4 py-3">SEE104</td>
                <td className="px-4 py-3">Software Engineering</td>
                <td className="px-4 py-3 text-lg text-gray-900">60</td>

                <td className="px-4 py-3 flex space-x-2 text-gray-900">
                  <FaEdit className="text-green-500 cursor-pointer hover:text-green-600 hover:scale-95 transition duration-150 ease-in-out" />{' '}
                  <FaTrash className="text-red-500 cursor-pointer hover:text-red-600 hover:scale-95 transition duration-150 ease-in-out" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Assessments;
