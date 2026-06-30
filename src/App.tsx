import React from 'react';
import { AppProvider, useApp } from './components/AppContext';
import HomePage from './components/HomePage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TaskBrowse from './components/TaskBrowse';
import TaskCreate from './components/TaskCreate';
import TaskDetails from './components/TaskDetails';
import Wallet from './components/Wallet';
import AdminPanel from './components/AdminPanel';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { currentUser, activeTab, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col justify-center items-center font-sans">
        <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
        <span className="text-sm font-semibold text-gray-300">Initializing TaskLink Peer Node...</span>
      </div>
    );
  }

  if (!currentUser) {
    return <HomePage />;
  }

  return (
    <Layout>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'browse_tasks' && <TaskBrowse />}
      {activeTab === 'post_task' && <TaskCreate />}
      {activeTab === 'active_tasks' && <TaskDetails />}
      {activeTab === 'wallet' && <Wallet />}
      {activeTab === 'admin_panel' && <AdminPanel />}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
