import { NextResponse } from "next/server";

const BLOCKED = /^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.|::1|\[::1\])/;

function isPrivateHost(hostname: string) {
  if (BLOCKED.test(hostname)) return true;
  const match = hostname.match(/^172\.(\d+)\./);
  if (match) {
    const octet = Number(match[1]);
    return octet >= 16 && octet <= 31;
  }
  return false;
}

async function fetchText(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "TheKPIPlus-Searchability/1.0" },
    });
    const text = await response.text();
    return { ok: response.ok, status: response.status, text: text.slice(0, 200_000), url: response.url };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { url?: string } | null;
  const raw = body?.url?.trim() ?? "";
  let parsed: URL;
  try {
    parsed = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  } catch {
    return NextResponse.json({ error: "invalid_url" }, { status: 400 });
  }
  if (!["http:", "https:"].includes(parsed.protocol) || isPrivateHost(parsed.hostname)) {
    return NextResponse.json({ error: "blocked_url" }, { status: 400 });
  }

  const origin = `${parsed.protocol}//${parsed.host}`;
  const home = await fetchText(parsed.toString());
  const robots = await fetchText(`${origin}/robots.txt`);
  const sitemap = await fetchText(`${origin}/sitemap.xml`);
  const html = home?.text ?? "";
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim() ?? "";
  const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i)?.[1] ?? "";
  const viewport = /name=["']viewport["']/i.test(html);
  const hasH1 = /<h1[\s>]/i.test(html);
  const https = parsed.protocol === "https:";
  const robotsOk = Boolean(robots?.ok && /sitemap:|user-agent/i.test(robots.text));
  const sitemapOk = Boolean(sitemap?.ok && /<urlset|<sitemapindex/i.test(sitemap.text));

  const google = Math.min(100, (https ? 20 : 0) + (title ? 20 : 0) + (description ? 20 : 0) + (hasH1 ? 15 : 0) + (robotsOk ? 15 : 0) + (sitemapOk ? 10 : 0));
  const ai = Math.min(100, (title ? 25 : 0) + (description ? 25 : 0) + (hasH1 ? 20 : 0) + (sitemapOk ? 15 : 0) + (https ? 15 : 0));
  const mobile = Math.min(100, (viewport ? 50 : 10) + (https ? 20 : 0) + (title ? 15 : 0) + (description ? 15 : 0));

  const improvements = [
    !https ? "เปลี่ยนเป็น HTTPS" : null,
    !title ? "เพิ่ม Title ที่อธิบายโรงแรมชัดเจน" : null,
    !description ? "เพิ่ม Meta Description" : null,
    !viewport ? "เพิ่ม viewport สำหรับมือถือ" : null,
    !robotsOk ? "ตรวจสอบ robots.txt" : null,
    !sitemapOk ? "เพิ่ม sitemap.xml" : null,
    !hasH1 ? "ใส่ H1 ที่หน้าแรก" : null,
  ].filter(Boolean).slice(0, 3);

  return NextResponse.json({
    url: parsed.toString(),
    scores: { google, ai, mobile },
    checks: { https, title, description, viewport, hasH1, robotsOk, sitemapOk, status: home?.status ?? 0 },
    improvements,
  });
}
