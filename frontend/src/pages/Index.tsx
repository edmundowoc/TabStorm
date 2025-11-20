import { useState } from "react";
import { TestForm } from "@/components/TestForm";
import { ResultsPanel } from "@/components/ResultsPanel";
import { AlertCircle } from "lucide-react";

export interface TestResult {
  success_count: number;
  error_count: number;
  proxy_used: boolean;
  execution_time: number;
}

const Index = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Playwright Traffic Tester
          </h1>
          <p className="text-muted-foreground">
            Narzędzie do testowania wejść na stronę z użyciem prawdziwej przeglądarki
          </p>
        </header>

        <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="text-warning mt-0.5 flex-shrink-0" size={20} />
          <div className="text-sm">
            <p className="font-semibold text-warning mb-1">Ważne!</p>
            <p className="text-foreground/80">
              Backend FastAPI musi być uruchomiony lokalnie. Zobacz README.md w repozytorium.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TestForm
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            setResult={setResult}
            setError={setError}
          />
          <ResultsPanel result={result} error={error} isRunning={isRunning} />
        </div>
      </div>
    </div>
  );
};

export default Index;
