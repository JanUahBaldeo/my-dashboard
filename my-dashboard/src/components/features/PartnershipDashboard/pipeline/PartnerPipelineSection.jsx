// 🎯 Partner Pipeline Section Component
// Uses the shared pipeline component for partnership dashboard

import SharedPipelineSection from '../../pipeline/SharedPipelineSection';

const PartnerPipelineSection = ({ isAdmin = false }) => {
  return (
    <SharedPipelineSection
      isAdmin={isAdmin}
      dashboardType="partnership"
      showMetrics={true}
      showAddLead={true}
    />
  );
};

export default PartnerPipelineSection;
