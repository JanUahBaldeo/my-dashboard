import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';
import { useTheme } from '../../hooks/useTheme';

const CommunicationLog = () => {
  const { darkMode } = useTheme();

  const tabs = ['Borrower Updates', 'Processor Feedback', 'Agent updates', 'Messages'];
  const loanTabs = ['Loan Type 1', 'Loan Type 2', 'Loan Type 3', 'Loan Type 4'];

  const [activeTab, setActiveTab] = useState('Borrower Updates');
  const [activeLoanTab, setActiveLoanTab] = useState('Loan Type 1');

  const logUsers = [
    { name: 'Althea Burnett', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Daniel Peters', avatar: 'https://randomuser.me/api/portraits/men/64.jpg' },
  ];

  const handoffUsers = [
    { name: 'Leo Martinez', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
    { name: 'Susan Lawrence', avatar: 'https://randomuser.me/api/portraits/women/49.jpg' },
  ];

  return (
    <section className="space-y-16 py-10 text-sm">
      {/* Communication Log */}
      <div>
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-white">
          <img src="https://cdn-icons-png.flaticon.com/512/124/124034.png" alt="whatsapp" className="w-6 h-6" />
          Communication Log
        </h2>

        {/* Tabs */}
        <div className="flex gap-6 font-semibold border-b border-gray-700 mb-6">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 transition-all ${
                tab === activeTab
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-gray-200 border-transparent'
              }`}
            >
              {tab}
              <span className="ml-2 bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                {10 + idx * 2}
              </span>
            </button>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#1F2937] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600">
            <FaFilter /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="bg-[#1F2937] rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 px-6 py-3 bg-[#374151] text-gray-300 font-semibold uppercase text-xs tracking-wide">
            <span>Name</span>
            <span>Date</span>
            <span>Message</span>
          </div>
          <div className="divide-y divide-gray-700">
            {logUsers.map((user, idx) => (
              <div key={idx} className="grid grid-cols-3 px-6 py-4 items-center text-white hover:bg-[#2C3344]">
                <div className="flex items-center gap-2">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  <a href="#" className="text-cyan-400 hover:underline font-medium">{user.name}</a>
                </div>
                <span className="text-sm text-gray-400">MM/DD/YYYY</span>
                <p className="text-sm text-gray-300">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collaboration & Handoff */}
      <div>
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-white">
          <img src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png" alt="handoff" className="w-6 h-6" />
          Collaboration & Handoff
        </h2>

        {/* Loan Tabs */}
        <div className="flex gap-6 font-semibold border-b border-gray-700 mb-6">
          {loanTabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveLoanTab(tab)}
              className={`pb-2 transition-all ${
                tab === activeLoanTab
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-gray-200 border-transparent'
              }`}
            >
              {tab}
              <span className="ml-2 bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                {10 + idx * 2}
              </span>
            </button>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#1F2937] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600">
            <FaFilter /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="bg-[#1F2937] rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 px-6 py-3 bg-[#374151] text-gray-300 font-semibold uppercase text-xs tracking-wide">
            <span>Point of Contact</span>
            <span>Progress</span>
            <span>Updates</span>
          </div>
          <div className="divide-y divide-gray-700">
            {handoffUsers.map((user, idx) => (
              <div key={idx} className="grid grid-cols-3 px-6 py-4 items-center text-white hover:bg-[#2C3344]">
                <div className="flex items-center gap-2">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <div>
                  <span className="inline-block text-xs font-semibold text-white bg-rose-500 px-4 py-1 rounded-full">
                    MARK READY FOR NEXT STAGE
                  </span>
                </div>
                <p className="text-sm text-gray-300">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunicationLog;
