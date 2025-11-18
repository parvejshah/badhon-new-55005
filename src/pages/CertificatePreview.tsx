import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SAMPLE_DATA = {
  donorName: 'John Doe',
  fatherName: 'Michael Doe',
  motherName: 'Sarah Doe',
  bloodGroup: 'A+',
  department: 'Computer Science & Engineering',
  serialNo: 'BADHAN-2024-001',
  hallName: 'Amar Ekushey Hall'
};

function capitalizeFirstLetter(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function CertificatePreview() {
  const navigate = useNavigate();
  const [certificateHTML, setCertificateHTML] = useState('');
  const [certificateCSS, setCertificateCSS] = useState('');

  useEffect(() => {
    async function loadCertificate() {
      try {
        // Load template and styles
        const [templateResponse, stylesResponse] = await Promise.all([
          fetch('/certificate-assets/certificate-template.html'),
          fetch('/certificate-assets/certificate-style.css')
        ]);

        let template = await templateResponse.text();
        const styles = await stylesResponse.text();

        // Populate template with sample data
        template = template
          .replace(/\{\{blood_group\}\}/g, capitalizeFirstLetter(SAMPLE_DATA.bloodGroup))
          .replace(/\{\{unique id\}\}/g, SAMPLE_DATA.serialNo)
          .replace(/\{\{donorname\}\}/g, capitalizeFirstLetter(SAMPLE_DATA.donorName))
          .replace(/\{\{father'sname\}\}/g, capitalizeFirstLetter(SAMPLE_DATA.fatherName))
          .replace(/\{\{mother'sanme\}\}/g, capitalizeFirstLetter(SAMPLE_DATA.motherName))
          .replace(/\{\{departmentname\}\}/g, capitalizeFirstLetter(SAMPLE_DATA.department))
          .replace(/\{\{hallname\}\}/g, capitalizeFirstLetter(SAMPLE_DATA.hallName))
          .replace(/\{\{hallanme\}\}/g, capitalizeFirstLetter(SAMPLE_DATA.hallName));

        setCertificateHTML(template);
        setCertificateCSS(styles);
      } catch (error) {
        console.error('Error loading certificate:', error);
      }
    }

    loadCertificate();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Certificate Preview</h1>
            <p className="text-muted-foreground mt-1">
              Sample certificate with test data
            </p>
          </div>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="bg-white shadow-lg">
            <style dangerouslySetInnerHTML={{ __html: certificateCSS }} />
            <div dangerouslySetInnerHTML={{ __html: certificateHTML }} />
          </div>
        </div>
      </div>
    </div>
  );
}
