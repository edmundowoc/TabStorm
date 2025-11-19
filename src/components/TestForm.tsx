import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { TestResult } from "@/pages/Index";

interface TestFormProps {
  isRunning: boolean;
  setIsRunning: (value: boolean) => void;
  setResult: (value: TestResult | null) => void;
  setError: (value: string | null) => void;
}

export function TestForm({ isRunning, setIsRunning, setResult, setError }: TestFormProps) {
  const [url, setUrl] = useState("");
  const [count, setCount] = useState(5);
  const [proxyType, setProxyType] = useState("none");
  const [proxyHost, setProxyHost] = useState("");
  const [proxyPort, setProxyPort] = useState("");
  const [proxyUsername, setProxyUsername] = useState("");
  const [proxyPassword, setProxyPassword] = useState("");
  const [ownerConfirmed, setOwnerConfirmed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ownerConfirmed) {
      toast({
        title: "Błąd",
        description: "Musisz potwierdzić, że jesteś właścicielem testowanej strony",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setResult(null);
    setError(null);

    try {
      const payload = {
        url,
        count,
        proxy_type: proxyType,
        proxy_host: proxyHost || null,
        proxy_port: proxyPort || null,
        proxy_username: proxyUsername || null,
        proxy_password: proxyPassword || null,
        owner_confirmed: ownerConfirmed,
      };

      const response = await fetch("http://localhost:8000/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Błąd serwera");
      }

      const data = await response.json();
      setResult(data);
      
      toast({
        title: "Test zakończony",
        description: `Wykonano ${data.success_count} wejść z ${data.error_count} błędami`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Nieznany błąd";
      setError(errorMessage);
      
      toast({
        title: "Błąd",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play size={20} className="text-primary" />
          Konfiguracja testu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="url">URL strony *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={isRunning}
            />
          </div>

          <div>
            <Label htmlFor="count">Liczba otwarć *</Label>
            <Input
              id="count"
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              required
              disabled={isRunning}
            />
          </div>

          <div>
            <Label htmlFor="proxyType">Typ proxy</Label>
            <Select value={proxyType} onValueChange={setProxyType} disabled={isRunning}>
              <SelectTrigger id="proxyType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Brak proxy</SelectItem>
                <SelectItem value="http">HTTP</SelectItem>
                <SelectItem value="socks5">SOCKS5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {proxyType !== "none" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="proxyHost">Host</Label>
                  <Input
                    id="proxyHost"
                    placeholder="proxy.example.com"
                    value={proxyHost}
                    onChange={(e) => setProxyHost(e.target.value)}
                    disabled={isRunning}
                  />
                </div>
                <div>
                  <Label htmlFor="proxyPort">Port</Label>
                  <Input
                    id="proxyPort"
                    placeholder="8080"
                    value={proxyPort}
                    onChange={(e) => setProxyPort(e.target.value)}
                    disabled={isRunning}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="proxyUsername">Login (opcjonalnie)</Label>
                <Input
                  id="proxyUsername"
                  placeholder="username"
                  value={proxyUsername}
                  onChange={(e) => setProxyUsername(e.target.value)}
                  disabled={isRunning}
                />
              </div>

              <div>
                <Label htmlFor="proxyPassword">Hasło (opcjonalnie)</Label>
                <Input
                  id="proxyPassword"
                  type="password"
                  placeholder="••••••••"
                  value={proxyPassword}
                  onChange={(e) => setProxyPassword(e.target.value)}
                  disabled={isRunning}
                />
              </div>
            </>
          )}

          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="owner"
                checked={ownerConfirmed}
                onCheckedChange={(checked) => setOwnerConfirmed(checked === true)}
                disabled={isRunning}
                className="mt-0.5"
              />
              <div>
                <Label
                  htmlFor="owner"
                  className="text-sm font-semibold text-warning cursor-pointer flex items-center gap-2"
                >
                  <AlertTriangle size={16} />
                  Potwierdzenie właściciela *
                </Label>
                <p className="text-xs text-foreground/80 mt-1">
                  Potwierdzam, że jestem właścicielem testowanej strony i mam prawo do przeprowadzenia tego testu
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isRunning || !ownerConfirmed}
            size="lg"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Test w toku...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Uruchom test
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
