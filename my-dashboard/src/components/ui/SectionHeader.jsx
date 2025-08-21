import { FiPlus } from 'react-icons/fi';

const SectionHeader = ({
  title,
  description,
  buttonText,
  onButtonClick,
  showButton = true,
  children,
}) => {
  return (
    <div className="bg-white border-b border-gray-100 px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
        {showButton && (
          <div className="flex items-center gap-3">
            <button
              onClick={onButtonClick}
              className="flex items-center gap-2 bg-gradient-to-r from-[#01818E] to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-[#01818E]/90 hover:to-cyan-600/90 transition-all duration-300 shadow-md hover:shadow-lg font-semibold text-sm"
            >
              <FiPlus className="w-4 h-4" /> {buttonText}
            </button>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default SectionHeader;
