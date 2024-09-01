import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function AssessmentSubmitted() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/my-grades'); // Redirect to grades or another page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <FaCheckCircle className="text-green-500 text-6xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Assessment Submitted</h2>
        <p className="text-gray-600 mb-6">
          Your assessment has been submitted successfully. Thank you!
        </p>
        <button
          className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
          onClick={handleRedirect}
        >
          Go to My Grades
        </button>
      </div>
    </div>
  );
}

export default AssessmentSubmitted;
