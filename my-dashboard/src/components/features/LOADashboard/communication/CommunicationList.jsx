import { motion } from 'framer-motion';
import { Mail, Phone, FileText, MessageCircle, Eye, Reply, Clock, ArrowRight, Paperclip } from 'lucide-react';

const CommunicationList = ({ communications }) => {
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
  );
};

export default CommunicationList;
