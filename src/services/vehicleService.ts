
import { Vehicle, Inspection, InspectionItem } from '../types/models';

// Mock data for vehicles
const vehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Van 1',
    licensePlate: 'PL-1234',
    year: 2020,
    model: 'Ford Transit',
    mileage: 45000,
    assignedTo: 'John Smith',
    lastInspection: '2025-03-15',
    status: 'good',
  },
  {
    id: '2',
    name: 'Van 2',
    licensePlate: 'PL-5678',
    year: 2019,
    model: 'Mercedes Sprinter',
    mileage: 62000,
    assignedTo: 'Sarah Johnson',
    lastInspection: '2025-03-10',
    status: 'needs-attention',
  },
  {
    id: '3',
    name: 'Van 3',
    licensePlate: 'PL-9012',
    year: 2021,
    model: 'Chevrolet Express',
    mileage: 28000,
    assignedTo: 'Mike Wilson',
    lastInspection: '2025-02-28',
    status: 'good',
  },
  {
    id: '4',
    name: 'Van 4',
    licensePlate: 'PL-3456',
    year: 2018,
    model: 'Ford Transit',
    mileage: 78000,
    assignedTo: 'Jessica Lee',
    lastInspection: '2025-03-05',
    status: 'critical',
  },
  {
    id: '5',
    name: 'Van 5',
    licensePlate: 'PL-7890',
    year: 2022,
    model: 'RAM ProMaster',
    mileage: 18000,
    assignedTo: 'David Brown',
    lastInspection: '2025-03-20',
    status: 'good',
  },
  {
    id: '6',
    name: 'Van 6',
    licensePlate: 'PL-2468',
    year: 2020,
    model: 'Nissan NV',
    mileage: 52000,
    assignedTo: 'Robert Garcia',
    lastInspection: '2025-03-12',
    status: 'needs-attention',
  },
];

// Mock data for inspections
const inspectionItems: InspectionItem[] = [
  { id: '1', name: 'Engine Oil', category: 'Fluids', status: 'pass' },
  { id: '2', name: 'Brake Fluid', category: 'Fluids', status: 'pass' },
  { id: '3', name: 'Transmission Fluid', category: 'Fluids', status: 'warning' },
  { id: '4', name: 'Coolant', category: 'Fluids', status: 'pass' },
  { id: '5', name: 'Windshield Washer Fluid', category: 'Fluids', status: 'pass' },
  { id: '6', name: 'Power Steering Fluid', category: 'Fluids', status: 'pass' },
  { id: '7', name: 'Brake Pads', category: 'Brakes', status: 'pass' },
  { id: '8', name: 'Brake Discs', category: 'Brakes', status: 'pass' },
  { id: '9', name: 'Parking Brake', category: 'Brakes', status: 'pass' },
  { id: '10', name: 'Headlights', category: 'Lights', status: 'pass' },
  { id: '11', name: 'Brake Lights', category: 'Lights', status: 'fail' },
  { id: '12', name: 'Turn Signals', category: 'Lights', status: 'pass' },
  { id: '13', name: 'Hazard Lights', category: 'Lights', status: 'pass' },
  { id: '14', name: 'Interior Lights', category: 'Lights', status: 'pass' },
  { id: '15', name: 'Tire Pressure', category: 'Tires', status: 'warning' },
  { id: '16', name: 'Tire Tread', category: 'Tires', status: 'pass' },
  { id: '17', name: 'Tire Rotation', category: 'Tires', status: 'pass' },
  { id: '18', name: 'Spare Tire', category: 'Tires', status: 'pass' },
  { id: '19', name: 'Battery', category: 'Electrical', status: 'pass' },
  { id: '20', name: 'Alternator', category: 'Electrical', status: 'pass' },
  { id: '21', name: 'Starter', category: 'Electrical', status: 'pass' },
  { id: '22', name: 'Horn', category: 'Electrical', status: 'pass' },
  { id: '23', name: 'Wiper Blades', category: 'Exterior', status: 'warning' },
  { id: '24', name: 'Mirrors', category: 'Exterior', status: 'pass' },
  { id: '25', name: 'Door Locks', category: 'Exterior', status: 'pass' },
  { id: '26', name: 'Air Filter', category: 'Engine', status: 'pass' },
  { id: '27', name: 'Cabin Filter', category: 'Interior', status: 'pass' },
  { id: '28', name: 'Exhaust System', category: 'Engine', status: 'pass' },
  { id: '29', name: 'Belts', category: 'Engine', status: 'pass' },
  { id: '30', name: 'Hoses', category: 'Engine', status: 'pass' },
];

const inspections: Inspection[] = [
  {
    id: '1',
    vehicleId: '1',
    date: '2025-03-15',
    performedBy: 'Alex Rodriguez',
    items: inspectionItems.map(item => ({...item})),
    overallStatus: 'good',
    notes: 'Vehicle is in good condition. Scheduled for next inspection in 30 days.',
  },
  {
    id: '2',
    vehicleId: '2',
    date: '2025-03-10',
    performedBy: 'Chris Johnson',
    items: inspectionItems.map(item => {
      if (item.id === '15') return {...item, status: 'warning', notes: 'Front right tire low pressure'};
      if (item.id === '23') return {...item, status: 'warning', notes: 'Wiper blades need replacement soon'};
      return {...item};
    }),
    overallStatus: 'needs-attention',
    notes: 'Check tire pressure and replace wiper blades.',
  },
  {
    id: '3',
    vehicleId: '3',
    date: '2025-02-28',
    performedBy: 'Taylor Swift',
    items: inspectionItems.map(item => ({...item})),
    overallStatus: 'good',
    notes: 'No issues found. Vehicle is performing well.',
  },
  {
    id: '4',
    vehicleId: '4',
    date: '2025-03-05',
    performedBy: 'Jamie Lane',
    items: inspectionItems.map(item => {
      if (item.id === '11') return {...item, status: 'fail', notes: 'Brake lights not functioning'};
      if (item.id === '3') return {...item, status: 'warning', notes: 'Transmission fluid low'};
      if (item.id === '29') return {...item, status: 'fail', notes: 'Belts showing excessive wear'};
      return {...item};
    }),
    overallStatus: 'critical',
    notes: 'Vehicle requires immediate attention for brake lights and belts.',
  },
  {
    id: '5',
    vehicleId: '5',
    date: '2025-03-20',
    performedBy: 'Pat Davis',
    items: inspectionItems.map(item => ({...item})),
    overallStatus: 'good',
    notes: 'Everything looks good. Regular maintenance performed.',
  },
  {
    id: '6',
    vehicleId: '6',
    date: '2025-03-12',
    performedBy: 'Jordan Smith',
    items: inspectionItems.map(item => {
      if (item.id === '15') return {...item, status: 'warning', notes: 'All tires slightly under pressure'};
      if (item.id === '3') return {...item, status: 'warning', notes: 'Transmission fluid needs changing'};
      return {...item};
    }),
    overallStatus: 'needs-attention',
    notes: 'Needs tire pressure adjustment and transmission fluid service.',
  },
];

// Service functions
export const getVehicles = (): Promise<Vehicle[]> => {
  return Promise.resolve(vehicles);
};

export const getVehicleById = (id: string): Promise<Vehicle | undefined> => {
  return Promise.resolve(vehicles.find(vehicle => vehicle.id === id));
};

export const getInspections = (vehicleId?: string): Promise<Inspection[]> => {
  if (vehicleId) {
    return Promise.resolve(inspections.filter(inspection => inspection.vehicleId === vehicleId));
  }
  return Promise.resolve(inspections);
};

export const getInspectionById = (id: string): Promise<Inspection | undefined> => {
  return Promise.resolve(inspections.find(inspection => inspection.id === id));
};

export const saveInspection = (inspection: Omit<Inspection, 'id'>): Promise<Inspection> => {
  const newInspection: Inspection = {
    ...inspection,
    id: Math.random().toString(36).substr(2, 9),
  };
  inspections.push(newInspection);
  
  // Update vehicle status and last inspection date
  const vehicleIndex = vehicles.findIndex(v => v.id === inspection.vehicleId);
  if (vehicleIndex >= 0) {
    vehicles[vehicleIndex] = {
      ...vehicles[vehicleIndex],
      status: inspection.overallStatus,
      lastInspection: inspection.date,
    };
  }
  
  return Promise.resolve(newInspection);
};

// Adding the missing functions that are required by the Vehicles.tsx page
export const addVehicle = (newVehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
  const vehicle: Vehicle = {
    ...newVehicle,
    id: Math.random().toString(36).substr(2, 9),
  };
  vehicles.push(vehicle);
  return Promise.resolve(vehicle);
};

export const updateVehicle = (updatedVehicle: Vehicle): Promise<Vehicle> => {
  const index = vehicles.findIndex(v => v.id === updatedVehicle.id);
  if (index !== -1) {
    vehicles[index] = updatedVehicle;
  }
  return Promise.resolve(updatedVehicle);
};

export const deleteVehicle = (id: string): Promise<void> => {
  const index = vehicles.findIndex(v => v.id === id);
  if (index !== -1) {
    vehicles.splice(index, 1);
  }
  return Promise.resolve();
};

// Alias for saveInspection to match the import in InspectionForm.tsx
export const submitInspection = saveInspection;

export const getInspectionChecklistTemplate = (): Promise<InspectionItem[]> => {
  return Promise.resolve(inspectionItems.map(item => ({
    ...item,
    status: 'pass', // Default all items to pass
    notes: '',
  })));
};

export const getAllInspections = async (): Promise<Inspection[]> => {
  // Simulated API call - in a real application, this would fetch from your API
  return new Promise((resolve) => {
    setTimeout(() => {
      const allInspections = mockInspections;
      resolve(allInspections);
    }, 800);
  });
};

// Add more mock inspection data
const mockInspections: Inspection[] = [
  {
    id: "insp-001",
    vehicleId: "van-001",
    date: "2023-11-15",
    performedBy: "Mike Johnson",
    items: [
      { id: "item-001", name: "Brakes", category: "Mechanical", status: "pass", notes: "In good condition" },
      { id: "item-002", name: "Lights", category: "Electrical", status: "pass", notes: "All working" },
    ],
    overallStatus: "good",
    notes: "Vehicle is in excellent condition",
  },
  {
    id: "insp-002",
    vehicleId: "van-002",
    date: "2023-11-10",
    performedBy: "Sarah Williams",
    items: [
      { id: "item-003", name: "Oil Level", category: "Fluids", status: "warning", notes: "Slightly low" },
      { id: "item-004", name: "Tires", category: "Mechanical", status: "pass", notes: "Good tread" },
    ],
    overallStatus: "needs-attention",
    notes: "Oil needs to be topped up",
  },
  {
    id: "insp-003",
    vehicleId: "van-003",
    date: "2023-11-05",
    performedBy: "John Smith",
    items: [
      { id: "item-005", name: "Battery", category: "Electrical", status: "fail", notes: "Needs replacement" },
      { id: "item-006", name: "Wiper Blades", category: "Exterior", status: "warning", notes: "Worn" },
    ],
    overallStatus: "critical",
    notes: "Battery replacement required urgently",
  },
];
