import { format } from 'date-fns';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { updateCurrentUser } from '../redux/userSlice';
import {
  deleteAssessment,
  updateAssessmentStatus,
} from '../services/aseessment.service.js';
import { toast } from 'react-toastify';

function AssessmentCard({ icon, assessment, onDelete, onStatusToggle }) {
  // fetch courses
  const [courses, setCourses] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log('Courses', courses);

  const formattedStartDate = format(
    new Date(assessment.start_date),
    'dd MMM yyyy',
  );
  const formattedEndDate = format(new Date(assessment.end_date), 'dd MMM yyyy');
  const formattedStartTime = format(new Date(assessment.start_date), 'h:mm a');
  const formattedEndTime = format(new Date(assessment.end_date), 'h:mm a');
  const timeLimitString = assessment.time_limit;
  const [hours, minutes, seconds] = timeLimitString.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + seconds / 60;

  const handleAssessmentManageClick = () => {
    navigate(`/assessment-manage/${assessment.id}`);
  };

  const handleDeleteAssessment = async () => {
    try {
      const response = await deleteAssessment(assessment.id);
      if (response.status === 204) {
        onDelete(assessment.id);
        toast.success('Assessment deleted successfully');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete assessment');
    }
  };

  const handleViewStudentScoresClick = () => {
    navigate(`/assessment-scores/${assessment.id}`);
  };

  const handleStatusToggle = async () => {
    try {
      // Fetch the questions for this assessment
      const questions = assessment.questions; // Assume you have a function to get the assessment questions
      const totalQuestionMarks = questions.reduce(
        (acc, question) => acc + question.marks,
        0
      );
  
      // Compare the total question marks with the assessment total marks
      if (totalQuestionMarks < assessment.total_marks) {
        toast.warning(
          `The total marks of the questions (${totalQuestionMarks}) are less than the assessment total marks (${assessment.total_marks}). Please update the assessment marks.`,
        );
        return; // Stop further execution if the marks are less
      }
  
      if (totalQuestionMarks > assessment.total_marks) {
        toast.warning(
          `The total marks of the questions (${totalQuestionMarks}) are greater than the assessment total marks (${assessment.total_marks}). Please update the assessment marks.`,
        );
        return; // Stop further execution if the marks are greater
      }
  
      // If the marks match, proceed with toggling the status
      const newStatus = !assessment.is_published; // Toggle the publish status
      const updatedAssessment = await updateAssessmentStatus(
        assessment.id,
        newStatus,
      );
  
      onStatusToggle(updatedAssessment); // Update the parent component state
      toast.success('Assessment status updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update assessment status');
    }
  };
  

  return (
    <div className="p-4 lg:w-1/2 md:w-full">
      <div
        className={`flex border-2 rounded-lg border-gray-200 border-opacity-50 p-8 sm:flex-row flex-col ${
          assessment.is_published ? 'animate-pulse' : ''
        }`}
      >
        
        <div className="flex-grow">
          <div className="flex justify-between">
            <h2 className="text-gray-900 text-lg font-bold title-font mb-3">
              {assessment.name}
            </h2>

            <FaTrash
              onClick={handleDeleteAssessment}
              className="text-red-500 cursor-pointer hover:text-red-400"
            />
          </div>

          <p className="leading-relaxed text-base">{assessment.description}</p>
          <p>
            This Assessment is part of {assessment.course.name} Course under{' '}
            {assessment.module.name} Module, It will Run from{' '}
            {formattedStartDate} at exactly {formattedStartTime} to{' '}
            {formattedEndDate} at exactly {formattedEndTime} it contains a total
            of {assessment.questions.length} Questions with{' '}
            {assessment.total_marks} Total marks and the passing marks are{' '}
            {assessment.passing_marks} marks, with {totalMinutes} Minutes Time
            Limit
          </p>

          <div className="flex justify-between mt-4">
            <button
              onClick={handleAssessmentManageClick}
              className="mt-3 text-indigo-500 inline-flex items-center cursor-pointer"
            >
              View Assessment
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
            <button
              onClick={handleViewStudentScoresClick}
              className="mt-3 text-indigo-500 inline-flex items-center cursor-pointer"
            >
              Scores
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

            <button
              onClick={handleStatusToggle}
              className={`text-white border-0 py-2 px-6 focus:outline-none rounded ${
                assessment.is_published
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {assessment.is_published ? 'Take Down' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssessmentCard;
