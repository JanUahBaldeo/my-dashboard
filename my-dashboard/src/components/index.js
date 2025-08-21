// ========================================
// 🎯 COMPREHENSIVE COMPONENT BARREL EXPORTS
// ========================================

// Layout Components
export { default as Header } from '@layout/Header';
export { default as Breadcrumb } from '@layout/Breadcrumb';
export { default as RoleSwitcher } from '@layout/RoleSwitcher';

// UI Components
export { default as Modal } from '@ui/Modal';
export { default as MetricCard } from '@ui/MetricCard';
export { default as SearchBox } from '@ui/SearchBox';
export { default as TagInput } from '@ui/TagInput';
export { default as ActionInput } from '@ui/ActionInput';
export { default as DnDContainer } from '@ui/DnDContainer';
export { DraggableWrapper } from '@ui/DraggableWrapper';
export { default as PipelineErrorBoundary } from '@ui/PipelineErrorBoundary';

// Form Components
export { default as LeadModal } from '@forms/LeadModal';

// LODashboard Components (Loan Officer Dashboard)
export { default as Dashboard } from '@features/LODashboard/Dashboard';
export { default as CalendarSection } from '@features/LODashboard/CalendarSection';
export { default as UserDashboard } from '@features/LODashboard/UserDashboard';
export { default as CampaignSection } from '@features/LODashboard/CampaignSection';
export { default as MarketingSection } from '@features/LODashboard/MarketingSection';
export { default as ProfileInfo } from '@features/LODashboard/ProfileInfo';
export { default as TaskCard } from '@features/LODashboard/TaskCard';
export { default as TaskSection } from '@features/LODashboard/TaskSection';
export { default as UserTasksSection } from '@features/LODashboard/UserTasksSection';
export { default as TaskManagementDashboard } from '@features/LODashboard/TaskManagementDashboard';

// LOADashboard Components (Loan Administrator Dashboard)
export { default as AdminDashboard } from '@features/LOADashboard/AdminDashboard';
export { default as CommunicationLog } from '@features/LOADashboard/CommunicationLog';
export { default as DocumentChecklist } from '@features/LOADashboard/DocumentChecklist';
export { default as NotificationSection } from '@features/LOADashboard/NotificationSection';
export { default as ParentComponent } from '@features/LOADashboard/ParentComponent';
export { default as QuickStats } from '@features/LOADashboard/QuickStats';
export { default as StatModal } from '@features/LOADashboard/StatModal';

// PartnershipDashboard Components (Partnership Dashboard)
export { default as CampaignTrackerTable } from '@features/PartnershipDashboard/CampaignTrackerTable';
export { default as CTRAnalyticsChart } from '@features/PartnershipDashboard/CTRAnalyticsChart';
export { default as IntegrationSummary } from '@features/PartnershipDashboard/IntegrationSummary';
export { default as LeadConversionFunnel } from '@features/PartnershipDashboard/LeadConversionFunnel';
export { default as PartnerDashboard } from '@features/PartnershipDashboard/PartnerDashboard';
export { default as PartnerDashboardInsights } from '@features/PartnershipDashboard/PartnerDashboardInsights';
export { default as PartnerLeadsTable } from '@features/PartnershipDashboard/PartnerLeadsTable';
export { default as PartnerOverviewTable } from '@features/PartnershipDashboard/PartnerOverviewTable';
export { default as PartnerRecommendations } from '@features/PartnershipDashboard/PartnerRecommendations';
export { default as TaskManagement } from '@features/PartnershipDashboard/TaskManagement';
export { default as CallActivity } from '@features/PartnershipDashboard/CallActivity';
export { default as RecentCalls } from '@features/PartnershipDashboard/RecentCalls';

// Pipeline Feature Components
export { default as PipelineSection } from '@pipeline/PipelineSection';
export { default as KanbanColumn } from '@pipeline/KanbanColumn';
export { default as KanbanCard } from '@pipeline/KanbanCard';
