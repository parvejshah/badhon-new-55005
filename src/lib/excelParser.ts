import * as XLSX from 'xlsx';
import { DonorData } from '@/components/DataPreview';

export async function parseExcelFile(file: File): Promise<DonorData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        const parsedData: DonorData[] = jsonData.map((row: any, index) => ({
          serialNo: row['Serial No'] || row['serial'] || row['Serial'] || row['Sl No'] || row['sl'] || (index + 1).toString(),
          donorName: row['Donor Name'] || row['name'] || row['Name'] || row['Name (English)'] || row['name (english)'] || row['donorName'] || row['DonorName'] || '',
          fatherName: row["Father's Name"] || row["Father Name"] || row['father'] || row['Father'] || row['fatherName'] || row['FatherName'] || '',
          motherName: row["Mother's Name"] || row["Mother Name"] || row['mother'] || row['Mother'] || row['motherName'] || row['MotherName'] || '',
          bloodGroup: row['Blood Group'] || row['bloodGroup'] || row['BloodGroup'] || row['blood'] || row['Blood'] || row['Group'] || '',
          department: row['Department'] || row['department'] || row['Dept'] || row['dept'] || row['Dept.'] || '',
          donationCount: row['Donation Count'] || row['donations'] || row['Donations'] || row['donationCount'] || row['Count'] || row['count'] || '1',
        }));

        resolve(parsedData);
      } catch (error) {
        reject(new Error('Failed to parse Excel file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });
}
