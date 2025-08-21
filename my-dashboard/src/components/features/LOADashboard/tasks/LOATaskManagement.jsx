import { motion } from 'framer-motion';
import {
  FolderOpen,
  Plus,
  Filter,
  Phone,
  FileText,
  Mail,
  User,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
} from 'lucide-react';

const LOATaskManagement = ({ tasks = [], onTaskClick }) => {
  const stats = [
    { label: 'Overdue Tasks', value: '1', icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-50' },
    { label: 'Pending Tasks', value: '3', icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Completed', value: '1', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Total Tasks', value: '5', icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  ];

  const getTaskIcon = (type) => {
    switch (type) {
      case 'call': return <Phone className="w-5 h-5 text-gray-600" />;
      case 'document': return <FileText className="w-5 h-5 text-gray-600" />;
      case 'email': return <Mail className="w-5 h-5 text-gray-600" />;
      case 'meeting': return <User className="w-5 h-5 text-gray-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'overdue': return 'bg-red-500 text-white';
      case 'pending': return 'bg-blue-500 text-white';
      case 'completed': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Task Management</h1>
            <p className="text-sm text-gray-600 mt-1">Track loan processing tasks and deadlines</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-lg p-4 border border-gray-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>Overdue</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Priority</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Types</option>
            <option>Call</option>
            <option>Document</option>
            <option>Email</option>
            <option>Meeting</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="p-6">
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onTaskClick(task)}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => {}}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />

              {/* Task Icon */}
              {getTaskIcon(task.type)}

              {/* Task Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{task.title}</h3>
                <p className="text-sm text-gray-600">
                  Client: {task.client} • Loan: {task.loanNumber}
                </p>
              </div>

              {/* Tags */}
              <div className="flex gap-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>

              {/* Due Date */}
              <div className="text-sm text-gray-500">
                Due: {task.dueDate}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LOATaskManagement;
