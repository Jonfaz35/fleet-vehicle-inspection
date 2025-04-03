
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllInspections } from '@/services/vehicleService';
import { Inspection } from '@/types/models';
import { useToast } from '@/components/ui/use-toast';
import { FileCheck, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import StatusBadge from '@/components/StatusBadge';

const Inspections = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [filteredInspections, setFilteredInspections] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadInspections = async () => {
      setIsLoading(true);
      try {
        const data = await getAllInspections();
        setInspections(data);
        setFilteredInspections(data);
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
  }, [toast]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    const filtered = inspections.filter((inspection) =>
      inspection.performedBy.toLowerCase().includes(query) ||
      inspection.vehicleId.toLowerCase().includes(query) ||
      inspection.date.toLowerCase().includes(query)
    );
    setFilteredInspections(filtered);
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Inspection Records</h2>
        <div className="w-64 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search inspections..."
            className="pl-8"
            onChange={handleSearch}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-20 bg-gray-100 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : (
        <>
          {filteredInspections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No inspection records found.</p>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileCheck className="mr-2 h-5 w-5 text-plumbing-500" />
                  Inspection History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredInspections.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((inspection) => (
                    <div key={inspection.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{new Date(inspection.date).toLocaleDateString()}</p>
                          <p className="text-sm text-muted-foreground">By {inspection.performedBy}</p>
                          <Link to={`/vehicle/${inspection.vehicleId}`} className="text-sm text-primary hover:underline">
                            View Vehicle
                          </Link>
                        </div>
                        <StatusBadge status={inspection.overallStatus} />
                      </div>
                      <p className="text-sm mt-2 line-clamp-2">{inspection.notes}</p>
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
