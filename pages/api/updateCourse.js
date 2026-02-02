export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiUrl = process.env.NEXT_PUBLIC_UPDATE_COURSE_API;
  console.log("Update API URL:", apiUrl);
  console.log("Update request body:", req.body);

  if (!apiUrl) {
    return res
      .status(500)
      .json({ error: "Update course API is not configured" });
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body || {}),
    });

    const contentType =
      response.headers.get("content-type") || "application/json";
    const text = await response.text();
    console.log("AWS response status:", response.status);
    console.log("AWS response:", text);

    res.setHeader("content-type", contentType);
    return res.status(response.status).send(text);
  } catch (error) {
    console.error("Update course proxy error:", error);
    return res
      .status(500)
      .json({
        error: "Failed to reach update course API",
        details: error.message,
      });
  }
}
