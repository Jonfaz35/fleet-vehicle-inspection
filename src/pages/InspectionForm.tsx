
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft } from 'lucide-react';
import { Vehicle, InspectionItem } from '@/types/models';
import { getVehicleById, getInspectionChecklistTemplate, saveInspection } from '@/services/vehicleService';
import StatusBadge from '@/components/StatusBadge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const InspectionForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>([]);
  const [performedBy, setPerformedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const [vehicleData, checklistTemplate] = await Promise.all([
          getVehicleById(id),
          getInspectionChecklistTemplate(),
        ]);
        
        if (!vehicleData) {
          toast({
            title: 'Error',
            description: 'Vehicle not found',
            variant: 'destructive',
          });
          navigate('/');
          return;
        }
        
        setVehicle(vehicleData);
        setInspectionItems(checklistTemplate);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(checklistTemplate.map(item => item.category)));
        setCategories(uniqueCategories);
        if (uniqueCategories.length > 0) {
          setCurrentCategory(uniqueCategories[0]);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load inspection data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id, navigate, toast]);

  const handleItemStatusChange = (itemId: string, status: 'pass' | 'fail' | 'warning') => {
    setInspectionItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, status } : item
      )
    );
  };

  const handleItemNotesChange = (itemId: string, notes: string) => {
    setInspectionItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, notes } : item
      )
    );
  };

  // Update the function to have an explicit return type
  const determineOverallStatus = (): 'good' | 'needs-attention' | 'critical' => {
    if (inspectionItems.some(item => item.status === 'fail')) {
      return 'critical';
    } else if (inspectionItems.some(item => item.status === 'warning')) {
      return 'needs-attention';
    }
    return 'good';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;
    
    if (!performedBy.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter who performed the inspection',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Explicitly type the overallStatus
      const overallStatus = determineOverallStatus();
      
      const newInspection = {
        vehicleId: vehicle.id,
        date: new Date().toISOString().split('T')[0],
        performedBy,
        items: inspectionItems,
        overallStatus, // Now correctly typed
        notes,
      };
      
      await saveInspection(newInspection);
      
      toast({
        title: 'Success',
        description: 'Inspection saved successfully',
      });
      
      navigate(`/vehicle/${vehicle.id}`);
    } catch (error) {
      console.error('Failed to save inspection:', error);
      toast({
        title: 'Error',
        description: 'Failed to save inspection',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
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
            <a href="/">Return to Dashboard</a>
          </Button>
        </div>
      </div>
    );
  }

  const categoryItems = inspectionItems.filter(item => item.category === currentCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mr-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">New Inspection for {vehicle.name}</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Inspection Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Vehicle</Label>
                    <Input id="vehicle" value={`${vehicle.name} - ${vehicle.licensePlate}`} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" value={new Date().toLocaleDateString()} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="performedBy">Performed By</Label>
                    <Input 
                      id="performedBy" 
                      value={performedBy} 
                      onChange={(e) => setPerformedBy(e.target.value)} 
                      placeholder="Enter name"
                      required 
                    />
                  </div>
                  <div className="space-y-2 pt-4">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea 
                      id="notes" 
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)} 
                      placeholder="Enter any general notes about this inspection"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Inspection Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={currentCategory} onValueChange={setCurrentCategory}>
                    <TabsList className="mb-4 flex flex-wrap">
                      {categories.map(category => (
                        <TabsTrigger key={category} value={category}>
                          {category}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <TabsContent value={currentCategory} className="mt-0">
                      <div className="space-y-6">
                        {categoryItems.map((item) => (
                          <div key={item.id} className="border rounded-lg p-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <h3 className="font-medium text-lg">{item.name}</h3>
                              <div className="mt-2 md:mt-0">
                                <RadioGroup 
                                  value={item.status} 
                                  onValueChange={(value) => 
                                    handleItemStatusChange(item.id, value as 'pass' | 'fail' | 'warning')
                                  }
                                  className="flex space-x-2"
                                >
                                  <div className="flex items-center space-x-1">
                                    <RadioGroupItem value="pass" id={`${item.id}-pass`} />
                                    <Label 
                                      htmlFor={`${item.id}-pass`} 
                                      className="cursor-pointer status-badge status-good"
                                    >
                                      Pass
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <RadioGroupItem value="warning" id={`${item.id}-warning`} />
                                    <Label 
                                      htmlFor={`${item.id}-warning`} 
                                      className="cursor-pointer status-badge status-needs-attention"
                                    >
                                      Warning
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <RadioGroupItem value="fail" id={`${item.id}-fail`} />
                                    <Label 
                                      htmlFor={`${item.id}-fail`} 
                                      className="cursor-pointer status-badge status-critical"
                                    >
                                      Fail
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </div>
                            {(item.status === 'warning' || item.status === 'fail') && (
                              <div className="mt-3">
                                <Label htmlFor={`notes-${item.id}`} className="text-sm">Notes</Label>
                                <Textarea 
                                  id={`notes-${item.id}`}
                                  value={item.notes || ''}
                                  onChange={(e) => handleItemNotesChange(item.id, e.target.value)}
                                  placeholder="Describe the issue..."
                                  className="mt-1"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <div className="flex justify-end mt-6">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-8"
                >
                  {isSubmitting ? 'Saving...' : 'Complete Inspection'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InspectionForm;
