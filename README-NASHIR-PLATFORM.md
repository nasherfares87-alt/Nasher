# منصة ناشر | Nashir AI Platform

منصة داخلية لموظفي شركة ناشر لتوظيف الذكاء الاصطناعي: توليد التصاميم والجرافيك، إنتاج الفيديو، ومساعد ذكي لجمع البيانات وإعداد الخطط — ثنائية اللغة (عربي/إنجليزي) مع نظام صلاحيات متعدد المستويات.

## الميزات

- **استوديو التصميم** — توليد تصاميم وجرافيك من وصف نصي (`/design`)
- **استوديو الفيديو** — طلبات إنتاج فيديو مع تتبع حالة المهمة (`/video`)
- **المساعد الذكي** — شات لجمع البيانات وإعداد الخطط (`/chat`)
- **إدارة المستخدمين** — لوحة سياسة مستخدمين سهلة (`/users`)

## نظام الصلاحيات

| الدور | الصلاحيات |
|---|---|
| SUPERADMIN | كل الصلاحيات + إدارة جميع الأقسام والمستخدمين |
| ADMIN (مدير قسم) | إنشاء حسابات موظفي قسمه وتفعيل/تعطيل حساباتهم ومنح الميزات |
| EMPLOYEE | فقط الميزات الممنوحة له |

الأقسام المدعومة: الإنتاج، إدارة المشاريع، تقنية المعلومات، التصميم، التسويق، الموارد البشرية، المالية.

## حسابات تجريبية

| البريد | الدور |
|---|---|
| super@nashir.sa | SUPERADMIN |
| prod.admin@nashir.sa | ADMIN (الإنتاج) |
| it.admin@nashir.sa | ADMIN (تقنية المعلومات) |
| sarah@nashir.sa | EMPLOYEE (التصميم) |

كلمة المرور تجريبية حالياً (الطبقة الحالية Mock).

## التشغيل المحلي

```bash
npm install
npm run dev        # ثم افتح http://localhost:3000
```

## النشر على سيرفر الشركة (hassef.sa أو نطاق ناشر)

```bash
npm run build
npm start          # يعمل على المنفذ 3000
```

### خيارات النشر

1. **PM2** (موصى بها لسيرفر Linux):
   ```bash
   npm i -g pm2
   pm2 start npm --name nashir -- start
   pm2 save && pm2 startup
   ```
2. **Docker**:
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```
3. ضع Nginx كـ reverse proxy يشير إلى المنفذ 3000 مع شهادة SSL للنطاق.

## ربط مزودات الذكاء الاصطناعي الحقيقية

المنصة تعمل حالياً بطبقة Mock في:

- `src/app/api/mock/design/route.ts` — استبدلها بـ OpenAI Images / Stability / Ideogram
- `src/app/api/mock/video/route.ts` — استبدلها بـ Runway / Pika / Sora
- `src/app/api/mock/chat/route.ts` — استبدلها بـ OpenAI / Gemini / نموذج داخلي

أضف المفاتيح في `.env.local` (لا ترفعها إلى Git):

```
OPENAI_API_KEY=...
GEMINI_API_KEY=...
```

## الخطوة التالية الموصى بها (للإنتاج)

- استبدال المخزن المحلي (zustand/persist) بقاعدة بيانات حقيقية (PostgreSQL + Prisma)
- مصادقة فعلية (NextAuth مع Azure AD/Google Workspace الخاص بالشركة)
- رفع الملفات إلى تخزين سحابي (S3 / Azure Blob)
