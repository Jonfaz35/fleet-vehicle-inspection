
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole, InviteUserData } from '@/types/user';
import { useToast } from '@/components/ui/use-toast';

// Sample users for demonstration
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@fleetinspection.com',
    role: 'admin',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@fleetinspection.com',
    role: 'user',
    active: true,
    createdAt: new Date().toISOString(),
  }
];

interface UserContextType {
  currentUser: User | null;
  users: User[];
  isAdmin: boolean;
  login: (email: string) => void;
  logout: () => void;
  inviteUser: (userData: InviteUserData) => void;
  toggleUserStatus: (userId: string) => void;
  changeUserRole: (userId: string, role: UserRole) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Auto-login as admin for demonstration purposes
  useEffect(() => {
    login('admin@fleetinspection.com');
  }, []);

  const login = (email: string) => {
    const user = users.find(u => u.email === email);
    if (user && user.active) {
      setCurrentUser(user);
      toast({
        title: 'Logged in',
        description: `Welcome back, ${user.name}`,
      });
    } else {
      toast({
        title: 'Login failed',
        description: 'User not found or inactive',
        variant: 'destructive',
      });
    }
  };

  const logout = () => {
    setCurrentUser(null);
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
  };

  const inviteUser = (userData: InviteUserData) => {
    const newUser: User = {
      id: (users.length + 1).toString(),
      name: userData.email.split('@')[0],
      email: userData.email,
      role: userData.role,
      active: true,
      createdAt: new Date().toISOString(),
    };
    
    setUsers([...users, newUser]);
    
    toast({
      title: 'User invited',
      description: `Invitation sent to ${userData.email}`,
    });
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
    
    const targetUser = users.find(user => user.id === userId);
    if (targetUser) {
      toast({
        title: targetUser.active ? 'User deactivated' : 'User activated',
        description: `${targetUser.name}'s account has been ${targetUser.active ? 'deactivated' : 'activated'}`,
      });
    }
  };

  const changeUserRole = (userId: string, role: UserRole) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role } : user
    ));
    
    const targetUser = users.find(user => user.id === userId);
    if (targetUser) {
      toast({
        title: 'Role updated',
        description: `${targetUser.name}'s role has been updated to ${role}`,
      });
    }
  };

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      users, 
      isAdmin: currentUser?.role === 'admin', 
      login, 
      logout,
      inviteUser,
      toggleUserStatus,
      changeUserRole
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
