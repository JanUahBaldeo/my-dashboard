// 🎯 Pipeline Section Component
// Uses the shared pipeline component for general dashboard

import SharedPipelineSection from './SharedPipelineSection';

const PipelineSection = ({ isAdmin = false }) => {
  return (
    <SharedPipelineSection
      isAdmin={isAdmin}
      dashboardType="general"
      showMetrics={true}
      showAddLead={true}
    />
  );
};

export default PipelineSection;
