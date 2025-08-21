import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, PauseCircle, Clock, ArrowUpDown, Info, TrendingUp, DollarSign, Users, Target } from 'lucide-react';
import { Tooltip } from '@radix-ui/react-tooltip';
import { PartnerPipelineSection } from './pipeline';
import { LeadsKPICards, LeadsTable } from './leads';

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

const PartnerLeadsTable = () => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);

  const sortedData = [...leadsData]
    .filter((d) => d.partner.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (!sortKey) return 0;
      return a[sortKey] > b[sortKey] ? 1 : -1;
    });

  return (
    <div className="w-full max-w-7xl mx-auto px-2 lg:px-4">
      {/* Production Partner Dashboard Header */}
      <div className="mb-6 lg:mb-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 lg:mb-6">Production Partner Dashboard</h2>

        {/* KPI Cards Section */}
        <LeadsKPICards />

        {/* Search and Filter Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search partners..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <LeadsTable search={search} sortKey={sortKey} setSortKey={setSortKey} />
      </div>
    </div>
  );
};

export default PartnerLeadsTable;
