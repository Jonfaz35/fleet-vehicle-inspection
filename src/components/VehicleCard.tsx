
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from './StatusBadge';
import { Vehicle } from '@/types/models';
import { CalendarCheck, CarFront, FileCheck, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

type VehicleCardProps = {
  vehicle: Vehicle;
};

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  return (
    <Card className="van-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{vehicle.name}</CardTitle>
          <StatusBadge status={vehicle.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <CarFront className="h-4 w-4 text-muted-foreground" />
            <span>{vehicle.year} {vehicle.model}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">License:</span>
            <span>{vehicle.licensePlate}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Mileage:</span>
            <span>{vehicle.mileage.toLocaleString()} mi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Assigned To:</span>
            <span>{vehicle.assignedTo}</span>
          </div>
          {vehicle.lastInspection && (
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
              <span>Last Inspection: {new Date(vehicle.lastInspection).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to={`/vehicle/${vehicle.id}`}>
            <FileCheck className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </Button>
        <Button asChild variant="default" size="sm" className="w-full ml-2">
          <Link to={`/inspect/${vehicle.id}`}>
            <Wrench className="h-4 w-4 mr-2" />
            New Inspection
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
