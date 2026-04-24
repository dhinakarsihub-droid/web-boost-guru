import type { NormalizedAudit } from "@/lib/seo-types";
import { Sparkles, Zap, Target, ChevronRight } from "lucide-react";

export const Insights = ({ audit }: { audit: NormalizedAudit }) => {
  const { insights } = audit;
  const hasContent = insights.summary || insights.quickWins.length || insights.strategic.length;
  if (!hasContent) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-bold">AI Insights</h2>
      </div>

      {insights.summary && (
        <div className="rounded-2xl border bg-gradient-hero p-6 md:p-8 shadow-card">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Executive Summary</p>
          <p className="text-base md:text-lg leading-relaxed">{insights.summary}</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {insights.quickWins.length > 0 && (
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                <Zap className="h-4 w-4 text-success" />
              </div>
              <h3 className="font-display font-bold">Quick Wins</h3>
            </div>
            <ul className="space-y-3">
              {insights.quickWins.map((w, i) => (
                <li key={i} className="flex gap-2.5 text-sm">
                  <ChevronRight className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {insights.strategic.length > 0 && (
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-display font-bold">Strategic Improvements</h3>
            </div>
            <ul className="space-y-3">
              {insights.strategic.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-sm">
                  <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
