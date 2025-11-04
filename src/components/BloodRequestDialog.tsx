import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BLOOD_GROUPS } from '@/lib/bloodGroupColors';
import { Plus } from 'lucide-react';

interface BloodRequestDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onRequestCreated?: () => void;
  onCreateRequest?: (request: any) => Promise<void>;
  onSuccess?: () => void;
}

export function BloodRequestDialog({
  open: controlledOpen,
  onOpenChange,
  onRequestCreated,
  onCreateRequest,
  onSuccess,
}: BloodRequestDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalOpen(value);
    }
  };
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    blood_group_needed: '',
    patient_name: '',
    hospital: '',
    contact_number: '',
    urgency: 'medium',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (onCreateRequest) {
        await onCreateRequest({
          ...formData,
          status: 'pending',
          handled_by_volunteer_id: null,
        });
      }
      
      setFormData({
        blood_group_needed: '',
        patient_name: '',
        hospital: '',
        contact_number: '',
        urgency: 'medium',
      });
      
      setOpen(false);
      if (onRequestCreated) onRequestCreated();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Blood Request
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Blood Request</DialogTitle>
          <DialogDescription>
            Fill in the details for the blood request
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="blood_group_needed">Blood Group Needed *</Label>
            <Select
              value={formData.blood_group_needed}
              onValueChange={(value) => setFormData({ ...formData, blood_group_needed: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_GROUPS.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="patient_name">Patient Name *</Label>
            <Input
              id="patient_name"
              value={formData.patient_name}
              onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hospital">Hospital *</Label>
            <Input
              id="hospital"
              value={formData.hospital}
              onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_number">Contact Number *</Label>
            <Input
              id="contact_number"
              type="tel"
              value={formData.contact_number}
              onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Urgency *</Label>
            <RadioGroup
              value={formData.urgency}
              onValueChange={(value) => setFormData({ ...formData, urgency: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="font-normal">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="font-normal">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="font-normal">High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="critical" id="critical" />
                <Label htmlFor="critical" className="font-normal">Critical</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
