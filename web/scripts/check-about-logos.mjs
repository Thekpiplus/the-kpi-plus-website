import http from "http";

http.get("http://localhost:3001/about-us", (res) => {
  let d = "";
  res.on("data", (c) => (d += c));
  res.on("end", () => {
    const html = d.replace(/<script[\s\S]*?<\/script>/gi, "");
    const brandCount = (html.match(/\/brand\/clients\//g) || []).length;
    const nextCount = (html.match(/_next\/image\?url=%2Fbrand%2Fclients/g) || []).length;
    const rawCount = (html.match(/src="\/brand\/clients\//g) || []).length;
    const cmsCount = (html.match(/\/media\/cms\//g) || []).length;
    const listMatch = html.match(/<ul class="kpi-about-clients"[\s\S]*?<\/ul>/);
    console.log(
      JSON.stringify(
        {
          brandCount,
          nextCount,
          rawCount,
          cmsCount,
          hasList: Boolean(listMatch),
          listPreview: listMatch ? listMatch[0].slice(0, 1500) : null,
        },
        null,
        2,
      ),
    );
  });
});
