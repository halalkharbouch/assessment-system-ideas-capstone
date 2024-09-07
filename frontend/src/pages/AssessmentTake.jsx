import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchAssessment } from '../services/aseessment.service';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import Loading from '../components/Loading';
import { FaBook, FaLayerGroup, FaCalendarAlt } from 'react-icons/fa';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function Timer({ initialTime, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((time) => time - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <span className="text-lg font-medium text-gray-900">
      Time Remaining: {formatTime(timeLeft)}
    </span>
  );
}

function AssessmentTake() {
  const { assessmentId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [warningVisible, setWarningVisible] = useState(false);
  const [answers, setAnswers] = useState({});
  const [timeLimit, setTimeLimit] = useState(0);
  const [tabChanged, setTabChanged] = useState(false);
  const navigate = useNavigate();

  const warningTimeoutRef = useRef(null);
  const focusTimeoutRef = useRef(null);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      await axiosInstance.post(`/api/assessments/submit/${assessmentId}/`, {
        answers,
      });
      navigate('/assessment-submitted');
      toast.success('Assessment submitted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit assessment');
    } finally {
      setLoading(false);
    }
  }, [assessmentId, answers, navigate]);

  useEffect(() => {
    const loadAssessment = async () => {
      try {
        const data = await fetchAssessment(assessmentId);
        setAssessment(data);

        // Convert time_limit from "HH:MM:SS" format to seconds
        const [hours, minutes, seconds] = data.time_limit
          .split(':')
          .map(Number);
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        setTimeLimit(totalSeconds);

        const warningTime = 60 * 2; // 2 minutes warning

        if (totalSeconds > warningTime) {
          warningTimeoutRef.current = setTimeout(() => {
            setWarningVisible(true);
          }, (totalSeconds - warningTime) * 1000);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();

    return () => {
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
    };
  }, [assessmentId]);

  // Warn the user if they try to leave or refresh the page
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const confirmationMessage =
        'Your assessment will be submitted immediately if you leave this page. Are you sure you want to leave?';

      e.preventDefault();
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleSubmit]);

  // Detect tab changes and focus changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setTabChanged(true);
        focusTimeoutRef.current = setTimeout(() => {
          if (tabChanged) {
            console.log('User has left the page');
          }
        }, 5000); // Delay for the user to notice the alert
      } else {
        console.log('User has returned to the page');
        setTabChanged(false);
        handleSubmit(); // Automatically submit the assessment
        if (focusTimeoutRef.current) {
          clearTimeout(focusTimeoutRef.current);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
    };
  }, [tabChanged, handleSubmit]);

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
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

  return (
    <section
      className="text-gray-600 body-font"
      onCopy={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {warningVisible && (
        <div className="fixed top-4 right-4 bg-yellow-300 p-4 rounded-md shadow-lg">
          <p className="text-yellow-800 font-semibold">
            Hurry up! Only 2 minutes left to complete the assessment.
          </p>
        </div>
      )}
      <div className="container px-5 py-24 mx-auto">
        <div className="text-center mb-20">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900 mb-4">
            {assessment.name}
          </h1>
          <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
            {assessment.description}
          </p>
        </div>

        <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
          <div className="p-2 sm:w-1/2 w-full">
            <div className="bg-gray-100 rounded flex p-4 h-full items-center">
              <FaBook className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" />
              <span className="title-font font-medium">
                Course: {assessment.course.name}
              </span>
            </div>
          </div>
          <div className="p-2 sm:w-1/2 w-full">
            <div className="bg-gray-100 rounded flex p-4 h-full items-center">
              <FaLayerGroup className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" />
              <span className="title-font font-medium">
                Module: {assessment.module.name}
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
            <div
              className="bg-gray-100```javascript
              rounded flex p-4 h-full items-center"
            >
              <FaCalendarAlt className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" />
              <span className="title-font font-medium">
                Ends: {formattedEndDate}, {formattedEndTime}
              </span>
            </div>
          </div>
        </div>

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
                          answers[question.id] === choice.id
                            ? 'bg-indigo-100 p-2 rounded'
                            : ''
                        }`}
                      >
                        <div className="relative flex-shrink-0 w-6 h-6">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={choice.id}
                            onChange={() =>
                              handleOptionChange(question.id, choice.id)
                            }
                            checked={answers[question.id] === choice.id}
                            className="absolute opacity-0"
                          />
                          <span className="block w-full h-full border-2 border-indigo-500 rounded-full cursor-pointer flex items-center justify-center">
                            {answers[question.id] === choice.id && (
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
                          answers[question.id] === 'True'
                            ? 'bg-indigo-100 p-2 rounded'
                            : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value="True"
                          onChange={() =>
                            handleOptionChange(question.id, 'True')
                          }
                          checked={answers[question.id] === 'True'}
                          className="mr-2"
                        />
                        True
                      </label>
                      <label
                        className={`flex items-center cursor-pointer ${
                          answers[question.id] === 'False'
                            ? 'bg-indigo-100 p-2 rounded'
                            : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value="False"
                          onChange={() =>
                            handleOptionChange(question.id, 'False')
                          }
                          checked={answers[question.id] === 'False'}
                          className="mr-2"
                        />
                        False
                      </label>
                    </div>
                  )}
                  <div>
                    <p className="text-indigo-500 mt-3">
                      {question.marks} Mark{question.marks > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center shadow-md">
          <Timer initialTime={timeLimit} onTimeUp={handleSubmit} />

          <button
            disabled={loading}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
            onClick={handleSubmit}
          >
            {loading ? (
              <ClipLoader size={20} color={'#fff'} />
            ) : (
              'Submit Assessment'
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

export default AssessmentTake;
