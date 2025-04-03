
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardHeader from '@/components/DashboardHeader';
import VehicleSummary from '@/components/VehicleSummary';
import { getVehicles, getAllInspections } from '@/services/vehicleService';
import { Vehicle, Inspection } from '@/types/models';
import { useToast } from '@/components/ui/use-toast';
import { Car, FileCheck, Wrench, AlertTriangle } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

const Index = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const vehicleData = await getVehicles();
        setVehicles(vehicleData);
        
        const inspectionData = await getAllInspections();
        setInspections(inspectionData);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Get vehicles that need attention
  const criticalVehicles = vehicles.filter(v => v.status === 'critical');
  const attentionVehicles = vehicles.filter(v => v.status === 'needs-attention');
  
  // Get recent inspections
  const recentInspections = [...inspections]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="container py-8">
      <DashboardHeader onSearchChange={() => {}} />
      
      <VehicleSummary vehicles={vehicles} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-warning" />
              Vehicles Needing Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-16 bg-gray-100 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {criticalVehicles.length === 0 && attentionVehicles.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">All vehicles are in good condition.</p>
                ) : (
                  <>
                    {criticalVehicles.map((vehicle) => (
                      <div key={vehicle.id} className="border-l-4 border-destructive p-3 bg-destructive/5 rounded-r-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <Link to={`/vehicle/${vehicle.id}`} className="font-medium hover:underline">
                              {vehicle.name} - {vehicle.licensePlate}
                            </Link>
                            <p className="text-sm">{vehicle.model}</p>
                          </div>
                          <StatusBadge status={vehicle.status} />
                        </div>
                      </div>
                    ))}
                    {attentionVehicles.map((vehicle) => (
                      <div key={vehicle.id} className="border-l-4 border-warning p-3 bg-warning/5 rounded-r-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <Link to={`/vehicle/${vehicle.id}`} className="font-medium hover:underline">
                              {vehicle.name} - {vehicle.licensePlate}
                            </Link>
                            <p className="text-sm">{vehicle.model}</p>
                          </div>
                          <StatusBadge status={vehicle.status} />
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm">
              <Link to="/vehicles">
                <Car className="mr-2 h-4 w-4" />
                View All Vehicles
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <FileCheck className="mr-2 h-5 w-5 text-primary" />
              Recent Inspections
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-16 bg-gray-100 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {recentInspections.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">No recent inspections found.</p>
                ) : (
                  recentInspections.map((inspection) => (
                    <div key={inspection.id} className="border-b pb-2 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">{new Date(inspection.date).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">By {inspection.performedBy}</p>
                        </div>
                        <StatusBadge status={inspection.overallStatus} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm">
              <Link to="/inspections">
                <Wrench className="mr-2 h-4 w-4" />
                View All Inspections
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="text-center py-4">
        <h2 className="text-xl font-medium mb-3">Quick Actions</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link to="/vehicles">
              <Car className="mr-2 h-4 w-4" />
              Manage Vehicles
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/inspections">
              <FileCheck className="mr-2 h-4 w-4" />
              View Inspection Records
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
