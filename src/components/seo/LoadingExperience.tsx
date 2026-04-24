import { useEffect, useState } from "react";
import { Check, Loader2, Globe, FileSearch, Sparkles } from "lucide-react";

const STEPS = [
  { icon: Globe, label: "Fetching site data", detail: "Crawling URLs and collecting metadata" },
  { icon: FileSearch, label: "Analyzing pages", detail: "Inspecting titles, headings, links and performance" },
  { icon: Sparkles, label: "Generating insights", detail: "AI is prioritizing fixes by impact" },
];

interface Props {
  url: string;
}

export const LoadingExperience = ({ url }: Props) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      // Asymptotic progress that never quite reaches 100% until response arrives
      const target = Math.min(95, 100 * (1 - Math.exp(-elapsed / 18000)));
      setProgress(target);
      if (target > 30 && step < 1) setStep(1);
      if (target > 65 && step < 2) setStep(2);
    }, 120);
    return () => clearInterval(id);
  }, [step]);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
      <div className="container relative max-w-xl py-16">
        <div className="text-center mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow animate-pulse-glow mb-6">
            <Loader2 className="h-7 w-7 text-primary-foreground animate-spin" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold">Auditing your site</h2>
          <p className="mt-2 text-sm text-muted-foreground truncate font-mono">{url}</p>
        </div>

        <div className="rounded-2xl border bg-card shadow-elegant p-6 md:p-8">
          <div className="space-y-1">
            {STEPS.map((s, i) => {
              const isDone = i < step;
              const isActive = i === step;
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className={`flex items-start gap-4 rounded-xl p-3 transition-all duration-500 ${
                    isActive ? "bg-accent" : ""
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all ${
                      isDone
                        ? "bg-success text-success-foreground"
                        : isActive
                        ? "bg-gradient-primary text-primary-foreground shadow-glow"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isDone ? (
                      <Check className="h-5 w-5" />
                    ) : isActive ? (
                      <Icon className="h-5 w-5 animate-pulse" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className={`font-medium ${isActive || isDone ? "" : "text-muted-foreground"}`}>{s.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between text-xs font-medium mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-mono tabular-nums">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-primary transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
