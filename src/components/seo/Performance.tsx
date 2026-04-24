import type { NormalizedAudit } from "@/lib/seo-types";
import { Smartphone, Monitor } from "lucide-react";

const Gauge = ({ score, label, Icon }: { score: number; label: string; Icon: any }) => {
  const clamped = Math.max(0, Math.min(100, score));
  const colorClass = clamped >= 90 ? "text-success" : clamped >= 50 ? "text-warning" : "text-destructive";
  const bgClass = clamped >= 90 ? "bg-success" : clamped >= 50 ? "bg-warning" : "bg-destructive";
  const verdict = clamped >= 90 ? "Excellent" : clamped >= 50 ? "Needs work" : "Poor";
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
            <Icon className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <p className="font-semibold">{label}</p>
            <p className="text-xs text-muted-foreground">PageSpeed score</p>
          </div>
        </div>
        <span className={`text-xs font-semibold ${colorClass}`}>{verdict}</span>
      </div>
      <div className="flex items-end gap-3 mb-4">
        <span className={`font-display text-5xl font-bold tabular-nums ${colorClass}`}>{clamped}</span>
        <span className="text-sm text-muted-foreground mb-2">/ 100</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${bgClass} transition-all duration-1000 ease-out`} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
};

export const Performance = ({ audit }: { audit: NormalizedAudit }) => {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold">Performance</h2>
        <p className="text-sm text-muted-foreground mt-1">Core Web Vitals and PageSpeed scores</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Gauge score={audit.performance.mobile} label="Mobile" Icon={Smartphone} />
        <Gauge score={audit.performance.desktop} label="Desktop" Icon={Monitor} />
      </div>
    </section>
  );
};
