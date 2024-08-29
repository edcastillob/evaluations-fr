import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleIniciar = () => {
    navigate('/home');
  };

  return (
    <div className="relative h-screen w-screen">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/vid.webm"
        autoPlay
        loop
        muted
      />
      <div className="absolute inset-0 flex justify-center items-center">
        <button
          onClick={handleIniciar}
          className="bg-white-500 hover:bg-transparent text-black-700 font-semibold hover:text-black py-2 px-4 border border-blue-500 hover:border-white-500 rounded"
        >
          Iniciar
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
