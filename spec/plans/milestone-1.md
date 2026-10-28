# Milestone 1: Walking Skeleton, התוכנית

## המטרה
הדף והפונקציה באוויר ב-Vercel, באותה כתובת, ומדברים זה עם זה. בלי AI. הפונקציה מדווחת רק אם המפתח קיים.

## מה נבדק בתיעוד
- Vercel Functions, Node.js runtime: קובץ ב-`api/` עם `export default { async fetch(request) { ... } }`, שמחזיר `Response`. ‏`Response.json()` זמין. (vercel.com/docs/functions/quickstart)

## הקבצים
| קובץ | מה בו |
|---|---|
| `index.html` | המסך הראשי לפי DESIGN.md, עם ה-CSS וה-JavaScript בתוכו |
| `api/joke.js` | הפונקציה: POST בלבד, מחזירה בדיחה זמנית ו"המפתח: נמצא/חסר" |
| `package.json` | `"type": "module"`, בלי dependencies |
| `.gitignore`, `.env.example`, `.claude/settings.json` | קיימים מההקמה. רק בודקים שהם שם |

## index.html
- `lang="he"`, `dir="rtl"`, viewport לטלפון, Google Fonts: Fredoka ‏(500, 600, 700) ו-Playpen Sans Hebrew ‏(500).
- צבעים מה-Style Guide כמשתני CSS על `:root`.
- רקע: `assets/bg-dots.svg` חוזר, ו-`assets/bg-doodles.svg` פעם אחת למעלה במרכז.
- מלמעלה למטה: לוגו (`assets/logo.svg`, רוחב 300), שורת הסבר, תווית ותיבה (maxlength 100), כפתור אדום, בועה עם הדמות, שורת תחתית.
- הבועה מחליפה מצב לפי `data-state`: ‏idle, ‏think, ‏joke, ‏error. כל מצב מציג ציור אחר מ-assets. ה-CSS של ארבעת המצבים והתנועות נבנה כבר עכשיו, כי המיילסטון הזה קובע את העיצוב.
- הכפתור: POST ל-`/api/joke` עם `{ topic }`, ואז `joke` בבועה עם textContent. כשל רשת או `error` מהשרת: מצב שגיאה עם הודעה קצרה.
- `aria-live="polite"` על אזור הבדיחה. `prefers-reduced-motion`: בלי תנועה.

## api/joke.js
- לא POST: ‏405 עם `{ "error": "..." }`.
- קורא את הגוף כ-JSON. גוף שבור נחשב נושא ריק.
- `console.log` קצר לכל לחיצה, כדי שתהיה שורה ב-Logs.
- מחזיר `{ "joke": "בדיחה זמנית מהשרת: [הנושא]. המפתח: נמצא" }`, או "חסר" כש-`process.env.OPENAI_API_KEY` ריק. אף פעם לא את המפתח עצמו.
- בלי כותרות CORS ובלי טיפול ב-OPTIONS.

## ביד, אחרי ה-push (המשתמש)
1. Vercel: ‏New Project, ‏Import לריפו `JOKE-APP-SPEC`, ‏Framework Preset: Other, ‏Deploy.
2. OpenAI, ‏API keys: מפתח production בשם `joke-in-a-click`.
3. Vercel, ‏Settings, ‏Environment Variables: ‏`OPENAI_API_KEY`, סוג Secret, ‏Production ו-Preview. ואז Redeploy.

## תנאי השלמה
לפי `spec/MILESTONES.md`, Milestone 1, סעיפים 1 עד 7.

## מה נבנה בפועל
- `index.html`: המסך כולו, עם CSS ו-JavaScript בפנים. פונקציה אחת, `show(state, text)`, מחליפה את `data-state`, את ציור הדמות, את הטקסט (textContent) ואת כיתוב הכפתור. הכפתור נעול במצב think.
- ארבעת המצבים נבדקו ויזואלית ברוחב 375 מול mockups.png: התחלה, בדיחה (הדמות בפינה, כתב יד 25) ושגיאה (רקע ורדרד, טקסט אדום).
- `api/joke.js`: ‏405 על כל דבר שאינו POST, חיתוך ל-100 תווים, ‏`console.log` עם הנושא ו-found/missing, ובלי הנושא: "בלי נושא".
- `package.json`: רק `name`, ‏`private` ו-`"type": "module"`.
- `.gitignore`, ‏`.env.example` ו-`.claude/settings.json` כבר בריפו מההקמה, ולא שונו.
