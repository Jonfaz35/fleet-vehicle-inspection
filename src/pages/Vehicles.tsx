import React, { useEffect, useState } from 'react';
import VehicleCard from '@/components/VehicleCard';
import DashboardHeader from '@/components/DashboardHeader';
import VehicleSummary from '@/components/VehicleSummary';
import VehicleManagement from '@/components/VehicleManagement';
import { getVehicles, addVehicle, updateVehicle, deleteVehicle } from '@/services/vehicleService';
import { Vehicle } from '@/types/models';
import { useToast } from '@/components/ui/use-toast';
import { useTechnicianAccess } from '@/contexts/UserContext';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isTechnician, assignedVehicleIds } = useTechnicianAccess();

  useEffect(() => {
    const loadVehicles = async () => {
      setIsLoading(true);
      try {
        const data = await getVehicles();
        // Filter vehicles if user is a technician
        const accessibleVehicles = isTechnician
          ? data.filter(vehicle => assignedVehicleIds.includes(vehicle.id))
          : data;
        
        setVehicles(accessibleVehicles);
        setFilteredVehicles(accessibleVehicles);
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
  }, [toast, isTechnician, assignedVehicleIds]);

  const handleSearch = (query: string) => {
    const filtered = vehicles.filter((vehicle) =>
      vehicle.name.toLowerCase().includes(query.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(query.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(query.toLowerCase()) ||
      vehicle.assignedTo.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredVehicles(filtered);
  };

  const handleAddVehicle = async (newVehicle: Omit<Vehicle, 'id'>) => {
    try {
      const addedVehicle = await addVehicle(newVehicle);
      setVehicles([...vehicles, addedVehicle]);
      setFilteredVehicles([...filteredVehicles, addedVehicle]);
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to add vehicle:', error);
      return Promise.reject(error);
    }
  };

  const handleEditVehicle = async (updatedVehicle: Vehicle) => {
    try {
      await updateVehicle(updatedVehicle);
      const updatedVehicles = vehicles.map(v => 
        v.id === updatedVehicle.id ? updatedVehicle : v
      );
      setVehicles(updatedVehicles);
      setFilteredVehicles(updatedVehicles);
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to update vehicle:', error);
      return Promise.reject(error);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      await deleteVehicle(id);
      const updatedVehicles = vehicles.filter(v => v.id !== id);
      setVehicles(updatedVehicles);
      setFilteredVehicles(updatedVehicles);
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
      return Promise.reject(error);
    }
  };

  return (
    <div className="container py-8">
      <h2 className="text-2xl font-semibold mb-4 text-slate-200">
        {isTechnician ? 'My Assigned Vehicles' : 'Fleet Vehicles'}
      </h2>
      
      <div className="mb-6">
        <DashboardHeader onSearchChange={handleSearch} />
      </div>
      
      <VehicleManagement 
        vehicles={vehicles}
        onAddVehicle={handleAddVehicle}
        onEditVehicle={handleEditVehicle}
        onDeleteVehicle={handleDeleteVehicle}
        className="mb-6"
      />
      
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
  );
};

export default Vehicles;
