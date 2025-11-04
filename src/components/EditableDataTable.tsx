import { useState } from 'react';
import { DonorData } from './DataPreview';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Pencil, Trash2, Check, X, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface DonorDataWithId extends DonorData {
  id: string;
}

interface EditableDataTableProps {
  data: DonorData[];
  onUpdate: (updatedData: DonorData[]) => void;
}

export const EditableDataTable = ({ data, onUpdate }: EditableDataTableProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<DonorData | null>(null);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...data[index] });
  };

  const handleSave = () => {
    if (!editForm || editingIndex === null) return;

    const updatedData = data.map((row, idx) => 
      idx === editingIndex ? editForm : row
    );
    onUpdate(updatedData);
    setEditingIndex(null);
    setEditForm(null);
    toast.success('Row updated successfully');
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditForm(null);
  };

  const handleDelete = (index: number) => {
    const updatedData = data.filter((_, idx) => idx !== index);
    onUpdate(updatedData);
    toast.success('Row deleted successfully');
  };

  const handleAdd = () => {
    const newRow: DonorData = {
      serialNo: String(data.length + 1),
      donorName: '',
      fatherName: '',
      motherName: '',
      bloodGroup: '',
      department: '',
      donationCount: '1',
    };
    onUpdate([...data, newRow]);
    handleEdit(data.length);
  };

  const handleInputChange = (field: keyof DonorData, value: string) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAdd} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Row
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-muted">
              <TableRow>
                <TableHead className="w-20">Serial</TableHead>
                <TableHead className="min-w-[180px]">Donor Name</TableHead>
                <TableHead className="min-w-[180px]">Father's Name</TableHead>
                <TableHead className="min-w-[180px]">Mother's Name</TableHead>
                <TableHead className="w-24">Blood</TableHead>
                <TableHead className="min-w-[150px]">Department</TableHead>
                <TableHead className="w-24">Count</TableHead>
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  {editingIndex === index && editForm ? (
                    <>
                      <TableCell>
                        <Input
                          value={editForm.serialNo}
                          onChange={(e) => handleInputChange('serialNo', e.target.value)}
                          className="h-8 w-16"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.donorName}
                          onChange={(e) => handleInputChange('donorName', e.target.value)}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.fatherName}
                          onChange={(e) => handleInputChange('fatherName', e.target.value)}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.motherName}
                          onChange={(e) => handleInputChange('motherName', e.target.value)}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.bloodGroup}
                          onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                          className="h-8 w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.donationCount}
                          onChange={(e) => handleInputChange('donationCount', e.target.value)}
                          className="h-8 w-16"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={handleSave}>
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleCancel}>
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-mono text-sm">{row.serialNo}</TableCell>
                      <TableCell className="font-medium">{row.donorName}</TableCell>
                      <TableCell>{row.fatherName}</TableCell>
                      <TableCell>{row.motherName}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {row.bloodGroup}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{row.department}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                          {row.donationCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(index)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
