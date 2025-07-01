import React from 'react';
import { FaFilter } from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';

const CommunicationLog = () => {
  const tabs = ['Borrower Updates', 'Processor Feedback', 'Agent updates', 'Messages'];
  const loanTabs = ['Loan Type 1', 'Loan Type 2', 'Loan Type 3', 'Loan Type 4'];
  const activeTab = 'Borrower Updates';
  const activeLoanTab = 'Loan Type 1';

  return (
    <section className="space-y-12 py-10">
      {/* Communication Log Section */}
      <div>
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <img src="https://cdn-icons-png.flaticon.com/512/124/124034.png" alt="whatsapp" className="w-6 h-6" />
          Communication Log
        </h2>
        <div className="flex gap-4 text-sm font-semibold mb-4 border-b">
          {tabs.map((tab, idx) => (
            <div
              key={tab}
              className={`pb-2 px-2 flex items-center gap-1 border-b-4 ${
                tab === activeTab ? 'border-cyan-600 text-cyan-700' : 'border-transparent text-gray-400'
              }`}
            >
              {tab} <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-0.5">{(10 + idx * 2)}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none"
            />
            <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button className="flex items-center gap-1 px-4 py-2 rounded-md bg-gray-100 text-gray-600">
            <FaFilter /> Filter
          </button>
        </div>

        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 text-sm font-semibold px-6 py-2 bg-gray-200">
            <span>LOREM IPSUM</span>
            <span>LOREM IPSUM</span>
            <span>LOREM IPSUM</span>
          </div>
          <div className="divide-y">
            {[{
              name: 'Althea Burnett',
              avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
            }, {
              name: 'Daniel Peters',
              avatar: 'https://randomuser.me/api/portraits/men/64.jpg'
            }].map((user, idx) => (
              <div key={idx} className="grid grid-cols-3 px-6 py-4 items-center">
                <div className="flex items-center gap-2">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  <a href="#" className="text-blue-600 hover:underline font-medium">{user.name}</a>
                </div>
                <span className="text-sm text-gray-500">MM/DD/YYYY</span>
                <p className="text-sm text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collaboration & Handoff Section */}
      <div>
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <img src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png" alt="collab" className="w-6 h-6" />
          Collaboration & Handoff
        </h2>
        <div className="flex gap-4 text-sm font-semibold mb-4 border-b">
          {loanTabs.map((tab, idx) => (
            <div
              key={tab}
              className={`pb-2 px-2 flex items-center gap-1 border-b-4 ${
                tab === activeLoanTab ? 'border-cyan-600 text-cyan-700' : 'border-transparent text-gray-400'
              }`}
            >
              {tab} <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-0.5">{(10 + idx * 2)}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none"
            />
            <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button className="flex items-center gap-1 px-4 py-2 rounded-md bg-gray-100 text-gray-600">
            <FaFilter /> Filter
          </button>
        </div>

        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 text-sm font-semibold px-6 py-2 bg-gray-200">
            <span>POINT OF CONTACT</span>
            <span>PROGRESS</span>
            <span>UPDATES</span>
          </div>
          <div className="divide-y">
            {[{
              name: 'Leo Martinez',
              avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
            }, {
              name: 'Susan Lawrence',
              avatar: 'https://randomuser.me/api/portraits/women/49.jpg'
            }].map((user, idx) => (
              <div key={idx} className="grid grid-cols-3 px-6 py-4 items-center">
                <div className="flex items-center gap-2">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  <span className="font-medium text-gray-700">{user.name}</span>
                </div>
                <span className="text-xs font-semibold text-white bg-rose-500 px-3 py-1 rounded-full">
                  MARK READY FOR NEXT STAGE
                </span>
                <p className="text-sm text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunicationLog;
