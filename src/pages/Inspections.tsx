import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllInspections } from '@/services/vehicleService';
import { Inspection } from '@/types/models';
import { useToast } from '@/components/ui/use-toast';
import { FileCheck, Search, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from '@/components/StatusBadge';
import { useTechnicianAccess } from '@/contexts/UserContext';

const Inspections = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [filteredInspections, setFilteredInspections] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isTechnician, hasVehicleAccess } = useTechnicianAccess();

  useEffect(() => {
    const loadInspections = async () => {
      setIsLoading(true);
      try {
        const data = await getAllInspections();
        const accessibleInspections = isTechnician
          ? data.filter(inspection => hasVehicleAccess(inspection.vehicleId))
          : data;
        
        setInspections(accessibleInspections);
        setFilteredInspections(accessibleInspections);
      } catch (error) {
        console.error('Failed to load inspections:', error);
        toast({
          title: 'Error',
          description: 'Failed to load inspection data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInspections();
  }, [toast, isTechnician, hasVehicleAccess]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    const filtered = inspections.filter((inspection) =>
      inspection.performedBy.toLowerCase().includes(query) ||
      inspection.vehicleId.toLowerCase().includes(query) ||
      inspection.date.toLowerCase().includes(query)
    );
    setFilteredInspections(filtered);
  };

  const handleInspectionClick = (inspectionId: string) => {
    navigate(`/inspection/${inspectionId}`);
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-200">Inspection Records</h2>
        <div className="w-64 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            type="search"
            placeholder="Search inspections..."
            className="pl-8 bg-slate-800 border-slate-700 text-slate-200"
            onChange={handleSearch}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-20 bg-slate-800 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : (
        <>
          {filteredInspections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No inspection records found.</p>
            </div>
          ) : (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-200">
                  <FileCheck className="mr-2 h-5 w-5 text-primary" />
                  Inspection History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredInspections.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((inspection) => (
                    <div 
                      key={inspection.id} 
                      className="border border-slate-700 rounded-lg p-4 hover:bg-slate-700 transition-colors cursor-pointer group"
                      onClick={() => handleInspectionClick(inspection.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-slate-200">{new Date(inspection.date).toLocaleDateString()}</p>
                          <p className="text-sm text-slate-400">By {inspection.performedBy}</p>
                          <Link to={`/vehicle/${inspection.vehicleId}`} 
                            className="text-sm text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()} // Prevent triggering parent onClick
                          >
                            View Vehicle
                          </Link>
                        </div>
                        <div className="flex items-center">
                          <StatusBadge status={inspection.overallStatus} />
                          <ChevronRight className="h-5 w-5 text-slate-400 ml-2 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                      <p className="text-sm mt-2 line-clamp-2 text-slate-300">{inspection.notes}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Inspections;
