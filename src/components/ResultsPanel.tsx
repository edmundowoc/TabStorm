import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, Wifi, Loader2, BarChart3 } from "lucide-react";
import type { TestResult } from "@/pages/Index";

interface ResultsPanelProps {
  result: TestResult | null;
  error: string | null;
  isRunning: boolean;
}

export function ResultsPanel({ result, error, isRunning }: ResultsPanelProps) {
  if (isRunning) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={20} className="text-primary" />
            Wyniki
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-foreground/80">Test w toku...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Przeglądarka wykonuje wejścia na stronę
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <XCircle size={20} />
            Błąd
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80">{error}</p>
          <p className="text-sm text-muted-foreground mt-3">
            Upewnij się, że backend FastAPI jest uruchomiony na localhost:8000
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={20} className="text-primary" />
            Wyniki
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <BarChart3 size={48} className="mb-4 opacity-50" />
          <p>Wyniki pojawią się tutaj po uruchomieniu testu</p>
        </CardContent>
      </Card>
    );
  }

  const successRate = result.success_count + result.error_count > 0
    ? (result.success_count / (result.success_count + result.error_count)) * 100
    : 0;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 size={20} className="text-primary" />
          Wyniki testu
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-success/10 border border-success/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="text-success" size={20} />
              <span className="text-sm font-medium text-success">Sukces</span>
            </div>
            <p className="text-3xl font-bold text-success">{result.success_count}</p>
            <p className="text-xs text-foreground/60 mt-1">
              {successRate.toFixed(1)}% skuteczności
            </p>
          </div>

          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="text-destructive" size={20} />
              <span className="text-sm font-medium text-destructive">Błędy</span>
            </div>
            <p className="text-3xl font-bold text-destructive">{result.error_count}</p>
            <p className="text-xs text-foreground/60 mt-1">
              nieudanych prób
            </p>
          </div>
        </div>

        <div className="bg-accent/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="text-primary" size={16} />
              <span className="text-foreground/80">Czas wykonania</span>
            </div>
            <span className="font-semibold">{result.execution_time.toFixed(2)}s</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Wifi className="text-primary" size={16} />
              <span className="text-foreground/80">Użyto proxy</span>
            </div>
            <span className="font-semibold">
              {result.proxy_used ? "Tak" : "Nie"}
            </span>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm">
          <p className="text-foreground/80">
            Wejścia zostały zarejestrowane w analityce strony (Google Analytics, Matomo, Cloudflare).
            Sprawdź statystyki za {new Date().toLocaleDateString('pl-PL')}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
