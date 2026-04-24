export type Severity = "critical" | "high" | "medium" | "low";

export interface PageRow {
  url: string;
  titleStatus: "ok" | "missing" | "too-short" | "too-long" | "duplicate";
  h1Status: "ok" | "missing" | "multiple";
  score: number;
}

export interface ActionItem {
  id: string;
  severity: Severity;
  issue: string;
  why: string;
  fix: string;
}

export interface NormalizedAudit {
  url: string;
  overallScore: number;
  totalPages: number;
  health: "good" | "needs-improvement" | "critical";
  issues: { critical: number; high: number; medium: number; low: number };
  pages: PageRow[];
  performance: { mobile: number; desktop: number };
  insights: { summary: string; quickWins: string[]; strategic: string[] };
  actions: ActionItem[];
}

const num = (v: unknown, fallback = 0): number => {
  const n = typeof v === "string" ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? Math.round(n as number) : fallback;
};

const str = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v : fallback;

const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

const pickHealth = (score: number): NormalizedAudit["health"] => {
  if (score >= 80) return "good";
  if (score >= 50) return "needs-improvement";
  return "critical";
};

/** Best-effort normalization of an unknown webhook response shape. */
export function normalizeAudit(raw: unknown, fallbackUrl: string): NormalizedAudit {
  // Unwrap common wrappers
  let data: any = raw;
  if (Array.isArray(data)) data = data[0] ?? {};
  if (data?.data && typeof data.data === "object") data = { ...data, ...data.data };
  if (data?.result && typeof data.result === "object") data = { ...data, ...data.result };
  if (data?.audit && typeof data.audit === "object") data = { ...data, ...data.audit };

  const overallScore = num(
    data?.overallScore ?? data?.seoScore ?? data?.score ?? data?.overall_score ?? 0,
  );

  const pagesRaw = arr<any>(data?.pages ?? data?.pageResults ?? data?.urls);
  const totalPages = num(data?.totalPages ?? data?.pagesAnalyzed ?? pagesRaw.length, pagesRaw.length || 1);

  const issuesRaw = data?.issues ?? data?.issueBreakdown ?? {};
  const issues = {
    critical: num(issuesRaw?.critical ?? data?.criticalIssues, 0),
    high: num(issuesRaw?.high ?? data?.highIssues, 0),
    medium: num(issuesRaw?.medium ?? data?.mediumIssues, 0),
    low: num(issuesRaw?.low ?? data?.lowIssues, 0),
  };

  const pages: PageRow[] = pagesRaw.slice(0, 200).map((p: any, i: number) => ({
    url: str(p?.url ?? p?.link ?? p?.page, `${fallbackUrl}/page-${i + 1}`),
    titleStatus: (p?.titleStatus ?? (p?.title ? "ok" : "missing")) as PageRow["titleStatus"],
    h1Status: (p?.h1Status ?? (p?.h1 ? "ok" : "missing")) as PageRow["h1Status"],
    score: num(p?.score ?? p?.seoScore, overallScore),
  }));

  const perfRaw = data?.performance ?? data?.pageSpeed ?? data?.psi ?? {};
  const performance = {
    mobile: num(perfRaw?.mobile ?? perfRaw?.mobileScore ?? data?.mobileScore, 0),
    desktop: num(perfRaw?.desktop ?? perfRaw?.desktopScore ?? data?.desktopScore, 0),
  };

  const insightsRaw = data?.insights ?? data?.aiInsights ?? data?.ai ?? {};
  const insights = {
    summary: str(insightsRaw?.summary ?? data?.summary ?? data?.aiSummary, ""),
    quickWins: arr<string>(insightsRaw?.quickWins ?? insightsRaw?.quick_wins ?? data?.quickWins).map(String),
    strategic: arr<string>(
      insightsRaw?.strategic ?? insightsRaw?.strategicImprovements ?? data?.strategicImprovements,
    ).map(String),
  };

  const actionsRaw = arr<any>(data?.actions ?? data?.actionPlan ?? data?.recommendations);
  const actions: ActionItem[] = actionsRaw.map((a, i) => ({
    id: str(a?.id, `action-${i}`),
    severity: (a?.severity ?? a?.priority ?? "medium") as Severity,
    issue: str(a?.issue ?? a?.title ?? a?.name, "Issue"),
    why: str(a?.why ?? a?.impact ?? a?.description, ""),
    fix: str(a?.fix ?? a?.recommendation ?? a?.action, ""),
  }));

  return {
    url: str(data?.url ?? data?.site, fallbackUrl),
    overallScore,
    totalPages,
    health: pickHealth(overallScore),
    issues,
    pages,
    performance,
    insights,
    actions,
  };
}

/** Demo data used when the webhook returns nothing useful, so the UI is always meaningful. */
export function demoAudit(url: string): NormalizedAudit {
  return {
    url,
    overallScore: 72,
    totalPages: 38,
    health: "needs-improvement",
    issues: { critical: 3, high: 8, medium: 14, low: 21 },
    performance: { mobile: 64, desktop: 89 },
    pages: [
      { url: `${url}/`, titleStatus: "ok", h1Status: "ok", score: 88 },
      { url: `${url}/about`, titleStatus: "too-short", h1Status: "ok", score: 71 },
      { url: `${url}/pricing`, titleStatus: "ok", h1Status: "missing", score: 58 },
      { url: `${url}/blog`, titleStatus: "duplicate", h1Status: "multiple", score: 42 },
      { url: `${url}/contact`, titleStatus: "missing", h1Status: "ok", score: 39 },
      { url: `${url}/blog/seo-guide`, titleStatus: "ok", h1Status: "ok", score: 81 },
      { url: `${url}/blog/ranking-tips`, titleStatus: "too-long", h1Status: "ok", score: 65 },
    ],
    insights: {
      summary:
        "Your site has a solid foundation but suffers from inconsistent metadata and weak mobile performance. Fixing the title tags and compressing images alone could lift your score by 12–18 points within a week.",
      quickWins: [
        "Add missing title tags on /contact and 4 other pages",
        "Compress hero images on the homepage (saves ~1.2s LCP)",
        "Add alt text to 23 images for accessibility and image search",
        "Enable text compression (gzip/brotli) on your server",
      ],
      strategic: [
        "Build a topical cluster around your top-performing blog post",
        "Implement structured data (Article, FAQ, Breadcrumb) site-wide",
        "Migrate above-the-fold images to modern formats (AVIF/WebP)",
        "Establish an internal linking strategy with a content hub",
      ],
    },
    actions: [
      {
        id: "a1",
        severity: "critical",
        issue: "Missing title tags on 5 pages",
        why: "Title tags are the strongest on-page ranking signal and what users see in search results.",
        fix: "Add unique, keyword-targeted titles (50–60 chars) to each affected page.",
      },
      {
        id: "a2",
        severity: "critical",
        issue: "Mobile LCP above 4 seconds",
        why: "Slow mobile load times harm Core Web Vitals and bounce rates, especially on 4G.",
        fix: "Compress hero images, defer non-critical JS, and preload the LCP image.",
      },
      {
        id: "a3",
        severity: "high",
        issue: "Duplicate H1 tags across blog",
        why: "Multiple H1s confuse crawlers about page hierarchy and primary topic.",
        fix: "Ensure exactly one H1 per page that matches search intent.",
      },
      {
        id: "a4",
        severity: "high",
        issue: "No structured data detected",
        why: "Schema markup unlocks rich results (stars, FAQs, breadcrumbs) and boosts CTR.",
        fix: "Add Article, Organization, and FAQ schema using JSON-LD.",
      },
      {
        id: "a5",
        severity: "medium",
        issue: "23 images missing alt text",
        why: "Alt text aids accessibility and helps you rank in Google Image search.",
        fix: "Write descriptive, keyword-aware alt text for each content image.",
      },
      {
        id: "a6",
        severity: "low",
        issue: "Sitemap not linked in robots.txt",
        why: "Helps search engines discover and prioritize your URLs faster.",
        fix: "Add a Sitemap: directive pointing to /sitemap.xml in robots.txt.",
      },
    ],
  };
}
