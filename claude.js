export default async function handler(req, res){
  const { message } = req.body;
  const response = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{
      "x-api-key": process.env.CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      messages: [{ role: "user", content: message }]
    })
  });
  const data = await response.json();
  res.json({ reply: data.content[0].text });
}
export default async function handler(req, res){
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ reply: "Method salah" });
    }

    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "Pesan kosong" });

    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return res.json({ reply: "ERROR: CLAUDE_API_KEY belum di set di Vercel Environment Variables" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.json({ reply: `Claude Error: ${JSON.stringify(data)}` });
    }

    const text = data.content?.[0]?.text || "Gak ada balasan dari Claude";
    res.json({ reply: text });

  } catch (err) {
    res.json({ reply: `Server Error: ${err.message}` });
  }
}
