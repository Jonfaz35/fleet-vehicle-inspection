
export interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  year: number;
  model: string;
  mileage: number;
  assignedTo: string;
  lastInspection: string | null;
  status: 'good' | 'needs-attention' | 'critical';
}

export interface InspectionItem {
  id: string;
  name: string;
  category: string;
  status: 'pass' | 'fail' | 'warning';
  notes?: string;
}

export interface Inspection {
  id: string;
  vehicleId: string;
  date: string;
  performedBy: string;
  items: InspectionItem[];
  overallStatus: 'good' | 'needs-attention' | 'critical';
  notes: string;
}
