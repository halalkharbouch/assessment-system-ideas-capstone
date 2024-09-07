import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import axiosInstance from '../api/axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import {
  LineChart,
  Line
} from 'recharts';
import {
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'; // Import PieChart and Pie
import { toast } from 'react-toastify';

const StudentPerformance = () => {
  const [data, setData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [scoreTrendData, setScoreTrendData] = useState([]);
  const [passRateData, setPassRateData] = useState([]);
  const [stackedData, setStackedData] = useState([]); // State for stacked bar chart data
  const [radarData, setRadarData] = useState([]); // State for radar chart data

  useEffect(() => {
    // Fetch courses
    axiosInstance
      .get('/api/courses/')
      .then((response) => response.data)
      .then((data) => setCourses(data))
      .catch((error) => console.error('Error fetching courses:', error));
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
        setLoading(true);
        try {
          const courseQuery = selectedCourse ? `?course=${selectedCourse}` : '';
          const [studentResponse, trendResponse, passRateResponse, performanceResponse, radarResponse] = await Promise.all([
            axiosInstance.get(`/api/users/students/${courseQuery}`),
            axiosInstance.get(`/api/score-trends/${courseQuery}`),
            axiosInstance.get(`/api/pass-rate/${courseQuery}`),
            axiosInstance.get(`/api/assessment-performance/${courseQuery}`),
            axiosInstance.get(`/api/radar-data/${courseQuery}`) // Fetch radar data
          ]);
          setData(studentResponse.data);
          setScoreTrendData(trendResponse.data);
          setPassRateData(passRateResponse.data);
          setStackedData(performanceResponse.data);
          setRadarData(radarResponse.data); // Set radar data
        } catch (error) {
          toast.error('Error fetching data:', error);
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

    fetchStudents();
  }, [selectedCourse]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: (row) => `${row.user.first_name} ${row.user.last_name}`, // Concatenate first and last names
        Cell: ({ value }) => value,
      },
      {
        Header: 'Assessments Taken',
        accessor: 'results.length', // This should be a count of results
      },
      {
        Header: 'Average Score',
        accessor: 'average_score',
      },
      {
        Header: 'Highest Score',
        accessor: 'highest_score',
      },
      {
        Header: 'Lowest Score',
        accessor: 'lowest_score',
      },
      {
        Header: 'Pass Rate (%)',
        accessor: 'pass_rate',
      },
    ],
    [],
  );

  // Filter data to only include students with results
  const filteredData = data.filter(student => student.results && student.results.length > 0);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: filteredData, // Use the filtered data here
    });

  // Prepare data for the bar chart
  const chartData = filteredData.map(student => ({
    name: `${student.user.first_name} ${student.user.last_name}`,
    averageScore: student.average_score,
    highestScore: student.highest_score,
    lowestScore: student.lowest_score,
  }));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Student Performance</h2>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <label
          htmlFor="course-select"
          className="block text-gray-600 font-semibold mb-2"
        >
          Filter by Course:
        </label>
        <select
          id="course-select"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <svg
            className="animate-spin h-12 w-12 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 016-7.75V2a10 10 0 10-2 0v2.25A8 8 0 014 12z"
            />
          </svg>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="mb-8">
          <table
            {...getTableProps()}
            className="min-w-full bg-white border border-gray-200"
          >
            <thead className="bg-gray-100">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className="py-2 px-4 text-left text-gray-600 font-semibold"
                      key={column.id}
                    >
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={row.id || row.index}>
                    {row.cells.map((cell) => (
                      <td
                        key={cell.id || cell.index}
                        {...cell.getCellProps()}
                        className="py-2 px-4 border-t border-gray-200"
                      >
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Bar Chart */}
      {!loading && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Student Scores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="averageScore" fill="#8884d8" />
              <Bar dataKey="highestScore" fill="#82ca9d" />
              <Bar dataKey="lowestScore" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Score Trends */}
      {!loading && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Score Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={scoreTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Pass Rates */}
      {!loading && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Pass Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={passRateData}
                dataKey="value"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                <Cell key="1" fill="#82ca9d" />
                <Cell key="2" fill="#ffc658" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stacked Bar Chart */}
      {!loading && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Assessment Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stackedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {stackedData.length > 0 && Object.keys(stackedData[0]).filter(key => key !== 'name').map((key, index) => (
                <Bar key={key} dataKey={key} stackId="a" fill={index % 2 === 0 ? '#8884d8' : '#82ca9d'} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

       {/* Radar Chart */}
       {!loading && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Radar Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Student"
                dataKey="score"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default StudentPerformance;
