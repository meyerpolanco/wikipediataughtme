// Shared user data store
export const users = new Map<string, { email: string; subscriptions: string[] }>();

// Initialize with some default users for testing
users.set('test@example.com', {
  email: 'test@example.com',
  subscriptions: ['true-random', 'brand-new']
});

users.set('demo@example.com', {
  email: 'demo@example.com',
  subscriptions: ['science', 'history']
});
