import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Task, Notification, Transaction, LocationData } from '../types';
import { SEED_USERS, SEED_TASKS, MOCK_NOTIFICATIONS } from '../data';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc 
} from 'firebase/firestore';

interface AppContextType {
  currentUser: UserProfile | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  isDoerMode: boolean;
  toggleRole: () => void;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  postTask: (task: Omit<Task, 'id' | 'createdAt' | 'posterId' | 'posterName' | 'posterRating' | 'posterPhotoURL' | 'college' | 'assignedDoerIds'>) => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id' | 'timestamp'>) => Promise<void>;
  addNotification: (notif: Omit<Notification, 'id' | 'createdAt'>) => Promise<void>;
  demoLogin: (userType: 'alice' | 'bob' | 'admin') => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [loading, setLoading] = useState<boolean>(true);

  // Apply theme class to HTML body
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#0b0f19';
      root.style.color = '#f3f4f6';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f9fafb';
      root.style.color = '#111827';
    }
  }, [theme]);

  // Auth Listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists()) {
            setCurrentUser(docSnap.data() as UserProfile);
          } else {
            // New Firebase user - create a default student profile
            const defaultProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || 'student@tasklink.edu',
              name: firebaseUser.displayName || 'New Student',
              username: firebaseUser.email ? firebaseUser.email.split('@')[0] : 'student_peer',
              photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${firebaseUser.uid}`,
              university: 'IIT Bombay',
              department: 'Computer Science',
              graduationYear: 2027,
              skills: ['Coding', 'MS Office', 'Academic Writing'],
              bio: 'Campus peer ready to collaborate and help with standard tasks.',
              rating: 5.0,
              reviewCount: 0,
              reliabilityScore: 100,
              successRate: 100,
              tasksCompleted: 0,
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
              isDoerMode: true,
              walletBalance: 1000, // Seed new signups with ₹1000 welcome credits!
              escrowBalance: 0,
              refundBalance: 0,
              lockedAmount: 0,
              portfolio: [],
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, defaultProfile);
            setCurrentUser(defaultProfile);
          }
        } catch (e) {
          console.error("Error reading profile from firestore:", e);
        }
      } else {
        // No firebase user, keep null unless demo is active
        if (!currentUser?.uid.startsWith('user_')) {
          setCurrentUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Listen to Firestore Tasks if available
  useEffect(() => {
    try {
      const q = collection(db, 'tasks');
      const unsubscribeTasks = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const loadedTasks: Task[] = [];
          snapshot.forEach((doc) => {
            loadedTasks.push({ id: doc.id, ...doc.data() } as Task);
          });
          setTasks(loadedTasks);
        }
      }, (err) => {
        console.warn("Firestore snapshot failed, using local seed tasks:", err);
      });
      return () => unsubscribeTasks();
    } catch (e) {
      console.warn("Firestore collection reference failed:", e);
    }
  }, []);

  // Listen to User Transactions
  useEffect(() => {
    if (!currentUser || currentUser.uid.startsWith('user_')) return;
    try {
      const q = collection(db, 'users', currentUser.uid, 'transactions');
      const unsubscribeTx = onSnapshot(q, (snapshot) => {
        const loadedTx: Transaction[] = [];
        snapshot.forEach((doc) => {
          loadedTx.push({ id: doc.id, ...doc.data() } as Transaction);
        });
        if (loadedTx.length > 0) {
          setTransactions(loadedTx.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        }
      }, (err) => {
        console.warn("Firestore transactions snapshot failed:", err);
      });
      return () => unsubscribeTx();
    } catch (e) {
      console.warn("Firestore transactions listener failed:", e);
    }
  }, [currentUser]);

  // Demo Bypass Login for instant evaluation
  const demoLogin = (userType: 'alice' | 'bob' | 'admin') => {
    setLoading(true);
    const selected = SEED_USERS.find(u => {
      if (userType === 'alice') return u.uid === 'user_alice';
      if (userType === 'bob') return u.uid === 'user_bob';
      return u.uid === 'user_admin';
    });
    if (selected) {
      setCurrentUser({ ...selected });
    }
    setLoading(false);
    setActiveTab('dashboard');
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const toggleRole = () => {
    if (!currentUser) return;
    const newMode = !currentUser.isDoerMode;
    setCurrentUser({
      ...currentUser,
      isDoerMode: newMode
    });
    // Sync to Firestore if logged in with real account
    if (!currentUser.uid.startsWith('user_')) {
      const userRef = doc(db, 'users', currentUser.uid);
      updateDoc(userRef, { isDoerMode: newMode }).catch(console.error);
    }
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const nextProfile = { ...currentUser, ...updated };
    setCurrentUser(nextProfile);

    if (!currentUser.uid.startsWith('user_')) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, updated);
      } catch (err) {
        console.warn("Firestore updateProfile error:", err);
      }
    }
  };

  const postTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'posterId' | 'posterName' | 'posterRating' | 'posterPhotoURL' | 'college' | 'assignedDoerIds'>) => {
    if (!currentUser) return;
    
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString(),
      posterId: currentUser.uid,
      posterName: currentUser.name,
      posterRating: currentUser.rating,
      posterPhotoURL: currentUser.photoURL,
      college: currentUser.university,
      assignedDoerIds: []
    };

    // Deduct budget from poster's active wallet and put into lockedAmount/escrowBalance
    const updatedWallet = currentUser.walletBalance - taskData.budget;
    const updatedEscrow = currentUser.escrowBalance + taskData.budget;
    
    await updateProfile({
      walletBalance: updatedWallet,
      escrowBalance: updatedEscrow
    });

    // Save to State
    setTasks(prev => [newTask, ...prev]);

    // Save transaction
    await addTransaction({
      userId: currentUser.uid,
      type: 'escrow_lock',
      amount: taskData.budget,
      description: `Escrow locked for task: "${taskData.title}"`,
      taskId: newTask.id
    });

    // Save to Firestore if real
    if (!currentUser.uid.startsWith('user_')) {
      try {
        const taskRef = doc(db, 'tasks', newTask.id);
        await setDoc(taskRef, newTask);
      } catch (err) {
        console.error("Firestore postTask error:", err);
      }
    }
  };

  const addTransaction = async (txData: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    
    setTransactions(prev => [newTx, ...prev]);

    if (currentUser && !currentUser.uid.startsWith('user_')) {
      try {
        const txColRef = collection(db, 'users', currentUser.uid, 'transactions');
        await addDoc(txColRef, newTx);
      } catch (err) {
        console.error("Firestore tx save failed:", err);
      }
    }
  };

  const addNotification = async (notifData: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotif: Notification = {
      ...notifData,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const isDoerMode = currentUser ? currentUser.isDoerMode : true;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        tasks,
        setTasks,
        notifications,
        setNotifications,
        transactions,
        setTransactions,
        activeTab,
        setActiveTab,
        selectedTaskId,
        setSelectedTaskId,
        theme,
        setTheme,
        isDoerMode,
        toggleRole,
        logout,
        updateProfile,
        postTask,
        addTransaction,
        addNotification,
        demoLogin,
        loading
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
