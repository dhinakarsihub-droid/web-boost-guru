import { useState } from "react";
import { Header } from "@/components/seo/Header";
import { Hero } from "@/components/seo/Hero";
import { LoadingExperience } from "@/components/seo/LoadingExperience";
import { Dashboard } from "@/components/seo/Dashboard";
import { ErrorState } from "@/components/seo/ErrorState";
import { normalizeAudit, demoAudit, saveHistoryEntry, type NormalizedAudit } from "@/lib/seo-types";
import { toast } from "@/hooks/use-toast";

const WEBHOOK_URL = "https://dhina007.app.n8n.cloud/webhook/seo-audit-advanced";

type View =
  | { kind: "idle" }
  | { kind: "loading"; url: string }
  | { kind: "results"; audit: NormalizedAudit }
  | { kind: "error"; message: string; lastUrl: string };

const Index = () => {
  const [view, setView] = useState<View>({ kind: "idle" });
  const [historyKey, setHistoryKey] = useState(0);

  const showAudit = (audit: NormalizedAudit) => setView({ kind: "results", audit });

  const runAudit = async (url: string, keyword?: string) => {
    setView({ kind: "loading", url });
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120_000);

      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(keyword ? { url, keyword } : { url }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`The audit service returned ${res.status}.`);

      const text = await res.text();
      let data: unknown = null;
      try { data = text ? JSON.parse(text) : null; } catch { data = text; }

      const audit = normalizeAudit(data, url, keyword);
      const isEmpty =
        !audit.overallScore &&
        audit.pages.length === 0 &&
        audit.actions.length === 0 &&
        !audit.insights.summary;

      const finalAudit = isEmpty ? demoAudit(url, keyword) : audit;
      if (isEmpty) {
        toast({
          title: "Showing sample report",
          description: "The audit service didn't return structured data yet. Here's a sample of what your report will look like.",
        });
      }
      saveHistoryEntry(finalAudit);
      setHistoryKey((k) => k + 1);
      setView({ kind: "results", audit: finalAudit });
    } catch (err: unknown) {
      const message =
        err instanceof DOMException && err.name === "AbortError"
          ? "The audit took too long to complete. Please try again."
          : err instanceof Error
          ? err.message
          : "Something went wrong while running your audit.";
      setView({ kind: "error", message, lastUrl: url });
    }
  };

  const reset = () => setView({ kind: "idle" });

  return (
    <div className="min-h-screen bg-background">
      <Header
        showNewAudit={view.kind === "results" || view.kind === "error"}
        onNewAudit={reset}
        historyRefreshKey={historyKey}
        onOpenHistoryEntry={showAudit}
      />
      <main>
        {view.kind === "idle" && <Hero onSubmit={runAudit} />}
        {view.kind === "loading" && <LoadingExperience url={view.url} />}
        {view.kind === "results" && <Dashboard audit={view.audit} />}
        {view.kind === "error" && (
          <ErrorState message={view.message} onRetry={() => runAudit(view.lastUrl)} />
        )}
      </main>
      {view.kind === "idle" && (
        <footer className="container py-10 text-center text-xs text-muted-foreground">
          Built with care · SEOscope analyzes any public URL
        </footer>
      )}
    </div>
  );
};

export default Index;
