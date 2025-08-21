// ========================================
// 🎯 LOADashboard ADMIN DASHBOARD COMPONENT WITH ALIASED IMPORTS
// ========================================

import React from 'react';
import { LOAPipelineSection, LOAUnifiedTaskManager, NotificationSection, CommunicationLog, CollaborationHandoff, QuickStats } from './';
import { PipelineProvider } from '@context/PipelineContext';

const AdminDashboard = () => {
  return (
    <PipelineProvider>
      <div className="w-full">
        <main className="space-y-6 w-full">
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
            <div className="flex flex-col lg:flex-row gap-6 w-full">
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
            <div className="flex flex-col lg:flex-row gap-6 w-full">
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
  <section className="w-full">
    {title && <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">{title}</h2>}
    {children}
  </section>
);

export default AdminDashboard;
