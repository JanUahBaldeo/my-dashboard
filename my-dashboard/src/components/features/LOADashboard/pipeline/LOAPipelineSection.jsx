// 🎯 LOA Pipeline Section Component
// Uses the shared pipeline component for LOA dashboard

import SharedPipelineSection from '../../pipeline/SharedPipelineSection';

const LOAPipelineSection = ({ isAdmin = false }) => {
  return (
    <SharedPipelineSection
      isAdmin={isAdmin}
      dashboardType="admin"
      showMetrics={true}
      showAddLead={true}
    />
  );
};

export default LOAPipelineSection;
