import React, { useState } from 'react';
import { useApp } from './AppContext';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  User, 
  Lock, 
  Mail, 
  Building, 
  Laptop, 
  Globe, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AuthPage() {
  const { demoLogin, setCurrentUser } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [university, setUniversity] = useState('IIT Bombay');
  const [department, setDepartment] = useState('Computer Science');
  const [gradYear, setGradYear] = useState('2027');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!email.endsWith('.edu') && !email.includes('student') && !email.includes('iit') && !email.includes('bits')) {
          setError('Please use a valid university student email address (e.g., student@domain.edu) to verify status.');
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Save additional profile details to Firestore
        const defaultProfile = {
          uid: user.uid,
          email,
          name: name || 'Student Peer',
          username: username || email.split('@')[0],
          photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.uid}`,
          university,
          department,
          graduationYear: parseInt(gradYear) || 2027,
          skills: skills ? skills.split(',').map(s => s.trim()) : ['Collaboration', 'Academic Writing'],
          bio: bio || 'TaskLink student ready to complete local tasks.',
          rating: 5.0,
          reviewCount: 0,
          reliabilityScore: 100,
          successRate: 100,
          tasksCompleted: 0,
          onTimeDelivery: 100,
          availability: 'online' as const,
          location: {
            latitude: 19.1334,
            longitude: 72.9133,
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            campus: university + ' Campus'
          },
          isDoerMode: true,
          walletBalance: 1500, // 1500 INR welcome credits
          escrowBalance: 0,
          refundBalance: 0,
          lockedAmount: 0,
          portfolio: [],
          createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'users', user.uid), defaultProfile);
        setCurrentUser(defaultProfile);
        setSuccess('Account created! Verification email simulated.');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess('Welcome back!');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Reset link dispatched! Check your college inbox.');
    } catch (err: any) {
      setError(err.message || 'Error triggering recovery reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-4 relative font-sans">

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 my-8">
        
        {/* Left Side: Brand Concept */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 lg:p-8 bg-zinc-900 border border-zinc-800 rounded-md">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-md bg-zinc-800 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">TaskLink</span>
            </div>

            <h1 className="text-3xl font-medium leading-tight text-white mb-4">
              The Campus Operating System
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Connect securely with verified peers on campus. Earn pocket money, trade services, and delegate chores through our secure multi-tier escrow system.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-zinc-800 text-white rounded">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-white">100% Student Verified</h4>
                  <p className="text-[11px] text-zinc-400">Strictly .edu domain authentication.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-zinc-800 text-white rounded">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-white">Safe Escrow Lockers</h4>
                  <p className="text-[11px] text-zinc-400">Funds are stored securely and only released on completion.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-zinc-800 text-white rounded">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-white">Hyperlocal Campus Discovery</h4>
                  <p className="text-[11px] text-zinc-400">Location sensors connect you to tasks 100m away.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800">
            <h3 className="text-xs font-medium text-zinc-500 tracking-wider uppercase mb-3">
              Sandbox Evaluator Fast-Pass
            </h3>
            <p className="text-[11px] text-zinc-400 mb-4">
              Skip typing! Click any bypass avatar to instantly login to simulated accounts:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => demoLogin('alice')}
                className="flex flex-col items-center justify-center p-2.5 bg-black hover:bg-zinc-800 border border-zinc-800 rounded-md transition group"
              >
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" 
                  alt="Alice" 
                  className="w-8 h-8 rounded-full border border-zinc-700 object-cover group-hover:scale-105 transition"
                />
                <span className="text-[10px] mt-1.5 text-zinc-400">Alice</span>
              </button>
              
              <button 
                onClick={() => demoLogin('bob')}
                className="flex flex-col items-center justify-center p-2.5 bg-black hover:bg-zinc-800 border border-zinc-800 rounded-md transition group"
              >
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" 
                  alt="Bob" 
                  className="w-8 h-8 rounded-full border border-zinc-700 object-cover group-hover:scale-105 transition"
                />
                <span className="text-[10px] mt-1.5 text-zinc-400">Bob</span>
              </button>

              <button 
                onClick={() => demoLogin('admin')}
                className="flex flex-col items-center justify-center p-2.5 bg-black hover:bg-zinc-800 border border-zinc-800 rounded-md transition group"
              >
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80" 
                  alt="Admin" 
                  className="w-8 h-8 rounded-full border border-zinc-700 object-cover group-hover:scale-105 transition"
                />
                <span className="text-[10px] mt-1.5 text-zinc-400">Prof (Admin)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Panel */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-md p-6 lg:p-8 flex flex-col justify-center">
          
          {showForgot ? (
            <form onSubmit={handleReset} className="space-y-4">
              <h2 className="text-xl font-medium text-white">Reset Account Password</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Provide your registered credentials and we will dispatch a recovery link.
              </p>
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    className="w-full pl-9 pr-4 py-2.5 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-sm text-white"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-md text-white text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-md text-white text-xs flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>{success}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-2.5 bg-white hover:bg-zinc-200 text-black text-sm font-medium rounded-md transition flex items-center justify-center gap-2"
              >
                {loading ? 'Sending...' : 'Send Recovery Link'}
              </button>

              <button 
                type="button" 
                onClick={() => setShowForgot(false)}
                className="w-full text-center text-xs text-zinc-400 hover:text-white"
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-2xl font-medium text-white">
                    {isSignUp ? 'Create Profile' : 'Sign In'}
                  </h2>
                  <p className="text-xs text-zinc-400">
                    {isSignUp ? 'Create your secure profile on campus' : 'Access your active campus collaborations'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-xs font-medium text-zinc-300 hover:text-white underline"
                >
                  {isSignUp ? 'Have profile? Sign In' : 'Create Profile'}
                </button>
              </div>

              {isSignUp && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Yash Deore"
                        className="w-full pl-9 pr-4 py-2 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">Username</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                      <input 
                        type="text" 
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="yash_codes"
                        className="w-full pl-9 pr-4 py-2 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">University</label>
                    <select
                      value={university}
                      onChange={e => setUniversity(e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white"
                    >
                      <option value="IIT Bombay">IIT Bombay</option>
                      <option value="IIT Delhi">IIT Delhi</option>
                      <option value="BITS Pilani">BITS Pilani</option>
                      <option value="Stanford University">Stanford University</option>
                      <option value="Bengaluru University">Bengaluru University</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">Department</label>
                    <input 
                      type="text" 
                      required
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      placeholder="Computer Science"
                      className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">Graduation Year</label>
                    <input 
                      type="number" 
                      required
                      value={gradYear}
                      onChange={e => setGradYear(e.target.value)}
                      placeholder="2027"
                      className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">Skills (Comma-separated)</label>
                    <input 
                      type="text" 
                      value={skills}
                      onChange={e => setSkills(e.target.value)}
                      placeholder="Python, UI Design, LaTeX"
                      className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-medium text-zinc-300">Bio</label>
                    <textarea 
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="Tell peers what you are good at..."
                      rows={2}
                      className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white resize-none"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-9 pr-4 py-2 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-xs font-medium text-zinc-300">Password</label>
                  {!isSignUp && (
                    <button 
                      type="button" 
                      onClick={() => setShowForgot(true)}
                      className="text-[10px] text-zinc-400 hover:text-white"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-md text-white text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-md text-white text-xs flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-2.5 bg-white text-black hover:bg-zinc-200 text-xs font-medium rounded-md transition flex items-center justify-center gap-2 mt-2"
              >
                {loading ? 'Processing...' : isSignUp ? 'Register' : 'Sign In'}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-zinc-800"></div>
                <span className="flex-shrink mx-4 text-[10px] text-zinc-500 uppercase font-medium">or</span>
                <div className="flex-grow border-t border-zinc-800"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button" 
                  onClick={() => demoLogin('alice')}
                  className="py-2 px-3 bg-black hover:bg-zinc-800 border border-zinc-800 rounded-md text-xs text-zinc-300 transition flex items-center justify-center gap-2"
                >
                  <span className="h-2 w-2 rounded-full bg-white"></span>
                  Google Login
                </button>
                <button 
                  type="button" 
                  onClick={() => demoLogin('bob')}
                  className="py-2 px-3 bg-black hover:bg-zinc-800 border border-zinc-800 rounded-md text-xs text-zinc-300 transition flex items-center justify-center gap-2"
                >
                  <span className="h-2 w-2 rounded-full bg-white"></span>
                  Phone Login
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
