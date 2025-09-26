export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const { text, level, parameters = {} } = req.body;

    if (!text || text.length > 1500) {
      return res.status(400).json({ error: "Text must be 1–1500 characters." });
    }

    // ✅ Use a FREE OpenRouter model (activated in your OpenRouter dashboard)
    const model = "google/gemma-3-27b-it:free";

    // ✅ Adjust temperature and max_tokens based on simplification level
    const max_new_tokens = level < 33 ? 300 : level < 66 ? 220 : 160;
    const temperature = level < 33 ? 0.3 : level < 66 ? 0.7 : 1.0;
    const levelLabel = level < 33 ? "basic" : level < 66 ? "standard" : "advanced";

    // ✅ Clear and strict prompt to get plain, one-paragraph simplified output
    const prompt = `
Please simplify the following text using ${levelLabel} language for general readers.
Only return single paragraphq. Avoid markdown, bullet points, and titles.
Users use you to have clear output, give them outputs like a professor re explaining the input. You can also define it you see the need.
Do not start with phrases like “Sure,” “Here is,” or “Okay.” Just rewrite it in simpler words. Only return the output , the suer should only get the output, you are a clarity bot that summarize and simplify.

Text:
"""${text}"""

Simplified:
`;

    // ✅ Send request to OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature,
        max_tokens: max_new_tokens,
      }),
    });

    const raw = await response.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      return res.status(502).json({
        error: `Could not parse response: ${raw.slice(0, 120)}...`,
      });
    }

    if (!response.ok || data.error || !data.choices?.[0]?.message?.content) {
      return res.status(503).json({
        error: data.error?.message || "The model is overloaded or returned nothing.",
      });
    }

    const simplified = data.choices[0].message.content.trim();

    return res.status(200).json({
      simplified,
      tokenCount: text.split(" ").length,
      charCount: text.length,
    });

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: "Server error – please try again later." });
  }
}
