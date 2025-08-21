// ✅ Place this FIRST, at the top of the file
const colorMap = {
  teal: 'bg-emerald-600',
  gray: 'bg-gray-700',
  blue: 'bg-sky-600',
  red: 'bg-rose-600',
  orange: 'bg-orange-500',
  green: 'bg-green-600',
};

// ✅ Then define the component
const PipelineCard = ({
  stage,
  color,
  icon,
  leadCount,
  avgTime,
  conversion,
  title,
  desc,
  className = '',
}) => {
  const percent = parseFloat(conversion?.replace('%', '') || 0);

  return (
    <article
      className={`w-[220px] sm:w-[240px] md:w-[260px] h-[340px] flex flex-col
        bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
        rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 ${className}`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-2 text-white rounded-t-2xl font-medium tracking-wide ${colorMap[color] || 'bg-gray-600'}`}
      >
        <span className="text-sm flex items-center gap-2">
          {icon} {stage}
        </span>
        <span className="text-lg opacity-60 hover:opacity-100 cursor-pointer">⋮</span>
      </div>

      {/* Body */}
      <div className="flex-1 px-4 py-3 text-sm space-y-2 text-gray-700 dark:text-gray-300">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Leads</span>
          <span className="font-semibold">{leadCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Avg Time</span>
          <span className="font-semibold">{avgTime}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Conversion</span>
          <span className="font-semibold">{conversion}</span>
        </div>

        <div className="mt-3">
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-800 dark:text-white text-sm mb-1 truncate">
          {title}
        </h4>
        <p className="line-clamp-2 text-xs text-gray-500 dark:text-gray-300">{desc}</p>
      </div>
    </article>
  );
};

export default PipelineCard;
