const urls = ["/", "/about-us", "/solutions/hotel-direct-bookings", "/solutions/hotel-seo-google-maps-ai-search"];
for (const path of urls) {
  const res = await fetch(`http://localhost:3001${path}`);
  const html = await res.text();
  const inlineStyleBytes = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].reduce((a, m) => a + m[1].length, 0);
  const flight = [...html.matchAll(/self\.__next_f\.push/g)].length;
  const svg = [...html.matchAll(/<svg\b/gi)].length;
  const img = [...html.matchAll(/<img\b/gi)].length;
  const linkCss = [...html.matchAll(/rel=["']stylesheet["']/gi)].length;
  // Rough RSC payload size from script bodies mentioning __next_f
  const rscBytes = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => m[1])
    .filter((s) => s.includes("__next_f") || s.includes("nonce"))
    .reduce((a, s) => a + s.length, 0);
  console.log(
    JSON.stringify({
      path,
      kb: Math.round(html.length / 1024),
      svg,
      img,
      linkCss,
      inlineStyleKB: Math.round(inlineStyleBytes / 1024),
      flightPushes: flight,
      rscScriptKB: Math.round(rscBytes / 1024),
    }),
  );
}
