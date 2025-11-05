import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSheets, Sheet } from '@/hooks/useSheets';
import { UploadDropzone } from '@/components/UploadDropzone';
import { DonorData } from '@/components/DataPreview';
import { EditableDataTable } from '@/components/EditableDataTable';
import { HallNameInput } from '@/components/HallNameInput';
import { GenerateButton } from '@/components/GenerateButton';
import { DownloadButton } from '@/components/DownloadButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { ExportFormatSelector, ExportFormat } from '@/components/ExportFormatSelector';
import { parseExcelFile } from '@/lib/excelParser';
import { generateCertificates } from '@/lib/certificateGenerator';
import { toast } from '@/hooks/use-toast';
import { Home, Droplet, FileText, Users, Sparkles, Eye, Trash2, Pencil, Loader2, Plus, Calendar, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateSheetDialog } from '@/components/CreateSheetDialog';
import { EditSheetDialog } from '@/components/EditSheetDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import headerBg from '@/assets/header-bg.jpg';

export default function Dashboard() {
  const navigate = useNavigate();
  const { saveSheet, fetchSheets, deleteSheet, createEmptySheet, updateSheet, loading } = useSheets();
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<DonorData[]>([]);
  const [hallName, setHallName] = useState('Amar Ekushay Hall');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editSheet, setEditSheet] = useState<Sheet | null>(null);

  useEffect(() => {
    loadSheets();
  }, []);

  const loadSheets = async () => {
    const data = await fetchSheets();
    setSheets(data);
  };

  const handleDelete = async () => {
    if (deleteId) {
      const success = await deleteSheet(deleteId);
      if (success) {
        await loadSheets();
      }
      setDeleteId(null);
    }
  };

  const handleCreate = async (sheetName: string, hallName: string) => {
    const sheetId = await createEmptySheet(sheetName, hallName);
    if (sheetId) {
      await loadSheets();
      navigate(`/sheet/${sheetId}`);
    }
  };

  const handleEditSave = async (sheetName: string, hallName: string) => {
    if (editSheet) {
      const success = await updateSheet(editSheet.id, sheetName, hallName);
      if (success) {
        await loadSheets();
      }
      setEditSheet(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleFileSelect = async (selectedFile: File) => {
    try {
      setFile(selectedFile);
      const parsedData = await parseExcelFile(selectedFile);
      setData(parsedData);
      setZipBlob(null);
      toast({
        title: 'File uploaded successfully',
        description: `${parsedData.length} donor records found`,
      });
    } catch (error) {
      toast({
        title: 'Error parsing file',
        description: 'Please ensure the file has the correct format',
        variant: 'destructive',
      });
    }
  };

  const handleGenerate = async () => {
    if (data.length === 0) return;

    setIsGenerating(true);
    setProgress({ current: 0, total: data.length });

    try {
      const blob = await generateCertificates(data, hallName, exportFormat, (current, total) => {
        setProgress({ current, total });
      });

      setZipBlob(blob);
      const formatLabel = exportFormat === 'pdf' ? 'PDFs' : exportFormat === 'html' ? 'HTML files' : 'Word documents';
      toast({
        title: 'Certificates generated!',
        description: `Your ${formatLabel} are ready for download`,
      });
    } catch (error) {
      toast({
        title: 'Generation failed',
        description: 'An error occurred while generating certificates',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!zipBlob) return;

    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    const formatExt = exportFormat.toUpperCase();
    link.download = `Badhon_Certificates_${formatExt}_${new Date().toISOString().split('T')[0]}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-white flex items-center gap-3">
                <FileText className="h-8 w-8" />
                Certificate Generator
              </h1>
              <p className="text-white/90 mt-1">Create certificates for blood donors</p>
            </div>
            <Button onClick={() => navigate('/')} size="lg" className="bg-white text-primary hover:bg-white/90">
              <Home className="mr-2 h-5 w-5" />
              Home
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-8">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="generate">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Certificates
            </TabsTrigger>
            <TabsTrigger value="manage">
              <FileText className="h-4 w-4 mr-2" />
              Manage Sheets
            </TabsTrigger>
          </TabsList>

          {/* Certificate Generation Tab */}
          <TabsContent value="generate" className="space-y-6 md:space-y-8">
            {/* Upload Section */}
            <section>
              <h2 className="text-lg md:text-xl font-heading font-semibold mb-3 md:mb-4 flex items-center gap-2">
                <Droplet className="h-6 w-6 text-primary" />
                1. Upload Donor Data
              </h2>
              <UploadDropzone
                onFileSelect={handleFileSelect}
                fileName={file?.name}
                fileSize={file?.size}
              />
            </section>

            {/* Preview Section */}
            {data.length > 0 && (
              <section>
                <h2 className="text-lg md:text-xl font-heading font-semibold mb-3 md:mb-4 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  2. Preview & Edit Data ({data.length} records)
                </h2>
                <div className="overflow-x-auto">
                  <EditableDataTable data={data} onUpdate={setData} />
                </div>
              </section>
            )}

            {/* Hall Name Input */}
            {data.length > 0 && (
              <section>
                <h2 className="text-lg md:text-xl font-heading font-semibold mb-3 md:mb-4 flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  3. Hall Name
                </h2>
                <HallNameInput value={hallName} onChange={setHallName} />
              </section>
            )}

            {/* Export Format Selection */}
            {data.length > 0 && (
              <section>
                <h2 className="text-lg md:text-xl font-heading font-semibold mb-3 md:mb-4 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  4. Choose Export Format
                </h2>
                <ExportFormatSelector value={exportFormat} onChange={setExportFormat} />
              </section>
            )}

            {/* Generate Section */}
            {data.length > 0 && (
              <section>
                <h2 className="text-lg md:text-xl font-heading font-semibold mb-3 md:mb-4 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  5. Generate Certificates
                </h2>
                <div className="space-y-4 md:space-y-6">
                  {isGenerating && (
                    <ProgressIndicator current={progress.current} total={progress.total} />
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <button
                      onClick={async () => {
                        if (!file) return;
                        const sheetName = file.name.replace(/\.[^/.]+$/, '');
                        const sheetId = await saveSheet(sheetName, hallName, data);
                        if (sheetId) {
                          navigate(`/sheet/${sheetId}`);
                        }
                      }}
                      disabled={data.length === 0 || !hallName || isGenerating}
                      className="flex-1 px-6 py-3 text-sm font-medium border border-primary text-primary hover:bg-primary/5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Save to Database
                    </button>
                    <GenerateButton
                      onClick={handleGenerate}
                      disabled={data.length === 0 || !hallName}
                      loading={isGenerating}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Download Section */}
            {zipBlob && !isGenerating && (
              <section className="pt-2 md:pt-4">
                <DownloadButton onClick={handleDownload} certificateCount={data.length} />
              </section>
            )}
          </TabsContent>

          {/* Sheet Management Tab */}
          <TabsContent value="manage">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-heading font-bold">Saved Sheets</h2>
                <p className="text-muted-foreground">View, edit, and generate certificates from your saved donor data</p>
              </div>
              <Button onClick={() => setCreateDialogOpen(true)} size="lg">
                <Plus className="mr-2 h-5 w-5" />
                New Sheet
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                {loading && sheets.length === 0 ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : sheets.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No sheets saved yet</p>
                    <Button onClick={() => setCreateDialogOpen(true)}>Create Your First Sheet</Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Sheet Name
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Hall Name
                          </div>
                        </TableHead>
                        <TableHead>Records</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Created
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sheets.map((sheet) => (
                        <TableRow key={sheet.id}>
                          <TableCell className="font-medium">{sheet.sheet_name}</TableCell>
                          <TableCell>{sheet.hall_name || 'N/A'}</TableCell>
                          <TableCell>{sheet.total_rows}</TableCell>
                          <TableCell>{formatDate(sheet.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/sheet/${sheet.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditSheet(sheet)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setDeleteId(sheet.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <CreateSheetDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={handleCreate}
      />

      <EditSheetDialog
        open={!!editSheet}
        onOpenChange={(open) => !open && setEditSheet(null)}
        onSave={handleEditSave}
        initialSheetName={editSheet?.sheet_name || ''}
        initialHallName={editSheet?.hall_name || ''}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the sheet and all
              associated donor records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
