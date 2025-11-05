import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DonorData } from './DataPreview';

interface SheetAnalysisProps {
  sheetData: DonorData[];
  sheetName: string;
  hallName: string;
}

export function SheetAnalysis({ sheetData, sheetName, hallName }: SheetAnalysisProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError(null);
    
    try {
      const { data, error: functionError } = await supabase.functions.invoke('analyze-sheet', {
        body: { sheetData, sheetName, hallName }
      });

      if (functionError) {
        throw functionError;
      }

      if (data?.error) {
        setError(data.error);
        toast.error(data.error);
        return;
      }

      setAnalysis(data.analysis);
      toast.success('Analysis complete!');
    } catch (err) {
      console.error('Analysis error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze sheet';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          AI Sheet Analysis
        </CardTitle>
        <CardDescription>
          Get AI-powered insights about missing fields and data quality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleAnalyze}
          disabled={analyzing || sheetData.length === 0}
          className="w-full"
        >
          {analyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze Sheet
            </>
          )}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {analysis && (
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm text-foreground mb-2">Analysis Results</h3>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {analysis}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
