import { DonorData } from '@/components/DataPreview';

async function loadCertificateTemplate(): Promise<string> {
  const response = await fetch('/certificate-assets/certificate-template.html');
  return await response.text();
}

async function loadCertificateStyles(): Promise<string> {
  const response = await fetch('/certificate-assets/certificate-style.css');
  return await response.text();
}

async function loadLogoAsBase64(): Promise<string> {
  const response = await fetch('/certificate-assets/badhanlogo.gif');
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

async function loadFontAsBase64(path: string): Promise<string> {
  const response = await fetch(path);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
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

export async function generateHTMLCertificate(
  data: DonorData,
  hallName: string
): Promise<string> {
  const [template, styles, logoBase64] = await Promise.all([
    loadCertificateTemplate(),
    loadCertificateStyles(),
    loadLogoAsBase64()
  ]);

  // Load all Monotype Corsiva fonts as base64
  const [corsivaRegular, corsivaItalic, corsivaBold, corsivaBoldItalic] = await Promise.all([
    loadFontAsBase64('/certificate-assets/Monotype Corsiva/Monotype-Corsiva-Regular.ttf'),
    loadFontAsBase64('/certificate-assets/Monotype Corsiva/Monotype-Corsiva-Regular-Italic.ttf'),
    loadFontAsBase64('/certificate-assets/Monotype Corsiva/Monotype-Corsiva-Bold.ttf'),
    loadFontAsBase64('/certificate-assets/Monotype Corsiva/Monotype-Corsiva-Bold-Italic.ttf')
  ]);

  // Embed fonts in CSS using base64
  const embeddedStyles = styles
    .replace(
      /url\('\/certificate-assets\/Monotype Corsiva\/Monotype-Corsiva-Regular\.ttf'\)/,
      `url('${corsivaRegular}')`
    )
    .replace(
      /url\('\/certificate-assets\/Monotype Corsiva\/Monotype-Corsiva-Regular-Italic\.ttf'\)/,
      `url('${corsivaItalic}')`
    )
    .replace(
      /url\('\/certificate-assets\/Monotype Corsiva\/Monotype-Corsiva-Bold\.ttf'\)/,
      `url('${corsivaBold}')`
    )
    .replace(
      /url\('\/certificate-assets\/Monotype Corsiva\/Monotype-Corsiva-Bold-Italic\.ttf'\)/,
      `url('${corsivaBoldItalic}')`
    )
    .replace(
      /url\('\/certificate-assets\/badhanlogo\.gif'\)/g,
      `url('${logoBase64}')`
    );

  const populatedHTML = populateTemplate(template, data, hallName);
  
  // Replace logo src with base64
  const htmlWithLogo = populatedHTML.replace(
    /src="\/certificate-assets\/badhanlogo\.gif"/,
    `src="${logoBase64}"`
  );

  // Create standalone HTML with embedded styles
  const standaloneHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate - ${data.donorName}</title>
    <style>
${embeddedStyles}
    </style>
</head>
${htmlWithLogo.substring(htmlWithLogo.indexOf('<body>'))}
</html>`;

  return standaloneHTML;
}
