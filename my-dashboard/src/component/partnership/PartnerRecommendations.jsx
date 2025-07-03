import React from 'react';

const PartnerRecommendations = () => {
  return (
    <section className="w-full bg-transparent text-white">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        🛠️ Actionable Tasks & Recommendations
      </h2>

      <div className="space-y-4">
        {/* Warning Task */}
        <div className="bg-yellow-100/90 text-gray-900 px-5 py-3 rounded-lg flex justify-between items-center shadow hover:shadow-md transition">
          <span>⚠️ Underperforming partner flagged (CTR &lt; 2%)</span>
          <button className="text-xl text-gray-800 hover:text-black">▶</button>
        </div>

        {/* Review Task */}
        <div className="bg-emerald-100/90 text-gray-900 px-5 py-3 rounded-lg flex justify-between items-center shadow hover:shadow-md transition">
          <span>🔍 Campaigns with low conversion needing review</span>
          <button className="text-xl text-gray-800 hover:text-black">▶</button>
        </div>

        {/* Suggestions */}
        <div className="bg-yellow-200/80 text-gray-900 px-5 py-3 rounded-lg flex justify-between items-center shadow hover:shadow-md transition">
          <span>🧪 Suggested tests (CTA, landing page, offer)</span>
          <button className="text-xl text-gray-800 hover:text-black">▶</button>
        </div>

        {/* High Performers Checklist */}
        <div className="bg-blue-100/90 px-5 py-4 rounded-lg shadow hover:shadow-md transition text-gray-900">
          <p className="font-semibold mb-2 flex justify-between items-center text-base">
            🌟 High-performing partners for scaling <span className="text-sm">▼</span>
          </p>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="form-checkbox text-blue-500" />
                <span className="underline cursor-pointer">Lorem ipsum dolor sit amet</span>
              </label>
            </li>
            <li>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox text-blue-500" />
                <span className="underline cursor-pointer">Lorem ipsum dolor sit amet</span>
              </label>
            </li>
            <li>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox text-blue-500" />
                <span className="underline cursor-pointer">Lorem ipsum dolor sit amet</span>
              </label>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PartnerRecommendations;
