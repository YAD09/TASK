import { Task, UserProfile, Notification, Review } from './types';

export const CAMPUS_OPTIONS = [
  'IIT Bombay Campus',
  'IIT Delhi Campus',
  'BITS Pilani Campus',
  'Delhi University North Campus',
  'Stanford University Campus',
  'MIT Campus',
  'Bengaluru University Campus'
];

export const CATEGORIES = [
  { id: 'all', name: 'All Services', icon: 'Layers' },
  { id: 'print_notes', name: 'Print & Notes', icon: 'Printer', description: 'Print documents, deliver notes or textbooks.' },
  { id: 'assignment_help', name: 'Lab & Assignment Help', icon: 'FileText', description: 'Assistance with proofreading, labs, and research.' },
  { id: 'hostel_delivery', name: 'Hostel Delivery', icon: 'Truck', description: 'Food, medicine, or grocery delivery to hostels.' },
  { id: 'tech_support', name: 'Tech & Laptop Repair', icon: 'Laptop', description: 'OS installation, software debugging, network setups.' },
  { id: 'campus_photography', name: 'Campus Photography', icon: 'Camera', description: 'Event photos, headshots, or club reels.' },
  { id: 'library_help', name: 'Library & Research', icon: 'BookOpen', description: 'Finding books, papers, or study partner support.' },
  { id: 'event_support', name: 'Club & Event Support', icon: 'Calendar', description: 'Volunteering, setup, sound, or design assistance.' }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    taskId: 'task_102',
    taskTitle: 'Need Printouts of CS-101 Lecture Notes Delivered',
    reviewerId: 'user_bob',
    reviewerName: 'Bob Vance',
    reviewerPhotoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    targetUserId: 'user_alice',
    rating: 5,
    comment: 'Super fast delivery to Hostel 4! Notes were printed exactly as requested. Saved my exam prep.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rev_2',
    taskId: 'task_104',
    taskTitle: 'Configure Dual Boot Ubuntu on ThinkPad',
    reviewerId: 'user_charlie',
    reviewerName: 'Charlie Brown',
    reviewerPhotoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
    targetUserId: 'user_alice',
    rating: 4.8,
    comment: 'Very knowledgeable CS senior. Solved a tricky grub loader issue with Ubuntu dual boot. Recommended!',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'not_1',
    userId: 'user_alice',
    title: 'New Nearby Task Posted',
    message: 'Hostel 3: "Need Urgent Help carrying heavy laundry luggage" is 200m away.',
    type: 'urgent_task',
    isRead: false,
    taskId: 'task_mock_3',
    createdAt: new Date().toISOString()
  },
  {
    id: 'not_2',
    userId: 'user_alice',
    title: 'Wallet Deposited Successfully',
    message: '₹1,500 deposited into your Escrow Wallet via secure local gateway.',
    type: 'wallet_update',
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  }
];

export const SEED_USERS: UserProfile[] = [
  {
    uid: 'user_admin',
    email: 'admin@tasklink.edu',
    name: 'Professor Roy',
    username: 'campus_moderator',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    university: 'IIT Bombay',
    department: 'Computer Science & Engineering',
    graduationYear: 2026,
    skills: ['Conflict Resolution', 'Moderation', 'Campus Policies'],
    bio: 'TaskLink Official Campus Ombudsman. Ensuring safe student interactions and prompt dispute resolution.',
    rating: 5.0,
    reviewCount: 42,
    reliabilityScore: 100,
    successRate: 100,
    tasksCompleted: 150,
    onTimeDelivery: 100,
    availability: 'online',
    location: {
      latitude: 19.1334,
      longitude: 72.9133,
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      campus: 'IIT Bombay Campus'
    },
    isDoerMode: false,
    walletBalance: 25000,
    escrowBalance: 0,
    refundBalance: 0,
    lockedAmount: 0,
    portfolio: [],
    createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    uid: 'user_alice',
    email: 'alice@tasklink.edu',
    name: 'Alice Sharma',
    username: 'alice_codes',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    university: 'IIT Bombay',
    department: 'Electrical Engineering',
    graduationYear: 2027,
    skills: ['Ubuntu', 'LaTeX Prep', 'Python', 'Note taking', 'Academic proofreading'],
    bio: 'Junior year EE student. Love assisting classmates with setups, research note prep, and running hostel errands for extra coffee cash.',
    rating: 4.9,
    reviewCount: 18,
    reliabilityScore: 98,
    successRate: 96,
    tasksCompleted: 24,
    onTimeDelivery: 95,
    availability: 'online',
    location: {
      latitude: 19.1330,
      longitude: 72.9130,
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      campus: 'IIT Bombay Campus'
    },
    isDoerMode: true,
    walletBalance: 3200,
    escrowBalance: 1200,
    refundBalance: 0,
    lockedAmount: 500,
    portfolio: [
      {
        id: 'port_1',
        title: 'Full Latex Academic Research Template',
        description: 'Formatted a 15-page IEEE master thesis with complex equations and bibliography.',
        category: 'assignment_help',
        completedAt: '2026-05-15',
        images: [],
        files: ['thesis_template.tex']
      }
    ],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    uid: 'user_bob',
    email: 'bob@tasklink.edu',
    name: 'Bob Cooper',
    username: 'cooper_run',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    university: 'IIT Bombay',
    department: 'Mechanical Engineering',
    graduationYear: 2028,
    skills: ['Cycling', 'Matlab', '3D Printing', 'Event volunteer'],
    bio: 'Freshman ME. Fast cyclist, ready for food/print deliveries to Hostels 1 to 9 anytime. Let’s collaborate!',
    rating: 4.7,
    reviewCount: 9,
    reliabilityScore: 92,
    successRate: 94,
    tasksCompleted: 11,
    onTimeDelivery: 98,
    availability: 'accepting_urgent',
    location: {
      latitude: 19.1345,
      longitude: 72.9125,
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      campus: 'IIT Bombay Campus'
    },
    isDoerMode: false,
    walletBalance: 850,
    escrowBalance: 0,
    refundBalance: 0,
    lockedAmount: 0,
    portfolio: [],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const SEED_TASKS: Task[] = [
  {
    id: 'task_1',
    title: 'LaTeX Formatting for Physics Lab Report',
    description: 'Need assistance formatting a complex physics report with 12 mathematical derivations in LaTeX. Must compile perfectly without warnings and include labeled figures.',
    category: 'assignment_help',
    budget: 800,
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    urgency: 'standard',
    taskType: 'digital',
    visibility: 'campus_only',
    status: 'open',
    location: {
      latitude: 19.1330,
      longitude: 72.9130,
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      campus: 'IIT Bombay Campus'
    },
    posterId: 'user_bob',
    posterName: 'Bob Cooper',
    posterRating: 4.7,
    posterPhotoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    assignedDoerIds: [],
    teamMembers: [
      { userId: '', userName: '', role: 'writer', sharePercentage: 100, status: 'pending' }
    ],
    files: [{ name: 'Lab_Draft.docx', url: '#', size: 124500, type: 'docx' }],
    aiClarityScore: 9,
    aiSuccessPrediction: 94,
    aiQualityScore: 92,
    aiPriceRecommendation: 750,
    aiFeedback: 'Excellent parameters. Adding structural subheaders could push clarity score to 10.',
    college: 'IIT Bombay',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'task_2',
    title: 'Urgent: Deliver Printed Lab Journal to Lab-3 Dept',
    description: 'I forgot my printed chemistry lab journal in Hostel-8, Room 204. I need someone to collect it from my roommate and deliver it directly to the ground floor of Chemistry Lab-3 inside IIT Bombay before 2:00 PM. It is super urgent!',
    category: 'print_notes',
    budget: 350,
    deadline: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    urgency: 'urgent',
    taskType: 'physical',
    visibility: 'campus_only',
    status: 'open',
    location: {
      latitude: 19.1350,
      longitude: 72.9140,
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      campus: 'IIT Bombay Campus'
    },
    posterId: 'user_bob',
    posterName: 'Bob Cooper',
    posterRating: 4.7,
    posterPhotoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    assignedDoerIds: [],
    teamMembers: [],
    files: [],
    aiClarityScore: 10,
    aiSuccessPrediction: 98,
    aiQualityScore: 95,
    aiPriceRecommendation: 300,
    aiFeedback: 'Clear physical location and precise timeline make this an extremely high-probability success match.',
    college: 'IIT Bombay',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'task_3',
    title: 'Design Logo and Banner for Mood Indigo Club Event',
    description: 'We need a modern, minimalist vector logo and social banner for the upcoming campus technical symposium. Deliverables should be in Figma/SVG.',
    category: 'event_support',
    budget: 1500,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    urgency: 'standard',
    taskType: 'digital',
    visibility: 'public',
    status: 'assigned',
    location: {
      latitude: 19.1320,
      longitude: 72.9120,
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      campus: 'IIT Bombay Campus'
    },
    posterId: 'user_admin',
    posterName: 'Professor Roy',
    posterRating: 5.0,
    posterPhotoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    assignedDoerIds: ['user_alice'],
    teamMembers: [
      { userId: 'user_alice', userName: 'Alice Sharma', role: 'designer', sharePercentage: 100, status: 'accepted' }
    ],
    files: [{ name: 'Brand_Brief.pdf', url: '#', size: 1048576, type: 'pdf' }],
    aiClarityScore: 8,
    aiSuccessPrediction: 88,
    aiQualityScore: 85,
    aiPriceRecommendation: 1200,
    aiFeedback: 'A little descriptive reference to the theme of Mood Indigo would bring perfect applications.',
    college: 'IIT Bombay',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];
