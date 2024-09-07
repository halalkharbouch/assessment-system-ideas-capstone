import { useState } from 'react';
import Papa from 'papaparse';
import Loading from '../Loading';
import { addUser } from '../../services/users.service.js';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
function ImportStudentsModal({ isOpen, onClose, allCourses, onAddStudents }) {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedCourseHeader, setSelectedCourseHeader] = useState('');
  const [distinctCourses, setDistinctCourses] = useState([]);
  const [courseMappings, setCourseMappings] = useState({});
  const [error, setError] = useState(null);
  const [fieldMappings, setFieldMappings] = useState({
    first_name: '',
    last_name: '',
    email: '',
    admission_number: '',
  });
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          const data = result.data;
          setCsvData(data);
          setHeaders(Object.keys(data[0]));
        },
      });
    }
  };

  const handleCourseHeaderSelect = (e) => {
    const header = e.target.value;
    setSelectedCourseHeader(header);

    const courses = Array.from(new Set(csvData.map((row) => row[header])));
    setDistinctCourses(courses);
  };

  const handleCourseMappingChange = (csvCourse, selectedCourseId) => {
    setCourseMappings((prevMappings) => ({
      ...prevMappings,
      [csvCourse]: selectedCourseId,
    }));
  };

  const handleFieldMappingChange = (field, csvHeader) => {
    setFieldMappings((prevMappings) => ({
      ...prevMappings,
      [field]: csvHeader,
    }));
  };

  const handleImport = async () => {
    setLoading(true);
    // Validate field mappings
    if (
      !fieldMappings.first_name ||
      !fieldMappings.last_name ||
      !fieldMappings.email ||
      !fieldMappings.admission_number
    ) {
      toast.error('Please map all required fields.');
      return;
    }

    if (!selectedCourseHeader) {
      toast.error('Please select a course header.');
      return;
    }

    if (Object.values(courseMappings).some((courseId) => !courseId)) {
      toast.error('Please map all courses to existing courses.');
      return;
    }

    const updatedData = csvData
      .filter((row) => Object.keys(row).some((key) => row[key])) // Filter out empty rows
      .map((row) => ({
        first_name: row[fieldMappings.first_name],
        last_name: row[fieldMappings.last_name],
        email: row[fieldMappings.email],
        admission_number: row[fieldMappings.admission_number],
        courseId: parseInt(courseMappings[row[selectedCourseHeader]]),
      }));
    const dataToSubmit = {
      students: updatedData,
      importing_students: true,
    };

    console.log('Data To Submit', dataToSubmit);

    console.log('Imported Data', updatedData);
    try {
      const response = await addUser(dataToSubmit, 'student');

      onAddStudents(response.data.users);
      toast.success('Students imported successfully');
    } catch (error) {
      console.log(error);
      toast.error('Failed to import students');
      setError("An error occurred while importing the students.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
        <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Import Students</h2>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="mb-4"
          />

          {headers.length > 0 && (
            <>
              <label>Select Course Header</label>
              <select
                value={selectedCourseHeader}
                onChange={handleCourseHeaderSelect}
                className="mb-4"
              >
                <option value="">Select Header</option>
                {headers.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </>
          )}

          {distinctCourses.length > 0 && (
            <div>
              <h3 className="font-bold mb-2">
                Map Courses in CSV to Existing Courses
              </h3>
              {distinctCourses.map((course) => (
                <div key={course} className="flex mb-2">
                  <span className="w-1/2">{course}</span>
                  <select
                    onChange={(e) =>
                      handleCourseMappingChange(course, e.target.value)
                    }
                    className="w-1/2"
                  >
                    <option value="">Select Course</option>
                    {allCourses.map((dbCourse) => (
                      <option key={dbCourse.value} value={dbCourse.value}>
                        {dbCourse.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {headers.length > 0 && (
            <>
              <h3 className="font-bold mb-2">Map CSV Headers to Fields</h3>
              {Object.keys(fieldMappings).map((field) => (
                <div key={field} className="flex mb-2">
                  <span className="w-1/2">{field}</span>
                  <select
                    onChange={(e) =>
                      handleFieldMappingChange(field, e.target.value)
                    }
                    className="w-1/2"
                  >
                    <option value="">Select CSV Header</option>
                    {headers.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </>
          )}

          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="text-red-500 bg-white border-2 border-red-500 px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={handleImport}
              className="bg-indigo-500 text-white px-4 py-2 rounded"
            >
              {loading ? <ClipLoader size={20} color={'#fff'} /> : 'Import'}
            </button>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    )
  );
}

export default ImportStudentsModal;
