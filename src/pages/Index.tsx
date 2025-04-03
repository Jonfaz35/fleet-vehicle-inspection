
import React, { useEffect, useState } from 'react';
import VehicleCard from '@/components/VehicleCard';
import DashboardHeader from '@/components/DashboardHeader';
import VehicleSummary from '@/components/VehicleSummary';
import { getVehicles } from '@/services/vehicleService';
import { Vehicle } from '@/types/models';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadVehicles = async () => {
      setIsLoading(true);
      try {
        const data = await getVehicles();
        setVehicles(data);
        setFilteredVehicles(data);
      } catch (error) {
        console.error('Failed to load vehicles:', error);
        toast({
          title: 'Error',
          description: 'Failed to load vehicle data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicles();
  }, [toast]);

  const handleSearch = (query: string) => {
    const filtered = vehicles.filter((vehicle) =>
      vehicle.name.toLowerCase().includes(query.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(query.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(query.toLowerCase()) ||
      vehicle.assignedTo.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredVehicles(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <DashboardHeader onSearchChange={handleSearch} />
        
        <VehicleSummary vehicles={vehicles} />
        
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Fleet Vehicles</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <>
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No vehicles found matching your search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
