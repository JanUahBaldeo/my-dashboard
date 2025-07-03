import React from 'react';
import { FaChartPie } from 'react-icons/fa';

const PartnerOverviewTable = () => {
  return (
    <section className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition duration-300">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <FaChartPie className="text-green-500" />
          Overview
        </h2>
        <div className="flex gap-3">
          <select className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-white shadow-sm focus:outline-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
          </select>
          <select className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-white shadow-sm focus:outline-none">
            <option>Email</option>
            <option>Social</option>
            <option>Referral</option>
          </select>
        </div>
      </div>

      {/* Overview Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left rounded overflow-hidden">
          <thead className="bg-green-100 dark:bg-green-900 text-gray-800 dark:text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3 font-semibold">Metric</th>
              <th className="px-4 py-3 font-semibold text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-200">
            {[
              ['Total Clicks', '3,457'],
              ['CTR (Click-Through Rate)', '4.8%'],
              ['Leads Generated', '287'],
              ['Qualified Leads (MQLs)', '134'],
              ['Conversion Rate', '13.2%'],
              ['Appointments Booked', '68'],
              ['Top Performing Partner', <span className="text-blue-600 dark:text-blue-400">XYZ Home Warranty</span>]
            ].map(([label, value], i) => (
              <tr
                key={label}
                className={i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}
              >
                <td className="px-4 py-3 font-medium">{label}</td>
                <td className="px-4 py-3 text-right">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PartnerOverviewTable;
