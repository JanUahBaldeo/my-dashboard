// ========================================
// 🎯 TASK MANAGEMENT PAGE
// ========================================

import { Header, TaskManagementDashboard } from '@components';

export default function TaskManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <TaskManagementDashboard />
    </div>
  );
}
