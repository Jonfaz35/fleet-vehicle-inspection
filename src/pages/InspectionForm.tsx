
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Clipboard, Save } from 'lucide-react';
import { getVehicleById, submitInspection } from '@/services/vehicleService';
import { Vehicle, Inspection, InspectionItem } from '@/types/models';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import InspectionChecklist, { ChecklistCategory } from '@/components/InspectionChecklist';

const InspectionForm = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [generalNotes, setGeneralNotes] = useState('');
  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser } = useUser();

  // Sample inspection checklist categories and items
  const inspectionCategories: ChecklistCategory[] = [
    {
      name: "Exterior",
      items: [
        { id: "ext-1", name: "Body Condition" },
        { id: "ext-2", name: "Lights" },
        { id: "ext-3", name: "Wipers" },
        { id: "ext-4", name: "Windows & Mirrors" },
        { id: "ext-5", name: "Tires" }
      ]
    },
    {
      name: "Interior",
      items: [
        { id: "int-1", name: "Seats & Belts" },
        { id: "int-2", name: "Dashboard Indicators" },
        { id: "int-3", name: "Horn" },
        { id: "int-4", name: "Air Conditioning" },
        { id: "int-5", name: "Interior Lights" }
      ]
    },
    {
      name: "Under Hood",
      items: [
        { id: "hood-1", name: "Engine Oil Level" },
        { id: "hood-2", name: "Coolant Level" },
        { id: "hood-3", name: "Brake Fluid" },
        { id: "hood-4", name: "Power Steering Fluid" },
        { id: "hood-5", name: "Battery" }
      ]
    },
    {
      name: "Mechanical",
      items: [
        { id: "mech-1", name: "Brakes" },
        { id: "mech-2", name: "Steering" },
        { id: "mech-3", name: "Suspension" },
        { id: "mech-4", name: "Transmission" },
        { id: "mech-5", name: "Exhaust System" }
      ]
    }
  ];

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
          navigate('/vehicles');
          return;
        }
        
        setVehicle(vehicleData);
      } catch (error) {
        console.error('Failed to load vehicle data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load vehicle data',
          variant: 'destructive',
        });
        navigate('/vehicles');
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicleData();
  }, [id, toast, navigate]);

  const handleItemChange = (item: InspectionItem) => {
    setInspectionItems(prev => {
      // Remove any existing item with the same ID
      const filtered = prev.filter(i => i.id !== item.id);
      // Add the updated item
      return [...filtered, item];
    });
  };

  const determineOverallStatus = (): 'good' | 'needs-attention' | 'critical' => {
    if (inspectionItems.length === 0) return 'good';
    if (inspectionItems.some(item => item.status === 'critical')) return 'critical';
    if (inspectionItems.some(item => item.status === 'needs-attention')) return 'needs-attention';
    return 'good';
  };

  const handleSubmit = async () => {
    if (!vehicle || !currentUser) return;
    
    setIsSaving(true);
    try {
      const newInspection: Omit<Inspection, 'id'> = {
        vehicleId: vehicle.id,
        date: new Date().toISOString(),
        performedBy: currentUser.name,
        items: inspectionItems,
        notes: generalNotes,
        overallStatus: determineOverallStatus()
      };
      
      await submitInspection(newInspection);
      
      toast({
        title: 'Inspection Submitted',
        description: 'The vehicle inspection has been successfully recorded.',
      });
      
      navigate(`/vehicle/${vehicle.id}`);
    } catch (error) {
      console.error('Failed to submit inspection:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit inspection',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
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
            <a href="/vehicles">Return to Vehicles</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button asChild variant="outline" size="sm" className="mr-4">
          <a href="/vehicles">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Vehicles
          </a>
        </Button>
        <h1 className="text-2xl font-bold">{vehicle.name} Inspection</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clipboard className="mr-2 h-5 w-5 text-plumbing-500" />
                Vehicle Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
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
                  <p>{vehicle.assignedTo}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Inspection Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add overall inspection notes..."
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>
          
          <InspectionChecklist 
            categories={inspectionCategories} 
            onItemChange={handleItemChange} 
          />

          <div className="flex justify-end mt-6">
            <Button onClick={handleSubmit} disabled={isSaving} size="lg">
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Submitting...' : 'Submit Inspection'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionForm;
