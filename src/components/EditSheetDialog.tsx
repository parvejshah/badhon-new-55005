import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface EditSheetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (sheetName: string, hallName: string) => void;
  initialSheetName: string;
  initialHallName: string;
}

export const EditSheetDialog = ({ 
  open, 
  onOpenChange, 
  onSave, 
  initialSheetName,
  initialHallName 
}: EditSheetDialogProps) => {
  const [sheetName, setSheetName] = useState(initialSheetName);
  const [hallName, setHallName] = useState(initialHallName);

  useEffect(() => {
    setSheetName(initialSheetName);
    setHallName(initialHallName);
  }, [initialSheetName, initialHallName, open]);

  const handleSave = () => {
    if (sheetName.trim()) {
      onSave(sheetName.trim(), hallName.trim());
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Sheet Details</DialogTitle>
          <DialogDescription>
            Update the sheet name and hall name
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-sheet-name">Sheet Name</Label>
            <Input
              id="edit-sheet-name"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-hall-name">Hall Name</Label>
            <Input
              id="edit-hall-name"
              value={hallName}
              onChange={(e) => setHallName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!sheetName.trim()}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
