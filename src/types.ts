export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  campus: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  completedAt: string;
  images: string[];
  files: string[];
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  username: string;
  photoURL: string;
  university: string;
  department: string;
  graduationYear: number;
  skills: string[];
  bio: string;
  rating: number;
  reviewCount: number;
  reliabilityScore: number;
  successRate: number;
  tasksCompleted: number;
  onTimeDelivery: number;
  availability: 'online' | 'busy' | 'accepting_urgent';
  location: LocationData;
  isDoerMode: boolean;
  walletBalance: number;
  escrowBalance: number;
  refundBalance: number;
  lockedAmount: number;
  portfolio: PortfolioItem[];
  createdAt: string;
}

export type TaskStatus =
  | 'open'
  | 'applied'
  | 'assigned'
  | 'in_progress'
  | 'submitted'
  | 'reviewing'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface TaskFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface MicroTeamMember {
  userId: string;
  userName: string;
  role: 'researcher' | 'writer' | 'designer' | 'developer' | 'editor';
  sharePercentage: number;
  status: 'pending' | 'accepted' | 'completed';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  urgency: 'standard' | 'urgent';
  taskType: 'digital' | 'physical';
  visibility: 'public' | 'campus_only';
  status: TaskStatus;
  location: LocationData;
  posterId: string;
  posterName: string;
  posterRating: number;
  posterPhotoURL: string;
  assignedDoerIds: string[];
  teamMembers: MicroTeamMember[];
  files: TaskFile[];
  aiClarityScore: number;
  aiSuccessPrediction: number;
  aiQualityScore: number;
  aiPriceRecommendation: number;
  aiFeedback: string;
  college: string;
  createdAt: string;
}

export interface Application {
  id: string;
  taskId: string;
  taskTitle: string;
  doerId: string;
  doerName: string;
  doerRating: number;
  doerPhotoURL: string;
  pitch: string;
  suggestedBudget: number;
  suggestedDeadline: string;
  status: 'pending' | 'accepted' | 'rejected';
  role: 'researcher' | 'writer' | 'designer' | 'developer' | 'editor' | 'general';
  createdAt: string;
}

export interface Message {
  id: string;
  taskId: string;
  senderId: string;
  senderName: string;
  senderPhotoURL: string;
  text: string;
  fileURL?: string;
  fileName?: string;
  fileType?: string;
  isVoice?: boolean;
  isRead: boolean;
  isScam: boolean;
  scamAlertReason?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'task_accepted' | 'task_assigned' | 'urgent_task' | 'wallet_update' | 'refund' | 'message' | 'review';
  isRead: boolean;
  taskId?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'escrow_lock' | 'payout' | 'refund' | 'commission';
  amount: number;
  description: string;
  taskId?: string;
  timestamp: string;
}

export interface Review {
  id: string;
  taskId: string;
  taskTitle: string;
  reviewerId: string;
  reviewerName: string;
  reviewerPhotoURL: string;
  targetUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
