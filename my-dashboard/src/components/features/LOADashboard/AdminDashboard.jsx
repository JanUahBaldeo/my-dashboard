// ========================================
// 🎯 LOADashboard ADMIN DASHBOARD COMPONENT WITH ALIASED IMPORTS
// ========================================

import React from 'react';
import { Header, Breadcrumb } from '@components';
import { LOAPipelineSection, LOAUnifiedTaskManager, NotificationSection, CommunicationLog, CollaborationHandoff, QuickStats } from '@components/features/LOADashboard';
import { PipelineProvider } from '@context/PipelineContext';

const AdminDashboard = () => {
  return (
    <PipelineProvider>
      <div className="w-screen h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-all overflow-auto">
        <Header />

        <main className="px-6 py-10 space-y-10 w-full h-full">
          {/* ✅ Replaced Breadcrumb */}
          <Breadcrumb path={['LOA Admin', 'Dashboard']} />

          {/* LOA Pipeline */}
          <Section>
            <LOAPipelineSection isAdmin={true} />
          </Section>

          {/* Unified Task Management */}
          <Section>
            <LOAUnifiedTaskManager />
          </Section>

          {/* Notifications and Quick Stats Row */}
          <Section>
            <div className="flex flex-col lg:flex-row gap-8 w-full">
              <div className="flex-1">
                <NotificationSection />
              </div>
              <div className="w-full lg:w-1/3">
                <QuickStats />
              </div>
            </div>
          </Section>

          {/* Communication Log and Collaboration Handoff Row */}
          <Section>
            <div className="flex flex-col lg:flex-row gap-8 w-full">
              <div className="flex-1">
                <CommunicationLog />
              </div>
              <div className="flex-1">
                <CollaborationHandoff />
              </div>
            </div>
          </Section>
        </main>
      </div>
    </PipelineProvider>
  );
};

const Section = ({ title, children }) => (
  <section className="pt-10 border-t border-gray-200 dark:border-gray-700 w-full">
    {title && <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">{title}</h2>}
    {children}
  </section>
);

export default AdminDashboard;
