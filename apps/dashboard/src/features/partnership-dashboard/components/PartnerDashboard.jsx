// ========================================
// 🎯 PARTNER DASHBOARD COMPONENT WITH ALIASED IMPORTS
// ========================================

import React from 'react';
import { Header } from '@shared/components';
import {
  PartnerOverviewTable,
  PartnerLeadsTable,
  LeadConversionFunnel,
  PartnerDashboardInsights,
  TaskManagement,
} from '@features';

const PartnerDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* ✅ Top Navigation */}
      <Header />

      {/* ✅ Page Content */}
      <main >

        {/* ✅ Partner Leads Table */}
        <section >
          <h2 className="text-lg font-semibold mb-3">Lead Generation</h2>
          <PartnerLeadsTable />
        </section>

        {/* ✅ Funnel */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
          <LeadConversionFunnel />
        </section>

        {/* ✅ Task Management */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
          <TaskManagement />
        </section>

        {/* ✅ Campaigns / Tasks / Integration */}
        <section className="rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <PartnerDashboardInsights />
        </section>

        {/* ✅ Call Activity */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
          <CallActivity />
        </section>

        {/* ✅ Overview Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
          <PartnerOverviewTable />
        </section>
      </main>
    </div>
  );
};

export default PartnerDashboardPage;
