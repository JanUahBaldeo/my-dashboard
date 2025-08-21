import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, PauseCircle, Clock, ArrowUpDown } from 'lucide-react';
import { Tooltip } from '@radix-ui/react-tooltip';

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
    status: 'Paused',
    url: '#',
  },
];

const statusIcon = {
  Active: <CheckCircle size={16} className="text-green-500" />,
  Pending: <Clock size={16} className="text-yellow-500" />,
  Paused: <PauseCircle size={16} className="text-red-500" />,
};

const getStatusBadge = (status) => {
  const base = 'inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full';
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

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
};

const LeadsTable = ({ search, sortKey, setSortKey }) => {
  const sortedData = [...leadsData]
    .filter((d) => d.partner.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (!sortKey) return 0;
      return a[sortKey] > b[sortKey] ? 1 : -1;
    });

  const handleSort = (key) => {
    setSortKey(sortKey === key ? null : key);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Partner
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('leads')}
              >
                <div className="flex items-center space-x-1">
                  <span>Leads</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('mqls')}
              >
                <div className="flex items-center space-x-1">
                  <span>MQLs</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('cpl')}
              >
                <div className="flex items-center space-x-1">
                  <span>CPL</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.map((lead, index) => (
              <motion.tr
                key={lead.partner}
                custom={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {lead.partner}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {lead.leads}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {lead.mqls}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {lead.cpl}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {lead.source}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {statusIcon[lead.status]}
                    <span className={getStatusBadge(lead.status)}>
                      {lead.status}
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsTable;
