import Lottie from 'lottie-react';
import landingAnimationData from '../assets/landing-animation.json';


function Landing() {
  return (
    <section className="max-w-lg mx-auto text-center">
      <div className="text-center my-16">
        <h2 className="text-4xl font-bold mb-4">Assessmento <span className='text-blue-500'>IDEAS</span> Baze</h2>
        <p className="text-lg mb-10">
          Welcome to the assessment platform for IDEAS Baze program sponsored by World Bank
        </p>
        <p className='uppercase mb-3 text-blue-500'>Sign in to Continue</p>
        <div className="flex justify-center">
          <input
            type="email"
            placeholder="Type your email"
            className="p-3 border border-gray-300 rounded-l focus:outline-blue-500"
          />
          <button className="bg-blue-500 ml-[-0.5rem] shadow-sm hover:shadow-md text-white px-6 py-3 rounded-r uppercase hover:bg-blue-600 transition duration-150 ease-in-out">
            Sign In
          </button>
        </div>
      </div>

      <Lottie animationData={landingAnimationData} />
    </section>
  );
}

export default Landing;
