// ========================================
// 🎯 LOADashboard PARENT COMPONENT WITH KANBAN COMPONENTS
// ========================================

import { LOAKanbanColumn } from './pipeline';

const mockStages = [
  {
    title: 'New Leads',
    description: 'Initial leads just entered the pipeline.',
  },
  {
    title: 'Qualified Prospects',
    description: 'Potential clients validated by SDR.',
  },
  {
    title: 'Proposal Sent',
    description: 'Formal proposals sent to client.',
  },
];

const mockLeads = [
  {
    id: '1',
    name: 'John Smith',
    loanType: 'Conventional',
    loanAmount: 250000,
    tags: ['Hot Lead', 'First Time Buyer'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    loanType: 'FHA',
    loanAmount: 180000,
    tags: ['Refinance'],
    updatedAt: new Date().toISOString(),
  },
];

const mockMetrics = {
  leads: 24,
  uniqueLeads: 24,
  avgTime: '3d',
  conversion: 12,
};

const ParentComponent = () => {
  return (
    <div className="flex gap-6 overflow-x-auto pb-6 kanban-scrollbar">
      {mockStages.map((stage, i) => (
        <LOAKanbanColumn
          key={stage.title}
          stage={stage}
          leads={mockLeads}
          metrics={mockMetrics}
          isAdmin={true}
        />
      ))}
    </div>
  );
};

export default ParentComponent;
