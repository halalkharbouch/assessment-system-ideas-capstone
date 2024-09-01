import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  FaBook,
  FaLayerGroup,
  FaQuestionCircle,
  FaTrophy,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
} from 'react-icons/fa';
import axiosInstance from '../api/axios';
import { useParams } from 'react-router-dom';

const StudentGradeDetail = () => {
  const [grade, setGrade] = useState(null);
  const { id } = useParams(); // Get the id from the URL

  useEffect(() => {
    const fetchGradeDetail = async () => {
      try {
        const response = await axiosInstance.get(`/api/results/${id}/`);
        setGrade(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGradeDetail();
  }, [id]);
  if (!grade) return null;

  const { assessment, incorrect_answers } = grade;
  const timeLimitString = assessment.time_limit;
  const [hours, minutes, seconds] = timeLimitString.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + seconds / 60;

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
        </div>

        <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
          <div className="p-2 sm:w-1/2 w-full">
            <div className="bg-gray-100 rounded flex p-4 h-full items-center">
              <FaBook className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" />
              <span className="title-font font-medium">
                Course: {assessment.course}
              </span>
            </div>
          </div>
          <div className="p-2 sm:w-1/2 w-full">
            <div className="bg-gray-100 rounded flex p-4 h-full items-center">
              <FaLayerGroup className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" />
              <span className="title-font font-medium">
                Module: {assessment.module}
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
                Passing Marks: {assessment.passing_marks}
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
        </div>

        <div className="flex justify-between items-center my-12">
          <h1 className="text-3xl font-medium title-font text-gray-900">
            Questions
          </h1>
          <p className="text-lg font-medium text-gray-900">
            Score: {grade.score}
          </p>
        </div>

        {/* Questions List */}
        <div className="flex flex-wrap -m-4 ">
          {assessment.questions.map((question, index) => {
            const isIncorrect = incorrect_answers[question.id] !== undefined;
            return (
              <div
                key={question.id}
                className={`p-4 w-full mt-2 ${isIncorrect ? 'bg-red-100' : ''}`}
              >
                <div
                  className={`h-full p-8 rounded ${
                    isIncorrect ? 'bg-red-200' : 'bg-gray-100'
                  }`}
                >
                  <p className="leading-relaxed mb-6">
                    <span className="font-bold">{index + 1}. </span>
                    {question.question_text}
                  </p>
                  <div className="flex flex-col">
                    {question.question_type === 'mcq' &&
                      question.choices.map((choice) => {
                        const isSelected =
                          incorrect_answers[question.id] === choice.id;
                        return (
                          <label
                            key={choice.id}
                            className={`flex items-center mb-4 cursor-pointer ${
                              choice.is_correct
                                ? 'bg-green-100 p-2 rounded'
                                : ''
                            } ${isSelected ? 'bg-red-100' : ''}`}
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
                        );
                      })}
                    {question.question_type === 'trueFalse' && (
                      <div className="flex space-x-4">
                        <label
                          className={`flex items-center cursor-pointer ${
                            question.is_true ? 'bg-green-100 p-2 rounded' : ''
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
                            question.is_true === false
                              ? 'bg-green-100 p-2 rounded'
                              : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value="False"
                            checked={question.is_true === false}
                            readOnly
                            className="mr-2"
                          />
                          False
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StudentGradeDetail;
