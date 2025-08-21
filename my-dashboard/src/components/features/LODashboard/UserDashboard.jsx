// ========================================
// 🎯 USER DASHBOARD COMPONENT WITH ALIASED IMPORTS
// ========================================

import { useParams } from 'react-router-dom';
import { Header } from '@components';
import CalendarSection from './CalendarSection';

const UserDashboard = () => {
  const { userId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header userId={userId} />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* 🔁 Return to Admin */}
        <div className="flex justify-end">
          <button
            onClick={() => window.history.back()}
            className="btn btn-secondary"
          >
            ← Go Back
          </button>
        </div>

        {/* 📅 Personal Calendar Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">📅 Your Calendar</h2>
          <CalendarSection userId={userId} />
        </section>

        {/* 🔍 Optional future sections */}
        {/* <UserMetrics userId={userId} /> */}
        {/* <ProfileInfo userId={userId} /> */}
      </main>
    </div>
  );
};

export default UserDashboard;
