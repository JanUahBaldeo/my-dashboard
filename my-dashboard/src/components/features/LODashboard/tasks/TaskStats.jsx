import { StatCard } from '@components/ui';
import { FiClock, FiCheckCircle, FiAlertTriangle, FiCalendar } from 'react-icons/fi';

const TaskStats = ({ tasksByCategory }) => {
  const getTaskStats = () => {
    const allTasks = tasksByCategory?.['All Tasks']?.items || [];
    return {
      total: allTasks.length,
      completed: allTasks.filter(task => task.status === 'Completed').length,
      pending: allTasks.filter(task => task.status === 'Pending').length,
      overdue: allTasks.filter(task => {
        if (task.dueDate) {
          return new Date(task.dueDate) < new Date() && task.status !== 'Completed';
        }
        return false;
      }).length,
    };
  };

  const stats = getTaskStats();

  const statItems = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: FiCalendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: FiCheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: FiClock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: '+5%',
      changeType: 'neutral',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: FiAlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '-3%',
      changeType: 'negative',
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
          change={stat.change}
          changeType={stat.changeType}
        />
      ))}
    </div>
  );
};

export default TaskStats;
