import { Button } from "@/components/ui/button";
import { Gauge, Moon, Sun, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { HistorySidebar } from "./HistorySidebar";
import type { NormalizedAudit } from "@/lib/seo-types";

interface Props {
  showNewAudit?: boolean;
  onNewAudit?: () => void;
  historyRefreshKey?: number;
  onOpenHistoryEntry?: (audit: NormalizedAudit) => void;
}

export const Header = ({ showNewAudit, onNewAudit, historyRefreshKey, onOpenHistoryEntry }: Props) => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("seo-theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefers;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("seo-theme", next ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow transition-transform group-hover:scale-105">
            <Gauge className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold tracking-tight">SEOscope</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">AI Audit</span>
          </div>
        </a>
        <div className="flex items-center gap-2">
          {onOpenHistoryEntry && (
            <HistorySidebar refreshKey={historyRefreshKey} onOpen={onOpenHistoryEntry} />
          )}
          {showNewAudit && (
            <Button onClick={onNewAudit} variant="outline" size="sm" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Run New Audit</span>
              <span className="sm:hidden">New</span>
            </Button>
          )}
          <Button onClick={toggleTheme} variant="ghost" size="icon" aria-label="Toggle theme">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
};
