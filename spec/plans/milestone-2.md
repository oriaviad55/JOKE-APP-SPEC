# Milestone 2: בדיחה מ-GPT-5, התוכנית

## המטרה
הבדיחה מגיעה מ-GPT-5 דרך `api/joke.js`. המפתח נשאר בשרת.

## מה נבדק בתיעוד (28.10.2026)
- OpenAI Responses: ‏`POST https://api.openai.com/v1/responses`, כותרות `Content-Type: application/json` ו-`Authorization: Bearer ...`. הגוף: `model`, ‏`instructions`, ‏`input` (מחרוזת), ‏`reasoning: { effort }`.
- התשובה: מערך `output` עם כמה פריטים (גם reasoning). הטקסט נמצא בפריטים מסוג `message`, בחלקים מסוג `output_text`. ‏`output_text` ברמה העליונה מובטח רק ב-SDK, ולכן הוא רק ניסיון ראשון.
- gpt-5: נתמך ב-Responses, מסומן Deprecated. ‏effort נתמך: minimal, ‏low, ‏medium, ‏high. נשארים עם `low`, לפי ARCHITECTURE.md.
- טוקני reasoning נספרים בתוך `max_output_tokens`, ולכן המגבלה 2000 ולא מספר קטן. אחרת התשובה תיחתך לפני שיש בה טקסט.
- Vercel: אותה צורת `export default { fetch }` כמו ב-Milestone 1.

## api/joke.js
1. לא POST: ‏405.
2. גוף שבור או נושא ריק: "אין נושא". הנושא נחתך ל-100 תווים.
3. אין מפתח: ‏500, ‏"המפתח חסר בשרת."
4. קריאה ל-OpenAI עם הפרומפט המרכזי מ-ARCHITECTURE.md סעיף 4. המודל: `OPENAI_MODEL` או `gpt-5`. עם timeout של 30 שניות.
5. שגיאה מ-OpenAI: `console.error` עם הסטטוס והקוד, ו-502 עם הודעה בעברית:
   - 401: המפתח בשרת לא תקין.
   - `insufficient_quota`: נגמר הקרדיט ב-OpenAI.
   - `billing_hard_limit_reached`: הגענו למגבלת ההוצאה החודשית.
   - 429 אחר: יותר מדי בקשות, נסו שוב בעוד רגע.
   - 404 או `model_not_found`: המודל שהוגדר לא קיים.
   - כל השאר, כולל timeout: אין חיבור ל-OpenAI כרגע. נסו שוב.
6. חילוץ הטקסט: קודם `output_text`, ואחר כך `message` ו-`output_text`. אין טקסט: שגיאה.
7. `console.log` קצר לכל בדיחה: הנושא והמודל.

## index.html
ארבעת המצבים כבר בנויים מ-Milestone 1. רק מוודאים שהודעות השגיאה מהשרת מוצגות כמו שהן.

## תנאי השלמה
לפי `spec/MILESTONES.md`, Milestone 2.

## מה נבנה בפועל
- `api/joke.js` נבנה לפי התוכנית, בלי שינויים. ‏`index.html` לא שונה: ארבעת המצבים היו קיימים כבר מ-Milestone 1.
- נבדק בכתובת החיה ב-28.10.2026:
  - "חתולים": בדיחה על חתולים, אחרי כ-10 שניות. תיבה ריקה: בדיחה כללית על החיים, אחרי כ-4 שניות.
  - דרך הממשק: "קפה" עבר את מצב הטעינה, "חושב...", והגיע למצב בדיחה עם "עוד בדיחה!".
  - Network: רק `/api/joke`, ואין בקשה ל-api.openai.com. בקוד הדף אין `sk-`. ‏maxlength=100.
- תנאי 4 (שם מודל שגוי ב-`OPENAI_MODEL`) דורש שינוי משתנה ב-Vercel, ונשאר לאישור של המשתמש.
- תנאי 8 (הרצה מקומית) דולג. הוא רשות, ואין Node.js במחשב.
