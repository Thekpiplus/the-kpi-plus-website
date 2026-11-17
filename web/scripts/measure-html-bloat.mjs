import http from "http";

function get(path) {
  return new Promise((resolve, reject) => {
    http
      .get(`http://localhost:3001${path}`, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve(d));
      })
      .on("error", reject);
  });
}

const paths = [
  "/",
  "/solutions/hotel-direct-bookings",
  "/solutions/hotel-seo-google-maps-ai-search",
  "/about-us",
];

for (const path of paths) {
  const d = await get(path);
  const scripts = (d.match(/<script[\s\S]*?<\/script>/gi) || []).reduce((a, s) => a + s.length, 0);
  const pushes = (d.match(/self\.__next_f\.push/g) || []).length;
  const fontFamilies = [...d.matchAll(/family=([^&"']+)/g)].map((m) => m[1]);
  console.log(
    JSON.stringify({
      path,
      total: d.length,
      scripts,
      html: d.length - scripts,
      flightPushes: pushes,
      fontFamilies,
    }),
  );
}
