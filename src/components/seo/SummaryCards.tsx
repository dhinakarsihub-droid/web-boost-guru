import type { NormalizedAudit } from "@/lib/seo-types";
import { FileText, Activity } from "lucide-react";

interface Props {
  audit: NormalizedAudit;
}

const healthMeta = {
  good: { label: "Good", color: "text-success", dot: "bg-success", desc: "Your site is performing well" },
  "needs-improvement": { label: "Needs Improvement", color: "text-warning", dot: "bg-warning", desc: "Several fixes will lift your score" },
  critical: { label: "Critical", color: "text-destructive", dot: "bg-destructive", desc: "Urgent issues need your attention" },
};

const ScoreRing = ({ score }: { score: number }) => {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const colorClass = clamped >= 80 ? "text-success" : clamped >= 50 ? "text-warning" : "text-destructive";
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={radius} className="stroke-muted fill-none" strokeWidth="10" />
        <circle
          cx="64" cy="64" r={radius}
          className={`fill-none ${colorClass} transition-all duration-1000 ease-out`}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-bold tabular-nums">{clamped}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">/ 100</span>
      </div>
    </div>
  );
};

export const SummaryCards = ({ audit }: Props) => {
  const health = healthMeta[audit.health];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-1 rounded-2xl border bg-card p-6 shadow-card animate-slide-up">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Overall SEO Score</p>
            <p className="text-sm text-muted-foreground mt-1">Weighted across all signals</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-2">
          <ScoreRing score={audit.overallScore} />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-card animate-slide-up" style={{ animationDelay: "0.05s" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
            <FileText className="h-5 w-5 text-accent-foreground" />
          </div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Pages Analyzed</p>
        </div>
        <p className="font-display text-5xl font-bold tabular-nums">{audit.totalPages}</p>
        <p className="text-sm text-muted-foreground mt-2">URLs crawled and inspected</p>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
            <Activity className="h-5 w-5 text-accent-foreground" />
          </div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Health Status</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${health.dot} animate-pulse`} />
          <p className={`font-display text-2xl font-bold ${health.color}`}>{health.label}</p>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{health.desc}</p>
      </div>
    </div>
  );
};
