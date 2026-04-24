import type { NormalizedAudit } from "@/lib/seo-types";
import { Target, Check, Minus, Trophy } from "lucide-react";

const Dot = ({ on, label }: { on: boolean; label: string }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ${
      on
        ? "bg-success/10 text-success ring-success/20"
        : "bg-muted text-muted-foreground ring-border"
    }`}
  >
    {on ? <Check className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
    {label}
  </span>
);

const RelevanceBar = ({ score }: { score: number }) => {
  const color =
    score >= 70 ? "bg-success" : score >= 40 ? "bg-warning" : "bg-muted-foreground/40";
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className="font-mono text-xs tabular-nums w-8 text-right">{score}</span>
    </div>
  );
};

export const KeywordMatches = ({ audit }: { audit: NormalizedAudit }) => {
  if (!audit.keyword || !audit.keywordMatches?.length) return null;

  const matches = audit.keywordMatches;
  const top = matches.slice(0, 8);
  const best = matches[0];
  const covered = matches.filter((m) => m.score >= 40).length;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-bold">Keyword Relevance</h2>
        <span className="ml-1 inline-flex items-center rounded-full bg-accent text-accent-foreground px-2.5 py-0.5 text-xs font-mono">
          {audit.keyword}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <Trophy className="h-3.5 w-3.5 text-primary" /> Best match
          </div>
          <p className="mt-2 font-mono text-sm truncate">{best.url}</p>
          <p className="mt-3 text-3xl font-display font-bold text-gradient">{best.score}</p>
          <p className="text-xs text-muted-foreground">relevance score</p>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Pages covering keyword</div>
          <p className="mt-2 text-3xl font-display font-bold">{covered}<span className="text-base text-muted-foreground"> / {matches.length}</span></p>
          <p className="text-xs text-muted-foreground mt-1">Score ≥ 40 indicates meaningful coverage.</p>
        </div>
        <div className="rounded-2xl border bg-gradient-hero p-5 shadow-card">
          <div className="text-xs uppercase tracking-widest text-primary font-semibold">Tip</div>
          <p className="mt-2 text-sm leading-relaxed">
            Prioritize pages with strong relevance but a low SEO score — they're closest to ranking with the smallest effort.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
                <th className="px-4 py-3 font-semibold">URL</th>
                <th className="px-4 py-3 font-semibold">Signals</th>
                <th className="px-4 py-3 font-semibold">Body hits</th>
                <th className="px-4 py-3 font-semibold">Relevance</th>
              </tr>
            </thead>
            <tbody>
              {top.map((m, i) => (
                <tr key={`${m.url}-${i}`} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs max-w-[280px] truncate">{m.url}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Dot on={m.inTitle} label="Title" />
                      <Dot on={m.inH1} label="H1" />
                      <Dot on={m.inDescription} label="Meta" />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs tabular-nums">{m.bodyHits}</td>
                  <td className="px-4 py-3"><RelevanceBar score={m.score} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
