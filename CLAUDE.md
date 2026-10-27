# כלי המחשה – טכנולוגיות מידע 14176 (מה"ט, לוגיסטיקה)

## מטרה
אתר סטטי בעברית עם כלים אינטראקטיביים להמחשת השיעורים. מוקרן בכיתה ונפתח בטלפון.

## טכנולוגיה
- Vite + React + TypeScript + Tailwind (v4, טוקנים ב-`src/index.css` תחת `@theme`)
- RTL מלא: dir="rtl" ב-html, תכונות CSS לוגיות (ms/me, ps/pe, start/end). לא להשתמש ב-ml/mr/pl/pr/left/right.
- בלי שרת ובלי התחברות. כל הנתונים בקבצי JSON תחת src/data
- נתב: react-router (HashRouter), כלי אחד לכל נתיב (/lesson/1 ... /lesson/12)
- פריסה: GitHub Pages (`.github/workflows/deploy.yml`) או Netlify (`netlify.toml`). `base: './'` ב-vite.

## עיצוב
- רקע כהה #0D1524 (`bg`), כרטיסים #1B2943 (`card`), קווים #2A3B5C (`line`)
- טקסט #EEF2F8 (`ink`), משני #AEBBD0 (`ink-2`)
- כחול #5AA9FF (`blue`), כתום #F5A54A (`orange`). כחול/כתום ולא אדום/ירוק.
- גופנים: Rubik לכותרות (`font-display`), Assistant לגוף (Google Fonts)
- מצב הקרנה: גופן גדול (`?big=1`), כפתור מסך מלא בכל כלי (מגיעים מ-`ToolShell`)
- מספרים: מחלקה `num` (LTR מבודד, ספרות טבלאיות)

## נתוני חברת התרגול (קבועים, לא לשנות)
פריטים: 1001 משטח עץ ₪45 · 1002 רדיד ₪38 · 1003 קרטון 40x30 ₪2.8 ·
1004 קרטון 60x40 ₪4.5 · 1005 סרט ₪6 · 1006 מדבקות ₪55 · 1007 רצועות ₪22 ·
1008 כפפות ₪9 · 1009 קרטון 30x20 ₪1.9 · 1010 משטח פלסטיק ₪85
ספקים: 501 אריזות הנגב (באר שבע) · 502 פלסט דרום (אשדוד) · 503 משטחי הדרום (דימונה)
מספרי בדיקה: ערך מלאי ₪15,580 · יציאות 17,342 · כניסות 15,600 ·
אריזות הנגב 14,277 · משלוחים 3,170

הנתונים נמצאים ב-`src/data/company.json`. `npm run check` נכשל אם משהו בהם השתנה.

## כללים
- כל כלי מסתיים במספר בדיקה שהסטודנט יכול להשוות לשקף (רכיב `<CheckNumber check=... value=... />`)
- טקסטים קצרים וישירים, בלי ז'רגון שלא נלמד
- לכל כלי יש מצב "מרצה" (מציג פתרון) ומצב "סטודנט": `useTeacherMode()` (`?mode=teacher`)
- אין localStorage לנתונים קריטיים. מצב נשמר ב-URL כשאפשר: `useUrlParam` / `useUrlFlag` מ-`src/lib/urlState.ts`

## הוספת כלי לשיעור
1. `src/tools/LessonN.tsx`: רכיב שמשתמש בנתונים מ-`src/lib/data.ts` ומסתיים ב-`CheckNumber`
2. רישום ב-`src/tools/index.ts`
3. כותרת, תקציר ו-`ready: true` ב-`src/data/lessons.json`
4. `npm run check && npm run build`
