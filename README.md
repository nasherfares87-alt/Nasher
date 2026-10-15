# منصة ناشر | Nashir AI Platform

منصة داخلية لموظفي شركة ناشر: توليد التصاميم، إنتاج الفيديو، ومساعد ذكي — ثنائية اللغة مع نظام صلاحيات كامل وقاعدة بيانات حقيقية.

## وضعان للتشغيل

| الوضع | الاستخدام | البيانات |
|---|---|---|
| **خادم + قاعدة بيانات** (الإنتاج) | سيرفر الشركة | مشتركة بين جميع الأجهزة ✅ |
| **عرض ثابت** (GitHub Pages) | تجربة عامة | محلية في متصفح الزائر فقط |

## التشغيل — نسخة الإنتاج (خادم + قاعدة بيانات)

```bash
npm install
cp .env.example .env        # عدّل AUTH_SECRET إلى قيمة عشوائية طويلة!
npx prisma db push          # إنشاء قاعدة البيانات (SQLite)
npx tsx prisma/seed.ts      # إنشاء الحسابات الأولية
npm run build && npm start  # يعمل على المنفذ 3000
```

### الحسابات الأولية (كلمة المرور الافتراضية: `Nashir@2026` — غيّروها فوراً)

| البريد | الدور |
|---|---|
| super@nashir.sa | SUPERADMIN |
| prod.admin@nashir.sa | ADMIN الإنتاج |
| it.admin@nashir.sa | ADMIN تقنية المعلومات |
| sarah@nashir.sa | EMPLOYEE تصميم |

لتغيير كلمة مرور seed: `SEED_PASSWORD=كلمة npm run seed`

## نظام الصلاحيات (مطبّق على الخادم وليس الواجهة فقط)

- **SUPERADMIN** — كل الصلاحيات + إنشاء مديري أقسام + إدارة الجميع
- **ADMIN قسم** — إنشاء/تعديل حسابات موظفي قسمه فقط، منح/سحب ميزات، تفعيل/إيقاف
- **EMPLOYEE** — الميزات الممنوحة له فقط (8 صلاحيات دقيقة)

حمايات مطبقة: منع تصعيد الأدوار · قصر مدير القسم على قسمه · تشفير كلمات المرور (bcrypt) · جلسات JWT في كوكيز httpOnly · رفض الطلبات من الحسابات الموقوفة.

## النشر على سيرفر الشركة

```bash
npm i -g pm2
pm2 start npm --name nashir -- start
pm2 save && pm2 startup
```
ثم Nginx كـ reverse proxy → المنفذ 3000 مع SSL للنطاق.

### PostgreSQL بدلاً من SQLite (اختياري لاحقاً)
غيّروا في `prisma/schema.prisma`: `provider = "postgresql"` و`DATABASE_URL` ثم `npx prisma db push`. لا تغييرات أخرى مطلوبة.

## بنية الكود

```
prisma/schema.prisma        مخطط قاعدة البيانات (User, Asset, ChatLog)
prisma/seed.ts              تهيئة الحسابات الأولية
src/lib/auth.ts             الجلسات JWT + سياسة الصلاحيات
src/lib/api.ts              طبقة العميل (تفصل تلقائياً بين وضع الخادم والعرض)
src/app/api/auth|users|assets|chat   API الخادم مع فحص الصلاحيات
```

## ربط مزودات الذكاء الاصطناعي الحقيقية

نقاط الاستبدال الجاهزة:
- `src/app/api/assets/route.ts` — تصميم: OpenAI Images / Stability / Ideogram · فيديو: Runway / Pika
- `src/app/api/chat/route.ts` — OpenAI / Gemini / نموذج داخلي

أضيفوا المفاتيح في `.env` (غير مرفوع لـ Git):
```
AUTH_SECRET=<قيمة عشوائية طويلة>
DATABASE_URL="file:./dev.db"
```
