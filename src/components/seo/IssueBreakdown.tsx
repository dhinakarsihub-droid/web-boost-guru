import type { NormalizedAudit } from "@/lib/seo-types";
import { AlertOctagon, AlertTriangle, AlertCircle, Info } from "lucide-react";

const items = [
  { key: "critical" as const, label: "Critical", Icon: AlertOctagon, color: "critical", bg: "bg-critical/10", text: "text-critical", ring: "ring-critical/20" },
  { key: "high" as const, label: "High Priority", Icon: AlertTriangle, color: "high", bg: "bg-high/10", text: "text-high", ring: "ring-high/20" },
  { key: "medium" as const, label: "Medium", Icon: AlertCircle, color: "medium", bg: "bg-medium/10", text: "text-medium", ring: "ring-medium/20" },
  { key: "low" as const, label: "Low", Icon: Info, color: "low", bg: "bg-low/10", text: "text-low", ring: "ring-low/20" },
];

export const IssueBreakdown = ({ audit }: { audit: NormalizedAudit }) => {
  const total = audit.issues.critical + audit.issues.high + audit.issues.medium + audit.issues.low;
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">Issue Breakdown</h2>
          <p className="text-sm text-muted-foreground mt-1">{total} total issues found across your site</p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map(({ key, label, Icon, bg, text, ring }, i) => (
          <div
            key={key}
            className={`rounded-2xl border bg-card p-5 shadow-card hover:shadow-elegant transition-shadow animate-slide-up`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg} ring-1 ${ring}`}>
              <Icon className={`h-5 w-5 ${text}`} />
            </div>
            <p className="mt-4 font-display text-3xl font-bold tabular-nums">{audit.issues[key]}</p>
            <p className="text-sm text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
