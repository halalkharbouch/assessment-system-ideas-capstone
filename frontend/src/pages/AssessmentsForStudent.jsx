import { useEffect, useState } from 'react';
import AssessmentCardForStudent from '../components/AssessmentCardForStudent';
import { useSelector } from 'react-redux';
import { fetchCourse, fetchCourseForStudent } from '../services/course.service';
import Loading from '../components/Loading';

function AssessmentsForStudent() {
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.user.currentUser);
  console.log('Course for student', course);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const course = await fetchCourseForStudent(
          currentUser.enrolled_course.id,
        );
        setCourse(course);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [currentUser]);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        {course?.modules?.map((module) => (
          <div key={module.id} className="mb-8">
            {module.assessments.length > 0 && (
              <h2 className="text-2xl font-semibold mb-4">
                {module.name} Module Assessments
              </h2>
            )}

            <div className="flex flex-wrap -m-4">
              {module.assessments.length > 0 &&
                module.assessments.map((assessment) => (
                  <AssessmentCardForStudent
                    key={assessment.id}
                    assessment={assessment}
                    title={assessment.name}
                    courseName={course.name}
                    moduleName={module.name}
                    icon={<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
      {course.modules.length === 0 && (
        <div className="flex justify-center items-center">
          <p className="font-semibold text-2xl text-center text-gray-500">
            You do not have any assessment to take at the moment
          </p>
        </div>
      )}
    </section>
  );
}

export default AssessmentsForStudent;
