import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthUser, UserRole, InviteUserData } from '@/types/user';
import { useToast } from '@/components/ui/use-toast';

// Mock data for users
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    active: true,
    createdAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
    active: true,
    createdAt: '2023-01-02T00:00:00.000Z'
  },
  {
    id: '3',
    name: 'Tech User',
    email: 'tech@example.com',
    role: 'technician',
    active: true,
    createdAt: '2023-01-03T00:00:00.000Z',
    assignedVehicleIds: ['1', '2']
  }
];

// Mock user credentials
const MOCK_CREDENTIALS: Record<string, string> = {
  'admin@example.com': 'admin123',
  'user@example.com': 'user123',
  'tech@example.com': 'tech123'
};

// Define the context type
interface UserContextType {
  currentUser: AuthUser | null;
  isAdmin: boolean;
  users: User[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  inviteUser: (userData: InviteUserData) => Promise<void>;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
  deactivateUser: (userId: string) => Promise<void>;
  reactivateUser: (userId: string) => Promise<void>;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const { toast } = useToast();

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('fleetUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('fleetUser');
      }
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const correctPassword = MOCK_CREDENTIALS[email];
        
        if (!correctPassword || correctPassword !== password) {
          reject(new Error('Invalid credentials'));
          return;
        }
        
        const user = users.find(u => u.email === email);
        
        if (!user || !user.active) {
          reject(new Error('User not found or inactive'));
          return;
        }
        
        const authUser: AuthUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          assignedVehicleIds: user.assignedVehicleIds
        };
        
        setCurrentUser(authUser);
        localStorage.setItem('fleetUser', JSON.stringify(authUser));
        resolve();
      }, 800);
    });
  };
  
  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fleetUser');
  };
  
  // Check if current user is admin
  const isAdmin = currentUser?.role === 'admin';
  
  // Invite a new user
  const inviteUser = async (userData: InviteUserData): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isAdmin) {
        reject(new Error('Unauthorized'));
        return;
      }
      
      if (users.some(u => u.email === userData.email)) {
        reject(new Error('Email already in use'));
        return;
      }
      
      setTimeout(() => {
        const newUser: User = {
          id: `user-${Date.now()}`,
          name: userData.email.split('@')[0],
          email: userData.email,
          role: userData.role,
          active: true,
          createdAt: new Date().toISOString()
        };
        
        setUsers(prevUsers => [...prevUsers, newUser]);
        
        toast({
          title: "User Invited",
          description: `Invitation sent to ${userData.email}`,
        });
        
        resolve();
      }, 800);
    });
  };
  
  // Update a user's role
  const updateUserRole = async (userId: string, newRole: UserRole): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isAdmin) {
        reject(new Error('Unauthorized'));
        return;
      }
      
      setTimeout(() => {
        setUsers(prevUsers => prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        
        toast({
          title: "User Role Updated",
          description: `User role has been updated to ${newRole}`,
        });
        
        resolve();
      }, 800);
    });
  };
  
  // Deactivate a user
  const deactivateUser = async (userId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isAdmin) {
        reject(new Error('Unauthorized'));
        return;
      }
      
      if (userId === currentUser?.id) {
        reject(new Error('Cannot deactivate your own account'));
        return;
      }
      
      setTimeout(() => {
        setUsers(prevUsers => prevUsers.map(user => 
          user.id === userId ? { ...user, active: false } : user
        ));
        
        toast({
          title: "User Deactivated",
          description: `User account has been deactivated`,
        });
        
        resolve();
      }, 800);
    });
  };
  
  // Reactivate a user
  const reactivateUser = async (userId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isAdmin) {
        reject(new Error('Unauthorized'));
        return;
      }
      
      setTimeout(() => {
        setUsers(prevUsers => prevUsers.map(user => 
          user.id === userId ? { ...user, active: true } : user
        ));
        
        toast({
          title: "User Reactivated",
          description: `User account has been reactivated`,
        });
        
        resolve();
      }, 800);
    });
  };

  const value = {
    currentUser,
    isAdmin,
    users,
    login,
    logout,
    inviteUser,
    updateUserRole,
    deactivateUser,
    reactivateUser
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Custom hook for technician-specific functionality
export const useTechnicianAccess = () => {
  const { currentUser } = useUser();
  
  const isTechnician = currentUser?.role === 'technician';
  const assignedVehicleIds = currentUser?.assignedVehicleIds || [];
  
  const hasVehicleAccess = (vehicleId: string) => {
    if (!isTechnician) return true;
    return assignedVehicleIds.includes(vehicleId);
  };
  
  return {
    isTechnician,
    assignedVehicleIds,
    hasVehicleAccess
  };
};
