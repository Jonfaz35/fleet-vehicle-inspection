
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Car, FileSearch, Settings } from 'lucide-react';

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
    <div className="w-full bg-white border-b sticky top-0 z-10">
      <div className="container">
        <Tabs value={getActiveTab()} className="w-full">
          <TabsList className="w-full flex justify-start bg-transparent h-14">
            <TabsTrigger value="dashboard" asChild className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none">
              <Link to="/" className="flex items-center justify-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="vehicles" asChild className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none">
              <Link to="/vehicles" className="flex items-center justify-center gap-2">
                <Car className="h-4 w-4" />
                <span>Vehicles</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="inspections" asChild className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none">
              <Link to="/inspections" className="flex items-center justify-center gap-2">
                <FileSearch className="h-4 w-4" />
                <span>Inspections</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="settings" asChild className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none">
              <Link to="/settings" className="flex items-center justify-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default TabNavigation;
