import { motion } from 'framer-motion';
import {
  Filter,
  Clock,
  Upload,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
} from 'lucide-react';

const LOADocumentManagement = ({ documents = [] }) => {
  const stats = [
    { label: 'Pending', value: '1', icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { label: 'Received', value: '2', icon: Upload, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Reviewed', value: '1', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Expired', value: '1', icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-50' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'expired': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'reviewed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'received': return <Upload className="w-5 h-5 text-blue-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'expired': return 'bg-red-500 text-white';
      case 'reviewed': return 'bg-green-500 text-white';
      case 'received': return 'bg-blue-500 text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getActionButton = (status, action) => {
    switch (action) {
      case 'resubmit': return <span className="text-blue-600 hover:text-blue-800 cursor-pointer">Resubmit</span>;
      case 'view': return <span className="text-blue-600 hover:text-blue-800 cursor-pointer">View</span>;
      case 'review': return (
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 hover:text-blue-800 cursor-pointer">Review</span>
        </div>
      );
      case 'request': return <span className="text-blue-600 hover:text-blue-800 cursor-pointer">Request</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Document Management</h1>
            <p className="text-sm text-gray-600 mt-1">Track loan documents and their status</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-lg p-4 border border-gray-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>Pending</option>
            <option>Received</option>
            <option>Reviewed</option>
            <option>Expired</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Types</option>
            <option>Employment Letter</option>
            <option>Property Appraisal</option>
            <option>Bank Statements</option>
            <option>Tax Returns</option>
            <option>Income Verification</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Sort by Due Date</option>
            <option>Sort by Upload Date</option>
            <option>Sort by Document Type</option>
          </select>
        </div>
      </div>

      {/* Document List */}
      <div className="p-6">
        <div className="space-y-4">
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Status Icon */}
              {getStatusIcon(doc.status)}

              {/* Document Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{doc.type}</h3>
                <p className="text-sm text-gray-600">
                  {doc.client}, document ID {doc.loanNumber}
                </p>
                {doc.fileSize && (
                  <p className="text-sm text-gray-500">
                    Due: {doc.dueDate} • {doc.fileSize}
                  </p>
                )}
                {doc.uploadInfo && (
                  <p className="text-sm text-gray-500">
                    {doc.uploadInfo}
                  </p>
                )}
              </div>

              {/* Status Tags */}
              <div className="flex gap-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(doc.status)}`}>
                  {doc.status}
                </span>
                {doc.overdue && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
                    Overdue
                  </span>
                )}
              </div>

              {/* Action Button */}
              <div className="text-sm">
                {getActionButton(doc.status, doc.action)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LOADocumentManagement;
