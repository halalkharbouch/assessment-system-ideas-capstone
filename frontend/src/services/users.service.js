import axiosInstance from '../api/axios';

export const fetchUsers = async (userType) => {
  try {
    const response = await axiosInstance.get(`/api/users/${userType}/`);

    const data = response.data;
    console.log('all teachers', data);

    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const addUser = async (data, userType) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/users/create/${userType}/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    if (result) {
      return result.data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/users/delete/${id}/`,
      {
        method: 'DELETE',
      },
    );
    const result = await response.json();
    if (result) {
      return result;
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (data, id, userType) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/users/update/${userType}/${id}/`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    if (result) {
      return result.data;
    }
  } catch (error) {
    console.log(error);
  }
};
