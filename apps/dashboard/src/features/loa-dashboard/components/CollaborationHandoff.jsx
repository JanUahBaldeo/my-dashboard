// ========================================
// 🎯 LOADashboard COLLABORATION & HANDOFF COMPONENT
// ========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  Handshake,
  Clock,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  User,
  Building,
} from 'lucide-react';

const CollaborationHandoff = () => {
  const [activeTab, setActiveTab] = useState('conventional');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStage, setFilterStage] = useState('all');

  // Quick Stats Data
  const stats = [
    { label: 'Active Handoffs', value: '8', icon: Handshake, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Pending Reviews', value: '3', icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { label: 'Completed', value: '12', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Blocked', value: '2', icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-50' },
  ];

  // Tab Data
  const tabs = [
    { id: 'conventional', label: 'Conventional Loans', count: 10 },
    { id: 'fha', label: 'FHA Loans', count: 12 },
    { id: 'va', label: 'VA Loans', count: 14 },
    { id: 'usda', label: 'USDA Loans', count: 16 },
  ];

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

  const getProgressButton = (progress) => {
    switch (progress) {
      case 'ready':
        return (
          <button className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full hover:bg-green-700 transition-colors">
            <CheckCircle className="w-3 h-3" />
            READY FOR NEXT STAGE
          </button>
        );
      case 'in-progress':
        return (
          <button className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full hover:bg-blue-700 transition-colors">
            <Clock className="w-3 h-3" />
            IN PROGRESS
          </button>
        );
      case 'blocked':
        return (
          <button className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full hover:bg-red-700 transition-colors">
            <AlertTriangle className="w-3 h-3" />
            BLOCKED
          </button>
        );
      case 'completed':
        return (
          <button className="inline-flex items-center gap-1 px-3 py-1 bg-gray-600 text-white text-xs font-semibold rounded-full">
            <CheckCircle className="w-3 h-3" />
            COMPLETED
          </button>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Loan Officer': return <User className="w-4 h-4 text-blue-500" />;
      case 'Processor': return <Building className="w-4 h-4 text-green-500" />;
      case 'Underwriter': return <CheckCircle className="w-4 h-4 text-purple-500" />;
      default: return <User className="w-4 h-4 text-gray-500" />;
    }
  };

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
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-lg p-3 border border-gray-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                  <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-6 h-6 ${stat.color} opacity-80`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tabs */}
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

      {/* Search and Filter */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search collaborations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01818E] focus:border-transparent text-sm"
            />
          </div>
          <div className="flex gap-1">
            <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm">
              <Filter className="w-3 h-3" />
              Filter
            </button>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01818E] text-sm"
            >
              <option value="all">All Status</option>
              <option value="ready">Ready</option>
              <option value="in-progress">In Progress</option>
              <option value="blocked">Blocked</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01818E] text-sm"
            >
              <option value="all">All Stages</option>
              <option value="processing">Processing</option>
              <option value="underwriting">Underwriting</option>
              <option value="closing">Closing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Collaboration List - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {collaborations.map((collab, index) => (
            <motion.div
              key={collab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Contact Info */}
              <div className="flex items-center gap-2 min-w-[160px]">
                <img
                  src={collab.avatar}
                  alt={collab.contact}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{collab.contact}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    {getRoleIcon(collab.role)}
                    <span>{collab.role}</span>
                  </div>
                  <p className="text-xs text-gray-500">{collab.loanNumber}</p>
                </div>
              </div>

              {/* Progress Button */}
              <div className="flex-1">
                {getProgressButton(collab.progress)}
              </div>

              {/* Updates */}
              <div className="flex-1">
                <p className="text-sm text-gray-700 mb-1">{collab.updates}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getPriorityBadge(collab.priority)}`}>
                    {collab.priority} priority
                  </span>
                  <span className="text-xs text-gray-500">Due: {collab.dueDate}</span>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-2">
                <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollaborationHandoff;
