import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { DonorData } from '@/components/DataPreview';

async function loadCertificateTemplate(): Promise<string> {
  const response = await fetch('/certificate-assets/certificate-template.html');
  return await response.text();
}

async function loadCertificateStyles(): Promise<string> {
  const response = await fetch('/certificate-assets/certificate-style.css');
  return await response.text();
}

function populateTemplate(template: string, data: DonorData, hallName: string): string {
  return template
    .replace(/\{\{blood_group\}\}/g, data.bloodGroup)
    .replace(/\{\{unique id\}\}/g, data.serialNo)
    .replace(/\{\{donorname\}\}/g, data.donorName)
    .replace(/\{\{father'sname\}\}/g, data.fatherName)
    .replace(/\{\{mother'sanme\}\}/g, data.motherName)
    .replace(/\{\{departmentname\}\}/g, data.department)
    .replace(/\{\{hallname\}\}/g, hallName)
    .replace(/\{\{hallanme\}\}/g, hallName);
}

async function generatePDFFromHTML(html: string, css: string): Promise<Blob> {
  // Create a temporary container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '1122px'; // A4 landscape width
  container.style.height = '794px'; // A4 landscape height
  document.body.appendChild(container);

  // Add styles
  const styleElement = document.createElement('style');
  styleElement.textContent = css;
  container.appendChild(styleElement);

  // Add HTML
  const contentDiv = document.createElement('div');
  contentDiv.innerHTML = html;
  container.appendChild(contentDiv);

  try {
    // Wait for fonts to be ready
    await document.fonts.ready;
    
    // Wait for all images to load
    const images = container.getElementsByTagName('img');
    await Promise.all(
      Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );
    
    // Additional wait to ensure all fonts and styles are fully rendered
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Capture with html2canvas at very high quality
    const canvas = await html2canvas(container, {
      scale: 4, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 0,
      removeContainer: false,
      windowWidth: 1122,
      windowHeight: 794,
    });

    // Convert to PDF - A4 landscape
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: false, // Don't compress for better quality
    });

    const imgData = canvas.toDataURL('image/png', 1.0); // Use PNG for better quality
    pdf.addImage(imgData, 'PNG', 0, 0, 297, 210); // A4 landscape: 297mm x 210mm

    return pdf.output('blob');
  } finally {
    document.body.removeChild(container);
  }
}

export async function generateCertificates(
  data: DonorData[],
  hallName: string,
  onProgress: (current: number, total: number) => void
): Promise<Blob> {
  const template = await loadCertificateTemplate();
  const styles = await loadCertificateStyles();
  const zip = new JSZip();

  for (let i = 0; i < data.length; i++) {
    const donor = data[i];
    const populatedHTML = populateTemplate(template, donor, hallName);
    const pdfBlob = await generatePDFFromHTML(populatedHTML, styles);
    
    const fileName = `${donor.donorName.replace(/[^a-zA-Z0-9]/g, '_')}_${donor.serialNo}.pdf`;
    zip.file(fileName, pdfBlob);

    onProgress(i + 1, data.length);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return zipBlob;
}
