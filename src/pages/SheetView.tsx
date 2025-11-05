import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSheets } from '@/hooks/useSheets';
import { DonorData } from '@/components/DataPreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Loader2, Save, Pencil, FileText, Building, Sparkles, Users } from 'lucide-react';
import headerBg from '@/assets/header-bg.jpg';
import { ExportFormatSelector, ExportFormat } from '@/components/ExportFormatSelector';
import { generateCertificates } from '@/lib/certificateGenerator';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { EditableDataTable } from '@/components/EditableDataTable';
import { EditSheetDialog } from '@/components/EditSheetDialog';
import { SheetAnalysis } from '@/components/SheetAnalysis';
import { toast } from 'sonner';

export default function SheetView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchSheetWithData, updateSheetData, updateSheet, loading } = useSheets();
  const [sheetName, setSheetName] = useState('');
  const [hallName, setHallName] = useState('');
  const [donorData, setDonorData] = useState<DonorData[]>([]);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (id) {
      loadSheetData(id);
    }
  }, [id]);

  const loadSheetData = async (sheetId: string) => {
    const sheet = await fetchSheetWithData(sheetId);
    if (sheet) {
      setSheetName(sheet.sheet_name);
      setHallName(sheet.hall_name || '');
      setDonorData(sheet.sheet_data);
    }
  };

  const handleDataUpdate = (updatedData: DonorData[]) => {
    setDonorData(updatedData);
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    if (!id) return;
    const success = await updateSheetData(id, donorData);
    if (success) {
      setHasChanges(false);
    }
  };

  const handleEditSave = async (newSheetName: string, newHallName: string) => {
    if (!id) return;
    const success = await updateSheet(id, newSheetName, newHallName);
    if (success) {
      setSheetName(newSheetName);
      setHallName(newHallName);
      setEditDialogOpen(false);
    }
  };

  const handleGenerate = async () => {
    if (!hallName.trim()) {
      toast.error('Please enter a hall name');
      return;
    }

    setGenerating(true);
    setProgress({ current: 0, total: donorData.length });

    try {
      const zipBlob = await generateCertificates(
        donorData,
        hallName,
        exportFormat,
        (current, total) => setProgress({ current, total })
      );

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificates_${sheetName}_${exportFormat}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Certificates generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate certificates');
    } finally {
      setGenerating(false);
    }
  };

  if (loading && donorData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header with Background */}
      <header className="relative border-b overflow-hidden mb-8">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${headerBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        </div>
        <div className="relative container mx-auto px-4 py-8">
          <Button 
            variant="secondary" 
            onClick={() => navigate('/dashboard')}
            className="mb-4 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-8 w-8 text-white" />
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">{sheetName}</h1>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setEditDialogOpen(true)}
                  className="text-white hover:bg-white/20"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {hallName}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {donorData.length} records
                </div>
              </div>
            </div>
            {hasChanges && (
              <Button onClick={handleSaveChanges} size="lg" className="bg-white text-primary hover:bg-white/90">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-8 space-y-8">
        <SheetAnalysis 
          sheetData={donorData} 
          sheetName={sheetName} 
          hallName={hallName}
        />


        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Donor Data
            </CardTitle>
            <CardDescription>
              Edit donor records, add new entries, or remove existing ones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EditableDataTable data={donorData} onUpdate={handleDataUpdate} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Generate Certificates
            </CardTitle>
            <CardDescription>
              Select export format and generate certificates for all donors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Hall Name</label>
              <input
                type="text"
                value={hallName}
                onChange={(e) => setHallName(e.target.value)}
                placeholder="Enter hall name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <ExportFormatSelector value={exportFormat} onChange={setExportFormat} />

            {generating && (
              <ProgressIndicator current={progress.current} total={progress.total} />
            )}

            <Button
              onClick={handleGenerate}
              disabled={generating || !hallName.trim()}
              size="lg"
              className="w-full"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Generate & Download Certificates
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <EditSheetDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleEditSave}
        initialSheetName={sheetName}
        initialHallName={hallName}
      />
    </div>
  );
}
