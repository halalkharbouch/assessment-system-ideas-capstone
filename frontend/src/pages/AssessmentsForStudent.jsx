import { useEffect, useState } from 'react';
import AssessmentCardForStudent from '../components/AssessmentCardForStudent';
import { useSelector } from 'react-redux';

function AssessmentsForStudent() {
  const [modules, setModules] = useState([]);
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    if (currentUser.enrolled_course) {
      setModules(currentUser.enrolled_course.modules);
    }
  }, [currentUser]);

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        {modules.map((module) => (
          <div key={module.id} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{module.name}</h2>
            <div className="flex flex-wrap -m-4">
              {module.assessments.length > 0 ? (
                module.assessments.map((assessment) => (
                  <AssessmentCardForStudent
                    key={assessment.id}
                    assessment={assessment}
                    title={assessment.name}
                    icon={<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>}
                  />
                ))
              ) : (
                <p>No assessments available for this module.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AssessmentsForStudent;
