import type { NormalizedAudit } from "@/lib/seo-types";
import { SummaryCards } from "./SummaryCards";
import { IssueBreakdown } from "./IssueBreakdown";
import { PagesTable } from "./PagesTable";
import { Performance } from "./Performance";
import { Insights } from "./Insights";
import { ActionPlan } from "./ActionPlan";
import { Globe } from "lucide-react";

export const Dashboard = ({ audit }: { audit: NormalizedAudit }) => (
  <div className="container py-8 md:py-12 space-y-10">
    <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in">
      <Globe className="h-4 w-4" />
      <span>Audit results for</span>
      <span className="font-mono text-foreground truncate">{audit.url}</span>
    </div>
    <SummaryCards audit={audit} />
    <IssueBreakdown audit={audit} />
    <Performance audit={audit} />
    <Insights audit={audit} />
    <PagesTable audit={audit} />
    <ActionPlan audit={audit} />
  </div>
);
