import { LineChart, Line, ResponsiveContainer } from 'recharts';

const bgColors = {
  mint: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100',
  lemon: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100',
  sky: 'bg-sky-100 text-sky-900 dark:bg-sky-900 dark:text-sky-100',
};

const sampleData = [
  { value: 40 },
  { value: 50 },
  { value: 42 },
  { value: 60 },
  { value: 55 },
  { value: 65 },
  { value: 62 },
];

const MetricCard = ({ title, value, trend, delta, bg, meta }) => {
  const isPositive = trend.startsWith('+');
  const trendColor = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  const trendIcon = isPositive ? '▲' : '▼';
  const percentValue = parseFloat(value);
  const isPercent = !isNaN(percentValue);

  return (
    <div
      className={`min-w-[280px] max-w-[320px] flex-shrink-0 px-6 py-8 rounded-2xl shadow-xl transition-all
                  transform hover:-translate-y-1 hover:shadow-2xl duration-300
                  ${bgColors[bg] || 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'}`}
    >
      <div className="text-base sm:text-lg font-semibold mb-2 tracking-tight">
        {title}
      </div>

      <div className="text-3xl sm:text-4xl font-extrabold mb-2">
        {value}
      </div>

      <div className={`text-sm font-medium flex items-center gap-2 mb-4 ${trendColor}`}>
        <span>{trendIcon}</span>
        <span>{trend}</span>
        <span className="text-gray-700 dark:text-gray-300 text-xs font-normal">{delta}</span>
      </div>

      {isPercent && (
        <div className="w-full bg-gray-300 dark:bg-gray-700 h-2 rounded-full mb-4">
          <div
            className="h-full bg-green-500 dark:bg-green-400 rounded-full transition-all duration-500"
            style={{ width: `${percentValue}%` }}
          />
        </div>
      )}

      <div className="w-full h-20 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Meta footer here */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
        {meta || 'Compared to last week'}
      </div>
    </div>
  );
};

export default MetricCard;
