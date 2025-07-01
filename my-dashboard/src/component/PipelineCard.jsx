const colorMap = {
  teal: 'bg-emerald-600',
  gray: 'bg-gray-700',
  blue: 'bg-sky-600',
  red: 'bg-rose-600',
  orange: 'bg-orange-500',
  green: 'bg-green-600',
};

const PipelineCard = ({ stage, color, icon, leadCount, avgTime, conversion, title, desc }) => {
  const percent = parseFloat(conversion.replace('%', '') || 0);

  return (
    <article
      className="w-[300px] sm:w-[360px] md:w-[420px] h-[350px] flex flex-col
                 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-6 py-3 text-white rounded-t-xl ${colorMap[color] || 'bg-gray-600'}`}>
        <span className="text-sm sm:text-base font-semibold flex items-center gap-2">{icon} {stage}</span>
        <span className="text-lg font-medium opacity-60 hover:opacity-100 cursor-pointer">⋮</span>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 py-4 text-sm sm:text-base space-y-2 text-gray-700 dark:text-gray-300">
        <p><span className="text-gray-500 dark:text-gray-400">No. of Leads:</span> <span className="font-semibold">{leadCount}</span></p>
        <p><span className="text-gray-500 dark:text-gray-400">Average Time:</span> <span className="font-semibold">{avgTime}</span></p>
        <p><span className="text-gray-500 dark:text-gray-400">Conversion:</span> <span className="font-semibold">{conversion}</span></p>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
        <h4 className="font-semibold text-gray-800 dark:text-white mb-1 truncate">{title}</h4>
        <p className="line-clamp-2 text-gray-500 dark:text-gray-300 text-sm">{desc}</p>
      </div>
    </article>
  );
};

export default PipelineCard;
