import React, { useState } from 'react';
import { useApp } from './AppContext';
import { CATEGORIES } from '../data';
import { 
  Sparkles, 
  MapPin, 
  Globe, 
  Mic, 
  Calendar,
  ChevronDown
} from 'lucide-react';

export default function TaskCreate() {
  const { postTask, currentUser, setActiveTab } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('academic');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [taskMode, setTaskMode] = useState<'remote' | 'in_person'>('in_person');
  const [urgency, setUrgency] = useState<'standard' | 'urgent' | 'overnight'>('standard');
  
  // Location states
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const numericBudget = Number(budget);
    if (isNaN(numericBudget) || numericBudget <= 0) {
      setError('Budget must be a positive number.');
      return;
    }

    if (currentUser.walletBalance < numericBudget) {
      setError(`Insufficient funds in Escrow Wallet (Balance: ₹${currentUser.walletBalance}). Please deposit ₹${numericBudget - currentUser.walletBalance} more on the Escrow Wallet tab before continuing.`);
      return;
    }

    try {
      await postTask({
        title,
        description,
        category,
        budget: numericBudget,
        deadline: deadline || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        urgency: urgency === 'standard' ? 'standard' : 'urgent',
        taskType: taskMode === 'remote' ? 'digital' : 'physical',
        visibility: 'public',
        location: {
          latitude: 19.1334,
          longitude: 72.9133,
          city: city || 'Mumbai',
          state: state || 'Maharashtra',
          country: 'India',
          campus: 'Campus'
        },
        teamMembers: [],
        files: [],
        aiClarityScore: 8,
        aiSuccessPrediction: 90,
        aiQualityScore: 85,
        aiPriceRecommendation: numericBudget,
        aiFeedback: 'Optimized for campus matching.'
      });

      setSuccess('Task posted! ₹' + budget + ' held securely in escrow.');
      // Reset
      setTitle('');
      setDescription('');
      
      // Take to collaborations list after 1s
      setTimeout(() => {
        setActiveTab('active_tasks');
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Task creation failed.');
    }
  };

  const calculateTotal = () => {
    const base = Number(budget) || 0;
    if (urgency === 'urgent') return base * 1.5;
    if (urgency === 'overnight') return base * 2;
    return base;
  };

  return (
    <div className="max-w-3xl mx-auto w-full pb-10">
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Post a Task</h2>
        <p className="text-sm text-[#8c9bb0]">Describe what you need help with. Funds will be held in escrow.</p>
      </div>

      <div className="bg-[#111727] border border-[#1e293b] rounded-xl p-6 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* TASK TITLE */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#8c9bb0] tracking-wider uppercase">Task Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Calculus Help"
              className="w-full px-4 py-3 bg-[#1e2638] border border-[#2d3748] focus:border-[#3b82f6] focus:outline-none rounded-lg text-sm text-white placeholder-[#64748b] transition-colors"
            />
          </div>

          {/* TASK MODE */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#8c9bb0] tracking-wider uppercase">Task Mode</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTaskMode('remote')}
                className={`py-3 rounded-lg text-sm font-medium border flex items-center justify-center gap-2 transition-colors ${
                  taskMode === 'remote' 
                    ? 'border-[#0ea5e9] text-[#0ea5e9] bg-[#0ea5e9]/5' 
                    : 'border-[#2d3748] text-[#94a3b8] hover:border-[#475569]'
                }`}
              >
                <Globe className="h-4 w-4" />
                Remote
              </button>
              <button
                type="button"
                onClick={() => setTaskMode('in_person')}
                className={`py-3 rounded-lg text-sm font-medium border flex items-center justify-center gap-2 transition-colors ${
                  taskMode === 'in_person' 
                    ? 'border-[#0ea5e9] text-[#0ea5e9] bg-[#0ea5e9]/5' 
                    : 'border-[#2d3748] text-[#94a3b8] hover:border-[#475569]'
                }`}
              >
                <MapPin className="h-4 w-4" />
                In-Person
              </button>
            </div>
          </div>

          {/* Location Section */}
          {taskMode === 'in_person' && (
            <div className="bg-[#0f1423] border border-[#1e293b] rounded-lg p-5 space-y-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-medium text-white">Task Location</h3>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border border-[#0ea5e9] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#0ea5e9] rounded-full"></div>
                  </div>
                  <span className="text-xs text-[#0ea5e9] font-medium">Auto Detect</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8c9bb0] tracking-wider uppercase">Street Address</label>
                <input 
                  type="text" 
                  value={streetAddress}
                  onChange={e => setStreetAddress(e.target.value)}
                  placeholder="Building, Street, Area"
                  className="w-full px-4 py-2.5 bg-[#1e2638] border border-[#2d3748] focus:border-[#3b82f6] focus:outline-none rounded-lg text-sm text-white placeholder-[#64748b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8c9bb0] tracking-wider uppercase">City</label>
                  <input 
                    type="text" 
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Mumbai"
                    className="w-full px-4 py-2.5 bg-[#1e2638] border border-[#2d3748] focus:border-[#3b82f6] focus:outline-none rounded-lg text-sm text-white placeholder-[#64748b]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8c9bb0] tracking-wider uppercase">Pincode</label>
                  <input 
                    type="text" 
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    placeholder="400001"
                    className="w-full px-4 py-2.5 bg-[#1e2638] border border-[#2d3748] focus:border-[#3b82f6] focus:outline-none rounded-lg text-sm text-white placeholder-[#64748b]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8c9bb0] tracking-wider uppercase">State</label>
                <input 
                  type="text" 
                  value={state}
                  onChange={e => setState(e.target.value)}
                  placeholder="Maharashtra"
                  className="w-full px-4 py-2.5 bg-[#1e2638] border border-[#2d3748] focus:border-[#3b82f6] focus:outline-none rounded-lg text-sm text-white placeholder-[#64748b]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8c9bb0] tracking-wider uppercase">Pinpoint on Map</label>
                <div className="w-full h-48 rounded-lg overflow-hidden border border-[#2d3748] relative">
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" alt="Map Placeholder" className="w-full h-full object-cover opacity-60 mix-blend-luminosity" />
                  <div className="absolute inset-0 bg-[#0ea5e9]/10"></div>
                  {/* Map Controls Mock */}
                  <div className="absolute top-3 left-3 bg-white text-black rounded shadow-md overflow-hidden flex flex-col">
                    <button type="button" className="w-8 h-8 flex items-center justify-center font-bold border-b border-gray-200 hover:bg-gray-100">+</button>
                    <button type="button" className="w-8 h-8 flex items-center justify-center font-bold hover:bg-gray-100">-</button>
                  </div>
                </div>
                <p className="text-[10px] text-[#64748b] mt-1">* Click on map to auto fill address details.</p>
              </div>
            </div>
          )}

          {/* CATEGORY & DEADLINE */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#8c9bb0] tracking-wider uppercase">Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1e2638] border border-[#2d3748] focus:border-[#3b82f6] focus:outline-none rounded-lg text-sm text-white appearance-none"
                >
                  <option value="academic">Academic</option>
                  <option value="errand">Errand</option>
                  <option value="technical">Technical</option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-[#94a3b8] pointer-events-none" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#8c9bb0] tracking-wider uppercase">Deadline</label>
              <div className="relative">
                <input 
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1e2638] border border-[#2d3748] focus:border-[#3b82f6] focus:outline-none rounded-lg text-sm text-white appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0"
                />
                <Calendar className="absolute right-4 top-3.5 h-4 w-4 text-[#94a3b8] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2 relative">
            <label className="text-[10px] font-bold text-[#8c9bb0] tracking-wider uppercase">Description</label>
            <div className="relative">
              <textarea 
                required
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-[#1e2638] border border-[#2d3748] focus:border-[#3b82f6] focus:outline-none rounded-lg text-sm text-white resize-none"
              />
              <button
                type="button"
                className="absolute bottom-3 right-3 text-[10px] text-[#a78bfa] bg-[#a78bfa]/10 hover:bg-[#a78bfa]/20 px-2 py-1 rounded flex items-center gap-1 font-medium transition-colors"
              >
                <Sparkles className="h-3 w-3" />
                AI Refine
              </button>
            </div>
          </div>

          {/* RECORD VOICE INSTRUCTIONS */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#8c9bb0] tracking-wider uppercase">Record Voice Instructions</label>
            <button
              type="button"
              className="w-full py-3.5 px-4 bg-[#1e2638] border border-[#2d3748] hover:border-[#475569] rounded-lg text-sm text-[#94a3b8] flex items-center gap-3 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#e0e7ff] flex items-center justify-center">
                <Mic className="h-4 w-4 text-[#6366f1]" />
              </div>
              Tap microphone to record instructions
            </button>
          </div>

          {/* ATTACHMENTS */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#8c9bb0] tracking-wider uppercase">Attachments</label>
            <button
              type="button"
              className="w-full py-5 border-2 border-dashed border-[#2d3748] hover:border-[#475569] rounded-lg flex items-center justify-center text-sm text-[#94a3b8] transition-colors"
            >
              Click to upload (Auto-Scanned)
            </button>
          </div>

          {/* BASE BUDGET & URGENCY */}
          <div className="pt-2 border-t border-[#1e293b]">
            <div className="flex justify-between items-end mb-2 mt-4">
              <label className="text-[10px] font-bold text-[#8c9bb0] tracking-wider uppercase">Base Budget (₹)</label>
              <button
                type="button"
                className="text-[10px] text-[#a78bfa] flex items-center gap-1 font-medium hover:underline"
              >
                <Sparkles className="h-3 w-3" />
                Suggest price with AI
              </button>
            </div>
            <div className="relative mb-6">
              <span className="absolute left-4 top-3 text-[#94a3b8] text-sm">₹</span>
              <input 
                type="number" 
                required
                value={budget}
                onChange={e => setBudget(e.target.value)}
                placeholder="500"
                className="w-full pl-8 pr-4 py-3 bg-[#1e2638] border border-[#2d3748] focus:border-[#3b82f6] focus:outline-none rounded-lg text-sm text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#8c9bb0] tracking-wider uppercase">Service Tier (Urgency)</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setUrgency('standard')}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    urgency === 'standard' 
                      ? 'border-[#6366f1] bg-[#6366f1]/10' 
                      : 'border-[#2d3748] bg-[#1e2638] hover:border-[#475569]'
                  }`}
                >
                  <div className={`text-sm font-medium ${urgency === 'standard' ? 'text-[#818cf8]' : 'text-white'}`}>Standard</div>
                  <div className="text-[10px] text-[#64748b] mt-0.5">Price x1x</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('urgent')}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    urgency === 'urgent' 
                      ? 'border-[#6366f1] bg-[#6366f1]/10' 
                      : 'border-[#2d3748] bg-[#1e2638] hover:border-[#475569]'
                  }`}
                >
                  <div className={`text-sm font-medium ${urgency === 'urgent' ? 'text-[#818cf8]' : 'text-white'}`}>Urgent</div>
                  <div className="text-[10px] text-[#64748b] mt-0.5">Price x1.5x</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('overnight')}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    urgency === 'overnight' 
                      ? 'border-[#6366f1] bg-[#6366f1]/10' 
                      : 'border-[#2d3748] bg-[#1e2638] hover:border-[#475569]'
                  }`}
                >
                  <div className={`text-sm font-medium ${urgency === 'overnight' ? 'text-[#818cf8]' : 'text-white'}`}>Overnight</div>
                  <div className="text-[10px] text-[#64748b] mt-0.5">Price x2x</div>
                </button>
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm font-medium">
              <span className="text-white">Total Budget: </span>
              <span className="text-[#22c55e]">₹{calculateTotal()}</span>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-[#1e293b]">
            <button
              type="button"
              className="px-6 py-2.5 text-sm font-medium text-[#94a3b8] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Post & Fund
            </button>
          </div>
          
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          {success && <div className="text-green-500 text-sm mt-2">{success}</div>}

        </form>
      </div>
    </div>
  );
}

