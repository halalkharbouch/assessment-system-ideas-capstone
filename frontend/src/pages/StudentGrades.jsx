import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../api/axios';
import Loading from '../components/Loading';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function StudentGrades() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axiosInstance.get('/api/results/user/');
        setResults(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleViewClick = (gradeId) => {
    navigate(`/grade-detail/${gradeId}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Filter results based on search query
  const filteredResults = results.filter(
    (result) =>
      result.assessment.course
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      result.assessment.module
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  // Pagination logic
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(
    indexOfFirstResult,
    indexOfLastResult,
  );

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <form className="bg-slate-100 p-3 rounded-lg flex items-center my-5 w-1/2 ml-auto">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent focus:outline-none w-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="button">
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <div className="w-full mx-auto overflow-auto">
          <table className="table-auto w-full text-left whitespace-no-wrap">
            <thead>
              <tr>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">
                  Course
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  Module
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  Questions
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  Score
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  Passing Marks
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"></th>
              </tr>
            </thead>
            <tbody>
              {currentResults.map((result) => (
                <tr key={result.id}>
                  <td className="px-4 py-3">{result.assessment.course}</td>
                  <td className="px-4 py-3">{result.assessment.module}</td>
                  <td className="px-4 py-3">
                    {result.assessment.questions.length}
                  </td>
                  <td className="px-4 py-3 font-bold text-lg text-gray-900">
                    {result.score} / {result.assessment.total_marks}
                  </td>
                  <td className="px-4 py-3 text-lg text-gray-900">
                    {result.assessment.passing_marks}
                  </td>
                  <td className="px-4 py-3 text-lg text-gray-900">
                    <button
                      onClick={() => handleViewClick(result.id)}
                      className="text-indigo-500 inline-flex items-center cursor-pointer"
                    >
                      View
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
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center my-5">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-1 mx-1 border rounded ${
                currentPage === index + 1
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StudentGrades;
