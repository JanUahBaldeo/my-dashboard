import React from 'react';

const CampaignTrackerTable = () => {
  return (
    <section className="w-full">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
        📈 Campaign Tracker / A/B Testing Performance
      </h2>

      {/* Table Container without border */}
      <div className="overflow-x-auto rounded-xl bg-slate-900 shadow-md">
        <table className="min-w-full text-sm text-left text-slate-200">
          {/* Table Head */}
          <thead className="bg-yellow-200 text-slate-800 uppercase text-xs tracking-wider">
            <tr>
              <th className="py-3 px-6">Campaign Name</th>
              <th className="py-3 px-6">Partner</th>
              <th className="py-3 px-6">Variant</th>
              <th className="py-3 px-6">CTR</th>
              <th className="py-3 px-6">Leads</th>
              <th className="py-3 px-6">Conversion Rate</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-800">
            <tr className="hover:bg-slate-800 transition">
              <td className="py-3 px-6 text-blue-400 underline cursor-pointer">ABC Title Co.</td>
              <td className="py-3 px-6">67</td>
              <td className="py-3 px-6">41</td>
              <td className="py-3 px-6">6.1%</td>
              <td className="py-3 px-6">53</td>
              <td className="py-3 px-6">14.7%</td>
            </tr>
            <tr className="hover:bg-slate-800 transition">
              <td className="py-3 px-6 text-blue-400 underline cursor-pointer">HomeShield Warranty</td>
              <td className="py-3 px-6">82</td>
              <td className="py-3 px-6">52</td>
              <td className="py-3 px-6">3.3%</td>
              <td className="py-3 px-6">21</td>
              <td className="py-3 px-6">9.4%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CampaignTrackerTable;
