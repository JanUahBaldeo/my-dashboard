// ========================================
// 🎯 MOCK TASK DATA FOR DEMONSTRATION
// ========================================

export const mockTasks = [
  {
    _id: 'task-1',
    title: 'Follow up with ABC Corp lead',
    body: 'Call client to discuss proposal details and answer questions about our services',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    tags: ['Sales', 'Follow-up', 'High Priority'],
    assignedTo: 'user-123',
    priority: 'high',
    category: 'sales',
  },
  {
    _id: 'task-2',
    title: 'Schedule client meeting for XYZ Project',
    body: 'Coordinate with client to set up a video conference call to review project requirements',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
    tags: ['Client Communication', 'Meeting', 'Medium Priority'],
    assignedTo: 'user-123',
    priority: 'medium',
    category: 'communication',
  },
  {
    _id: 'task-3',
    title: 'Prepare sales presentation for new product',
    body: 'Create PowerPoint presentation highlighting key features and benefits of our new solution',
    dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday (overdue)
    tags: ['Sales', 'Presentation', 'High Priority'],
    assignedTo: 'user-123',
    priority: 'high',
    category: 'sales',
  },
  {
    _id: 'task-4',
    title: 'Send follow-up email to potential client',
    body: 'Send personalized email thanking them for their interest and providing additional information',
    dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // Today
    tags: ['Client Communication', 'Email', 'Medium Priority'],
    assignedTo: 'user-123',
    priority: 'medium',
    category: 'communication',
  },
  {
    _id: 'task-5',
    title: 'Review and update client proposal',
    body: 'Update proposal document with latest pricing and terms for DEF Company',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    tags: ['Sales', 'Proposal', 'Medium Priority'],
    assignedTo: 'user-123',
    priority: 'medium',
    category: 'sales',
  },
  {
    _id: 'task-6',
    title: 'Client feedback call - Smith Account',
    body: 'Conduct quarterly review call to gather feedback and discuss future opportunities',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    tags: ['Client Communication', 'Feedback', 'Low Priority'],
    assignedTo: 'user-123',
    priority: 'low',
    category: 'communication',
  },
  {
    _id: 'task-7',
    title: 'Cold call prospect list',
    body: 'Make 20 cold calls to new prospects from the generated lead list',
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
    tags: ['Sales', 'Cold Call', 'High Priority'],
    assignedTo: 'user-123',
    priority: 'high',
    category: 'sales',
  },
  {
    _id: 'task-8',
    title: 'Update CRM with latest client interactions',
    body: 'Log all recent client communications and update contact information in CRM system',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    tags: ['Administrative', 'CRM', 'Low Priority'],
    assignedTo: 'user-123',
    priority: 'low',
    category: 'general',
  },
];

// Helper function to get tasks for a specific user
export const getUserTasks = (userId) => {
  return mockTasks.filter(task => task.assignedTo === userId);
};

// Helper function to get sales-related tasks
export const getSalesTasks = (userId) => {
  return mockTasks.filter(task =>
    task.assignedTo === userId &&
    (task.category === 'sales' || task.tags.some(tag => tag.toLowerCase().includes('sales'))),
  );
};

// Helper function to get client communication tasks
export const getCommunicationTasks = (userId) => {
  return mockTasks.filter(task =>
    task.assignedTo === userId &&
    (task.category === 'communication' || task.tags.some(tag => tag.toLowerCase().includes('communication'))),
  );
};

// Helper function to get overdue tasks
export const getOverdueTasks = (userId) => {
  const now = new Date();
  return mockTasks.filter(task =>
    task.assignedTo === userId &&
    new Date(task.dueDate) < now,
  );
};

// Helper function to get today's tasks
export const getTodayTasks = (userId) => {
  const today = new Date().toISOString().split('T')[0];
  return mockTasks.filter(task =>
    task.assignedTo === userId &&
    task.dueDate.split('T')[0] === today,
  );
};
