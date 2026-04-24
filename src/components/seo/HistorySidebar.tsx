import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { History, Trash2, ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  type AuditHistoryEntry,
  type NormalizedAudit,
  clearHistory,
  deleteHistoryEntry,
  loadHistory,
} from "@/lib/seo-types";

interface Props {
  /** bumped by the parent every time a new audit completes so the list refreshes */
  refreshKey?: number;
  onOpen: (audit: NormalizedAudit) => void;
}

const healthClass = (h: NormalizedAudit["health"]) =>
  h === "good"
    ? "bg-success/10 text-success ring-success/20"
    : h === "needs-improvement"
    ? "bg-warning/10 text-warning ring-warning/20"
    : "bg-critical/10 text-critical ring-critical/20";

const formatDate = (ts: number) => {
  const d = new Date(ts);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return isToday ? `Today · ${time}` : `${d.toLocaleDateString()} · ${time}`;
};

const Delta = ({ current, previous }: { current: number; previous?: number }) => {
  if (previous === undefined) return null;
  const diff = current - previous;
  if (diff === 0)
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Minus className="h-3 w-3" /> 0
      </span>
    );
  const up = diff > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold ${
        up ? "text-success" : "text-destructive"
      }`}
    >
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {up ? "+" : ""}
      {diff}
    </span>
  );
};

export const HistorySidebar = ({ refreshKey, onOpen }: Props) => {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<AuditHistoryEntry[]>([]);

  useEffect(() => {
    setEntries(loadHistory());
  }, [refreshKey, open]);

  const remove = (id: string) => setEntries(deleteHistoryEntry(id));
  const wipe = () => {
    clearHistory();
    setEntries([]);
  };

  const handleOpen = (e: AuditHistoryEntry) => {
    onOpen(e.audit);
    setOpen(false);
  };

  // Group by URL so we can compute previous score for delta on the latest entry per URL.
  const previousByUrl = new Map<string, number>();
  // entries are newest-first; walking forward, the *next* same-url is "previous".
  const prevLookup = new Map<string, number | undefined>();
  entries.forEach((e, i) => {
    const prior = entries.slice(i + 1).find((p) => p.url === e.url);
    prevLookup.set(e.id, prior?.overallScore);
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">History</span>
          {entries.length > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
              {entries.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Audit history
          </SheetTitle>
          <SheetDescription>
            Revisit any previous run and compare scores over time. Stored locally in your browser.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 mt-4 space-y-2">
          {entries.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
                <History className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mt-4 font-display font-semibold">No audits yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Run your first audit to start building a history.
              </p>
            </div>
          ) : (
            entries.map((e) => (
              <div
                key={e.id}
                className="group rounded-xl border bg-card p-4 shadow-card hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs truncate">{e.url}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {formatDate(e.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(e.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1"
                    aria-label="Delete entry"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-display font-bold">{e.overallScore}</span>
                      <span className="text-[10px] text-muted-foreground">/100</span>
                    </div>
                    <Delta current={e.overallScore} previous={prevLookup.get(e.id)} />
                  </div>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 capitalize ${healthClass(
                      e.health,
                    )}`}
                  >
                    {e.health.replace("-", " ")}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{e.totalPages} pages{e.keyword ? ` · "${e.keyword}"` : ""}</span>
                  <button
                    onClick={() => handleOpen(e)}
                    className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
                  >
                    Open <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {entries.length > 0 && (
          <div className="pt-3 border-t mt-3">
            <Button
              onClick={wipe}
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Clear all history
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
