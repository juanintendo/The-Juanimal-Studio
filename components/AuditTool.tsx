"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";

type Finding = {
  title: string;
  severity: "high" | "medium" | "low";
  issue: string;
  fix: string;
};

type Report = {
  overallScore: number;
  summary: string;
  findings: Finding[];
};

const SEVERITY_LABEL: Record<Finding["severity"], string> = {
  high: "Fix first",
  medium: "Worth fixing",
  low: "Nice to have",
};

export function AuditTool() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  async function runAudit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setReport(data.report);
      setScreenshotUrl(data.screenshotUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="services sec-pad" id="ux-audit">
      <Reveal as="span" className="eyebrow">
        Free tool
      </Reveal>
      <Reveal as="h2" className="sec-h2">
        Cast a UX audit
        <br />
        <span className="accent">on any live page</span>
      </Reveal>
      <p className="about-lede" style={{ marginBottom: 32 }}>
        Drop a URL and your email — the studio&rsquo;s AI reads the page like a
        wizard reads a spellbook and hands back what to fix first. Free, no
        strings.
      </p>

      <form
        onSubmit={runAudit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          maxWidth: 440,
          marginBottom: 40,
        }}
      >
        <label className="pf-field">
          Page URL
          <input
            type="url"
            required
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
        <label className="pf-field">
          Your email
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button type="submit" className="cta-btn postcard-submit" disabled={loading}>
          {loading ? "Casting the audit…" : "Run the audit"}
        </button>
      </form>

      {error && (
        <p style={{ color: "var(--red)", fontWeight: 700, marginBottom: 24 }}>
          {error}
        </p>
      )}

      {report && (
        <div>
          {screenshotUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={screenshotUrl}
              alt="Screenshot of the audited page"
              style={{
                width: "100%",
                maxWidth: 480,
                border: "4px solid var(--ink)",
                boxShadow: "7px 7px 0 var(--ink)",
                marginBottom: 28,
                display: "block",
              }}
            />
          )}

          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
            <span
              className="stat-num"
              style={{ color: "var(--ink)", textShadow: "3px 3px 0 var(--red)", fontSize: 56 }}
            >
              {report.overallScore}
            </span>
            <span className="stat-lbl" style={{ color: "var(--rust)" }}>
              / 100 overall
            </span>
          </div>
          <p className="about-lede" style={{ marginBottom: 32 }}>
            {report.summary}
          </p>

          <div className="svc-grid">
            {report.findings.map((f, i) => (
              <article className="svc-card" key={i}>
                <span className="svc-num">{i + 1}</span>
                <span
                  className="merch-tag"
                  style={{
                    color:
                      f.severity === "high"
                        ? "var(--red)"
                        : f.severity === "medium"
                          ? "var(--rust)"
                          : "#3a2c1c",
                  }}
                >
                  {SEVERITY_LABEL[f.severity]}
                </span>
                <h3>{f.title}</h3>
                <p style={{ marginBottom: 10 }}>{f.issue}</p>
                <p style={{ fontWeight: 700 }}>{f.fix}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
