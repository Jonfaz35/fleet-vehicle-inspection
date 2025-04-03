
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Car, FileSearch, Settings } from 'lucide-react';
import UserManagement from './UserManagement';

const TabNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Determine active tab based on current path
  const getActiveTab = () => {
    if (currentPath.includes('/vehicle')) return 'vehicles';
    if (currentPath.includes('/inspect')) return 'inspections';
    if (currentPath.includes('/settings')) return 'settings';
    return 'dashboard'; // Default to dashboard
  };

  return (
    <div className="w-full bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
      <div className="container flex items-center justify-between">
        <Tabs value={getActiveTab()} className="flex-1">
          <TabsList className="w-full flex justify-start bg-transparent h-14">
            <TabsTrigger value="dashboard" asChild className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none text-slate-300 hover:text-white">
              <Link to="/" className="flex items-center justify-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="vehicles" asChild className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none text-slate-300 hover:text-white">
              <Link to="/vehicles" className="flex items-center justify-center gap-2">
                <Car className="h-4 w-4" />
                <span>Vehicles</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="inspections" asChild className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none text-slate-300 hover:text-white">
              <Link to="/inspections" className="flex items-center justify-center gap-2">
                <FileSearch className="h-4 w-4" />
                <span>Inspections</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="settings" asChild className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none text-slate-300 hover:text-white">
              <Link to="/settings" className="flex items-center justify-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="pl-4">
          <UserManagement />
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
