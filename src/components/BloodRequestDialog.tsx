import { useState } from 'react';
import { useBloodRequests } from '@/hooks/useBloodRequests';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DonorSearchResults } from './DonorSearchResults';

interface BloodRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function BloodRequestDialog({ open, onOpenChange, onSuccess }: BloodRequestDialogProps) {
  const { createRequest, loading } = useBloodRequests();
  const [formData, setFormData] = useState({
    blood_group_needed: '',
    patient_name: '',
    hospital: '',
    contact_number: '',
    urgency: 'medium',
    status: 'pending',
    handled_by_volunteer_id: null,
    units_needed: 1,
    needed_by: '',
    additional_notes: '',
  });
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createRequest(formData);
    if (result) {
      setCreatedRequestId(result.id);
      onSuccess();
    }
  };

  const handleClose = () => {
    setFormData({
      blood_group_needed: '',
      patient_name: '',
      hospital: '',
      contact_number: '',
      urgency: 'medium',
      status: 'pending',
      handled_by_volunteer_id: null,
      units_needed: 1,
      needed_by: '',
      additional_notes: '',
    });
    setCreatedRequestId(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Blood Donation Request</DialogTitle>
          <DialogDescription>
            {createdRequestId ? 'Request created! Now find eligible donors.' : 'Fill in the details for the blood donation request'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={createdRequestId ? "donors" : "request"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="request" disabled={!!createdRequestId}>Request Details</TabsTrigger>
            <TabsTrigger value="donors" disabled={!createdRequestId}>Find Donors</TabsTrigger>
          </TabsList>

          <TabsContent value="request" className="space-y-4 mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="blood_group">Blood Group Needed *</Label>
                  <Select
                    value={formData.blood_group_needed}
                    onValueChange={(value) => setFormData({ ...formData, blood_group_needed: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                        <SelectItem key={group} value={group}>{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="units_needed">Units Needed</Label>
                  <Input
                    id="units_needed"
                    type="number"
                    min="1"
                    value={formData.units_needed}
                    onChange={(e) => setFormData({ ...formData, units_needed: parseInt(e.target.value) })}
                    required
                  />
                </div>
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

              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="contact">Contact Number *</Label>
                  <Input
                    id="contact"
                    value={formData.contact_number}
                    onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency Level *</Label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical - Immediate</SelectItem>
                      <SelectItem value="high">High - Within 24 hours</SelectItem>
                      <SelectItem value="medium">Medium - Within 3 days</SelectItem>
                      <SelectItem value="low">Low - Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="needed_by">Needed By</Label>
                  <Input
                    id="needed_by"
                    type="date"
                    value={formData.needed_by}
                    onChange={(e) => setFormData({ ...formData, needed_by: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.additional_notes}
                  onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
                  placeholder="Any additional information..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating...' : 'Create Request & Find Donors'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="donors" className="mt-4">
            {createdRequestId && formData.blood_group_needed && (
              <DonorSearchResults
                requestId={createdRequestId}
                bloodGroup={formData.blood_group_needed}
                onContact={(donorId) => console.log('Contacted donor:', donorId)}
              />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
