// ========================================
// 🎯 LOADashboard COMMUNICATION LOG COMPONENT
// ========================================

import React, { useState } from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import { CommunicationStats, CommunicationTabs, CommunicationFilters, CommunicationList } from './communication';

const CommunicationLog = () => {
  const [activeTab, setActiveTab] = useState('borrower');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDirection, setFilterDirection] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Communication Data - More concise descriptions
  const communications = [
    {
      id: 1,
      type: 'email',
      title: 'Additional Documentation Request',
      status: 'unread',
      participant: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      role: 'Borrower',
      loanNumber: 'LN-2024-001',
      email: 'sarah.johnson@email.com',
      direction: 'From:',
      message: 'Please provide updated bank statements for the last 3 months.',
      date: 'Jan 15',
      attachments: 2,
      priority: 'high',
      highlighted: true,
    },
    {
      id: 2,
      type: 'call',
      title: 'Phone outbound',
      status: 'read',
      participant: 'Mike Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      role: 'Borrower',
      loanNumber: 'LN-2024-002',
      direction: 'To:',
      message: 'Discussed loan terms and PMI requirements. Client has questions about payments.',
      date: 'Jan 14',
      priority: 'medium',
    },
    {
      id: 3,
      type: 'note',
      title: 'Note outbound',
      status: 'read',
      participant: 'Lisa Wong',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      role: 'Loan Officer',
      loanNumber: 'LN-2024-003',
      direction: 'Internal:',
      message: 'Client requested rate lock extension. Processing team notified.',
      date: 'Jan 13',
      priority: 'medium',
    },
    {
      id: 4,
      type: 'email',
      title: 'Closing Confirmation',
      status: 'replied',
      participant: 'David Smith',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      role: 'Borrower',
      loanNumber: 'LN-2024-004',
      direction: 'To:',
      message: 'Closing scheduled for January 25th at 2:00 PM. All documents approved.',
      date: 'Jan 12',
      priority: 'low',
    },
    {
      id: 5,
      type: 'system',
      title: 'System inbound',
      status: 'read',
      participant: 'System',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      role: 'System',
      loanNumber: 'LN-2024-005',
      direction: 'System:',
      message: 'Credit report updated. New score: 745. Loan eligibility confirmed.',
      date: 'Jan 11',
      priority: 'low',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-green-500" />
            <div>
              <h1 className="text-lg font-bold text-gray-800">Communications</h1>
              <p className="text-xs text-gray-600">Track all client interactions, notes, and system messages</p>
            </div>
          </div>
          <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <Plus className="w-3 h-3" />
            New Message
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <CommunicationStats />

      {/* Tabs */}
      <CommunicationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Search and Filter */}
      <CommunicationFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
        filterDirection={filterDirection}
        setFilterDirection={setFilterDirection}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      {/* Communication List - Scrollable */}
      <CommunicationList communications={communications} />
    </div>
  );
};

export default CommunicationLog;
