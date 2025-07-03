import React from 'react';

const leadsData = [
  {
    partner: 'ABC Title Co.',
    leads: 67,
    mqls: 41,
    cpl: '$12.50',
    source: 'Co-branded email',
    status: 'Active',
    url: '#',
  },
  {
    partner: 'HomeShield Warranty',
    leads: 82,
    mqls: 52,
    cpl: '$9.10',
    source: 'Paid Meta Ads',
    status: 'Pending',
    url: '#',
  },
  {
    partner: 'RateCompare Pro',
    leads: 138,
    mqls: 37,
    cpl: '$15.70',
    source: 'GMB/Web',
    status: 'Active',
    url: '#',
  },
];

const getStatusBadge = (status) => {
  const base = 'text-xs font-semibold px-3 py-1 rounded-full';
  switch (status) {
    case 'Active':
      return `${base} text-green-500 bg-green-100 dark:bg-green-800/20`;
    case 'Pending':
      return `${base} text-yellow-500 bg-yellow-100 dark:bg-yellow-700/20`;
    case 'Paused':
      return `${base} text-red-500 bg-red-100 dark:bg-red-800/20`;
    default:
      return `${base} text-gray-500 bg-gray-100 dark:bg-gray-700/20`;
  }
};

const PartnerLeadsTable = () => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm text-left text-gray-800 dark:text-gray-100">
          <thead className="bg-gray-100 dark:bg-gray-800 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 rounded-tl-xl">Partner</th>
              <th className="px-4 py-3">Leads</th>
              <th className="px-4 py-3">MQLs</th>
              <th className="px-4 py-3">CPL (Cost/Lead)</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3 rounded-tr-xl">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {leadsData.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-3">
                  <a href={row.url} className="text-blue-600 dark:text-blue-400 underline font-medium">
                    {row.partner}
                  </a>
                </td>
                <td className="px-4 py-3 font-medium">{row.leads}</td>
                <td className="px-4 py-3 font-medium">{row.mqls}</td>
                <td className="px-4 py-3">{row.cpl}</td>
                <td className="px-4 py-3">{row.source}</td>
                <td className="px-4 py-3">
                  <span className={getStatusBadge(row.status)}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartnerLeadsTable;
