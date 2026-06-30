import React, { useState } from 'react';
import { useApp } from './AppContext';
import { 
  Sparkles, 
  User, 
  Layers, 
  PlusCircle, 
  Wallet, 
  Bell, 
  Moon, 
  Sun, 
  LogOut, 
  Shield, 
  Briefcase, 
  Activity, 
  MapPin, 
  Menu, 
  X,
  UserCheck,
  Award,
  ArrowRightLeft,
  ChevronDown,
  Compass,
  AlertTriangle
} from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    theme, 
    setTheme, 
    toggleRole, 
    logout,
    notifications,
    setNotifications,
    setSelectedTaskId
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!currentUser) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Activity, roles: ['doer', 'poster'] },
    { id: 'browse_tasks', name: 'Campus Marketplace', icon: Compass, roles: ['doer'] },
    { id: 'post_task', name: 'Post a Task', icon: PlusCircle, roles: ['poster'] },
    { id: 'active_tasks', name: 'My Collaborations', icon: Briefcase, roles: ['doer', 'poster'] },
    { id: 'wallet', name: 'Escrow Wallet', icon: Wallet, roles: ['doer', 'poster'] },
    { id: 'admin_panel', name: 'Admin Control', icon: Shield, roles: ['admin'] }
  ];

  // If user is admin, show admin panel tab. Otherwise, filter out
  const isAdmin = currentUser.email === 'admin@tasklink.edu' || currentUser.uid === 'user_admin';
  const visibleMenuItems = menuItems.filter(item => {
    if (isAdmin) return true;
    if (item.id === 'admin_panel') return false;
    return true;
  });

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-zinc-300' : 'bg-white text-zinc-900'} flex flex-col font-sans transition-colors duration-200`}>
      
      {/* Top Navigation Bar */}
      <header className={`sticky top-0 z-40 w-full border-b ${theme === 'dark' ? 'bg-black border-zinc-900' : 'bg-white border-zinc-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Platform Branding */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-400 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-zinc-500" />
              </div>
              <div>
                <span className="font-display font-medium text-lg tracking-tight">
                  {theme === 'dark' ? <span className="text-white">TaskLink</span> : <span className="text-black">TaskLink</span>}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Profiles Info */}
          <div className="flex items-center gap-3">
            
            {/* Notifications Alert Icon */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileDrawer(false);
                }}
                className={`p-2 rounded-xl border ${
                  theme === 'dark' ? 'border-gray-800 hover:bg-gray-850' : 'border-gray-200 hover:bg-gray-100'
                } relative transition`}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Drawer */}
              {showNotifications && (
                <div className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl border ${
                  theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-250'
                } z-50 overflow-hidden`}>
                  <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-gray-950/20">
                    <span className="text-xs font-bold">Campus Alerts</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-[10px] text-indigo-400 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-800">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-gray-500">No active alerts on campus.</div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className={`p-3 text-xs hover:bg-gray-800/20 transition ${!notif.isRead ? 'bg-indigo-500/5' : ''}`}>
                          <div className="flex justify-between items-start mb-0.5">
                            <span className="font-bold text-gray-200">{notif.title}</span>
                            <span className="text-[9px] text-gray-500">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-gray-400 leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-md border ${
                theme === 'dark' ? 'border-zinc-800 hover:bg-zinc-900' : 'border-zinc-200 hover:bg-zinc-100'
              } transition`}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-zinc-400" /> : <Moon className="h-4 w-4 text-zinc-600" />}
            </button>

            {/* User Profile Avatar Circle */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileDrawer(!showProfileDrawer);
                  setShowNotifications(false);
                }}
                className={`flex items-center gap-2 p-1 pr-2 rounded-xl border ${
                  theme === 'dark' ? 'border-gray-800 hover:bg-gray-850' : 'border-gray-200 hover:bg-gray-100'
                } transition`}
              >
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-lg border border-gray-700 object-cover"
                />
                <span className="hidden md:inline text-xs font-semibold">{currentUser.name.split(' ')[0]}</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
              </button>

              {/* Profile dropdown */}
              {showProfileDrawer && (
                <div className={`absolute right-0 mt-3 w-60 rounded-2xl shadow-2xl border ${
                  theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-250'
                } z-50 overflow-hidden`}>
                  <div className="p-4 border-b border-gray-800 bg-gray-950/25 flex flex-col items-center text-center">
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.name} 
                      className="w-14 h-14 rounded-full border-2 border-indigo-500/40 object-cover mb-2 shadow-md"
                    />
                    <h3 className="text-sm font-semibold">{currentUser.name}</h3>
                    <p className="text-[10px] text-gray-500 font-mono">@{currentUser.username}</p>
                    <div className="flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 text-[10px] font-bold">
                      <Award className="h-3 w-3" />
                      <span>Reliability: {currentUser.reliabilityScore}%</span>
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-mono text-gray-500">CAMPUS</div>
                    <div className="px-3 pb-2 text-xs flex items-center gap-1.5 text-gray-300">
                      <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{currentUser.university}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setActiveTab('dashboard');
                        setShowProfileDrawer(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-gray-800/30 transition flex items-center gap-2"
                    >
                      <User className="h-4 w-4 text-gray-400" />
                      <span>Peer Profile Card</span>
                    </button>
                    <button 
                      onClick={() => {
                        logout();
                        setShowProfileDrawer(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Main Body Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6 relative">
        
        {/* Persistent Side Navigation Drawer for Desktop */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-6">
          <nav className={`flex flex-col gap-1`}>
            
            <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-zinc-500">
              Menu
            </div>

            {visibleMenuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSelectedTaskId(null);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                    isActive 
                      ? (theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-black')
                      : (theme === 'dark' ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-600 hover:text-black')
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Stats / Wallet Balance card in Sidebar */}
          <div className={`p-4 rounded-md border ${
            theme === 'dark' 
              ? 'border-zinc-900 bg-black' 
              : 'border-zinc-200 bg-white'
          }`}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] text-zinc-500 uppercase">Wallet</span>
            </div>
            <div className="text-lg font-medium">
              ₹{currentUser.walletBalance.toLocaleString('en-IN')}
            </div>
          </div>
        </aside>

        {/* Dynamic Content Panel */}
        <main className="flex-1 min-w-0 flex flex-col gap-6">
          {children}
        </main>

      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#0b0f19]/80 backdrop-blur-md">
          <div className="w-64 max-w-[80vw] h-full bg-gray-900 border-r border-gray-800 p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <span className="font-display font-bold text-md text-white">TaskLink Menu</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {visibleMenuItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSelectedTaskId(null);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
            <div className="mt-auto border-t border-gray-800 pt-6">
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition text-xs font-semibold"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
