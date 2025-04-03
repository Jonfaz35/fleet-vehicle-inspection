
import React from 'react';
import { Wrench, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

type DashboardHeaderProps = {
  onSearchChange: (query: string) => void;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onSearchChange }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex items-center">
        <Wrench className="h-8 w-8 text-plumbing-500 mr-2" />
        <h1 className="text-3xl font-bold text-plumbing-700">Fleet Vehicle Inspection</h1>
      </div>
      
      <div className="w-full md:w-64 relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search vehicles..."
          className="pl-8"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
