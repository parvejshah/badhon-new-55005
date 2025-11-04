import { useCallback, useState } from 'react';
import { Upload, Sparkles, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  fileName?: string;
  fileSize?: number;
}

export function UploadDropzone({ onFileSelect, fileName, fileSize }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.csv'))) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      className={cn(
        "relative border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer overflow-hidden",
        "hover:border-primary hover:bg-primary/5",
        isDragging && "border-primary bg-primary/5 scale-105",
        fileName ? "border-primary bg-primary/5" : "border-border"
      )}
    >
      {/* Animated circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-4 w-12 h-12 border-2 border-primary/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-primary/30 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-primary/10 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '0.5s' }} />
      </div>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".xlsx,.csv"
        onChange={handleFileInput}
      />
      <label htmlFor="file-upload" className="cursor-pointer relative z-10">
        {fileName ? (
          <div className="flex flex-col items-center gap-3">
            <FileSpreadsheet className="h-12 w-12 text-primary" />
            <div>
              <p className="text-lg font-medium text-foreground mb-1">{fileName}</p>
              <p className="text-sm text-muted-foreground">
                {(fileSize! / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="relative inline-block mb-4">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <Sparkles className="h-5 w-5 text-primary absolute -top-1 -right-1 animate-pulse" />
            </div>
            <p className="text-lg font-medium text-foreground mb-2 flex items-center gap-2 justify-center">
              <FileSpreadsheet className="h-5 w-5" />
              Drop your Excel file here
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              or click to browse (.xlsx, .csv)
            </p>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs font-medium text-foreground mb-2">Required Columns:</p>
              <p className="text-xs text-muted-foreground">
                Serial No, Donor Name, Father Name, Mother Name, Department, Blood Group
              </p>
            </div>
          </>
        )}
      </label>
    </div>
  );
}
