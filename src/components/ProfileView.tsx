import React, { useState } from 'react';
import { useApp } from './AppContext';
import { CATEGORIES, MOCK_REVIEWS } from '../data';
import { 
  User, 
  Award, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Edit3, 
  Check, 
  Sparkles, 
  Briefcase, 
  Camera, 
  AlertCircle,
  TrendingUp,
  FileText
} from 'lucide-react';

export default function ProfileView() {
  const { currentUser, updateProfile } = useApp();
  const [editing, setEditing] = useState(false);

  // Form states
  const [name, setName] = useState(currentUser?.name || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [skills, setSkills] = useState(currentUser?.skills.join(', ') || '');
  const [university, setUniversity] = useState(currentUser?.university || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [gradYear, setGradYear] = useState(String(currentUser?.graduationYear || '2027'));

  if (!currentUser) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      username,
      bio,
      university,
      department,
      graduationYear: Number(gradYear) || 2027,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean)
    });
    setEditing(false);
  };

  const handleAvailabilityChange = async (mode: typeof currentUser.availability) => {
    await updateProfile({ availability: mode });
  };

  return (
    <div className="space-y-6">
      
      {/* Top profile layout card */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-md flex flex-col md:flex-row gap-6 items-center md:items-start justify-between">
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-5 text-center md:text-left">
          <img 
            src={currentUser.photoURL} 
            alt={currentUser.name} 
            className="w-20 h-20 rounded-md border border-zinc-700 object-cover"
          />
          
          <div className="space-y-2">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h2 className="text-xl font-medium text-white">{currentUser.name}</h2>
                <span className="px-2 py-0.5 rounded text-[9px] bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase">
                  Campus Peer
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-mono">@{currentUser.username}</p>
            </div>

            <p className="text-xs text-zinc-300 max-w-md leading-relaxed">{currentUser.bio}</p>

            {/* University and academic descriptors */}
            <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 pt-1 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4" />
                <span>{currentUser.university}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                <span>{currentUser.department} ({currentUser.graduationYear})</span>
              </span>
            </div>
          </div>
        </div>

        {/* Buttons and actions */}
        <div className="shrink-0">
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-medium rounded-md transition flex items-center gap-1.5"
          >
            <Edit3 className="h-4 w-4" />
            <span>{editing ? 'Cancel edit' : 'Edit profile'}</span>
          </button>
        </div>

      </div>

      {editing ? (
        <form onSubmit={handleSave} className="p-6 bg-zinc-900 border border-zinc-800 rounded-md space-y-4">
          <h3 className="text-sm font-medium text-white">Update Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">University</label>
              <input 
                type="text" 
                value={university}
                onChange={e => setUniversity(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Department</label>
              <input 
                type="text" 
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Graduation Year</label>
              <input 
                type="number" 
                value={gradYear}
                onChange={e => setGradYear(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Skills</label>
              <input 
                type="text" 
                value={skills}
                onChange={e => setSkills(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-medium text-zinc-300">Bio</label>
              <textarea 
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white resize-none"
              />
            </div>

          </div>

          <button
            type="submit"
            className="py-2 px-5 bg-white hover:bg-zinc-200 text-black text-xs font-medium rounded-md transition flex items-center gap-1.5"
          >
            <Check className="h-4 w-4" />
            <span>Save Profile Updates</span>
          </button>
        </form>
      ) : null}

      {/* Grid details (Availability, ratings, portfolios) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Availability Selector */}
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-md space-y-3">
            <h4 className="text-[10px] text-zinc-500 uppercase tracking-wider">Availability</h4>
            
            <div className="space-y-2">
              {(['online', 'busy', 'accepting_urgent'] as const).map(mode => {
                const isActive = currentUser.availability === mode;
                const labels: Record<string, string> = {
                  online: 'Available',
                  busy: 'Busy',
                  accepting_urgent: 'Accepting Urgent Tasks'
                };
                const colors: Record<string, string> = {
                  online: 'bg-zinc-300',
                  busy: 'bg-zinc-500',
                  accepting_urgent: 'bg-white'
                };
                return (
                  <button
                    key={mode}
                    onClick={() => handleAvailabilityChange(mode)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium border transition ${
                      isActive 
                        ? 'bg-zinc-800 border-zinc-700 text-white' 
                        : 'bg-black border-zinc-800 text-zinc-400 hover:text-zinc-300'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${colors[mode]}`} />
                    <span>{labels[mode]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Peer Trust Scores Card */}
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-md space-y-4">
            <h4 className="text-[10px] text-zinc-500 uppercase tracking-wider">Metrics</h4>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">Reliability Index</span>
                  <span className="font-medium text-white">{currentUser.reliabilityScore}%</span>
                </div>
                <div className="h-1 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-white" style={{ width: `${currentUser.reliabilityScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">On-Time Delivery</span>
                  <span className="font-medium text-white">{currentUser.onTimeDelivery}%</span>
                </div>
                <div className="h-1 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-400" style={{ width: `${currentUser.onTimeDelivery}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">Success Rate</span>
                  <span className="font-medium text-white">{currentUser.successRate}%</span>
                </div>
                <div className="h-1 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-600" style={{ width: `${currentUser.successRate}%` }} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Skills Badges list */}
          <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-md space-y-3">
            <h4 className="text-[10px] text-zinc-500 uppercase tracking-wider">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {currentUser.skills.map((skill, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-md border border-zinc-700 text-xs flex items-center gap-1.5"
                >
                  <Award className="h-3.5 w-3.5" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Past peer reviews */}
          <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-md space-y-4">
            <h4 className="text-[10px] text-zinc-500 uppercase tracking-wider">Feedback</h4>
            
            <div className="divide-y divide-zinc-800 space-y-4">
              {MOCK_REVIEWS.map((review, idx) => (
                <div key={review.id || idx} className={`${idx > 0 ? 'pt-4' : ''} space-y-1.5 text-xs`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <img 
                        src={review.reviewerPhotoURL} 
                        alt={review.reviewerName} 
                        className="w-6 h-6 rounded-full"
                      />
                      <div>
                        <span className="font-medium text-zinc-200">{review.reviewerName}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-white font-mono">★ {review.rating}</span>
                  </div>
                  <h5 className="font-medium text-zinc-300 text-xs truncate">Task: {review.taskTitle}</h5>
                  <p className="text-zinc-400 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
