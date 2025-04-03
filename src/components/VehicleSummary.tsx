
import React from 'react';
import { Vehicle } from '@/types/models';

type VehicleSummaryProps = {
  vehicles: Vehicle[];
};

const VehicleSummary: React.FC<VehicleSummaryProps> = ({ vehicles }) => {
  const goodCount = vehicles.filter(v => v.status === 'good').length;
  const needsAttentionCount = vehicles.filter(v => v.status === 'needs-attention').length;
  const criticalCount = vehicles.filter(v => v.status === 'critical').length;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="text-sm text-muted-foreground mb-1">Vehicles</div>
        <div className="text-2xl font-bold">{vehicles.length}</div>
        <div className="text-xs text-muted-foreground mt-1">Total in fleet</div>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="text-sm text-muted-foreground mb-1">Need Attention</div>
        <div className="text-2xl font-bold text-warning">{needsAttentionCount + criticalCount}</div>
        <div className="text-xs text-muted-foreground mt-1">Require maintenance</div>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="text-sm text-muted-foreground mb-1">Ready for Service</div>
        <div className="text-2xl font-bold text-success">{goodCount}</div>
        <div className="text-xs text-muted-foreground mt-1">Good condition</div>
      </div>
    </div>
  );
};

export default VehicleSummary;
