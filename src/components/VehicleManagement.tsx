
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Vehicle } from '@/types/models';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';

type VehicleManagementProps = {
  vehicles: Vehicle[];
  onAddVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
  onEditVehicle: (vehicle: Vehicle) => Promise<void>;
  onDeleteVehicle: (id: string) => Promise<void>;
  className?: string;
};

const VehicleManagement = ({
  vehicles,
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle,
  className
}: VehicleManagementProps) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    mileage: 0,
    assignedTo: '',
  });
  const { toast } = useToast();
  const { isAdmin } = useUser();

  const resetForm = () => {
    setFormData({
      name: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      mileage: 0,
      assignedTo: '',
    });
    setSelectedVehicle(null);
  };

  const handleEditClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
      mileage: vehicle.mileage,
      assignedTo: vehicle.assignedTo,
    });
    setIsEditOpen(true);
  };

  const handleDeleteClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAddVehicle({
        ...formData,
        status: 'good',
        lastInspection: null,
      });
      toast({
        title: "Vehicle Added",
        description: `${formData.name} has been added to the fleet.`,
      });
      resetForm();
      setIsAddOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to add vehicle",
        description: "There was an error adding the vehicle. Please try again.",
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;
    
    try {
      await onEditVehicle({
        ...selectedVehicle,
        name: formData.name,
        model: formData.model,
        year: formData.year,
        licensePlate: formData.licensePlate,
        mileage: formData.mileage,
        assignedTo: formData.assignedTo,
      });
      toast({
        title: "Vehicle Updated",
        description: `${formData.name} has been updated.`,
      });
      resetForm();
      setIsEditOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update vehicle",
        description: "There was an error updating the vehicle. Please try again.",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVehicle) return;
    
    try {
      await onDeleteVehicle(selectedVehicle.id);
      toast({
        title: "Vehicle Deleted",
        description: `${selectedVehicle.name} has been removed from the fleet.`,
      });
      resetForm();
      setIsDeleteOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete vehicle",
        description: "There was an error deleting the vehicle. Please try again.",
      });
    }
  };

  if (!isAdmin) return null;

  return (
    <div className={className}>
      {/* Add Vehicle Button and Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>
              Enter the details for the new vehicle.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="model" className="text-right">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="year" className="text-right">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="licensePlate" className="text-right">License Plate</Label>
                <Input
                  id="licensePlate"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({...formData, licensePlate: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mileage" className="text-right">Mileage</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData({...formData, mileage: parseInt(e.target.value)})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assignedTo" className="text-right">Assigned To</Label>
                <Input
                  id="assignedTo"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Vehicle</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>
              Update the details for this vehicle.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-model" className="text-right">Model</Label>
                <Input
                  id="edit-model"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-year" className="text-right">Year</Label>
                <Input
                  id="edit-year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-licensePlate" className="text-right">License Plate</Label>
                <Input
                  id="edit-licensePlate"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({...formData, licensePlate: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-mileage" className="text-right">Mileage</Label>
                <Input
                  id="edit-mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData({...formData, mileage: parseInt(e.target.value)})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-assignedTo" className="text-right">Assigned To</Label>
                <Input
                  id="edit-assignedTo"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Update Vehicle</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Vehicle Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Vehicle</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedVehicle?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleManagement;
