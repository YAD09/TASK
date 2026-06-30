import React, { useState } from 'react';
import { useApp } from './AppContext';
import { CATEGORIES } from '../data';
import { 
  MapPin, 
  Search, 
  Sparkles, 
  Coins, 
  Clock, 
  Filter, 
  ArrowUpRight, 
  Sliders, 
  Award, 
  Check, 
  Layers, 
  Compass, 
  AlertCircle,
  FileCheck,
  ChevronRight
} from 'lucide-react';

export default function TaskBrowse() {
  const { tasks, currentUser, setSelectedTaskId, setActiveTab } = useApp();
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [radius, setRadius] = useState<'campus' | '1km' | '5km' | 'city'>('campus');
  const [minBudget, setMinBudget] = useState('');
  const [urgencyOnly, setUrgencyOnly] = useState(false);

  // Application Modal
  const [applyingTaskId, setApplyingTaskId] = useState<string | null>(null);
  const [pitch, setPitch] = useState('');
  const [suggestedBudget, setSuggestedBudget] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);
  const [appSuccess, setAppSuccess] = useState('');

  if (!currentUser) return null;

  const currentTaskApplying = tasks.find(t => t.id === applyingTaskId);

  // Filters logic
  const filteredTasks = tasks.filter(task => {
    if (task.status !== 'open') return false;
    
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                          task.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    
    const matchesUrgency = !urgencyOnly || task.urgency === 'urgent';
    
    const matchesBudget = !minBudget || task.budget >= Number(minBudget);
    
    // Simulate radius filtering based on campus matches
    if (radius === 'campus' && task.college !== currentUser.university) {
      return false;
    }

    return matchesSearch && matchesCategory && matchesUrgency && matchesBudget;
  });

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingTaskId) return;

    setSubmittingApp(true);
    
    // Simulate submitting application with a beautiful verification step
    setTimeout(() => {
      setAppSuccess('Your application was submitted and dispatched to the poster!');
      setSubmittingApp(false);
      
      // Clear after 1.5s
      setTimeout(() => {
        setApplyingTaskId(null);
        setPitch('');
        setSuggestedBudget('');
        setAppSuccess('');
        
        // Take to collaborations tab
        setActiveTab('active_tasks');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      
      {/* Search and Campus Filters Bar */}
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-md flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white"
          />
        </div>
        
        {/* Radius toggle selector */}
        <div className="flex flex-wrap gap-1 w-full md:w-auto">
          <button
            onClick={() => setRadius('campus')}
            className={`px-3 py-1.5 rounded-md text-xs border transition ${
              radius === 'campus' 
                ? 'bg-white border-white text-black font-medium' 
                : 'bg-black border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Same Campus
          </button>
          
          <button
            onClick={() => setRadius('1km')}
            className={`px-3 py-1.5 rounded-md text-xs border transition ${
              radius === '1km' 
                ? 'bg-white border-white text-black font-medium' 
                : 'bg-black border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            &lt; 1 km
          </button>

          <button
            onClick={() => setRadius('5km')}
            className={`px-3 py-1.5 rounded-md text-xs border transition ${
              radius === '5km' 
                ? 'bg-white border-white text-black font-medium' 
                : 'bg-black border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            &lt; 5 km
          </button>

          <button
            onClick={() => setRadius('city')}
            className={`px-3 py-1.5 rounded-md text-xs border transition ${
              radius === 'city' 
                ? 'bg-white border-white text-black font-medium' 
                : 'bg-black border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Whole City
          </button>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Categories sidebar & Filters */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Categories select card */}
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-md space-y-2">
            <h4 className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Service Sectors</h4>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition ${
                  selectedCategory === cat.id 
                    ? 'bg-zinc-800 text-white border border-zinc-700' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>{cat.name}</span>
                {selectedCategory === cat.id && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>

          {/* Budget filter card */}
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-md space-y-3">
            <h4 className="text-[10px] text-zinc-500 uppercase tracking-wider">Advanced Filter</h4>
            
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400">Min Budget (₹)</label>
              <input 
                type="number" 
                placeholder="e.g. 500"
                value={minBudget}
                onChange={e => setMinBudget(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox"
                checked={urgencyOnly}
                onChange={e => setUrgencyOnly(e.target.checked)}
                className="rounded text-white focus:ring-zinc-500 bg-black border-zinc-800 h-3.5 w-3.5"
              />
              <span className="text-xs text-zinc-300">Show Urgent Only</span>
            </label>
          </div>

        </div>

        {/* Right Side: Market Task Cards Grid */}
        <div className="lg:col-span-9 space-y-4">
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">
              Showing <span className="text-indigo-400 font-bold">{filteredTasks.length} verified tasks</span> on campus
            </span>
            <span className="text-[10px] text-gray-500 font-mono">Location: Auto GPS detected</span>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-gray-800 bg-gray-900/10">
              <Compass className="h-10 w-10 text-gray-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-gray-300">No matching campus tasks</h3>
              <p className="text-xs text-gray-500 mt-1">Try relaxing filters, or check back later for newly posted requests from Hostel blocks.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.map(task => {
                const distance = task.urgency === 'urgent' ? '200m' : '500m';
                return (
                  <div 
                    key={task.id}
                    className="p-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-md transition flex flex-col justify-between group h-56"
                  >
                    <div>
                      {/* Top row */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-1.5">
                          <img 
                            src={task.posterPhotoURL} 
                            alt={task.posterName} 
                            className="w-5 h-5 rounded-full object-cover border border-zinc-800"
                          />
                          <span className="text-[10px] text-zinc-400">@{task.posterName.split(' ')[0]}</span>
                          <span className="text-[10px] text-zinc-500">• ★ {task.posterRating}</span>
                        </div>
                        <span className="text-sm font-medium text-white">₹{task.budget}</span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xs font-medium text-white mt-2.5 line-clamp-1 transition">
                        {task.title}
                      </h3>
                      <p className="text-[10px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                        {task.description}
                      </p>

                      {/* AI recommendations highlight */}
                      <div className="mt-3 flex items-center gap-2">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-md border border-zinc-700 text-[8px] uppercase">
                          <Sparkles className="h-2.5 w-2.5" />
                          <span>AI Match: {task.aiSuccessPrediction}%</span>
                        </div>
                        {task.urgency === 'urgent' && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-md border border-zinc-700 text-[8px] uppercase">
                            <span>Urgent</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Details Row */}
                    <div className="flex justify-between items-center border-t border-zinc-800 pt-3 mt-4">
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">{distance} • {task.location.campus.split(' ')[0]}</span>
                      </div>
                      
                      <button
                        onClick={() => setApplyingTaskId(task.id)}
                        className="px-3 py-1.5 bg-white text-black hover:bg-zinc-200 text-[10px] font-medium rounded-md transition flex items-center gap-1 shrink-0"
                      >
                        <span>Apply</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* Peer Pitch Application Modal */}
      {applyingTaskId && currentTaskApplying && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-md p-5 shadow-2xl relative">
            
            <h3 className="text-sm font-medium text-white mb-1">Apply for Task</h3>
            <p className="text-xs text-zinc-400 mb-4">{currentTaskApplying.title}</p>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs text-zinc-300">Proposal message</label>
                <textarea 
                  required
                  rows={3}
                  value={pitch}
                  onChange={e => setPitch(e.target.value)}
                  placeholder="Explain why you are the best fit..."
                  className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-300">Suggested Budget (₹)</label>
                <div className="relative">
                  <Coins className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <input 
                    type="number" 
                    value={suggestedBudget}
                    onChange={e => setSuggestedBudget(e.target.value)}
                    placeholder={String(currentTaskApplying.budget)}
                    className="w-full pl-9 pr-3 py-2 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white"
                  />
                </div>
              </div>

              {appSuccess && (
                <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-md text-white text-xs flex items-center gap-2">
                  <FileCheck className="h-4 w-4 shrink-0" />
                  <span>{appSuccess}</span>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyingTaskId(null)}
                  className="w-1/3 py-2 bg-black border border-zinc-800 hover:bg-zinc-800 text-white text-xs font-medium rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApp}
                  className="flex-1 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-medium rounded-md transition flex justify-center items-center gap-1.5"
                >
                  {submittingApp ? 'Submitting...' : 'Send Application'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
