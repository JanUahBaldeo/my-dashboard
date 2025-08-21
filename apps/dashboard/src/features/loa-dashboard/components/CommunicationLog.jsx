// ========================================
// 🎯 LOADashboard COMMUNICATION LOG COMPONENT
// ========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Phone,
  FileText,
  Mail,
  Plus,
  Search,
  Filter,
  Paperclip,
  Eye,
  Reply,
  Clock,
  ArrowRight,
  User,
} from 'lucide-react';

const CommunicationLog = () => {
  const [activeTab, setActiveTab] = useState('borrower');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDirection, setFilterDirection] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Quick Stats Data
  const stats = [
    { label: 'Emails', value: '2', icon: Mail, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Calls', value: '1', icon: Phone, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Notes', value: '1', icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { label: 'Unread', value: '1', icon: MessageCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
  ];

  // Tab Data
  const tabs = [
    { id: 'borrower', label: 'Borrower Updates', count: 10 },
    { id: 'processor', label: 'Processor Feedback', count: 12 },
    { id: 'agent', label: 'Agent Updates', count: 14 },
    { id: 'messages', label: 'Messages', count: 16 },
  ];

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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4 text-blue-500" />;
      case 'call': return <Phone className="w-4 h-4 text-green-500" />;
      case 'note': return <FileText className="w-4 h-4 text-purple-500" />;
      case 'system': return <MessageCircle className="w-4 h-4 text-gray-500" />;
      default: return <MessageCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusButton = (status) => {
    switch (status) {
      case 'unread':
        return (
          <button className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full hover:bg-red-700 transition-colors">
            <Eye className="w-3 h-3" />
            UNREAD
          </button>
        );
      case 'read':
        return (
          <button className="inline-flex items-center gap-1 px-3 py-1 bg-gray-600 text-white text-xs font-semibold rounded-full hover:bg-gray-700 transition-colors">
            <Clock className="w-3 h-3" />
            READ
          </button>
        );
      case 'replied':
        return (
          <button className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full hover:bg-green-700 transition-colors">
            <Reply className="w-3 h-3" />
            REPLIED
          </button>
        );
      default:
        return (
          <button className="inline-flex items-center gap-1 px-3 py-1 bg-gray-600 text-white text-xs font-semibold rounded-full">
            <Clock className="w-3 h-3" />
            READ
          </button>
        );
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
              placeholder="Search communications..."
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
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01818E] text-sm"
            >
              <option value="all">All Types</option>
              <option value="email">Email</option>
              <option value="call">Call</option>
              <option value="note">Note</option>
              <option value="system">System</option>
            </select>
            <select
              value={filterDirection}
              onChange={(e) => setFilterDirection(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01818E] text-sm"
            >
              <option value="all">All Direction</option>
              <option value="inbound">Inbound</option>
              <option value="outbound">Outbound</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01818E] text-sm"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        </div>
      </div>

      {/* Communication List - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {communications.map((comm, index) => (
            <motion.div
              key={comm.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${
                comm.highlighted ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              {/* Contact Info */}
              <div className="flex items-center gap-2 min-w-[160px]">
                <img
                  src={comm.avatar}
                  alt={comm.participant}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{comm.participant}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    {getTypeIcon(comm.type)}
                    <span>{comm.role}</span>
                  </div>
                  <p className="text-xs text-gray-500">{comm.loanNumber}</p>
                </div>
              </div>

              {/* Status Button */}
              <div className="flex-1">
                {getStatusButton(comm.status)}
              </div>

              {/* Communication Details */}
              <div className="flex-1">
                <p className="text-sm text-gray-700 mb-1 font-medium">{comm.title}: {comm.message}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getPriorityBadge(comm.priority)}`}>
                    {comm.priority} priority
                  </span>
                  {comm.attachments && (
                    <div className="flex items-center gap-1 text-gray-400">
                      <Paperclip className="w-3 h-3" />
                      <span className="text-xs">{comm.attachments} attachments</span>
                    </div>
                  )}
                  <span className="text-xs text-gray-500">Due: {comm.date}</span>
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

export default CommunicationLog;
