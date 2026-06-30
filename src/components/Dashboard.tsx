import React, { useState } from 'react';
import { useApp } from './AppContext';
import { CATEGORIES } from '../data';
import { 
  Compass, 
  PlusCircle, 
  Briefcase, 
  TrendingUp, 
  MapPin, 
  Sparkles, 
  Clock, 
  Users, 
  ArrowUpRight, 
  CheckCircle,
  Zap,
  Printer,
  FileText,
  Truck,
  Laptop,
  Camera,
  BookOpen,
  Calendar,
  Layers,
  Search
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Layers, Printer, FileText, Truck, Laptop, Camera, BookOpen, Calendar
};

export default function Dashboard() {
  const { 
    currentUser, 
    tasks, 
    activeTab, 
    setActiveTab, 
    setSelectedTaskId
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeRadius, setActiveRadius] = useState<'all' | '1km' | 'campus'>('campus');

  if (!currentUser) return null;

  // Filter tasks based on search
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && task.status === 'open';
  });

  const urgentTasks = tasks.filter(t => t.urgency === 'urgent' && t.status === 'open');
  const myActiveCollaborations = tasks.filter(t => 
    t.posterId === currentUser.uid || t.assignedDoerIds.includes(currentUser.uid)
  );

  return (
    <div className="space-y-6">
      
      {/* Hero Welcome Panel */}
      <div className="p-6 md:p-8 rounded-md bg-zinc-900 border border-zinc-800 relative overflow-hidden">
        <div className="max-w-xl z-10 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800 text-zinc-300 rounded-md border border-zinc-700 text-[10px] uppercase tracking-wider font-medium mb-4">
            <Zap className="h-3.5 w-3.5 text-zinc-400" />
            <span>Hyperlocal Student platform</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-medium text-white mb-2">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-zinc-400 text-xs leading-relaxed mb-6">
            You are currently connected to <span className="text-zinc-200">{currentUser.university}</span>. 
            There are <span className="text-zinc-200">{tasks.filter(t => t.status === 'open').length} active tasks</span> within 1 km.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('browse_tasks')}
              className="px-4 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-medium rounded-md transition flex items-center gap-2"
            >
              <Compass className="h-4 w-4" />
              <span>Browse Nearby Tasks</span>
            </button>
            <button
              onClick={() => setActiveTab('post_task')}
              className="px-4 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-medium rounded-md transition flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Campus Task</span>
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-medium rounded-md transition flex items-center gap-1.5"
            >
              <Users className="h-4 w-4" />
              <span>Verify Wallet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Same College Stats */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-md">
          <div className="text-[10px] text-zinc-500 uppercase">On-Campus Hub</div>
          <div className="text-xl font-medium mt-1 text-white">{currentUser.university}</div>
        </div>

        {/* Reliability Score */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-md">
          <div className="text-[10px] text-zinc-500 uppercase">Student Reputation</div>
          <div className="text-xl font-medium mt-1 text-white">{currentUser.reliabilityScore}%</div>
        </div>

        {/* Tasks completed */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-md">
          <div className="text-[10px] text-zinc-500 uppercase">Completed Jobs</div>
          <div className="text-xl font-medium mt-1 text-white">{currentUser.tasksCompleted} Tasks</div>
        </div>

        {/* Active Collaborations */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-md">
          <div className="text-[10px] text-zinc-500 uppercase">My Collaborations</div>
          <div className="text-xl font-medium mt-1 text-white">{myActiveCollaborations.length} Active</div>
        </div>

      </div>

      {/* Main Grid: Campus Radar & Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Campus Hub radar simulation & Categories */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Hyperlocal Campus Radar Simulation */}
          <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                  <MapPin className="h-4.5 w-4.5 text-zinc-400" />
                  <span>Campus Location Radar</span>
                </h3>
              </div>
            </div>

            {/* Radar Canvas / Map Representation */}
            <div className="h-44 rounded-md border border-zinc-800 flex items-center justify-center relative overflow-hidden bg-black">
              {/* Radar sweeps line */}
              <div className="absolute inset-0 origin-center" />

              {/* Dynamic Nearby Nodes representing peers */}
              <div className="absolute top-1/4 left-1/3 flex flex-col items-center">
                <div className="h-2 w-2 bg-white rounded-full" />
              </div>

              <div className="absolute bottom-1/4 right-1/4 flex flex-col items-center">
                <div className="h-2 w-2 bg-zinc-500 rounded-full" />
              </div>

              <div className="absolute top-1/3 right-1/3 flex flex-col items-center">
                <div className="h-2 w-2 bg-white rounded-full" />
              </div>

              <div className="absolute bottom-1/3 left-1/4 flex flex-col items-center">
                <div className="h-2 w-2 bg-zinc-400 rounded-full" />
              </div>

              {/* Center point */}
              <div className="z-10 flex flex-col items-center">
                <div className="h-3 w-3 bg-white rounded-full flex items-center justify-center">
                </div>
              </div>
            </div>
          </div>

          {/* Quick Categories list */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.slice(1).map(cat => {
                const Icon = ICON_MAP[cat.icon] || Layers;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveTab('browse_tasks');
                    }}
                    className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-md transition text-left group"
                  >
                    <div className="text-white mb-2">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-xs font-medium text-white">{cat.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Active/Urgent Tasks Feed */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Urgent Campus Tasks */}
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-md">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-zinc-400" />
              <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Urgent Requests</h3>
            </div>
            {urgentTasks.length === 0 ? (
              <p className="text-xs text-zinc-500">No urgent flags active right now.</p>
            ) : (
              <div className="space-y-2">
                {urgentTasks.map(task => (
                  <div 
                    key={task.id} 
                    onClick={() => {
                      setSelectedTaskId(task.id);
                      setActiveTab('active_tasks');
                    }}
                    className="p-3 bg-black hover:bg-zinc-800 border border-zinc-800 rounded-md transition cursor-pointer flex justify-between items-start"
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="text-xs font-medium text-white truncate">{task.title}</h4>
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-zinc-500">
                        <MapPin className="h-3 w-3" />
                        <span>{task.location.campus.split(' ')[0]}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-medium text-white">₹{task.budget}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Tasks Search & Filter Summary */}
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-md">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Instant Match</h3>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white"
              />
            </div>
            
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {filteredTasks.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-4">No match found.</p>
              ) : (
                filteredTasks.slice(0, 3).map(task => (
                  <div 
                    key={task.id}
                    onClick={() => {
                      setSelectedTaskId(task.id);
                      if (task.posterId === currentUser.uid || task.assignedDoerIds.includes(currentUser.uid)) {
                        setActiveTab('active_tasks');
                      } else {
                        setActiveTab('browse_tasks');
                      }
                    }}
                    className="p-2.5 bg-black hover:bg-zinc-800 rounded-md border border-zinc-800 transition cursor-pointer flex justify-between items-center"
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="text-xs font-medium text-white truncate">{task.title}</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{task.category.replace('_', ' ')}</p>
                    </div>
                    <span className="text-xs font-medium text-white shrink-0">₹{task.budget}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
