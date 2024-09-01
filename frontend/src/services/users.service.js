import axiosInstance from '../api/axios';

// Fetch users function using axios
export const fetchUsers = async (userType) => {
  try {
    const response = await axiosInstance.get(`/api/users/${userType}/`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Add user function using axios
export const addUser = async (data, userType) => {
  try {
    const response = await axiosInstance.post(
      `/api/users/create/${userType}/`,
      data,
    );
    console.log(response.data);

    return response;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// Delete user function using axios
export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/users/delete/${id}/`);
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Update user function using axios
export const updateUser = async (data, id, userType) => {
  try {
    const response = await axiosInstance.put(
      `/api/users/update/${userType}/${id}/`,
      data,
    );
    return response.data.user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const fetchCurrentUser = async () => {
  try {
    const response = await axiosInstance.get('/api/users/current/');
    const userData = await response.data.user;

    console.log('User Data: ', userData);

    return userData;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};
