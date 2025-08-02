// ========================================
// 🎯 LOADashboard COLLABORATION & HANDOFF COMPONENT
// ========================================

import React, { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { CollaborationStats, CollaborationTabs, CollaborationFilters, CollaborationList } from './collaboration';

const CollaborationHandoff = () => {
  const [activeTab, setActiveTab] = useState('conventional');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStage, setFilterStage] = useState('all');

  // Collaboration Data
  const collaborations = [
    {
      id: 1,
      contact: 'Leo Martinez',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      role: 'Loan Officer',
      loanNumber: 'LN-2024-001',
      progress: 'ready',
      stage: 'Underwriting',
      updates: 'All documents submitted and verified. Credit score: 745. Income verified. Ready for underwriting review.',
      priority: 'high',
      dueDate: 'Jan 20, 2024',
    },
    {
      id: 2,
      contact: 'Susan Lawrence',
      avatar: 'https://randomuser.me/api/portraits/women/49.jpg',
      role: 'Processor',
      loanNumber: 'LN-2024-002',
      progress: 'in-progress',
      stage: 'Processing',
      updates: 'Waiting for additional bank statements. Client has been notified. Expected completion: 2 days.',
      priority: 'medium',
      dueDate: 'Jan 22, 2024',
    },
    {
      id: 3,
      contact: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      role: 'Underwriter',
      loanNumber: 'LN-2024-003',
      progress: 'blocked',
      stage: 'Underwriting',
      updates: 'Appraisal review required. Property value discrepancy found. Need additional documentation.',
      priority: 'high',
      dueDate: 'Jan 18, 2024',
    },
    {
      id: 4,
      contact: 'Jennifer Davis',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      role: 'Loan Officer',
      loanNumber: 'LN-2024-004',
      progress: 'completed',
      stage: 'Closing',
      updates: 'Loan approved and cleared to close. All conditions satisfied. Closing scheduled for Jan 25th.',
      priority: 'low',
      dueDate: 'Jan 25, 2024',
    },
    {
      id: 5,
      contact: 'Robert Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      role: 'Processor',
      loanNumber: 'LN-2024-005',
      progress: 'ready',
      stage: 'Processing',
      updates: 'Initial review complete. All required documents received. Ready for underwriting submission.',
      priority: 'medium',
      dueDate: 'Jan 21, 2024',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-500" />
            <div>
              <h1 className="text-lg font-bold text-gray-800">Collaboration & Handoff</h1>
              <p className="text-xs text-gray-600">Track team collaboration and loan stage transitions</p>
            </div>
          </div>
          <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <Plus className="w-3 h-3" />
            New Handoff
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <CollaborationStats />

      {/* Tabs */}
      <CollaborationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Search and Filter */}
      <CollaborationFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterStage={filterStage}
        setFilterStage={setFilterStage}
      />

      {/* Collaboration List - Scrollable */}
      <CollaborationList collaborations={collaborations} />
    </div>
  );
};

export default CollaborationHandoff;
