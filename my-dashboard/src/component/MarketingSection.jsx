import MetricCard from './MetricCard';
import { motion } from 'framer-motion';

const metrics = [
  {
    title: 'Email Open Rate',
    value: '58%',
    trend: '+18%',
    delta: '+3.8k this week',
    bg: 'mint',
  },
  {
    title: 'Click-Through Rate',
    value: '24%',
    trend: '+12%',
    delta: '+1.2k this week',
    bg: 'lemon',
  },
  {
    title: 'Contact Growth Tracker',
    value: '1.5k',
    trend: '+9%',
    delta: '+140 this week',
    bg: 'sky',
  },
];

const MarketingSection = () => {
  return (
    <section className="flex flex-col lg:flex-row justify-between items-start gap-10 animate-fade-in">
      {/* Metric Cards in horizontal scroll */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-2 pr-2">
        {metrics.map((m, i) => (
          <MetricCard key={i} {...m} />
        ))}
      </div>

      {/* Purpose Paragraph Section */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 w-full lg:max-w-md xl:max-w-lg top-0 sticky self-start text-base sm:text-lg text-gray-800 dark:text-gray-100 font-medium leading-relaxed pr-4 sm:pr-6 lg:pr-10"
      >
        <div className="relative pl-5 sm:pl-8 border-l-4 border-teal-500 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg">
          <h3 className="text-xl sm:text-2xl font-bold text-teal-600 dark:text-teal-400 mb-4 tracking-tight">
            📈 Marketing Purpose
          </h3>

          <p className="mb-4">
            The goal is to build a <strong className="text-teal-700 dark:text-teal-300">WORKDESK</strong> —
            a clean, organized space for handling your tasks and campaigns with purpose.
          </p>

          <p className="text-gray-600 dark:text-gray-300">
            If something isn’t <span className="font-semibold text-teal-700 dark:text-teal-400">actionable</span>,
            then it needs to be reframed. Metrics aren’t just for show — they should fuel momentum and guide your
            next move.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default MarketingSection;
