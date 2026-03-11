import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    const apiKey = process.env.AI_SUMMARY_API_KEY;

    const prompt = `Summarize this tech article in 2 short sentences:\n\n${title}`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "HN Modern"
        },
        body: JSON.stringify({
          model: "openrouter/auto",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("AI response:", data);

    const summary =
      data?.choices?.[0]?.message?.content ||
      "AI summary unavailable.";

    return NextResponse.json({
      summary,
      status: "success"
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      summary: "AI generation failed",
      status: "error"
    });
  }
}