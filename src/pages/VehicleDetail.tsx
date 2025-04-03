
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import StatusBadge from '@/components/StatusBadge';
import { Vehicle, Inspection } from '@/types/models';
import { getVehicleById, getInspections, updateVehicle } from '@/services/vehicleService';
import { CarFront, ChevronLeft, Clock, FileCheck, Wrench, User, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { useUser } from '@/contexts/UserContext';

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const { toast } = useToast();
  const { isAdmin } = useUser();
  
  const form = useForm<Omit<Vehicle, 'id' | 'status' | 'lastInspection'>>({
    defaultValues: {
      name: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      mileage: 0,
      assignedTo: '',
    }
  });
  
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
        
        // Update form with vehicle data
        form.reset({
          name: vehicleData.name,
          model: vehicleData.model,
          year: vehicleData.year,
          licensePlate: vehicleData.licensePlate,
          mileage: vehicleData.mileage,
          assignedTo: vehicleData.assignedTo,
        });
        
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
  }, [id, toast, form]);

  const onSubmit = async (data: Omit<Vehicle, 'id' | 'status' | 'lastInspection'>) => {
    if (!vehicle) return;
    
    try {
      const updatedVehicle = await updateVehicle({
        ...vehicle,
        ...data,
      });
      
      setVehicle(updatedVehicle);
      toast({
        title: 'Success',
        description: 'Vehicle details updated successfully',
      });
      setActiveTab('info');
    } catch (error) {
      console.error('Failed to update vehicle:', error);
      toast({
        title: 'Error',
        description: 'Failed to update vehicle details',
        variant: 'destructive',
      });
    }
  };

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Vehicle Information</TabsTrigger>
            <TabsTrigger value="inspections">Inspection History</TabsTrigger>
            {isAdmin && <TabsTrigger value="edit">Edit Vehicle</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="info" className="mt-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CarFront className="mr-2 h-5 w-5 text-plumbing-500" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </div>
                  <div className="space-y-4">
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inspections" className="mt-6">
            <Card>
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
          </TabsContent>

          {isAdmin && (
            <TabsContent value="edit" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Vehicle Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vehicle Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="model"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Make & Model</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ford Transit" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="licensePlate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>VIN/License Plate</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="mileage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Odometer/Mileage</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="assignedTo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Assigned To</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="mr-2"
                          onClick={() => setActiveTab('info')}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default VehicleDetail;
