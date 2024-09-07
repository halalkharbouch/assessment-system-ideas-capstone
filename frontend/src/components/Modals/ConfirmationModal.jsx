import React from 'react';

function ConfirmationModal({ assessment, isOpen, onClose, onContinue }) {
  if (!isOpen) return null;

  const timeLimitString = assessment.time_limit;
  const formattedTimeLimit = parseInt(timeLimitString) / 60;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Assessment Details</h2>
        <p className="mb-2">
          <strong>Total Marks:</strong> {assessment.total_marks}
        </p>
        <p className="mb-2">
          <strong>Passing Marks:</strong> {assessment.passing_marks}
        </p>
        <p className="mb-2">
          <strong>Total Questions:</strong> {assessment.questions.length}
        </p>
        <p className="mb-4">
          <strong>Time Limit:</strong> {formattedTimeLimit} Minutes
        </p>
        <p className="text-red-600 mb-4">
          Please make sure you are ready and have a stable Internet Connection
          before continuing. The timer will start once you press "Continue."
        </p>
        <p className="text-red-600">You progress is not been save!</p>
        <p className="text-red-600">This a proctored assessment </p>
        <p className="text-red-600">
          Switching Tabs may result in your assessment been automatically
          submitted
        </p>
        <p className="text-red-600">
          Switching Windows may result in your assessment been automatically
          submitted
        </p>
        <p className="text-red-600">
          Refreshing the page may result in your assessment been automatically
          submitted
        </p>
        <p className="text-red-600">
          Attempting to visit another page may result in your assessment been
          automatically submitted
        </p>
        <p className="text-green-600 mt-2">God Luck</p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onContinue}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
