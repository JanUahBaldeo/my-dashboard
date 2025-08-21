import { StatCard } from '@components/ui';
import { FiCalendar, FiClock, FiUser, FiTarget } from 'react-icons/fi';

const CalendarStats = ({ events, taskEvents }) => {
  const getCalendarStats = () => {
    const totalEvents = events.length + taskEvents.length;
    const todayEvents = events.filter(event => {
      const eventDate = new Date(event.start).toDateString();
      const today = new Date().toDateString();
      return eventDate === today;
    }).length;

    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      const today = new Date();
      return eventDate > today;
    }).length;

    const completedEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      const today = new Date();
      return eventDate < today;
    }).length;

    return {
      total: totalEvents,
      today: todayEvents,
      upcoming: upcomingEvents,
      completed: completedEvents,
    };
  };

  const stats = getCalendarStats();

  const statItems = [
    {
      title: 'Total Events',
      value: stats.total,
      icon: FiCalendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Today',
      value: stats.today,
      icon: FiClock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Upcoming',
      value: stats.upcoming,
      icon: FiTarget,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: FiUser,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          bgColor={stat.bgColor}
        />
      ))}
    </div>
  );
};

export default CalendarStats;
