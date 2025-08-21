// ========================================
// 🎯 PARTNER DASHBOARD PAGE WITH ALIASED IMPORTS
// ========================================

import React from 'react';
import { Header } from '@shared/components';
import {
  PartnerLeadsTable,
  PartnerOverviewTable,
  CampaignTrackerTable,
  CTRAnalyticsChart,
  LeadConversionFunnel,
  IntegrationSummary,
  PartnerRecommendations,
  PartnerDashboardInsights,
  TaskManagement,
  CallActivity,
} from '@features';

const PartnerDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* ✅ Top Navigation */}
      <Header />

      {/* ✅ Main Content */}
      <main className="w-full max-w-full px-3 py-3 space-y-3">

        {/* ✅ Section: Lead Generation */}
        <section>
          <PartnerLeadsTable />
        </section>

        {/* ✅ Section: Insights & Task Management (2-column row) */}
        <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <TaskManagement />
          </div>
          <div>
            <PartnerDashboardInsights />
          </div>
        </section>

        {/* ✅ Section: Call Activity */}
        <section>
          <CallActivity />
        </section>

        {/* ✅ Section: Overview Metrics */}
        <section>
          <PartnerOverviewTable />
        </section>

        {/* ✅ Section: CTR Analytics */}
        <section>
          <CTRAnalyticsChart />
        </section>

        {/* ✅ Section: Lead Conversion Funnel & Integration Summary */}
        <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <LeadConversionFunnel />
          </div>
          <div>
            <IntegrationSummary />
          </div>
        </section>

      </main>
    </div>
  );
};

export default PartnerDashboardPage;
