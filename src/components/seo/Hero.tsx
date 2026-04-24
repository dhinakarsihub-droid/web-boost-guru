import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Search, ArrowRight, Zap, ShieldCheck, LineChart } from "lucide-react";

interface Props {
  onSubmit: (url: string, keyword?: string) => void;
}

const normalizeUrl = (raw: string): string | null => {
  let v = raw.trim();
  if (!v) return null;
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  try {
    const u = new URL(v);
    if (!u.hostname.includes(".")) return null;
    return u.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
};

export const Hero = ({ onSubmit }: Props) => {
  const [url, setUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeUrl(url);
    if (!normalized) {
      setError("Please enter a valid website URL (e.g. example.com)");
      return;
    }
    setError(null);
    onSubmit(normalized, keyword.trim() || undefined);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
      <div className="container relative py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Powered by AI · Real-time analysis
          </div>

          <h1 className="mt-6 font-display text-4xl md:text-6xl font-bold tracking-tight animate-slide-up">
            Find every SEO issue.
            <br />
            <span className="text-gradient">Fix what actually matters.</span>
          </h1>

          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Get a complete technical and content audit with AI-prioritized recommendations in under 60 seconds.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 mx-auto max-w-2xl animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="rounded-2xl border bg-card shadow-elegant p-2 md:p-2.5">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); if (error) setError(null); }}
                    placeholder="yourwebsite.com"
                    className="h-12 pl-11 border-0 bg-transparent text-base focus-visible:ring-0 shadow-none"
                    autoFocus
                    aria-invalid={!!error}
                  />
                </div>
                <Button type="submit" size="lg" className="h-12 px-6 gap-2 bg-gradient-primary hover:opacity-95 shadow-glow border-0">
                  Run SEO Audit
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 px-2">
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Target keyword (optional) — for future competitor analysis"
                  className="h-10 border-0 bg-transparent text-sm text-muted-foreground focus-visible:ring-0 shadow-none placeholder:text-muted-foreground/70"
                />
              </div>
            </div>
            {error && (
              <p className="mt-3 text-sm text-destructive animate-fade-in" role="alert">
                {error}
              </p>
            )}
          </form>

          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <span className="inline-flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> 60-second audits</span>
            <span className="inline-flex items-center gap-2"><LineChart className="h-4 w-4 text-primary" /> Core Web Vitals</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> No signup required</span>
          </div>
        </div>
      </div>
    </section>
  );
};
