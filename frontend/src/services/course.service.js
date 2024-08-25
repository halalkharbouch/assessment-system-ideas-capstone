export const fetchCourses = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/courses/');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
