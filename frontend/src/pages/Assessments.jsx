import { useEffect, useState } from 'react';
import AssessmentCard from '../components/AssessmentCard';
import AddAssessmentModal from '../components/Modals/AddAssessmentModal';
import { useDispatch, useSelector } from 'react-redux';
import { createAssessment, deleteAssessment } from '../services/aseessment.service';
import { updateCurrentUser } from '../redux/userSlice';

function Assessments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [userData, setUserData] = useState(currentUser);

  useEffect(() => {
    setUserData(currentUser);
  }, [currentUser]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAssessmentCreation = async (newAssessment) => {
    try {
      const updatedUser = await createAssessment(newAssessment);
      setUserData(updatedUser);
      dispatch(updateCurrentUser(updatedUser));
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssessmentDeletion = async (assessmentId) => {
    try {
      const updatedUser = await deleteAssessment(assessmentId);
      setUserData(updatedUser);
      dispatch(updateCurrentUser(updatedUser));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap">
        <div className="flex flex-wrap -m-4">
          {userData?.assessments_created.map((assessment) => (
            <AssessmentCard
              key={assessment.id}
              assessment={assessment}
              title={assessment.name}
              icon={<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>}
            />
          ))}
        </div>
        <div className="flex pl-4 mt-4 w-full mx-auto">
          <button
            onClick={openModal}
            className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
          >
            Add Assessment
          </button>
        </div>
      </div>
      {/* Add Assessment Modal */}
      <AddAssessmentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onCreate={handleAssessmentCreation}
      />
    </section>
  );
}

export default Assessments;
