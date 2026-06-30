import React, { useState } from 'react';
import { useApp } from './AppContext';
import { 
  ShieldAlert, 
  TrendingUp, 
  Users, 
  Coins, 
  MapPin, 
  AlertTriangle, 
  BarChart, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  XCircle,
  Clock,
  ThumbsUp,
  FileText
} from 'lucide-react';

export default function AdminPanel() {
  const { tasks, setTasks, addTransaction, addNotification, updateProfile } = useApp();
  const [moderatingText, setModeratingText] = useState('');

  // Find disputed tasks
  const disputedTasks = tasks.filter(t => t.status === 'disputed');

  const handleResolveDispute = async (taskId: string, decision: 'refund_poster' | 'payout_doer') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (decision === 'refund_poster') {
      // Refund payment to poster
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'cancelled' } : t));
      
      await addNotification({
        userId: task.posterId,
        title: 'Dispute Resolved: Refunded',
        message: `Your dispute for task: "${task.title}" has been ruled in your favor. ₹${task.budget} was refunded to your Refund Wallet.`,
        type: 'refund',
        taskId
      });

      await addTransaction({
        userId: task.posterId,
        type: 'refund',
        amount: task.budget,
        description: `Dispute Refund: "${task.title}"`,
        taskId
      });
    } else {
      // Release payment to assigned doer
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'completed' } : t));
      
      await addNotification({
        userId: task.posterId,
        title: 'Dispute Resolved: Payout',
        message: `Your dispute for task: "${task.title}" has been ruled in favor of the doer. ₹${task.budget} was released.`,
        type: 'wallet_update',
        taskId
      });

      if (task.assignedDoerIds && task.assignedDoerIds.length > 0) {
        await addNotification({
          userId: task.assignedDoerIds[0],
          title: 'Dispute Resolved: Earnings Credited',
          message: `The campus ombudsman has approved your work for: "${task.title}". ₹${task.budget} was credited.`,
          type: 'wallet_update',
          taskId
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Admin stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-md">
          <div className="text-[10px] text-zinc-500 uppercase">Daily Active Users</div>
          <div className="text-xl font-medium mt-1 text-white">4,820 Students</div>
          <div className="text-[10px] text-zinc-400 mt-2">Active across 7 university blocks</div>
        </div>

        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-md">
          <div className="text-[10px] text-zinc-500 uppercase">Platform Volume</div>
          <div className="text-xl font-medium mt-1 text-white">₹2,84,500</div>
          <div className="text-[10px] text-zinc-400 mt-2">Total gross transactions escrowed</div>
        </div>

        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-md">
          <div className="text-[10px] text-zinc-500 uppercase">Dispute Rate</div>
          <div className="text-xl font-medium mt-1 text-white">0.42%</div>
          <div className="text-[10px] text-zinc-400 mt-2">Extremely high student trust factor</div>
        </div>

        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-md">
          <div className="text-[10px] text-zinc-500 uppercase">Popular Category</div>
          <div className="text-xl font-medium mt-1 text-white">Print & Notes</div>
          <div className="text-[10px] text-zinc-400 mt-2">64% of hostel-gigs are deliveries</div>
        </div>

      </div>

      {/* Disputes and Telemetry logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Dispute Center */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-md p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="h-4 w-4 text-white" />
            <h3 className="text-xs font-medium text-white uppercase tracking-wider">Campus Dispute Arbitration Center</h3>
          </div>

          {disputedTasks.length === 0 ? (
            <div className="text-center py-12 text-xs text-zinc-500">
              <CheckCircle2 className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
              <span>All clear! No active peer disputes on campus.</span>
            </div>
          ) : (
            <div className="space-y-4">
              {disputedTasks.map(task => (
                <div key={task.id} className="p-4 bg-black rounded-md border border-zinc-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-medium text-white">{task.title}</h4>
                      <p className="text-[9px] text-zinc-500 font-mono mt-0.5">Task ID: {task.id} • Posted by student</p>
                    </div>
                    <span className="text-xs font-medium text-white">₹{task.budget}</span>
                  </div>

                  <p className="text-[10px] text-zinc-400 leading-relaxed font-sans bg-zinc-900 p-2.5 rounded-md border border-zinc-800">
                    ⚠️ <b>Dispute Claim:</b> Doer submitted file slides, poster claims resolution is incomplete and demands full refund.
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleResolveDispute(task.id, 'refund_poster')}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-[10px] font-medium rounded-md transition"
                    >
                      Refund Poster (₹{task.budget})
                    </button>
                    <button
                      onClick={() => handleResolveDispute(task.id, 'payout_doer')}
                      className="px-3 py-1.5 bg-white hover:bg-zinc-200 text-black text-[10px] font-medium rounded-md transition"
                    >
                      Release Payout to Doer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Security Fraud Telemetry Logs */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-md p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart className="h-4 w-4 text-white" />
            <h3 className="text-xs font-medium text-white uppercase tracking-wider">Campus Activity & Scam Logs</h3>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto">
            <div className="p-3 bg-black rounded-md border border-zinc-800 text-[10px] font-mono leading-relaxed space-y-1">
              <div className="text-white flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>[FLAGGED BYPASS] @cooper_run</span>
              </div>
              <p className="text-zinc-400">Triggered alarm: Attempted contact bypass "Whatsapp me". Blocked transmission.</p>
              <div className="text-zinc-600 text-[8px]">Time: 2 mins ago • Location: Hostel 8</div>
            </div>

            <div className="p-3 bg-black rounded-md border border-zinc-800 text-[10px] font-mono leading-relaxed space-y-1">
              <div className="text-white flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>[ESCROW COMPLETED] @alice_codes</span>
              </div>
              <p className="text-zinc-400">Released ₹1,500. Commission of ₹75 deducted. Dispatched to Bank A/C.</p>
              <div className="text-zinc-600 text-[8px]">Time: 1 hour ago • IIT Bombay Hub</div>
            </div>

            <div className="p-3 bg-black rounded-md border border-zinc-800 text-[10px] font-mono leading-relaxed space-y-1">
              <div className="text-white flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>[AI CO-PILOT ANALYSIS]</span>
              </div>
              <p className="text-zinc-400">Analyzed clarity score for LaTeX Physics Lab template. Rating: 9/10.</p>
              <div className="text-zinc-600 text-[8px]">Time: 4 hours ago • Physics Dept</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
