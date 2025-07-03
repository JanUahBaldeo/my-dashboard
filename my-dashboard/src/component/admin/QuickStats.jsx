import React from 'react';
import CountUp from 'react-countup';
import { BsSpeedometer2 } from 'react-icons/bs';
import { FaExclamationTriangle } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';

const QuickStats = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-white">📈 Quick Stats</h2>
      
      <div className="flex flex-col gap-4">
        {/* Loans on Schedule */}
        <div className="bg-blue-700 text-white p-6 rounded-lg shadow min-h-[120px] flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <BsSpeedometer2 className="text-xl" />
            <h3 className="text-md font-semibold">% of loans on schedule</h3>
          </div>
          <p className="text-5xl font-bold mt-2">
            <CountUp end={82} duration={2} suffix="%" />
          </p>
        </div>

        {/* Top Overdue Files */}
        <div className="bg-amber-800 text-white p-6 rounded-lg shadow min-h-[120px] flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <FaExclamationTriangle className="text-xl" />
            <h3 className="text-md font-semibold">Top overdue files</h3>
          </div>
          <p className="text-lg text-white/80 mt-4">—</p>
        </div>

        {/* Avg Days in Processing */}
        <div className="bg-green-800 text-white p-6 rounded-lg shadow min-h-[120px] flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <FiClock className="text-xl" />
            <h3 className="text-md font-semibold">Avg days in processing</h3>
          </div>
          <p className="text-lg text-white/80 mt-4">—</p>
        </div>
      </div>
    </section>
  );
};

export default QuickStats;
