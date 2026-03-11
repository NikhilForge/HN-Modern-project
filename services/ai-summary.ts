export async function generateSummary(url: string, title?: string) {
  const response = await fetch("/api/ai-summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      url,
      title
    })
  });

  return response.json();
}