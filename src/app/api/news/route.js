import Parser from "rss-parser";

const parser = new Parser();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return Response.json({ error: "Missing query parameter" }, { status: 400 });
  }

  try {
    // Fetch Google News RSS for India (in English)
    const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
      q
    )}&hl=en-IN&gl=IN&ceid=IN:en`;
    
    const feed = await parser.parseURL(feedUrl);
    
    // Return top 3 articles
    const articles = feed.items.slice(0, 3).map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      source: item.source || "Google News",
    }));

    return Response.json({ articles });
  } catch (error) {
    console.error("RSS fetch error:", error);
    return Response.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
