
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatusBadge from '@/components/StatusBadge';
import { Vehicle, Inspection } from '@/types/models';
import { getVehicleById, getInspections } from '@/services/vehicleService';
import { CarFront, ChevronLeft, Clock, FileCheck, Wrench, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadVehicleData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const vehicleData = await getVehicleById(id);
        if (!vehicleData) {
          toast({
            title: 'Error',
            description: 'Vehicle not found',
            variant: 'destructive',
          });
          return;
        }
        
        setVehicle(vehicleData);
        
        const inspectionData = await getInspections(id);
        setInspections(inspectionData);
      } catch (error) {
        console.error('Failed to load vehicle data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load vehicle data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicleData();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Vehicle not found.</p>
          <Button asChild className="mt-4">
            <Link to="/">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button asChild variant="outline" size="sm" className="mr-4">
            <Link to="/">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{vehicle.name} Details</h1>
          <StatusBadge status={vehicle.status} className="ml-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CarFront className="mr-2 h-5 w-5 text-plumbing-500" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Model</p>
                  <p>{vehicle.year} {vehicle.model}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">License Plate</p>
                  <p>{vehicle.licensePlate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mileage</p>
                  <p>{vehicle.mileage.toLocaleString()} mi</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
                  <p className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-muted-foreground" />
                    {vehicle.assignedTo}
                  </p>
                </div>
                {vehicle.lastInspection && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Inspection</p>
                    <p className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      {new Date(vehicle.lastInspection).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div className="pt-4">
                  <Button asChild className="w-full">
                    <Link to={`/inspect/${vehicle.id}`}>
                      <Wrench className="h-4 w-4 mr-2" />
                      Perform New Inspection
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileCheck className="mr-2 h-5 w-5 text-plumbing-500" />
                Inspection History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {inspections.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No inspection records found.</p>
                </div>
              ) : (
                <Tabs defaultValue="list" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="details">Latest Details</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="list" className="mt-4">
                    <div className="space-y-4">
                      {inspections.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((inspection) => (
                        <div key={inspection.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{new Date(inspection.date).toLocaleDateString()}</p>
                              <p className="text-sm text-muted-foreground">By {inspection.performedBy}</p>
                            </div>
                            <StatusBadge status={inspection.overallStatus} />
                          </div>
                          <p className="text-sm mt-2 line-clamp-2">{inspection.notes}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details" className="mt-4">
                    {inspections.length > 0 && (
                      <div>
                        <div className="mb-4">
                          <p className="text-sm font-medium text-muted-foreground">Date</p>
                          <p>{new Date(inspections[0].date).toLocaleDateString()}</p>
                        </div>
                        <div className="mb-4">
                          <p className="text-sm font-medium text-muted-foreground">Performed By</p>
                          <p>{inspections[0].performedBy}</p>
                        </div>
                        <div className="mb-4">
                          <p className="text-sm font-medium text-muted-foreground">Notes</p>
                          <p className="text-sm">{inspections[0].notes}</p>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <h3 className="font-medium mb-2">Inspection Items</h3>
                        
                        {Array.from(new Set(inspections[0].items.map(item => item.category))).map(category => (
                          <div key={category} className="mb-4">
                            <h4 className="text-sm font-semibold mb-2">{category}</h4>
                            <div className="space-y-2">
                              {inspections[0].items
                                .filter(item => item.category === category)
                                .map(item => (
                                  <div key={item.id} className="flex justify-between items-center text-sm">
                                    <span>{item.name}</span>
                                    <StatusBadge status={item.status} />
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
