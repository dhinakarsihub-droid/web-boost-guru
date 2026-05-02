import { useMemo, useState } from "react";
import type { PageRow, NormalizedAudit } from "@/lib/seo-types";
import { scorePageForKeyword } from "@/lib/seo-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search, Check, X, AlertTriangle, Target } from "lucide-react";

type SortKey = "url" | "score" | "titleStatus" | "h1Status" | "relevance";
type FilterKey = "all" | "issues" | "ok" | "keyword";

const StatusBadge = ({ status, kind }: { status: string; kind: "title" | "h1" }) => {
  const ok = status === "ok";
  const missing = status === "missing";
  const Icon = ok ? Check : missing ? X : AlertTriangle;
  const cls = ok
    ? "bg-success/10 text-success ring-success/20"
    : missing
    ? "bg-critical/10 text-critical ring-critical/20"
    : "bg-warning/10 text-warning ring-warning/20";
  const label = ok ? "OK" : status.replace("-", " ");
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ring-1 capitalize ${cls}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
};

const ScoreBar = ({ score }: { score: number }) => {
  const color = score >= 80 ? "bg-success" : score >= 50 ? "bg-warning" : "bg-destructive";
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className="font-mono text-xs tabular-nums w-8 text-right">{score}</span>
    </div>
  );
};

export const PagesTable = ({ audit }: { audit: NormalizedAudit }) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "issues" | "ok">("all");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const rows = useMemo(() => {
    let r = audit.pages.filter((p) => p.url.toLowerCase().includes(query.toLowerCase()));
    if (filter === "issues") r = r.filter((p) => p.titleStatus !== "ok" || p.h1Status !== "ok" || p.score < 70);
    if (filter === "ok") r = r.filter((p) => p.titleStatus === "ok" && p.h1Status === "ok" && p.score >= 70);
    r = [...r].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      const cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return r;
  }, [audit.pages, query, filter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir(key === "score" ? "asc" : "asc"); }
  };

  const SortBtn = ({ k, children }: { k: SortKey; children: React.ReactNode }) => (
    <button
      onClick={() => toggleSort(k)}
      className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
    >
      {children}
      <ArrowUpDown className={`h-3 w-3 ${sortKey === k ? "text-primary" : "text-muted-foreground/50"}`} />
    </button>
  );

  if (audit.pages.length === 0) return null;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold">Page-Level Analysis</h2>
        <p className="text-sm text-muted-foreground mt-1">Per-URL breakdown of titles, headings, and SEO score</p>
      </div>

      <div className="rounded-2xl border bg-card shadow-card overflow-hidden">
        <div className="flex flex-col md:flex-row gap-3 p-4 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter URLs…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <div className="flex gap-1 p-1 rounded-lg bg-muted">
            {(["all", "issues", "ok"] as const).map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "default" : "ghost"}
                onClick={() => setFilter(f)}
                className={`h-7 px-3 text-xs capitalize ${filter === f ? "" : "hover:bg-background"}`}
              >
                {f === "ok" ? "Healthy" : f}
              </Button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
                <th className="px-4 py-3 font-semibold"><SortBtn k="url">URL</SortBtn></th>
                <th className="px-4 py-3 font-semibold"><SortBtn k="titleStatus">Title</SortBtn></th>
                <th className="px-4 py-3 font-semibold"><SortBtn k="h1Status">H1</SortBtn></th>
                <th className="px-4 py-3 font-semibold"><SortBtn k="score">Score</SortBtn></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr key={`${p.url}-${i}`} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs max-w-[280px] truncate">{p.url}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.titleStatus} kind="title" /></td>
                  <td className="px-4 py-3"><StatusBadge status={p.h1Status} kind="h1" /></td>
                  <td className="px-4 py-3"><ScoreBar score={p.score} /></td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No pages match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
