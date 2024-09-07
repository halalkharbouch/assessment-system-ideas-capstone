// components/Modals/EditAssessmentModal.js

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { updateAssessment } from '../../services/aseessment.service';
import { ClipLoader } from 'react-spinners';

function EditAssessmentModal({
  isOpen,
  onClose,
  assessmentData,
  onUpdate,
  timeLimit,
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    total_marks: 0,
    passing_marks: 0,
    time_limit: 0,
    start_date: null,
    end_date: null,
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    if (assessmentData && isOpen && timeLimit) {
      setFormData({
        name: assessmentData.name || '',
        description: assessmentData.description || '',
        total_marks: assessmentData.total_marks || 0,
        passing_marks: assessmentData.passing_marks || 0,
        time_limit: timeLimit || 0,
        start_date: assessmentData.start_date
          ? new Date(assessmentData.start_date)
          : null,
        end_date: assessmentData.end_date
          ? new Date(assessmentData.end_date)
          : null,
      });
    }
  }, [assessmentData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStartDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      start_date: date,
    }));
  };

  const handleEndDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      end_date: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const newUpdatedAssessment = await updateAssessment(
        assessmentData.id,
        formData,
      );
      onUpdate(newUpdatedAssessment);
    } catch (error) {
      console.error('Error updating assessment:', error);
      setError('An error occurred while updating the assessment.');
    } finally {
      setLoading(false);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-medium mb-4">Edit Assessment</h2>
        <form onSubmit={handleSubmit}>
          {/* Assessment Name */}
          <div className="mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">
              Assessment Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="leading-7 text-sm text-gray-600"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
              rows="4"
              required
            />
          </div>

          {/* Total Marks and Passing Marks */}
          <div className="flex mb-4 space-x-4">
            <div className="w-1/2">
              <label
                htmlFor="total_marks"
                className="leading-7 text-sm text-gray-600"
              >
                Total Marks
              </label>
              <input
                type="number"
                id="total_marks"
                name="total_marks"
                value={formData.total_marks}
                onChange={handleChange}
                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
                min="0"
                required
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="passing_marks"
                className="leading-7 text-sm text-gray-600"
              >
                Passing Marks
              </label>
              <input
                type="number"
                id="passing_marks"
                name="passing_marks"
                value={formData.passing_marks}
                onChange={handleChange}
                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
                min="0"
                required
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="passing_marks"
                className="leading-7 text-sm text-gray-600"
              >
                Time Limit (minutes)
              </label>
              <input
                type="number"
                id="time_limit"
                name="time_limit"
                value={formData.time_limit}
                onChange={handleChange}
                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700"
                min="0"
                required
              />
            </div>
          </div>

          {/* Start Date and Time */}
          <div className="mb-4 flex flex-col">
            <label
              htmlFor="start_date"
              className="leading-7 text-sm text-gray-600"
            >
              Start Date and Time
            </label>
            <DatePicker
              id="start_date"
              selected={formData.start_date}
              onChange={handleStartDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700 leading-8"
              placeholderText="Select start date and time"
              required
            />
          </div>

          {/* End Date and Time */}
          <div className="mb-4 flex flex-col">
            <label
              htmlFor="end_date"
              className="leading-7 text-sm text-gray-600"
            >
              End Date and Time
            </label>
            <DatePicker
              id="end_date"
              selected={formData.end_date}
              onChange={handleEndDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={formData.start_date}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700 leading-8"
              placeholderText="Select end date and time"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-700 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-500 text-white py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={20} color={'#fff'} />
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}

export default EditAssessmentModal;
