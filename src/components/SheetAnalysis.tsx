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
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          AI-Powered Sheet Analysis
        </CardTitle>
        <CardDescription className="text-base">
          Get intelligent insights about missing fields, data quality, and sheet statistics powered by AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <Button
          onClick={handleAnalyze}
          disabled={analyzing || sheetData.length === 0}
          className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
          size="lg"
        >
          {analyzing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Analyze Sheet with AI
            </>
          )}
        </Button>

        {error && (
          <Alert variant="destructive" className="border-2">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {analysis && (
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border-2 border-primary/20 shadow-inner space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <h3 className="font-bold text-base text-foreground">AI Analysis Results</h3>
            </div>
            <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed bg-background/50 rounded-lg p-4 border border-primary/10">
              {analysis}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
