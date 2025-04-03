
export type UserRole = 'admin' | 'user' | 'technician';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  assignedVehicleIds?: string[]; // For technicians
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  assignedVehicleIds?: string[]; // Added this property to match the User interface
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface InviteUserData {
  email: string;
  role: UserRole;
}
