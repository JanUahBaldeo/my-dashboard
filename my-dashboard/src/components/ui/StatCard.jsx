import { motion } from 'framer-motion';
import { FiAlertTriangle, FiClock, FiCheckCircle, FiTarget, FiCalendar, FiTag, FiEye } from 'react-icons/fi';

const iconMap = {
  overdue: { icon: FiAlertTriangle, color: 'red', gradient: 'from-red-100 to-red-200' },
  pending: { icon: FiClock, color: 'blue', gradient: 'from-blue-100 to-blue-200' },
  completed: { icon: FiCheckCircle, color: 'emerald', gradient: 'from-emerald-100 to-emerald-200' },
  total: { icon: FiTarget, color: 'purple', gradient: 'from-purple-100 to-purple-200' },
  events: { icon: FiCalendar, color: 'blue', gradient: 'from-blue-100 to-blue-200' },
  week: { icon: FiClock, color: 'emerald', gradient: 'from-emerald-100 to-emerald-200' },
  month: { icon: FiTag, color: 'purple', gradient: 'from-purple-100 to-purple-200' },
  upcoming: { icon: FiEye, color: 'orange', gradient: 'from-orange-100 to-orange-200' },
};

const StatCard = ({
  type,
  title,
  value,
  description,
  delay = 0.1,
  className = 'hover:border-gray-200',
}) => {
  const config = iconMap[type];
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`group bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition-all duration-500 border border-gray-100 ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 bg-gradient-to-br ${config.gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <IconComponent className={`w-4 h-4 text-${config.color}-600`} />
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      <p className={`text-xs text-${config.color}-600 font-medium`}>{description}</p>
    </motion.div>
  );
};

export default StatCard;
