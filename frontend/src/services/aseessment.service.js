import axiosInstance from '../api/axios';

export const fetchCurrentUserAssessments = async () => {
  try {
    const response = await axiosInstance.get('/api/assessments/current-user/');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const createAssessment = async (assessmentData) => {
  try {
    const response = await axiosInstance.post(
      '/api/assessments/create/',
      assessmentData,
    );
    return response.data.assessment;
  } catch (error) {
    console.error(error);
  }
};

export const updateAssessment = async (assessmentId, assessmentData) => {
  try {
    const response = await axiosInstance.put(
      `/api/assessments/update/${assessmentId}/`,
      assessmentData,
    );
    return response.data.assessment;
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

export const deleteAssessment = async (assessmentId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/assessments/delete/${assessmentId}/`,
    );
    console.log('Deleted assessment from server', response);

    return response;
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
    console.log('Deleted question from server', response);

    return response;
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
    return response.data.assessment;
  } catch (error) {
    console.error(error);
  }
};
