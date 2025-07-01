import { useTheme } from '../../hooks/useTheme';
import { FolderOpen } from 'lucide-react';

const DocumentChecklist = ({ documents = [] }) => {
  const { darkMode } = useTheme();

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'REQUIRED':
        return 'bg-red-500 text-white';
      case 'RECEIVED':
        return 'bg-green-500 text-white';
      case 'PENDING':
        return 'bg-yellow-400 text-black';
      default:
        return darkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div
      className={`w-full rounded-2xl shadow-md border overflow-hidden transition-all duration-300 ${
        darkMode
          ? 'bg-gradient-to-b from-[#1f2937] to-[#111827] border-gray-700'
          : 'bg-white border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-5 pt-5 pb-2">
        <FolderOpen className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
        <h2 className={`text-sm font-bold tracking-wide ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Documentation Checklist
        </h2>
      </div>

      {/* Table Head */}
      <div
        className={`grid grid-cols-3 px-5 py-2 text-xs font-semibold uppercase tracking-wider border-t border-b ${
          darkMode
            ? 'bg-gray-700 border-gray-600 text-gray-300'
            : 'bg-gray-100 border-gray-200 text-gray-700'
        }`}
      >
        <span>Status</span>
        <span>Document</span>
        <span className="text-right">Date</span>
      </div>

      {/* Table Body */}
      {documents.length === 0 ? (
        <div className="text-center text-sm text-gray-400 py-6 italic">No documents listed.</div>
      ) : (
        documents.map((doc, i) => (
          <div
            key={i}
            className={`grid grid-cols-3 items-center px-5 py-3 text-sm border-t transition-colors ${
              darkMode
                ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                : 'border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {/* Checkbox + Status */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked={doc.checked}
                className="accent-teal-500 w-4 h-4"
              />
              <span
                className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${
                  getStatusBadgeClass(doc.status)
                }`}
              >
                {doc.status}
              </span>
            </div>

            {/* Document Name */}
            <div className="truncate max-w-[160px]">
              <a
                href="#"
                className={`underline ${
                  darkMode
                    ? 'text-blue-300 hover:text-blue-400'
                    : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                {doc.name}
              </a>
            </div>

            {/* Date */}
            <span className={`text-xs text-right ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {doc.date}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default DocumentChecklist;
