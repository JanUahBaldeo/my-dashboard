import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertTriangle, ArrowRight, User, Building } from 'lucide-react';

const CollaborationList = ({ collaborations }) => {
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
  );
};

export default CollaborationList;
