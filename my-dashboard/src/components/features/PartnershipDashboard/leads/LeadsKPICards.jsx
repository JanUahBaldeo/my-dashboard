import { TrendingUp, DollarSign, Users, Target } from 'lucide-react';

const LeadsKPICards = () => {
  const kpiCards = [
    {
      title: 'Team Performance',
      value: '94%',
      change: '+3% vs last month',
      icon: TrendingUp,
      iconColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Revenue Generated',
      value: '$127.5K',
      change: '+12% vs last month',
      icon: DollarSign,
      iconColor: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: 'Active Partners',
      value: '24',
      change: '+2 new this month',
      icon: Users,
      iconColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      title: 'Conversion Rate',
      value: '8.2%',
      change: '+1.1% vs last month',
      icon: Target,
      iconColor: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
      {kpiCards.map((card, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 lg:p-4 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">{card.title}</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-800 dark:text-gray-100">{card.value}</p>
              <div className="flex items-center text-green-500 text-xs lg:text-sm">
                <TrendingUp size={14} className="mr-1" />
                {card.change}
              </div>
            </div>
            <div className={`p-2 ${card.bgColor} rounded-lg`}>
              <card.icon size={20} className={card.iconColor} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadsKPICards;
