
import Header from './Header';
import MarketingSection from './MarketingSection';
import PipelineSection from './PipelineSection';
import CampaignSection from './CampaignSection';
import TaskSection from './TaskSection';
import CalendarSection from './CalendarSection'; 

const Dashboard = () => (
  <div className="w-full min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100 text-base md:text-lg">
    <Header />

    <main className="flex flex-col gap-16 px-4 sm:px-6 md:px-10 lg:px-20">
      <PipelineSection />

      <section className="bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-2xl px-6 sm:px-8 md:px-10 py-10 sm:py-12 transition-all hover:shadow-xl hover:-translate-y-1">
        <MarketingSection />
      </section>

      <section className="bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-2xl px-6 sm:px-8 md:px-10 py-10 sm:py-12 transition-all hover:shadow-xl">
        <CampaignSection />
      </section>

      <section className="bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-2xl px-6 sm:px-8 md:px-10 py-10 sm:py-12 transition-all hover:shadow-xl">
        <TaskSection />
      </section>

      {/* ✅ NEW: Calendar Section */}
      <section className="bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-2xl px-6 sm:px-8 md:px-10 py-10 sm:py-12 transition-all hover:shadow-xl mb-10">
        <CalendarSection />
      </section>
    </main>
  </div>
);

export default Dashboard;
