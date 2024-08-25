import { useState } from 'react';
import AssessmentCard from '../components/AssessmentCard';
import AddAssessmentModal from '../components/Modals/AddAssessmentModal';

function Assessments() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap">
        <div className="flex flex-wrap -m-4">
          <AssessmentCard
            title="Shooting Stars"
            icon={<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>}
          />
          <AssessmentCard
            title="The Catalyzer"
            icon={
              <>
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </>
            }
          />
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
      <AddAssessmentModal isOpen={isModalOpen} onClose={closeModal} />
    </section>
  );
}

export default Assessments;
