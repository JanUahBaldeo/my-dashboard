import { motion } from 'framer-motion';

const PipelineMetrics = ({ showMetrics, leadsByStage, metrics }) => {
  if (!showMetrics) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200"
    >
      <div className="px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#01818E] mb-1">
              {Object.values(leadsByStage || {}).reduce((total, leads) => total + (leads?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-600 font-medium">Total Leads</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {metrics?.conversionRate || 0}%
            </div>
            <div className="text-sm text-gray-600 font-medium">Conversion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {metrics?.avgTimeInPipeline || '0:00'}
            </div>
            <div className="text-sm text-gray-600 font-medium">Avg Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              ${(metrics?.totalValue || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 font-medium">Total Value</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PipelineMetrics;
