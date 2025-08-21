import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  FiAlertTriangle,
  FiClock,
  FiCheckCircle,
  FiTarget,
  FiCalendar,
  FiTag,
  FiEye,
} from 'react-icons/fi';

const VARIANTS = {
  overdue:   { icon: FiAlertTriangle, gradient: 'from-red-100 to-red-200',    text: 'text-red-600' },
  pending:   { icon: FiClock,         gradient: 'from-blue-100 to-blue-200',  text: 'text-blue-600' },
  completed: { icon: FiCheckCircle,   gradient: 'from-emerald-100 to-emerald-200', text: 'text-emerald-600' },
  total:     { icon: FiTarget,        gradient: 'from-purple-100 to-purple-200',   text: 'text-purple-600' },
  events:    { icon: FiCalendar,      gradient: 'from-blue-100 to-blue-200',  text: 'text-blue-600' },
  week:      { icon: FiClock,         gradient: 'from-emerald-100 to-emerald-200', text: 'text-emerald-600' },
  month:     { icon: FiTag,           gradient: 'from-purple-100 to-purple-200',   text: 'text-purple-600' },
  upcoming:  { icon: FiEye,           gradient: 'from-orange-100 to-orange-200',   text: 'text-orange-600' },
};

const CARD_BASE =
  'bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 ' +
  'border border-gray-100';

const ICON_WRAP_BASE =
  'w-8 h-8 bg-gradient-to-br rounded-lg flex items-center justify-center ' +
  'transition-transform duration-200 group-hover:scale-110';

const StatCard = ({
  type = 'total',
  title = '',
  value = 0,
  description = '',
  delay = 0, // default to 0 for no perceived lag
  className = '',
}) => {
  const cfg = VARIANTS[type] || VARIANTS.total;
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`group ${CARD_BASE} ${className}`}
      aria-label={`${title}: ${value}`}
      role="region"
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`${ICON_WRAP_BASE} ${cfg.gradient}`} aria-hidden="true">
          <Icon className={`w-4 h-4 ${cfg.text}`} />
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
            {title}
          </p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>

      {description ? (
        <p className={`text-xs font-medium ${cfg.text}`}>{description}</p>
      ) : null}
    </motion.div>
  );
};

export default memo(StatCard);
