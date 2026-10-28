// הפונקציה היחידה שקוראת את המפתח. הדפדפן מקבל רק את הבדיחה, או הודעת שגיאה קצרה.
const INSTRUCTIONS =
  "אתה כותב בדיחות קצרות בעברית. כתוב בדיחה אחת בלבד, עד ארבעה משפטים, נקייה ומתאימה לכל גיל. בלי הקדמה, בלי הסבר ובלי אימוג׳י. רק הבדיחה.";

const GENERIC_ERROR = "אין חיבור ל-OpenAI כרגע. נסו שוב.";

function errorMessage(status, code) {
  if (status === 401) return "המפתח בשרת לא תקין.";
  if (code === "insufficient_quota") return "נגמר הקרדיט ב-OpenAI.";
  if (code === "billing_hard_limit_reached") return "הגענו למגבלת ההוצאה החודשית.";
  if (status === 429) return "יותר מדי בקשות. נסו שוב בעוד רגע.";
  if (status === 404 || code === "model_not_found") return "המודל שהוגדר לא קיים.";
  return GENERIC_ERROR;
}

function extractText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) return data.output_text.trim();
  return (data?.output ?? [])
    .filter((item) => item.type === "message")
    .flatMap((item) => item.content ?? [])
    .filter((part) => part.type === "output_text")
    .map((part) => part.text)
    .join("")
    .trim();
}

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return Response.json({ error: "רק POST, בבקשה." }, { status: 405 });
    }

    let topic = "";
    try {
      const body = await request.json();
      if (typeof body?.topic === "string") topic = body.topic.trim().slice(0, 100);
    } catch {
      // גוף שבור נחשב "אין נושא"
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEY is missing");
      return Response.json({ error: "המפתח חסר בשרת." }, { status: 500 });
    }

    const model = process.env.OPENAI_MODEL || "gpt-5";
    const input = topic ? `נושא הבדיחה: ${topic}` : "אין נושא. ספר בדיחה כללית על החיים.";
    console.log(`joke request: topic="${topic}" model=${model}`);

    let response;
    try {
      response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          instructions: INSTRUCTIONS,
          input,
          reasoning: { effort: "low" },
          max_output_tokens: 2000,
        }),
        signal: AbortSignal.timeout(30000),
      });
    } catch (err) {
      console.error(`OpenAI request failed: ${err.name} ${err.message}`);
      return Response.json({ error: GENERIC_ERROR }, { status: 502 });
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const code = data?.error?.code ?? data?.error?.type ?? "unknown";
      console.error(`OpenAI error: status=${response.status} code=${code} model=${model}`);
      return Response.json({ error: errorMessage(response.status, code) }, { status: 502 });
    }

    const joke = extractText(data);
    if (!joke) {
      console.error(`OpenAI returned no text: status=${data?.status} reason=${data?.incomplete_details?.reason}`);
      return Response.json({ error: GENERIC_ERROR }, { status: 502 });
    }

    return Response.json({ joke });
  },
};
