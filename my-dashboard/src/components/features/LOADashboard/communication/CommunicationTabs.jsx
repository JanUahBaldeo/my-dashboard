const CommunicationTabs = ({ activeTab, setActiveTab }) => {
  // Tab Data
  const tabs = [
    { id: 'borrower', label: 'Borrower Updates', count: 10 },
    { id: 'processor', label: 'Processor Feedback', count: 12 },
    { id: 'agent', label: 'Agent Updates', count: 14 },
    { id: 'messages', label: 'Messages', count: 16 },
  ];

  return (
    <div className="px-4 pt-3 border-b border-gray-200">
      <div className="flex gap-1 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#01818E] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
            <span className="bg-white/20 px-1 py-0.5 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CommunicationTabs;
