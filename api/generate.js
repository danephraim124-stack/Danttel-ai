
export default async function handler(req, res) {

  // Allow POST requests only
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    // Read the user's prompt
    const { prompt } = req.body || {};

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        error: "Please provide a valid prompt."
      });
    }

    // Limit prompt size
    if (prompt.length > 12000) {
      return res.status(400).json({
        error: "Your prompt is too long."
      });
    }

    // Connect to Groq AI
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },

        body: JSON.stringify({
          model: "openai/gpt-oss-120b",

          messages: [
            {
              role: "system",
              content: `You are Danttel AI Studio, a professional AI assistant and expert full-stack web developer.

Your responsibilities:
- Generate complete websites.
- Write HTML, CSS and JavaScript.
- Help users debug code.
- Explain programming concepts.
- Improve existing code.
- Create professional business websites.

Always provide accurate, useful and functional solutions.
When generating websites, use responsive layouts and clean code.`
            },

            {
              role: "user",
              content: prompt
            }
          ],

          temperature: 0.7,
          max_completion_tokens: 4000
        })
      }
    );

    // Read Groq response
    const data = await response.json();

    // Handle API errors
    if (!response.ok) {
      console.error("Groq API error:", data);

      return res.status(response.status).json({
        error: data.error?.message || "Groq API request failed."
      });
    }

    // Return AI response
    return res.status(200).json({
      result: data.choices?.[0]?.message?.content || ""
    });

  } catch (error) {

    console.error("Backend error:", error);

    return res.status(500).json({
      error: "Internal server error. Please try again."
    });

  }
}
