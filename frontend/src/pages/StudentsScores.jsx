import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../api/axios';
import Loading from '../components/Loading';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAssessment } from '../services/aseessment.service';
import { stringify } from 'postcss';

function StudentsScores() {
  const { assessmentId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  console.log('AA', assessment);
  console.log('results', results);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Filter results based on search query
  const filteredResults = results.filter(
    (result) =>
      result.student.user.first_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      result.student.user.last_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      result.student.admission_number
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
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

  useEffect(() => {
    const loadAssessment = async () => {
      try {
        const data = await fetchAssessment(assessmentId);
        setAssessment(data);
        setResults(data.results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [assessmentId]);

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
                  First Name
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  Last Name
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  Admission Number
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {currentResults.map((result) => (
                <tr key={result.id}>
                  <td className="px-4 py-3">
                    {result.student.user.first_name}
                  </td>
                  <td className="px-4 py-3">{result.student.user.last_name}</td>
                  <td className="px-4 py-3">
                    {result.student.admission_number}
                  </td>
                  <td className="px-4 py-3 font-bold text-lg text-gray-900">
                    {result.score}
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

export default StudentsScores;
