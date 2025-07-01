// QuickStats.jsx
import React from 'react';

const QuickStats = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">📈 Quick Stats</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg shadow">
          <h3 className="text-md font-semibold mb-2">% of loans on schedule</h3>
          <p className="text-5xl font-bold">%</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900 p-6 rounded-lg shadow">
          <h3 className="text-md font-semibold mb-2">Top overdue files</h3>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg shadow">
          <h3 className="text-md font-semibold mb-2">Avg days in processing</h3>
        </div>
      </div>
    </section>
  );
};

export default QuickStats;
