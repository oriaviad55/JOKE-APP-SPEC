# Milestone 3: התקנה בטלפון, התוכנית

## המטרה
מתקינים את האפליקציה במסך הבית, והיא נפתחת במסך מלא.

## מה נבדק בתיעוד
- MDN ו-web.dev, תנאי ההתקנה: manifest עם `name` או `short_name`, ‏`start_url`, ‏`display: standalone`, ואייקונים בגודל 192 ו-512. הכל ב-HTTPS. Vercel נותן HTTPS.
- אייקון maskable מסומן `purpose: "maskable"`, בשורה נפרדת מהאייקון הרגיל.

## הקבצים
| קובץ | מה בו |
|---|---|
| `manifest.webmanifest` | ‏name, ‏short_name, ‏start_url, ‏scope, ‏display: standalone, ‏lang: he, ‏dir: rtl, ‏theme_color ו-background_color ‏#FFE15A, ושלושה אייקונים מ-assets |
| `sw.js` | network-first לפי ARCHITECTURE.md סעיף 7 |
| `index.html` | `<link rel="manifest">`, ‏`<meta name="theme-color">`, ‏apple-touch-icon, ורישום של `/sw.js` |

## sw.js
- install: שומר במטמון את `/`, את ה-manifest, את קבצי ה-SVG מ-assets ואת שני אייקוני ה-PNG. ‏`skipWaiting`.
- activate: מוחק מטמונים של גרסאות קודמות. ‏`clients.claim`.
- fetch: רק GET מאותה כתובת, ולא `/api`. קודם רשת, ושומר עותק. אין רשת: מחזיר מהמטמון, ואם אין, את `/`.
- בקשה ל-`/api`, בקשה שאינה GET, או בקשה לכתובת אחרת (כמו Google Fonts): לא נוגע בה.

## תנאי השלמה
לפי `spec/MILESTONES.md`, Milestone 3.

## מה נבנה בפועל
(יעודכן בסוף)
