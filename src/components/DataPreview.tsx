import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface DonorData {
  donorName: string;
  fatherName: string;
  motherName: string;
  bloodGroup: string;
  department: string;
  donationCount: string;
  serialNo: string;
}

interface DataPreviewProps {
  data: DonorData[];
}

export function DataPreview({ data }: DataPreviewProps) {
  if (data.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center bg-card">
        <p className="text-muted-foreground">Upload a file to preview data</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serial No.</TableHead>
              <TableHead>Donor Name</TableHead>
              <TableHead>Father's Name</TableHead>
              <TableHead>Mother's Name</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Donation Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.serialNo}</TableCell>
                <TableCell className="font-medium">{row.donorName}</TableCell>
                <TableCell>{row.fatherName}</TableCell>
                <TableCell>{row.motherName}</TableCell>
                <TableCell>{row.bloodGroup}</TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>{row.donationCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
