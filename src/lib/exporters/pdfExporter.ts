import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '1122px';
  container.style.height = '794px';
  document.body.appendChild(container);

  const styleElement = document.createElement('style');
  styleElement.textContent = css;
  container.appendChild(styleElement);

  const contentDiv = document.createElement('div');
  contentDiv.innerHTML = html;
  container.appendChild(contentDiv);

  try {
    await document.fonts.ready;
    
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
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const canvas = await html2canvas(container, {
      scale: 4,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 0,
      removeContainer: false,
      windowWidth: 1122,
      windowHeight: 794,
    });

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: false,
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);

    return pdf.output('blob');
  } finally {
    document.body.removeChild(container);
  }
}

export async function generatePDFCertificate(
  data: DonorData,
  hallName: string,
  template: string,
  styles: string
): Promise<Blob> {
  const populatedHTML = populateTemplate(template, data, hallName);
  return await generatePDFFromHTML(populatedHTML, styles);
}

export async function loadPDFAssets() {
  const [template, styles] = await Promise.all([
    loadCertificateTemplate(),
    loadCertificateStyles()
  ]);
  return { template, styles };
}
