
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, UserPlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const { currentUser, logout, isAdmin } = useUser();
  const navigate = useNavigate();

  if (!currentUser) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full bg-slate-700 p-0 text-slate-200 hover:bg-slate-600"
          aria-label="User menu"
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-slate-800 text-slate-200 border-slate-700">
        <DropdownMenuLabel>
          <div className="font-normal text-xs text-slate-400">Signed in as</div>
          <div className="font-medium">{currentUser.name}</div>
          <div className="text-xs text-slate-400">{currentUser.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-700" />
        
        {isAdmin && (
          <>
            <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer hover:bg-slate-700">
              <Users className="mr-2 h-4 w-4" />
              <span>Manage Users</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer hover:bg-slate-700">
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Invite User</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
          </>
        )}

        <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer hover:bg-slate-700">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-700" />
        <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-400 hover:bg-slate-700 hover:text-red-300">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserManagement;
