import { useEffect, useState, useRef } from 'react';
import PipelineCard from './PipelineCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

const PipelineSection = () => {
  const scrollRef = useRef(null);
  const [activeCard, setActiveCard] = useState(null);
  const [filterStage, setFilterStage] = useState('All');
  const [pipelineData, setPipelineData] = useState([]);

  const fallbackData = [
    { stage: 'New Lead', color: 'teal', icon: '🟢', leadCount: 25, avgTime: '2:30', conversion: '12%', title: 'Lead A', desc: 'Initial contact made.' },
    { stage: 'Contacted', color: 'gray', icon: '📞', leadCount: 18, avgTime: '3:20', conversion: '10%', title: 'Lead B', desc: 'Waiting for follow-up.' },
    { stage: 'Application Started', color: 'blue', icon: '📝', leadCount: 12, avgTime: '1:45', conversion: '8%', title: 'Lead C', desc: 'Submitted partial form.' },
    { stage: 'Pre-Approved', color: 'red', icon: '✅', leadCount: 7, avgTime: '4:00', conversion: '5%', title: 'Lead D', desc: 'Pre-approval given.' },
    { stage: 'In Underwriting', color: 'orange', icon: '🔍', leadCount: 5, avgTime: '5:15', conversion: '3%', title: 'Lead E', desc: 'Review in progress.' },
    { stage: 'Closed', color: 'green', icon: '🏁', leadCount: 3, avgTime: '6:00', conversion: '2%', title: 'Lead F', desc: 'Deal closed successfully.' },
  ];

  useEffect(() => {
    fetch('/api/pipeline-data')
      .then((res) => res.json())
      .then((data) => setPipelineData(data))
      .catch(() => setPipelineData(fallbackData));
  }, []);

  const scroll = (dir) => {
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -500 : 500,
      behavior: 'smooth',
    });
  };

  const filteredData =
    filterStage === 'All'
      ? pipelineData
      : pipelineData.filter((item) => item.stage === filterStage);

  return (
    <section className="relative w-full bg-white dark:bg-gray-800 px-6 sm:px-10 py-10 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in text-gray-800 dark:text-white">
      {/* Header + Arrows */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold">🧭 Pipeline Overview</h2>
        <div className="flex gap-3 text-xl">
          <button onClick={() => scroll('left')} className="hover:text-teal-600 transition">←</button>
          <button onClick={() => scroll('right')} className="hover:text-teal-600 transition">→</button>
        </div>
      </div>

      {/* Stage Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {['All', 'New Lead', 'Contacted', 'Application Started', 'Pre-Approved', 'In Underwriting', 'Closed'].map((stage) => (
          <button
            key={stage}
            onClick={() => setFilterStage(stage)}
            className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 ${
              filterStage === stage
                ? 'bg-teal-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            {stage}
          </button>
        ))}
      </div>

      {/* Horizontal Scrollable Pipeline Cards */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
      >
        {filteredData.map((item, i) => (
          <div
            key={i}
            className="snap-start flex-shrink-0 cursor-pointer"
            onClick={() => setActiveCard(item)}
          >
            <PipelineCard {...item} />
          </div>
        ))}
      </div>

      {/* Modal View for Active Card */}
      {activeCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white w-full max-w-3xl p-8 rounded-2xl shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setActiveCard(null)}
              className="absolute top-4 right-6 text-gray-500 dark:text-gray-300 text-2xl hover:text-gray-700 dark:hover:text-white"
            >
              ×
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {activeCard.stage} Details
            </h2>
            <p className="mb-2 text-sm">
              <strong>Leads:</strong> {activeCard.leadCount}
            </p>
            <p className="mb-2 text-sm">
              <strong>Avg Time:</strong> {activeCard.avgTime}
            </p>
            <p className="mb-4 text-sm">
              <strong>Conversion:</strong> {activeCard.conversion}
            </p>
            <p className="mb-6 text-sm text-gray-700 dark:text-gray-300">{activeCard.desc}</p>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[{ name: 'Week 1', value: 20 }, { name: 'Week 2', value: 35 }]}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkTheme() ? '#1f2937' : '#ffffff',
                    color: isDarkTheme() ? '#e5e7eb' : '#0f172a',
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  );
};

// Optional helper to check system theme
const isDarkTheme = () =>
  document.documentElement.classList.contains('dark');

export default PipelineSection;
