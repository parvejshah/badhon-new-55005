import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export type ExportFormat = 'pdf' | 'html' | 'docx';

interface ExportFormatSelectorProps {
  value: ExportFormat;
  onChange: (value: ExportFormat) => void;
}

export const ExportFormatSelector = ({ value, onChange }: ExportFormatSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Export Format</Label>
      <RadioGroup value={value} onValueChange={(v) => onChange(v as ExportFormat)}>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
            <RadioGroupItem value="pdf" id="format-pdf" className="mt-0.5" />
            <div className="flex-1">
              <Label htmlFor="format-pdf" className="cursor-pointer font-medium">
                PDF (Recommended)
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                High-quality PDF files with perfect typography. Best for printing and archiving.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
            <RadioGroupItem value="html" id="format-html" className="mt-0.5" />
            <div className="flex-1">
              <Label htmlFor="format-html" className="cursor-pointer font-medium">
                HTML Files
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Standalone HTML files with embedded assets. Perfect design fidelity, can be opened in any browser.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
            <RadioGroupItem value="docx" id="format-docx" className="mt-0.5" />
            <div className="flex-1">
              <Label htmlFor="format-docx" className="cursor-pointer font-medium">
                Word Documents (.docx)
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Editable Word documents. All text remains editable while maintaining layout structure.
              </p>
            </div>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};
