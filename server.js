const express = require("express");
const cors = require("cors");
const path = require("path");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Mr Leshan website server is running." });
});

/*
  Imports public text/content from another website.
  For best results, provide a public URL. Some websites block automated requests
  or require authentication; in that case the page content must be supplied manually.
*/
app.post("/api/import-site", async (req, res) => {
  const { url } = req.body || {};

  if (!url || !/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: "Please provide a valid http/https website URL." });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mr-Leshan-Website/1.0"
      }
    });

    if (!response.ok) {
      return res.status(502).json({
        error: `The source website returned HTTP ${response.status}.`
      });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    $("script, style, noscript, svg").remove();

    const title = $("title").first().text().trim();
    const description =
      $('meta[name="description"]').attr("content")?.trim() ||
      $('meta[property="og:description"]').attr("content")?.trim() ||
      "";

    const headings = $("h1, h2, h3")
      .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
      .get()
      .filter(Boolean)
      .slice(0, 30);

    const paragraphs = $("p")
      .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
      .get()
      .filter(t => t.length > 25)
      .slice(0, 80);

    const links = $("a")
      .map((_, el) => ({
        text: $(el).text().replace(/\s+/g, " ").trim(),
        href: $(el).attr("href") || ""
      }))
      .get()
      .filter(x => x.text && x.href)
      .slice(0, 40);

    res.json({
      source: url,
      title,
      description,
      headings,
      paragraphs,
      links
    });
  } catch (error) {
    res.status(500).json({
      error: "Could not import the website. The site may block automated requests or be unavailable.",
      detail: error.message
    });
  }
});

app.get("*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Mr Leshan website running at http://localhost:${PORT}`);
});