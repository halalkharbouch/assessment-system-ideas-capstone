import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from './Modals/ConfirmationModal';
function AssessmentCardForStudent({
  title,
  icon,
  assessment,
  courseName,
  moduleName,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const formattedStartDate = format(
    new Date(assessment.start_date),
    'dd MMM yyyy',
  );
  const formattedEndDate = format(new Date(assessment.end_date), 'dd MMM yyyy');
  const formattedStartTime = format(new Date(assessment.start_date), 'h:mm a');
  const formattedEndTime = format(new Date(assessment.end_date), 'h:mm a');

  const timeLimitString = assessment.time_limit;
  const formattedTimeLimit = parseInt(timeLimitString) / 60;

  console.log('assessment', assessment);

  const handleViewAssessment = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleContinue = () => {
    setIsModalOpen(false);
    navigate(`/take-assessment/${assessment.id}`);
  };

  return (
    <div className="p-4 lg:w-1/2 md:w-full">
      <div
        className={`flex border-2 rounded-lg border-gray-200 border-opacity-50 p-8 sm:flex-row flex-col ${
          assessment.is_published ? 'animate-pulse' : ''
        }`}
      >
        <div className="w-16 h-16 sm:mr-8 sm:mb-0 mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 flex-shrink-0">
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-8 h-8"
            viewBox="0 0 24 24"
          >
            {icon}
          </svg>
        </div>
        <div className="flex-grow">
          <div className="flex justify-between">
            <h2 className="text-gray-900 text-lg font-bold title-font mb-3">
              {title}
            </h2>
          </div>

          <p className="leading-relaxed text-base">{assessment.description}</p>
          <p>
            This Assessment is part of {courseName} Course under {moduleName}{' '}
            Module. It will Run from {formattedStartDate} at exactly{' '}
            {formattedStartTime} to {formattedEndDate} at exactly{' '}
            {formattedEndTime}. It contains a total of{' '}
            {assessment.questions.length} Questions with{' '}
            {assessment.total_marks} Total marks and the passing marks are{' '}
            {assessment.passing_marks} marks, with {formattedTimeLimit}{' '}
             Minutes Time Limit
          </p>

          <div className="flex justify-between mt-4">
            <button
              onClick={handleViewAssessment}
              className="mt-3 ml-auto text-indigo-500 inline-flex items-center cursor-pointer"
            >
              Take Assessment
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
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        assessment={assessment}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onContinue={handleContinue}
      />
    </div>
  );
}

export default AssessmentCardForStudent;
