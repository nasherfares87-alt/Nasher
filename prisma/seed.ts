import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const users = [
  {
    name: 'المدير العام',
    nameEn: 'Super Admin',
    email: 'super@nashir.sa',
    role: 'SUPERADMIN',
    department: 'PRODUCTION',
    permissions: ['ai.design', 'ai.video', 'ai.chat', 'users.manage', 'users.create', 'reports.view', 'plans.generate', 'assets.download'],
  },
  {
    name: 'مدير الإنتاج',
    nameEn: 'Production Admin',
    email: 'prod.admin@nashir.sa',
    role: 'ADMIN',
    department: 'PRODUCTION',
    permissions: ['ai.design', 'ai.video', 'ai.chat', 'users.create', 'plans.generate', 'assets.download'],
  },
  {
    name: 'مدير تقنية المعلومات',
    nameEn: 'IT Admin',
    email: 'it.admin@nashir.sa',
    role: 'ADMIN',
    department: 'IT',
    permissions: ['ai.chat', 'users.create', 'reports.view', 'plans.generate'],
  },
  {
    name: 'سارة المطيري',
    nameEn: 'Sarah Almutairi',
    email: 'sarah@nashir.sa',
    role: 'EMPLOYEE',
    department: 'DESIGN',
    permissions: ['ai.design', 'ai.chat'],
  },
];

async function main() {
  const pass = process.env.SEED_PASSWORD || 'Nashir@2026';
  const hash = await bcrypt.hash(pass, 10);
  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { passwordHash: hash },
      create: { ...u, passwordHash: hash, permissions: JSON.stringify(u.permissions) },
    });
  }
  console.log(`Seeded ${users.length} users. Password: ${pass}`);
}

main().finally(() => prisma.$disconnect());
