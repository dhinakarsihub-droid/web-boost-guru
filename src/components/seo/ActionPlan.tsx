import type { NormalizedAudit, Severity, ActionItem } from "@/lib/seo-types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ListChecks } from "lucide-react";

const severityMeta: Record<Severity, { label: string; ring: string; text: string; bg: string; dot: string }> = {
  critical: { label: "Critical", ring: "ring-critical/20", text: "text-critical", bg: "bg-critical/10", dot: "bg-critical" },
  high: { label: "High", ring: "ring-high/20", text: "text-high", bg: "bg-high/10", dot: "bg-high" },
  medium: { label: "Medium", ring: "ring-medium/20", text: "text-medium", bg: "bg-medium/10", dot: "bg-medium" },
  low: { label: "Low", ring: "ring-low/20", text: "text-low", bg: "bg-low/10", dot: "bg-low" },
};

const order: Severity[] = ["critical", "high", "medium", "low"];

const ActionRow = ({ a }: { a: ActionItem }) => {
  const m = severityMeta[a.severity];
  return (
    <AccordionItem value={a.id} className="border rounded-xl px-4 bg-background data-[state=open]:bg-muted/30 transition-colors">
      <AccordionTrigger className="hover:no-underline py-4 gap-3">
        <div className="flex items-center gap-3 flex-1 text-left">
          <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${m.bg} ${m.text} ${m.ring}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
            {m.label}
          </span>
          <span className="font-medium">{a.issue}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4">
        <div className="grid gap-4 md:grid-cols-2 pt-2 pl-1">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1.5">Why it matters</p>
            <p className="text-sm leading-relaxed">{a.why || "—"}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1.5">Recommended fix</p>
            <p className="text-sm leading-relaxed">{a.fix || "—"}</p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export const ActionPlan = ({ audit }: { audit: NormalizedAudit }) => {
  if (audit.actions.length === 0) return null;
  const grouped = order
    .map((sev) => ({ sev, items: audit.actions.filter((a) => a.severity === sev) }))
    .filter((g) => g.items.length);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <ListChecks className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-bold">Action Plan</h2>
      </div>
      <div className="rounded-2xl border bg-card p-4 md:p-6 shadow-card space-y-6">
        {grouped.map(({ sev, items }) => {
          const m = severityMeta[sev];
          return (
            <div key={sev}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`h-2 w-2 rounded-full ${m.dot}`} />
                <h3 className={`text-xs uppercase tracking-widest font-bold ${m.text}`}>
                  {m.label} priority · {items.length}
                </h3>
              </div>
              <Accordion type="multiple" className="space-y-2">
                {items.map((a) => <ActionRow key={a.id} a={a} />)}
              </Accordion>
            </div>
          );
        })}
      </div>
    </section>
  );
};
