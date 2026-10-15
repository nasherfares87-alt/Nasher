export type Role = 'SUPERADMIN' | 'ADMIN' | 'EMPLOYEE';
export type Department = 'PRODUCTION' | 'PROJECT_MANAGEMENT' | 'IT' | 'DESIGN' | 'MARKETING' | 'HR' | 'FINANCE' | 'BUSINESS_DEVELOPMENT';

export interface User {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  role: Role;
  department: Department;
  permissions: Permission[];
  active: boolean;
  createdAt: string;
}

export type Permission =
  | 'ai.design'
  | 'ai.video'
  | 'ai.chat'
  | 'users.manage'
  | 'users.create'
  | 'reports.view'
  | 'plans.generate'
  | 'assets.download';

export const PERMISSION_LABELS: Record<Permission, { ar: string; en: string }> = {
  'ai.design': { ar: 'توليد التصاميم', en: 'Generate designs' },
  'ai.video': { ar: 'توليد الفيديو', en: 'Generate videos' },
  'ai.chat': { ar: 'المساعد الذكي', en: 'AI chat' },
  'users.manage': { ar: 'إدارة المستخدمين', en: 'Manage users' },
  'users.create': { ar: 'إنشاء حسابات', en: 'Create accounts' },
  'reports.view': { ar: 'عرض التقارير', en: 'View reports' },
  'plans.generate': { ar: 'إعداد الخطط', en: 'Generate plans' },
  'assets.download': { ar: 'تحميل الملفات', en: 'Download assets' },
};

export const DEPARTMENT_LABELS: Record<Department, { ar: string; en: string }> = {
  PRODUCTION: { ar: 'الإنتاج', en: 'Production' },
  PROJECT_MANAGEMENT: { ar: 'إدارة المشاريع', en: 'Project Management' },
  IT: { ar: 'تقنية المعلومات', en: 'IT' },
  DESIGN: { ar: 'التصميم', en: 'Design' },
  MARKETING: { ar: 'التسويق', en: 'Marketing' },
  HR: { ar: 'الموارد البشرية', en: 'HR' },
  FINANCE: { ar: 'المالية', en: 'Finance' },
  BUSINESS_DEVELOPMENT: { ar: 'تطوير الأعمال', en: 'Business Development' },
};

export const ROLE_LABELS: Record<Role, { ar: string; en: string }> = {
  SUPERADMIN: { ar: 'مدير المنصة العام', en: 'Super Admin' },
  ADMIN: { ar: 'مدير قسم', en: 'Department Admin' },
  EMPLOYEE: { ar: 'موظف', en: 'Employee' },
};

export interface DesignRequest {
  id: string;
  userId: string;
  prompt: string;
  status: 'pending' | 'done';
  resultUrl?: string;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  meta?: Record<string, unknown>;
}

export interface GeneratedPlan {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}
