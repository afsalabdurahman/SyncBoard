import { FiArrowLeft, FiArrowRight, FiClock, FiSearch, FiHelpCircle } from 'react-icons/fi';

const TopBar = () => {
  return (
    <div className="bg-purple-900 h-10 flex items-center px-4 justify-between text-white text-sm">
      {/* Left side navigation icons */}
      <div className="flex items-center space-x-4">
        <button className="hover:text-gray-300">
          <FiArrowLeft />
        </button>
        <button className="hover:text-gray-300">
          <FiArrowRight />
        </button>
        <button className="hover:text-gray-300">
          <FiClock />
        </button>
      </div>

      {/* Center search bar */}
      <div className="flex flex-1 mx-4">
        <input
          type="text"
          placeholder="Search ABC ltd"
          className="bg-purple-700 text-white placeholder-purple-300 px-3 py-1 rounded w-full focus:outline-none"
        />
        <button className="ml-2 text-purple-300 hover:text-white">
          <FiSearch />
        </button>
      </div>

      {/* Right help icon */}
      <div>
        <button className="hover:text-gray-300">
          <FiHelpCircle />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
