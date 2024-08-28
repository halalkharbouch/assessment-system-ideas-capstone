import axiosInstance from '../api/axios';

const fetchAssessments = () => {};

export const createAssessment = async (assessmentData) => {
  try {
    const response = await axiosInstance.post(
      '/api/assessments/create/',
      assessmentData,
    );
    return response.data.user;
  } catch (error) {
    console.error(error);
  }
};

export const fetchAssessment = async (assessmentId) => {
  try {
    const response = await axiosInstance.get(
      `/api/assessments/${assessmentId}/`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const addQuestion = async (assessmentId, questionData) => {
  try {
    const response = await axiosInstance.post(
      `/api/questions/${assessmentId}/create/`,
      questionData,
    );
    console.log('Created question from server', response.data);

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const updateQuestion = async (questionId, questionData) => {
  try {
    const response = await axiosInstance.put(
      `/api/questions/${questionId}/update/`,
      questionData,
    );

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const deleteQuestion = async (questionId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/questions/${questionId}/delete/`,
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const deleteAssessment = async (assessmentId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/assessments/delete/${assessmentId}/`,
    );
    console.log('Deleted assessment from server', response.data);

    return response.data.user;
  } catch (error) {
    console.error(error);
  }
};
export const updateAssessmentStatus = async (assessmentId, status) => {
  try {
    const response = await axiosInstance.patch(
      `/api/assessments/update-status/${assessmentId}/`,
      { is_published: status },
    );
    return response.data.user;
  } catch (error) {
    console.error(error);
  }
};
