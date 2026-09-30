"use client";

import { useState, useEffect, useCallback } from "react";

// ── Types ───────────────────────────────────────────────────────────────────
interface Overview {
  totalVisits: number;
  uniqueVisitors: number;
  newVisitors: number;
  totalRevenue: number;
  avgOrderValue: number;
  purchases: number;
  totalClicks: number;
}
interface DailyVisit { date: string; visits: number; uniqueVisitors: number }
interface TopPage { path: string; visits: number }
interface TrafficSource { source: string; visits: number; revenue: number }
interface Device { type: string; count: number }
interface Referrer { domain: string; visits: number }
interface Campaign { campaign: string; source: string; medium: string; visits: number; revenue: number }
interface Purchase { orderId?: string; value?: number; currency: string; source: string; campaign?: string; page: string; createdAt: string }
interface TopClick { label: string; count: number }

interface DashboardData {
  overview: Overview;
  dailyVisits: DailyVisit[];
  topPages: TopPage[];
  trafficSources: TrafficSource[];
  devices: Device[];
  topReferrers: Referrer[];
  campaigns: Campaign[];
  recentPurchases: Purchase[];
  topClicks: TopClick[];
  generatedAt: string;
}

const RANGES = [
  { label: "Today", value: "today" },
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
];

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
  direct:     { label: "Direct",       color: "#687767" },
  organic:    { label: "Organic",      color: "#536252" },
  meta_ads:   { label: "Meta Ads",     color: "#1877F2" },
  google_ads: { label: "Google Ads",   color: "#EA4335" },
  email:      { label: "Email",        color: "#F59E0B" },
  social:     { label: "Social",       color: "#8B5CF6" },
  referral:   { label: "Referral",     color: "#10B981" },
  campaign:   { label: "Campaign",     color: "#F97316" },
  paid:       { label: "Paid",         color: "#EF4444" },
};

function fmt(n: number) { return n.toLocaleString("en-CA"); }
function fmtCad(n: number) { return `$${n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
function fmtDate(iso: string) { return new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric" }); }
function fmtTs(iso: string) {
  return new Date(iso).toLocaleString("en-CA", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

// ── Mini bar chart (CSS only) ───────────────────────────────────────────────
function BarChart({ data }: { data: { label: string; value: number; color?: string }[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-1 group relative">
          <div
            className="w-full rounded-t transition-all duration-300"
            style={{ height: `${(d.value / max) * 100}%`, background: d.color ?? "#687767", minHeight: 2 }}
          />
          <span className="text-[9px] text-soft-gray truncate w-full text-center">{d.label}</span>
          <div className="absolute bottom-full mb-1 bg-charcoal text-ivory text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
            {d.label}: {fmt(d.value)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Horizontal bar row ──────────────────────────────────────────────────────
function HBar({ label, value, max, sub }: { label: string; value: number; max: number; sub?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="py-1.5">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-charcoal truncate max-w-[60%]">{label}</span>
        <span className="text-soft-gray tabular-nums">{sub ?? fmt(value)}</span>
      </div>
      <div className="h-1.5 bg-stone rounded-full overflow-hidden">
        <div className="h-full bg-sage rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Donut (pure SVG) ────────────────────────────────────────────────────────
function Donut({ slices }: { slices: { label: string; value: number; color: string }[] }) {
  const total = slices.reduce((s, d) => s + d.value, 0) || 1;
  let offset = -25;
  const r = 40;
  const cx = 50;
  const cy = 50;
  const circ = 2 * Math.PI * r;
  const paths = slices.map(s => {
    const pct = s.value / total;
    const path = { ...s, pct, offset, dashLen: pct * circ, dashOff: (1 - pct) * circ };
    offset += pct * 100;
    return path;
  });
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="w-24 h-24 flex-shrink-0">
        {paths.map((p, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={p.color} strokeWidth="18"
            strokeDasharray={`${p.dashLen} ${p.dashOff}`}
            strokeDashoffset={`${circ * 0.25 - (p.offset / 100) * circ}`}
          />
        ))}
        <circle cx={cx} cy={cy} r="28" fill="white" />
      </svg>
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: s.color }} />
            <span className="truncate text-charcoal">{s.label}</span>
            <span className="ml-auto tabular-nums text-soft-gray">{Math.round(s.value / total * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── KPI card ────────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border border-stone rounded-lg p-4">
      <div className="flex items-center gap-2 text-soft-gray mb-1 text-xs font-medium uppercase tracking-widest">
        <i className={`${icon} text-sage`} />
        {label}
      </div>
      <div className="text-2xl font-semibold text-charcoal font-display">{value}</div>
      {sub && <div className="text-xs text-soft-gray mt-0.5">{sub}</div>}
    </div>
  );
}

// ── Password gate ───────────────────────────────────────────────────────────
function PasswordGate({ onAuth }: { onAuth: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/analytics/data?key=${encodeURIComponent(pw)}&range=today`);
    if (res.ok) { localStorage.setItem("altr_analytics_key", pw); onAuth(pw); }
    else setErr(true);
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <form onSubmit={submit} className="bg-white border border-stone rounded-lg p-8 w-full max-w-sm shadow-sm">
        <div className="text-2xl font-display font-semibold text-charcoal mb-1">ALTR Analytics</div>
        <div className="text-soft-gray text-sm mb-6">Enter your analytics password to continue.</div>
        <input
          type="password"
          value={pw}
          onChange={e => { setPw(e.target.value); setErr(false); }}
          className="w-full border border-stone rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sage mb-3"
          placeholder="Password"
          autoFocus
        />
        {err && <div className="text-red-500 text-xs mb-3">Incorrect password.</div>}
        <button type="submit" className="w-full bg-sage-deep text-ivory rounded-md py-2 text-sm font-medium hover:bg-charcoal transition-colors">
          Sign In
        </button>
      </form>
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────────────────────────────
export default function AnalyticsDashboard() {
  const [key, setKey] = useState<string | null>(null);
  const [range, setRange] = useState("30d");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("altr_analytics_key");
    if (saved) setKey(saved);
  }, []);

  const load = useCallback(async (k: string, r: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/analytics/data?key=${encodeURIComponent(k)}&range=${r}`);
      if (res.status === 401) { setKey(null); localStorage.removeItem("altr_analytics_key"); return; }
      if (!res.ok) { setError("Failed to load data."); return; }
      setData(await res.json() as DashboardData);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (key) load(key, range);
  }, [key, range, load]);

  if (!key) return <PasswordGate onAuth={k => setKey(k)} />;

  const exportUrl = `/api/analytics/export?key=${encodeURIComponent(key)}&range=${range}`;

  return (
    <div className="min-h-screen bg-ivory">
      {/* Topbar */}
      <div className="bg-white border-b border-stone sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-display font-semibold text-charcoal text-lg">ALTR Analytics</span>
            {loading && <i className="ri-loader-4-line animate-spin text-soft-gray" />}
          </div>
          <div className="flex items-center gap-2">
            {RANGES.map(r => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${range === r.value ? "bg-sage-deep text-ivory" : "text-soft-gray hover:text-charcoal hover:bg-sage-mist"}`}
              >
                {r.label}
              </button>
            ))}
            <a href={exportUrl} download className="ml-2 flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium bg-ivory-soft border border-stone text-charcoal hover:bg-sage-mist transition-colors">
              <i className="ri-download-line" /> Export CSV
            </a>
            <button onClick={() => { setKey(null); localStorage.removeItem("altr_analytics_key"); }} className="ml-1 text-soft-gray hover:text-charcoal text-xs">
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {error && <div className="bg-red-50 text-red-700 border border-red-200 rounded-md px-4 py-2 text-sm">{error}</div>}

        {!data && !loading && (
          <div className="text-center text-soft-gray py-24 text-sm">No data yet.</div>
        )}

        {data && (
          <>
            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              <KpiCard icon="ri-eye-line" label="Page Views" value={fmt(data.overview.totalVisits)} />
              <KpiCard icon="ri-user-line" label="Visitors" value={fmt(data.overview.uniqueVisitors)} sub={`${fmt(data.overview.newVisitors)} new`} />
              <KpiCard icon="ri-money-dollar-circle-line" label="Revenue" value={fmtCad(data.overview.totalRevenue)} />
              <KpiCard icon="ri-shopping-bag-line" label="Orders" value={fmt(data.overview.purchases)} sub={data.overview.purchases ? `Avg ${fmtCad(data.overview.avgOrderValue)}` : undefined} />
              <KpiCard icon="ri-cursor-line" label="Clicks" value={fmt(data.overview.totalClicks)} />
              <KpiCard icon="ri-line-chart-line" label="Conv. Rate" value={data.overview.uniqueVisitors ? `${((data.overview.purchases / data.overview.uniqueVisitors) * 100).toFixed(2)}%` : "—"} />
              <KpiCard icon="ri-refresh-line" label="Last Updated" value={fmtTs(data.generatedAt).split(",")[1]?.trim() ?? "—"} sub={fmtTs(data.generatedAt).split(",")[0]} />
            </div>

            {/* Daily visits chart */}
            <div className="bg-white border border-stone rounded-lg p-5">
              <h2 className="text-sm font-semibold text-charcoal uppercase tracking-widest mb-4">Page Views Over Time</h2>
              {data.dailyVisits.length > 0 ? (
                <BarChart
                  data={data.dailyVisits.slice(-30).map(d => ({
                    label: fmtDate(d.date),
                    value: d.visits,
                    color: "#687767",
                  }))}
                />
              ) : <div className="h-32 flex items-center justify-center text-soft-gray text-sm">No data</div>}
            </div>

            {/* Sources + Devices row */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Traffic sources */}
              <div className="bg-white border border-stone rounded-lg p-5">
                <h2 className="text-sm font-semibold text-charcoal uppercase tracking-widest mb-4">Traffic Sources</h2>
                {data.trafficSources.length > 0 ? (
                  <div className="space-y-0.5">
                    {data.trafficSources.map(s => {
                      const meta = SOURCE_LABELS[s.source] ?? { label: s.source, color: "#777970" };
                      const max = Math.max(...data.trafficSources.map(x => x.visits));
                      return (
                        <div key={s.source} className="py-1.5">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-sm" style={{ background: meta.color }} />
                              <span className="text-charcoal">{meta.label}</span>
                            </span>
                            <span className="text-soft-gray tabular-nums">
                              {fmt(s.visits)} visits{s.revenue > 0 ? ` · ${fmtCad(s.revenue)}` : ""}
                            </span>
                          </div>
                          <div className="h-1.5 bg-stone rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${max ? (s.visits / max) * 100 : 0}%`, background: meta.color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : <div className="text-soft-gray text-sm">No data</div>}
              </div>

              {/* Device breakdown */}
              <div className="bg-white border border-stone rounded-lg p-5">
                <h2 className="text-sm font-semibold text-charcoal uppercase tracking-widest mb-4">Devices</h2>
                {data.devices.length > 0 ? (
                  <Donut
                    slices={data.devices.map((d, i) => {
                      const colors = ["#687767", "#536252", "#97A494", "#D8D3C9", "#10130F"];
                      return { label: d.type.charAt(0).toUpperCase() + d.type.slice(1), value: d.count, color: colors[i % colors.length] };
                    })}
                  />
                ) : <div className="text-soft-gray text-sm">No data</div>}
              </div>
            </div>

            {/* Top pages + Referrers row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-stone rounded-lg p-5">
                <h2 className="text-sm font-semibold text-charcoal uppercase tracking-widest mb-4">Top Pages</h2>
                <div className="space-y-0.5">
                  {data.topPages.slice(0, 10).map(p => (
                    <HBar key={p.path} label={p.path} value={p.visits} max={data.topPages[0]?.visits ?? 1} />
                  ))}
                  {data.topPages.length === 0 && <div className="text-soft-gray text-sm">No data</div>}
                </div>
              </div>

              <div className="bg-white border border-stone rounded-lg p-5">
                <h2 className="text-sm font-semibold text-charcoal uppercase tracking-widest mb-4">Top Referrers</h2>
                <div className="space-y-0.5">
                  {data.topReferrers.slice(0, 10).map(r => (
                    <HBar key={r.domain} label={r.domain} value={r.visits} max={data.topReferrers[0]?.visits ?? 1} />
                  ))}
                  {data.topReferrers.length === 0 && <div className="text-soft-gray text-sm">No referral traffic yet.</div>}
                </div>
              </div>
            </div>

            {/* Campaigns */}
            {data.campaigns.some(c => c.campaign !== "(none)") && (
              <div className="bg-white border border-stone rounded-lg p-5 overflow-x-auto">
                <h2 className="text-sm font-semibold text-charcoal uppercase tracking-widest mb-4">UTM Campaigns</h2>
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="text-left text-xs text-soft-gray uppercase tracking-wider border-b border-stone">
                      <th className="pb-2 pr-4 font-medium">Campaign</th>
                      <th className="pb-2 pr-4 font-medium">Source</th>
                      <th className="pb-2 pr-4 font-medium">Medium</th>
                      <th className="pb-2 pr-4 font-medium text-right">Visits</th>
                      <th className="pb-2 font-medium text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone/50">
                    {data.campaigns.filter(c => c.campaign !== "(none)").map((c, i) => (
                      <tr key={i} className="hover:bg-ivory-soft transition-colors">
                        <td className="py-2 pr-4 text-charcoal font-medium">{c.campaign}</td>
                        <td className="py-2 pr-4 text-soft-gray">{c.source || "—"}</td>
                        <td className="py-2 pr-4 text-soft-gray">{c.medium || "—"}</td>
                        <td className="py-2 pr-4 text-right tabular-nums">{fmt(c.visits)}</td>
                        <td className="py-2 text-right tabular-nums text-sage-deep">{c.revenue > 0 ? fmtCad(c.revenue) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sales Attribution */}
            {data.recentPurchases.length > 0 && (
              <div className="bg-white border border-stone rounded-lg p-5 overflow-x-auto">
                <h2 className="text-sm font-semibold text-charcoal uppercase tracking-widest mb-4">Sales Attribution</h2>
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="text-left text-xs text-soft-gray uppercase tracking-wider border-b border-stone">
                      <th className="pb-2 pr-4 font-medium">Order ID</th>
                      <th className="pb-2 pr-4 font-medium">Value</th>
                      <th className="pb-2 pr-4 font-medium">Source</th>
                      <th className="pb-2 pr-4 font-medium">Campaign</th>
                      <th className="pb-2 pr-4 font-medium">Page</th>
                      <th className="pb-2 font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone/50">
                    {data.recentPurchases.map((p, i) => {
                      const meta = SOURCE_LABELS[p.source] ?? { label: p.source, color: "#777970" };
                      return (
                        <tr key={i} className="hover:bg-ivory-soft transition-colors">
                          <td className="py-2 pr-4 text-charcoal font-mono text-xs">{p.orderId ?? "—"}</td>
                          <td className="py-2 pr-4 tabular-nums font-medium text-sage-deep">{p.value != null ? fmtCad(p.value) : "—"}</td>
                          <td className="py-2 pr-4">
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: `${meta.color}20`, color: meta.color }}>
                              {meta.label}
                            </span>
                          </td>
                          <td className="py-2 pr-4 text-soft-gray text-xs">{p.campaign || "—"}</td>
                          <td className="py-2 pr-4 text-soft-gray text-xs truncate max-w-[140px]">{p.page}</td>
                          <td className="py-2 text-soft-gray text-xs">{fmtTs(p.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Top Clicks */}
            {data.topClicks.length > 0 && (
              <div className="bg-white border border-stone rounded-lg p-5">
                <h2 className="text-sm font-semibold text-charcoal uppercase tracking-widest mb-4">Top Clicked Elements</h2>
                <div className="space-y-0.5">
                  {data.topClicks.map(c => (
                    <HBar key={c.label} label={c.label} value={c.count} max={data.topClicks[0]?.count ?? 1} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
