
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Clipboard, CalendarIcon, UserCircle, Car } from 'lucide-react';
import { getInspectionById, getVehicleById } from '@/services/vehicleService';
import { Inspection, Vehicle, InspectionItem } from '@/types/models';
import { useToast } from '@/components/ui/use-toast';
import StatusBadge from '@/components/StatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const InspectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadInspectionData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const inspectionData = await getInspectionById(id);
        if (!inspectionData) {
          toast({
            title: 'Error',
            description: 'Inspection not found',
            variant: 'destructive',
          });
          navigate('/inspections');
          return;
        }
        
        setInspection(inspectionData);
        
        // Load vehicle data
        const vehicleData = await getVehicleById(inspectionData.vehicleId);
        setVehicle(vehicleData || null);
      } catch (error) {
        console.error('Failed to load inspection data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load inspection data',
          variant: 'destructive',
        });
        navigate('/inspections');
      } finally {
        setIsLoading(false);
      }
    };

    loadInspectionData();
  }, [id, toast, navigate]);

  // Group inspection items by category
  const groupedItems = React.useMemo(() => {
    if (!inspection) return {};
    
    return inspection.items.reduce<Record<string, InspectionItem[]>>((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [inspection]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="h-96 bg-slate-800 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  if (!inspection) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <p className="text-slate-400">Inspection not found.</p>
          <Button asChild variant="outline" className="mt-4">
            <a href="/inspections">Return to Inspections</a>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: InspectionItem['status']) => {
    switch (status) {
      case 'pass':
      case 'good':
        return 'text-green-500';
      case 'warning':
      case 'needs-attention':
        return 'text-yellow-500';
      case 'fail':
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button
          onClick={() => navigate('/inspections')}
          variant="outline"
          size="sm"
          className="mr-4 bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Inspections
        </Button>
        <h1 className="text-2xl font-bold">Inspection Report</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-200">
              <Clipboard className="mr-2 h-5 w-5 text-primary" />
              Inspection Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-400">Date</p>
                <p className="text-slate-200">{new Date(inspection.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center">
              <UserCircle className="h-4 w-4 mr-2 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-400">Performed By</p>
                <p className="text-slate-200">{inspection.performedBy}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Status</p>
              <StatusBadge status={inspection.overallStatus} />
            </div>
          </CardContent>
        </Card>

        {vehicle && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-200">
                <Car className="mr-2 h-5 w-5 text-primary" />
                Vehicle Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium text-slate-400">Name</p>
                <p className="text-slate-200">{vehicle.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Model</p>
                <p className="text-slate-200">{vehicle.year} {vehicle.model}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">License Plate</p>
                <p className="text-slate-200">{vehicle.licensePlate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Mileage</p>
                <p className="text-slate-200">{vehicle.mileage.toLocaleString()} mi</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-200">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">{inspection.notes || "No additional notes provided."}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-200">Inspection Items</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-medium mb-3 text-primary">{category}</h3>
              <Table>
                <TableHeader className="bg-slate-900">
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-200">Item</TableHead>
                    <TableHead className="text-slate-200">Status</TableHead>
                    <TableHead className="text-slate-200">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className="border-slate-700">
                      <TableCell className="text-slate-300">{item.name}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getStatusColor(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-400">{item.notes || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default InspectionDetail;
