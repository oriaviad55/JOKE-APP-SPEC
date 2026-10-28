// Milestone 1: בדיחה זמנית, בלי AI. רק מדווחת אם המפתח קיים, אף פעם לא את המפתח עצמו.
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

    const hasKey = Boolean(process.env.OPENAI_API_KEY);
    console.log(`joke request: topic="${topic}" key=${hasKey ? "found" : "missing"}`);

    const keyStatus = hasKey ? "נמצא" : "חסר";
    return Response.json({
      joke: `בדיחה זמנית מהשרת: ${topic || "בלי נושא"}. המפתח: ${keyStatus}`,
    });
  },
};
