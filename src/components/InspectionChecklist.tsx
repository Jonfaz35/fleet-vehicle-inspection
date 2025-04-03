
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { InspectionItem } from '@/types/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type ChecklistCategory = {
  name: string;
  items: {
    id: string;
    name: string;
  }[];
};

type InspectionChecklistProps = {
  categories: ChecklistCategory[];
  onItemChange: (item: InspectionItem) => void;
  className?: string;
};

// Mapping between UI-friendly status names and the actual status values
const statusMapping = {
  'good': 'pass',
  'needs-attention': 'warning',
  'critical': 'fail'
} as const;

// Reverse mapping for display purposes
const reverseStatusMapping = {
  'pass': 'good',
  'warning': 'needs-attention',
  'fail': 'critical'
} as const;

const InspectionChecklist: React.FC<InspectionChecklistProps> = ({
  categories,
  onItemChange,
  className,
}) => {
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [checkedState, setCheckedState] = useState<Record<string, 'good' | 'needs-attention' | 'critical'>>({});

  const handleStatusChange = (itemId: string, categoryName: string, itemName: string, status: 'good' | 'needs-attention' | 'critical') => {
    setCheckedState(prev => ({
      ...prev,
      [itemId]: status
    }));
    
    onItemChange({
      id: itemId,
      name: itemName,
      category: categoryName,
      status: statusMapping[status] as InspectionItem['status'],
      notes: notes[itemId] || ''
    });
  };

  const handleNotesChange = (itemId: string, categoryName: string, itemName: string, noteText: string) => {
    setNotes(prev => ({
      ...prev,
      [itemId]: noteText
    }));
    
    onItemChange({
      id: itemId,
      name: itemName,
      category: categoryName,
      status: checkedState[itemId] ? statusMapping[checkedState[itemId]] as InspectionItem['status'] : 'pass',
      notes: noteText
    });
  };

  return (
    <div className={className}>
      {categories.map((category) => (
        <Card key={category.name} className="mb-6">
          <CardHeader>
            <CardTitle>{category.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {category.items.map((item) => (
                <div key={item.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor={item.id} className="text-base font-medium">
                      {item.name}
                    </Label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`${item.id}-good`} 
                          checked={checkedState[item.id] === 'good'}
                          onCheckedChange={() => handleStatusChange(item.id, category.name, item.name, 'good')} 
                          className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" 
                        />
                        <Label htmlFor={`${item.id}-good`} className="text-sm">Good</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`${item.id}-needs-attention`} 
                          checked={checkedState[item.id] === 'needs-attention'}
                          onCheckedChange={() => handleStatusChange(item.id, category.name, item.name, 'needs-attention')} 
                          className="data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500" 
                        />
                        <Label htmlFor={`${item.id}-needs-attention`} className="text-sm">Needs Attention</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`${item.id}-critical`} 
                          checked={checkedState[item.id] === 'critical'}
                          onCheckedChange={() => handleStatusChange(item.id, category.name, item.name, 'critical')} 
                          className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500" 
                        />
                        <Label htmlFor={`${item.id}-critical`} className="text-sm">Critical</Label>
                      </div>
                    </div>
                  </div>
                  <Textarea 
                    id={`${item.id}-notes`}
                    placeholder="Add notes about this item..."
                    value={notes[item.id] || ''}
                    onChange={e => handleNotesChange(item.id, category.name, item.name, e.target.value)}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InspectionChecklist;
