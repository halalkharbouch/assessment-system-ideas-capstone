import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

import { fetchAssessment } from '../services/aseessment.service';
import Loading from '../components/Loading';
import {
  FaQuestionCircle,
  FaTrophy,
  FaCheckCircle,
  FaBook,
  FaLayerGroup,
  FaClock,
  FaCalendarAlt,
  FaCalendarDay,
} from 'react-icons/fa';
import AddQuestionModal from '../components/Modals/AddQuestionModal';
import UpdateQuestionModal from '../components/Modals/UpdateQuestionModal';
import { deleteQuestion } from '../services/aseessment.service';

function AssessmentManage() {
  const { assessmentId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [isUpdateQuestionModalOpen, setIsUpdateQuestionModalOpen] =
    useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const openAddQuestionModal = () => setIsAddQuestionModalOpen(true);
  const closeAddQuestionModal = () => setIsAddQuestionModalOpen(false);

  const openUpdateQuestionModal = (question) => {
    setSelectedQuestion(question);
    setIsUpdateQuestionModalOpen(true);
  };
  const closeUpdateQuestionModal = () => {
    setSelectedQuestion(null);
    setIsUpdateQuestionModalOpen(false);
  };

  useEffect(() => {
    const loadAssessment = async () => {
      try {
        const data = await fetchAssessment(assessmentId);
        setAssessment(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadAssessment();
  }, [assessmentId]);

  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  if (loading) {
    return <Loading />;
  }
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

  const onAddQuestion = (questionData) => {
    console.log('Question Data', questionData);
    // add the question data to the assessment.questions
    setAssessment((prevAssessment) => ({
      ...prevAssessment,
      questions: [...prevAssessment.questions, questionData.question],
    }));
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await deleteQuestion(questionId);

      // delete the question data from the assessment.questions
      setAssessment((prevAssessment) => ({
        ...prevAssessment,
        questions: prevAssessment.questions.filter(
          (question) => question.id !== questionId,
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const onUpdateQuestion = (questionData) => {
    console.log('Question Data', questionData);
    // update the question data in the assessment.questions
    setAssessment((prevAssessment) => ({
      ...prevAssessment,
      questions: prevAssessment.questions.map((question) => {
        if (question.id === questionData.question.id) {
          return questionData.question;
        }
        return question;
      }),
    }));
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="text-center mb-20">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900 mb-4">
            {assessment.name}
          </h1>
          <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
            {assessment.description}
          </p>
          <button className="flex mx-auto mt-4 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
            Edit Assessment
          </button>
        </div>

        <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
          <div className="p-2 sm:w-1/2 w-full">
            <div className="bg-gray-100 rounded flex p-4 h-full items-center">
              <FaBook className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" />{' '}
              <span className="title-font font-medium">
                Course: {assessment.course.name}
              </span>
            </div>
          </div>
          <div className="p-2 sm:w-1/2 w-full">
            <div className="bg-gray-100 rounded flex p-4 h-full items-center">
              <FaLayerGroup className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" />{' '}
              <span className="title-font font-medium">
                Module: {assessment.module.name}
              </span>
            </div>
          </div>
          <div className="p-2 sm:w-1/2 w-full">
            <div className="bg-gray-100 rounded flex p-4 h-full items-center">
              <FaQuestionCircle className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" />
              <span className="title-font font-medium">
                {assessment.questions.length} Questions
              </span>
            </div>
          </div>
          <div className="p-2 sm:w-1/2 w-full">
            <div className="bg-gray-100 rounded flex p-4 h-full items-center">
              <FaTrophy className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" />
              <span className="title-font font-medium">
                {assessment.total_marks} Marks
              </span>
            </div>
          </div>
          <div className="p-2 sm:w-1/2 w-full">
            <div className="bg-gray-100 rounded flex p-4 h-full items-center">
              <FaCheckCircle className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" />
              <span className="title-font font-medium">
                {assessment.passing_marks} Passing Marks
              </span>
            </div>
          </div>
          <div className="p-2 sm:w-1/2 w-full">
            <div className="bg-gray-100 rounded flex p-4 h-full items-center">
              <FaClock className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" />
              <span className="title-font font-medium">
                {totalMinutes} Minutes
              </span>
            </div>
          </div>
          <div className="p-2 sm:w-1/2 w-full">
            <div className="bg-gray-100 rounded flex p-4 h-full items-center">
              <FaCalendarAlt className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" />
              <span className="title-font font-medium">
                Starts: {formattedStartDate}, {formattedStartTime}
              </span>
            </div>
          </div>
          <div className="p-2 sm:w-1/2 w-full">
            <div className="bg-gray-100 rounded flex p-4 h-full items-center">
              <FaCalendarAlt className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" />
              <span className="title-font font-medium">
                Ends: {formattedEndDate}, {formattedEndTime}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center my-12">
          <h1 className="text-3xl font-medium title-font text-gray-900">
            Questions
          </h1>
          <div className="flex gap-4">
            <button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
              Generate Questions AI
            </button>
            <button
              onClick={openAddQuestionModal}
              className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
            >
              Add Question
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="flex flex-wrap -m-4">
          {assessment.questions.map((question, index) => (
            <div key={question.id} className="p-4 w-full">
              <div className="h-full bg-gray-100 p-8 rounded">
                <p className="leading-relaxed mb-6">
                  <span className="font-bold">{index + 1}. </span>
                  {question.question_text}
                </p>
                <div className="flex flex-col">
                  {question.question_type === 'mcq' &&
                    question.choices.map((choice) => (
                      <label
                        key={choice.id}
                        className={`flex items-center mb-4 cursor-pointer ${
                          choice.is_correct ? 'bg-green-100 p-2 rounded' : ''
                        }`}
                      >
                        <div className="relative flex-shrink-0 w-6 h-6">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={choice.id}
                            checked={choice.is_correct}
                            readOnly
                            className="absolute opacity-0"
                          />
                          <span className="block w-full h-full border-2 border-indigo-500 rounded-full cursor-pointer flex items-center justify-center">
                            {choice.is_correct && (
                              <span className="block w-3 h-3 bg-indigo-500 rounded-full" />
                            )}
                          </span>
                        </div>
                        <span className="flex-grow flex flex-col pl-4">
                          <span className="title-font font-medium text-gray-900">
                            {choice.choice_text}
                          </span>
                        </span>
                      </label>
                    ))}
                  {question.question_type === 'trueFalse' && (
                    <div className="flex space-x-4">
                      <label
                        className={`flex items-center cursor-pointer ${
                          question.is_true === true
                            ? 'bg-green-100 p-2 rounded'
                            : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value="True"
                          checked={question.is_true === true}
                          readOnly
                          className="mr-2"
                        />
                        True
                      </label>
                      <label
                        className={`flex items-center cursor-pointer ${
                          question.is_true === false ||
                          question.is_true === null
                            ? 'bg-green-100 p-2 rounded'
                            : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value="False"
                          checked={
                            question.is_true === false ||
                            question.is_true === null
                          }
                          readOnly
                          className="mr-2"
                        />
                        False
                      </label>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-2">
                    <p>{question.marks} Mark{question.marks > 1 ? 's' : ''}</p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => openUpdateQuestionModal(question)}
                        className="ml-auto text-indigo-500 inline-flex items-center cursor-pointer"
                      >
                        Edit Question
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
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="ml-auto text-red-500 inline-flex items-center cursor-pointer"
                      >
                        Delete Question
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
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddQuestionModal
        isOpen={isAddQuestionModalOpen}
        onClose={closeAddQuestionModal}
        assessmentId={assessmentId}
        onAddQuestion={onAddQuestion}
      />

      <UpdateQuestionModal
        isOpen={isUpdateQuestionModalOpen}
        onClose={closeUpdateQuestionModal}
        questionData={selectedQuestion}
        onUpdateQuestion={onUpdateQuestion}
      />
    </section>
  );
}

export default AssessmentManage;
