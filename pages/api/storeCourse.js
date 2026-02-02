export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiUrl = process.env.NEXT_PUBLIC_STORE_COURSE_API;
  if (!apiUrl) {
    return res
      .status(500)
      .json({ error: "Store course API is not configured" });
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body || {}),
    });

    const contentType = response.headers.get("content-type") || "text/plain";
    const text = await response.text();
    res.setHeader("content-type", contentType);
    return res.status(response.status).send(text);
  } catch (error) {
    console.error("Store course proxy error:", error);
    return res.status(500).json({ error: "Failed to reach store course API" });
  }
}
