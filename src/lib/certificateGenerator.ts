import JSZip from 'jszip';
import { DonorData } from '@/components/DataPreview';
import { generatePDFCertificate, loadPDFAssets } from './exporters/pdfExporter';
import { generateHTMLCertificate } from './exporters/htmlExporter';
import { generateDOCXCertificate } from './exporters/docxExporter';

export type ExportFormat = 'pdf' | 'html' | 'docx';

export async function generateCertificates(
  data: DonorData[],
  hallName: string,
  format: ExportFormat,
  onProgress: (current: number, total: number) => void
): Promise<Blob> {
  const zip = new JSZip();

  if (format === 'pdf') {
    const { template, styles } = await loadPDFAssets();
    
    for (let i = 0; i < data.length; i++) {
      const donor = data[i];
      const pdfBlob = await generatePDFCertificate(donor, hallName, template, styles);
      
      const fileName = `certificate_${donor.donorName.replace(/[^a-zA-Z0-9]/g, '_')}_${donor.serialNo}.pdf`;
      zip.file(fileName, pdfBlob);

      onProgress(i + 1, data.length);
    }
  } else if (format === 'html') {
    for (let i = 0; i < data.length; i++) {
      const donor = data[i];
      const htmlContent = await generateHTMLCertificate(donor, hallName);
      
      const fileName = `certificate_${donor.donorName.replace(/[^a-zA-Z0-9]/g, '_')}_${donor.serialNo}.html`;
      zip.file(fileName, htmlContent);

      onProgress(i + 1, data.length);
    }
  } else if (format === 'docx') {
    for (let i = 0; i < data.length; i++) {
      const donor = data[i];
      const docxBlob = await generateDOCXCertificate(donor, hallName);
      
      const fileName = `certificate_${donor.donorName.replace(/[^a-zA-Z0-9]/g, '_')}_${donor.serialNo}.docx`;
      zip.file(fileName, docxBlob);

      onProgress(i + 1, data.length);
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return zipBlob;
}
