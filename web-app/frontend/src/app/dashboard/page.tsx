'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, SubscriptionOption } from '@/lib/api';

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState('');
  const [activeSubscriptions, setActiveSubscriptions] = useState<string[]>([]);
  const [availableOptions, setAvailableOptions] = useState<SubscriptionOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Load user data and subscriptions
      const [userResponse, subscriptions, options] = await Promise.all([
        apiClient.verifyToken(),
        apiClient.getSubscriptions(),
        apiClient.getSubscriptionOptions()
      ]);

      setUserEmail(userResponse.user.email);
      setActiveSubscriptions(subscriptions);
      setAvailableOptions(options);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data');
      // Redirect to sign-in if not authenticated
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubscriptions = async (newSubscriptions: string[]) => {
    try {
      const updatedSubscriptions = await apiClient.updateSubscriptions(newSubscriptions);
      setActiveSubscriptions(updatedSubscriptions);
    } catch (err) {
      console.error('Failed to update subscriptions:', err);
      setError('Failed to update subscriptions');
    }
  };

  const addSubscription = async (optionId: string) => {
    if (!activeSubscriptions.includes(optionId)) {
      const newSubscriptions = [...activeSubscriptions, optionId];
      await updateSubscriptions(newSubscriptions);
    }
  };

  const removeSubscription = async (optionId: string) => {
    const newSubscriptions = activeSubscriptions.filter(id => id !== optionId);
    await updateSubscriptions(newSubscriptions);
  };

  const logout = () => {
    apiClient.logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Your Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Welcome back, {userEmail}
            </p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Subscriptions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Current Subscriptions
            </h2>
            
            {activeSubscriptions.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No active subscriptions. Add some below!
              </p>
            ) : (
              <div className="space-y-4">
                {activeSubscriptions.map((subscriptionId) => {
                  const option = availableOptions.find(opt => opt.id === subscriptionId);
                  if (!option) return null;
                  
                  return (
                    <div
                      key={subscriptionId}
                      className="p-4 border border-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {option.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {option.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                            Active
                          </span>
                          <button
                            onClick={() => removeSubscription(subscriptionId)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Available Options */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Available Options
            </h2>
            
            <div className="space-y-3">
              {availableOptions.map((option) => {
                const isSubscribed = activeSubscriptions.includes(option.id);
                return (
                  <div
                    key={option.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      isSubscribed
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {option.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {option.description}
                        </p>
                      </div>
                      <button
                        onClick={() => isSubscribed ? removeSubscription(option.id) : addSubscription(option.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isSubscribed
                            ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700'
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700'
                        }`}
                      >
                        {isSubscribed ? 'Remove' : 'Add'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Daily emails sent around 10 AM • Changes take effect immediately
          </p>
        </div>
      </div>
    </div>
  );
}
