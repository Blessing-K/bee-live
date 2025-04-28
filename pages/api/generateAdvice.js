const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Missing OpenAI API key");
    return res.status(500).json({ error: "Missing OpenAI API key" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { courseName } = req.body;

  if (!courseName || typeof courseName !== "string") {
    return res.status(400).json({ error: "Invalid course name" });
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `List exactly 5 study strategies to improve performance in ${courseName}. Number each strategy. Keep each strategy short and actionable.`,
        },
      ],
    });

    const rawAdvice = chatCompletion.choices[0]?.message?.content || "No advice returned.";
    
    // 🔥 NEW: Inject real paragraph breaks
    const formattedAdvice = rawAdvice.replace(/(\d+\.\s)/g, '\n\n$1');

    console.log("Formatted Advice:", formattedAdvice);

    return res.status(200).json({ advice: formattedAdvice });

  } catch (error) {
    console.error("🔴 OpenAI API error:", error.response?.data || error.message);
    return res.status(500).json({
      error:
        error.response?.data?.error?.message ||
        error.message ||
        "Unknown error while generating advice",
    });
  }
}
