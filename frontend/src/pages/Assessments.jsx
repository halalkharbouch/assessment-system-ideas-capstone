import { useEffect, useState } from 'react';
import AssessmentCard from '../components/AssessmentCard';
import AddAssessmentModal from '../components/Modals/AddAssessmentModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  createAssessment,
  deleteAssessment,
  fetchCurrentUserAssessments,
} from '../services/aseessment.service';
import { updateCurrentUser } from '../redux/userSlice';
import { fetchCurrentUser } from '../services/users.service';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

function Assessments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [userData, setUserData] = useState(currentUser);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const loadCurrentAssessments = async () => {
      const assessments = await fetchCurrentUserAssessments();
      setAssessments(assessments);
      setLoading(false);
    };
    loadCurrentAssessments();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAssessmentCreation = async (newAssessment) => {
    try {
      const assessment = await createAssessment(newAssessment);
      setAssessments([...assessments, assessment]);
      toast.success('Assessment created successfully');
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create assessment');
    }
  };

  const handleAssessmentDeletion = async (assessmentId) => {
    setAssessments((prevAssessments) =>
      prevAssessments.filter((assessment) => assessment.id !== assessmentId),
    );
  };

  const handleUpdateAssessmentStatus = async (updatedAssessment) => {
    setAssessments((prevAssessments) =>
      prevAssessments.map((assessment) =>
        assessment.id === updatedAssessment.id ? updatedAssessment : assessment,
      ),
    );
  };

  if (loading) return <Loading />;

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap">
        <div className="flex flex-wrap -m-4">
          {assessments?.map((assessment) => (
            <AssessmentCard
              key={assessment.id}
              assessment={assessment}
              icon={<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>}
              onDelete={handleAssessmentDeletion}
              onStatusToggle={handleUpdateAssessmentStatus}
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
