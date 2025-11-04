import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface CreateSheetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (sheetName: string, hallName: string) => void;
}

export const CreateSheetDialog = ({ open, onOpenChange, onCreate }: CreateSheetDialogProps) => {
  const [sheetName, setSheetName] = useState('');
  const [hallName, setHallName] = useState('Amar Ekushay Hall');

  const handleCreate = () => {
    if (sheetName.trim()) {
      onCreate(sheetName.trim(), hallName.trim());
      setSheetName('');
      setHallName('Amar Ekushay Hall');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Sheet</DialogTitle>
          <DialogDescription>
            Create a new blank donor sheet to add records manually
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="sheet-name">Sheet Name</Label>
            <Input
              id="sheet-name"
              placeholder="e.g., Donors 2024"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hall-name">Hall Name</Label>
            <Input
              id="hall-name"
              placeholder="e.g., Amar Ekushay Hall"
              value={hallName}
              onChange={(e) => setHallName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!sheetName.trim()}>
            Create Sheet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
