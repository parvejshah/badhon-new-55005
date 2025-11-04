import { Document, Paragraph, TextRun, AlignmentType, HeadingLevel, PageOrientation, BorderStyle, convertInchesToTwip } from 'docx';
import { DonorData } from '@/components/DataPreview';

export async function generateDOCXCertificate(
  data: DonorData,
  hallName: string
): Promise<Blob> {
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: {
            orientation: PageOrientation.LANDSCAPE,
          },
          margin: {
            top: convertInchesToTwip(0.75),
            right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(0.75),
            left: convertInchesToTwip(1),
          },
        },
      },
      children: [
        // Header with Bengali text
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: 'একের রক্ত অন্যের জীবন',
              size: 24,
            }),
            new TextRun({
              text: '                                        ',
              size: 24,
            }),
            new TextRun({
              text: 'রক্তই হোক আত্মার বাঁধন',
              size: 24,
            }),
          ],
        }),

        // Info box (Blood Group and Serial No)
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { before: 200, after: 200 },
          children: [
            new TextRun({
              text: `Blood Group: ${data.bloodGroup}`,
              bold: true,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({
              text: `Serial No. ${data.serialNo}`,
              bold: true,
              size: 24,
            }),
          ],
        }),

        // BADHAN title
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
          children: [
            new TextRun({
              text: 'BADHAN',
              bold: true,
              size: 56,
              color: 'C00000',
              font: 'Verdana',
            }),
          ],
        }),

        // Subtitle
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: 'A Voluntary Blood Donors\' Organization',
              size: 32,
              font: 'Verdana',
            }),
          ],
        }),

        // Registration
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'Est.- 1997: Reg. No. DHA- 06152',
              bold: true,
              size: 28,
              font: 'Century Gothic',
            }),
          ],
        }),

        // Certificate Title
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 300 },
          children: [
            new TextRun({
              text: 'Certificate of Acknowledgment',
              bold: true,
              size: 38,
              font: 'Times New Roman',
            }),
          ],
        }),

        // Acknowledgment text
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { line: 360, before: 200, after: 200 },
          children: [
            new TextRun({
              text: 'We are very glad to certify of acknowledgement for Mr./Mrs. ',
              size: 32,
              italics: true,
              font: 'Monotype Corsiva',
            }),
            new TextRun({
              text: data.donorName,
              bold: true,
              size: 32,
              italics: true,
              font: 'Monotype Corsiva',
            }),
            new TextRun({
              text: ', son/daughter of ',
              size: 32,
              italics: true,
              font: 'Monotype Corsiva',
            }),
            new TextRun({
              text: data.fatherName,
              bold: true,
              size: 32,
              italics: true,
              font: 'Monotype Corsiva',
            }),
            new TextRun({
              text: ' & ',
              size: 32,
              italics: true,
              font: 'Monotype Corsiva',
            }),
            new TextRun({
              text: data.motherName,
              bold: true,
              size: 32,
              italics: true,
              font: 'Monotype Corsiva',
            }),
            new TextRun({
              text: ', student of the Faculty/Institute/Department of ',
              size: 32,
              italics: true,
              font: 'Monotype Corsiva',
            }),
            new TextRun({
              text: data.department,
              bold: true,
              size: 32,
              italics: true,
              font: 'Monotype Corsiva',
            }),
            new TextRun({
              text: ' as well as ',
              size: 32,
              italics: true,
              font: 'Monotype Corsiva',
            }),
            new TextRun({
              text: `${hallName}, University of Dhaka`,
              bold: true,
              size: 32,
              italics: true,
              font: 'Monotype Corsiva',
            }),
            new TextRun({
              text: ' to salute him/her for his/her noble humanitarian effort by donating fresh blood on voluntary basis. He/She has promised to continue this effort for suffering humanity for the rest of his/her life.',
              size: 32,
              italics: true,
              font: 'Monotype Corsiva',
            }),
          ],
        }),

        // Wish paragraph
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { before: 300, after: 400 },
          children: [
            new TextRun({
              text: 'We wish him/her every success in life.',
              size: 32,
              italics: true,
              font: 'Monotype Corsiva',
            }),
          ],
        }),

        // Footer signatures (simplified for DOCX)
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 600 },
          children: [
            new TextRun({
              text: '________________________          ________________________          ________________________',
              size: 24,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100 },
          children: [
            new TextRun({
              text: 'Provost                                           President/Secretary                              President/Secretary',
              bold: true,
              size: 24,
              italics: true,
              font: 'Monotype Corsiva',
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `${hallName} Hall                              `,
              size: 22,
              italics: true,
              font: 'Monotype Corsiva',
            }),
            new TextRun({
              text: 'Badhan                                            ',
              size: 22,
              italics: true,
              color: 'C00000',
              bold: true,
              font: 'Monotype Corsiva',
            }),
            new TextRun({
              text: 'Badhan',
              size: 22,
              italics: true,
              color: 'C00000',
              bold: true,
              font: 'Monotype Corsiva',
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `University Of Dhaka                    ${hallName}, DU Zone              Dhaka University Zone`,
              size: 22,
              italics: true,
              font: 'Monotype Corsiva',
            }),
          ],
        }),
      ],
    }],
  });

  const blob = await doc.toBlob();
  return blob;
}

// Helper to convert Document to Blob
declare module 'docx' {
  interface Document {
    toBlob(): Promise<Blob>;
  }
}

Document.prototype.toBlob = async function(): Promise<Blob> {
  const { Packer } = await import('docx');
  const buffer = await Packer.toBlob(this);
  return buffer;
};
