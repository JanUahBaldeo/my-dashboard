import { motion } from 'framer-motion';
import { Handshake, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const CollaborationStats = () => {
  // Quick Stats Data
  const stats = [
    { label: 'Active Handoffs', value: '8', icon: Handshake, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Pending Reviews', value: '3', icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { label: 'Completed', value: '12', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Blocked', value: '2', icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-50' },
  ];

  return (
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
  );
};

export default CollaborationStats;
