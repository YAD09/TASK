import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Task, TaskStatus, MicroTeamMember } from '../types';
import ChatComponent from './ChatComponent';
import { 
  Briefcase, 
  MapPin, 
  Coins, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  Check, 
  UserCheck, 
  FileCheck, 
  Users, 
  Sparkles, 
  Play, 
  Upload, 
  ThumbsUp, 
  Brain,
  Search,
  MessageSquare,
  Compass,
  Loader2
} from 'lucide-react';

export default function TaskDetails() {
  const { 
    tasks, 
    setTasks, 
    currentUser, 
    selectedTaskId, 
    setSelectedTaskId,
    addTransaction,
    addNotification,
    updateProfile
  } = useApp();

  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'status' | 'files' | 'team' | 'chat'>('status');
  const [submissionText, setSubmissionText] = useState('');
  
  // AI Polish State
  const [polishing, setPolishing] = useState(false);
  const [polishSuggestions, setPolishSuggestions] = useState<string | null>(null);

  // Scan files mock
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'clean' | 'corrupt' | null>(null);

  if (!currentUser) return null;

  // Filter tasks based on user involvement
  const filteredCollaborations = tasks.filter(task => {
    return task.posterId === currentUser.uid || task.assignedDoerIds.includes(currentUser.uid) || task.id === 'task_1' || task.id === 'task_3';
  });

  const activeTask = tasks.find(t => t.id === selectedTaskId) || filteredCollaborations[0];
  const isPoster = activeTask?.posterId === currentUser.uid;

  // AI Polish suggestions for work
  const handleAIPolish = async () => {
    if (!submissionText) return;
    setPolishing(true);
    try {
      const response = await fetch('/api/gemini/work-improver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionText })
      });
      const data = await response.json();
      if (data.suggestions) {
        setPolishSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPolishing(false);
    }
  };

  // Safe Scan File upload checker
  const triggerSafeScan = () => {
    setScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setScanning(false);
      setScanResult('clean');
    }, 2000);
  };

  // Status transitions
  const handleUpdateStatus = async (nextStatus: TaskStatus) => {
    if (!activeTask) return;
    
    // Create status updates
    setTasks(prev => prev.map(t => t.id === activeTask.id ? { ...t, status: nextStatus } : t));

    // Handle Wallet logic upon completion
    if (nextStatus === 'completed') {
      // Release payment to assigned doer
      const totalBudget = activeTask.budget;
      const commission = Math.round(totalBudget * 0.05); // 5% platform comm
      const netPay = totalBudget - commission;

      // Deduct locked amount from poster escrow
      await updateProfile({
        escrowBalance: Math.max(0, currentUser.escrowBalance - totalBudget)
      });

      // Send alert
      await addNotification({
        userId: activeTask.posterId,
        title: 'Project Escrow Released',
        message: `₹${totalBudget} released from your escrow wallet for task: "${activeTask.title}"`,
        type: 'wallet_update'
      });

      await addTransaction({
        userId: activeTask.posterId,
        type: 'payout',
        amount: totalBudget,
        description: `Escrow release: "${activeTask.title}"`,
        taskId: activeTask.id
      });
    }

    await addNotification({
      userId: activeTask.posterId,
      title: 'Workflow Updated',
      message: `Task "${activeTask.title}" status shifted to: ${nextStatus.toUpperCase()}`,
      type: 'task_assigned',
      taskId: activeTask.id
    });
  };

  // Micro Team - add role
  const handleAddTeamRole = (role: MicroTeamMember['role']) => {
    if (!activeTask) return;
    const currentMembers = activeTask.teamMembers || [];
    
    const isPresent = currentMembers.some(m => m.role === role);
    if (isPresent) return;

    const newMember: MicroTeamMember = {
      userId: 'user_alice', // Simulate assigning Alice
      userName: 'Alice Sharma',
      role,
      sharePercentage: currentMembers.length === 0 ? 100 : Math.round(100 / (currentMembers.length + 1)),
      status: 'accepted'
    };

    // Distribute percentages equally among roles
    const updatedMembers = [...currentMembers, newMember];
    const equalShare = Math.round(100 / updatedMembers.length);
    const finalMembers = updatedMembers.map(m => ({ ...m, sharePercentage: equalShare }));

    setTasks(prev => prev.map(t => t.id === activeTask.id ? { ...t, teamMembers: finalMembers } : t));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Left Master List Sidebar */}
      <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-md p-4 space-y-3">
        <h3 className="text-xs text-zinc-500 uppercase tracking-wider mb-2">My Workspaces</h3>
        
        {filteredCollaborations.length === 0 ? (
          <div className="text-center py-10 text-xs text-zinc-500">
            <Briefcase className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
            <span>No active jobs or proposals.</span>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCollaborations.map(collab => {
              const isActive = activeTask && activeTask.id === collab.id;
              return (
                <button
                  key={collab.id}
                  onClick={() => setSelectedTaskId(collab.id)}
                  className={`w-full text-left p-3 rounded-md border text-xs transition ${
                    isActive 
                      ? 'bg-white border-white text-black font-medium' 
                      : 'bg-black border-zinc-800 hover:bg-zinc-800 text-zinc-400'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`truncate pr-1 font-medium ${isActive ? 'text-black' : 'text-zinc-200'}`}>{collab.title}</span>
                    <span className="font-medium">₹{collab.budget}</span>
                  </div>
                  <div className={`flex justify-between mt-2 text-[9px] font-mono ${isActive ? 'text-zinc-500' : 'text-zinc-500'}`}>
                    <span>Status: {collab.status.toUpperCase()}</span>
                    <span>IIT Bombay</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Details Workspace */}
      <div className="lg:col-span-8 space-y-6">
        {(!activeTask) ? (
          <div className="p-12 text-center bg-zinc-900 rounded-md border border-zinc-800">
            <Compass className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-white">Select Campus Workspace</h3>
            <p className="text-xs text-zinc-500 mt-1">Pick a collaboration hub on the left to start.</p>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-md p-6 space-y-6">
            
            {/* Header Title */}
            <div>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-zinc-800 text-white rounded border border-zinc-700 text-[9px] font-medium mb-2">
                    <span>Task ID: {activeTask.id}</span>
                  </div>
                  <h2 className="text-md font-medium text-white leading-snug">{activeTask.title}</h2>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{activeTask.description}</p>
                </div>
                
                <div className="text-right shrink-0">
                  <span className="text-md font-medium text-white">₹{activeTask.budget}</span>
                  <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Held in Escrow</div>
                </div>
              </div>

              {/* Status Tracker Flow Bar */}
              <div className="mt-6">
                <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono uppercase mb-2">
                  <span>Workspace workflow</span>
                  <span className="text-white">STATUS: {activeTask.status.toUpperCase()}</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  <div className={`h-1.5 rounded-full ${['open', 'applied', 'assigned', 'in_progress', 'submitted', 'reviewing', 'completed'].includes(activeTask.status) ? 'bg-white' : 'bg-zinc-800'}`} />
                  <div className={`h-1.5 rounded-full ${['assigned', 'in_progress', 'submitted', 'reviewing', 'completed'].includes(activeTask.status) ? 'bg-white' : 'bg-zinc-800'}`} />
                  <div className={`h-1.5 rounded-full ${['submitted', 'reviewing', 'completed'].includes(activeTask.status) ? 'bg-white' : 'bg-zinc-800'}`} />
                  <div className={`h-1.5 rounded-full ${activeTask.status === 'completed' ? 'bg-white' : 'bg-zinc-800'}`} />
                </div>
              </div>
            </div>

            {/* Sub navigation bar inside workspace */}
            <div className="flex gap-1 bg-black p-0.5 rounded-md border border-zinc-800">
              <button
                onClick={() => setActiveWorkspaceTab('status')}
                className={`flex-1 py-1.5 text-xs font-medium rounded transition ${activeWorkspaceTab === 'status' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                Workflow
              </button>
              
              <button
                onClick={() => setActiveWorkspaceTab('files')}
                className={`flex-1 py-1.5 text-xs font-medium rounded transition ${activeWorkspaceTab === 'files' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                Deliverables
              </button>

              <button
                onClick={() => setActiveWorkspaceTab('team')}
                className={`flex-1 py-1.5 text-xs font-medium rounded transition ${activeWorkspaceTab === 'team' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                Micro-Teams
              </button>

              <button
                onClick={() => setActiveWorkspaceTab('chat')}
                className={`flex-1 py-1.5 text-xs font-medium rounded transition ${activeWorkspaceTab === 'chat' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                Chat
              </button>
            </div>

            {/* TAB CONTENT: Controls */}
            {activeWorkspaceTab === 'status' && (
              <div className="p-4 bg-black border border-zinc-800 rounded-md space-y-4">
                <h4 className="text-xs font-medium text-white">Task Control Actions</h4>
                
                <div className="flex flex-wrap gap-2.5">
                  {isPoster ? (
                    <>
                      {activeTask.status === 'open' && (
                        <button
                          onClick={() => handleUpdateStatus('assigned')}
                          className="px-4 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-medium rounded-md transition flex items-center gap-1.5"
                        >
                          <UserCheck className="h-4 w-4" />
                          <span>Assign to Alice Sharma</span>
                        </button>
                      )}
                      
                      {activeTask.status === 'assigned' && (
                        <button
                          onClick={() => handleUpdateStatus('in_progress')}
                          className="px-4 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-medium rounded-md transition flex items-center gap-1.5"
                        >
                          <Play className="h-4 w-4" />
                          <span>Authorize Start Work</span>
                        </button>
                      )}

                      {['submitted', 'reviewing'].includes(activeTask.status) && (
                        <button
                          onClick={() => handleUpdateStatus('completed')}
                          className="px-4 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-medium rounded-md transition flex items-center gap-1.5"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve Submission & Release Escrow</span>
                        </button>
                      )}

                      {activeTask.status !== 'completed' && activeTask.status !== 'disputed' && (
                        <button
                          onClick={() => handleUpdateStatus('disputed')}
                          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-xs font-medium rounded-md transition flex items-center gap-1.5"
                        >
                          <AlertTriangle className="h-4 w-4" />
                          <span>Trigger Dispute Resolution</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {activeTask.status === 'assigned' && (
                        <button
                          onClick={() => handleUpdateStatus('in_progress')}
                          className="px-4 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-medium rounded-md transition flex items-center gap-1.5"
                        >
                          <Play className="h-4 w-4" />
                          <span>Acknowledge Start</span>
                        </button>
                      )}

                      {activeTask.status === 'in_progress' && (
                        <button
                          onClick={() => handleUpdateStatus('submitted')}
                          className="px-4 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-medium rounded-md transition flex items-center gap-1.5"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Submit Finished Work</span>
                        </button>
                      )}
                    </>
                  )}
                </div>

                <div className="p-3 bg-zinc-900 rounded-md border border-zinc-800 text-[11px] text-zinc-400 leading-relaxed font-sans">
                  🛡️ <b>TaskLink Escrow:</b> Posters deposit ₹{activeTask.budget} which remains locked. Once doers submit verification and poster approves, funds are dispatched immediately.
                </div>
              </div>
            )}

            {/* TAB CONTENT: Previews */}
            {activeWorkspaceTab === 'files' && (
              <div className="space-y-4">
                
                {/* Safe scan helper */}
                <div className="p-4 bg-black border border-zinc-800 rounded-md space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-medium text-white">Safe Deliverables Sandbox</h4>
                    <span className="px-2 py-0.5 rounded text-[8px] bg-zinc-800 text-white border border-zinc-700 font-medium uppercase">SECURED</span>
                  </div>

                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    Upload your print PDF sheets or deliverables. Every file uploaded is automatically verified.
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={triggerSafeScan}
                      disabled={scanning}
                      className="px-3.5 py-1.5 bg-white hover:bg-zinc-200 text-black text-[10px] font-medium rounded-md transition flex items-center gap-1.5"
                    >
                      {scanning ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ShieldCheck className="h-4 w-4" />
                      )}
                      <span>{scanning ? 'Checking bytes integrity...' : 'Upload & run malware scan'}</span>
                    </button>

                    {scanResult === 'clean' && (
                      <span className="text-[10px] text-white font-medium flex items-center gap-1 font-mono">
                        <Check className="h-3.5 w-3.5" />
                        <span>STATUS: CLEAN</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* AI Work Improver for Doers */}
                {!isPoster && activeTask.status === 'in_progress' && (
                  <div className="p-4 bg-black border border-zinc-800 rounded-md space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-white">AI Quality Co-Pilot</span>
                      <span className="text-[9px] text-zinc-500 font-mono">Gemini-powered</span>
                    </div>

                    <textarea 
                      value={submissionText}
                      onChange={e => setSubmissionText(e.target.value)}
                      placeholder="Type a summary description of the files you are submitting to let Gemini proofread."
                      rows={2.5}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white resize-none font-sans"
                    />

                    <button
                      onClick={handleAIPolish}
                      disabled={polishing || !submissionText}
                      className="py-1.5 px-3 bg-zinc-800 border border-zinc-700 text-white text-[10px] font-medium rounded-md transition hover:bg-zinc-700 flex items-center gap-1.5"
                    >
                      {polishing ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Brain className="h-4 w-4" />
                      )}
                      <span>Analyze Submission Quality</span>
                    </button>

                    {polishSuggestions && (
                      <div className="p-3 bg-zinc-900 rounded-md border border-zinc-800 text-[11px] text-zinc-300 leading-relaxed font-sans">
                        <h5 className="font-medium text-white mb-1">Gemini Suggestions:</h5>
                        {polishSuggestions}
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

            {/* TAB CONTENT: Teams */}
            {activeWorkspaceTab === 'team' && (
              <div className="p-4 bg-black border border-zinc-800 rounded-md space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-medium text-white flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Micro-Team Splitter</span>
                    </h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Let multiple students join a single workspace with split payouts.</p>
                  </div>
                  {isPoster && (
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => handleAddTeamRole('writer')}
                        className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-[9px] font-medium text-white"
                      >
                        + Add Writer
                      </button>
                      <button 
                        onClick={() => handleAddTeamRole('designer')}
                        className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-[9px] font-medium text-white"
                      >
                        + Add Designer
                      </button>
                    </div>
                  )}
                </div>

                <div className="divide-y divide-zinc-800">
                  {(!activeTask.teamMembers || activeTask.teamMembers.length === 0) ? (
                    <div className="py-6 text-center text-xs text-zinc-500">
                      <span>No splits active. This is a single-doer task.</span>
                    </div>
                  ) : (
                    activeTask.teamMembers.map((member, idx) => (
                      <div key={idx} className="py-3 flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <img 
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" 
                            alt={member.userName} 
                            className="w-5.5 h-5.5 rounded-full"
                          />
                          <div>
                            <span className="font-medium text-white">{member.userName || 'Unassigned Peer'}</span>
                            <span className="ml-1.5 px-1.5 py-0.5 text-[8px] font-medium uppercase bg-zinc-800 text-zinc-300 rounded">
                              {member.role}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-medium text-white">₹{Math.round(activeTask.budget * member.sharePercentage / 100)}</span>
                          <span className="ml-2 text-[9px] text-zinc-500">({member.sharePercentage}%)</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Chat */}
            {activeWorkspaceTab === 'chat' && (
              <ChatComponent taskId={activeTask.id} />
            )}

          </div>
        )}
      </div>

    </div>
  );
}
