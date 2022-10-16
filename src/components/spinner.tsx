const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative w-24 h-24 animate-spin rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-sky-800">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-transparent rounded-full border-2 border-white"></div>
      </div>
    </div>
  );
};

export default Spinner;
