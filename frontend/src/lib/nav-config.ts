import {
  LayoutDashboard,
  Users,
  Search,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  MessageSquare,
  Heart,
  CalendarDays,
  Settings,
  School,
  Building2,
  GraduationCap,
  UserSquare2,
  FileText,
  Star,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  NotebookPen,
  ShieldCheck,
  History,
  Tags,
  LifeBuoy,
  Bell,
  Newspaper,
  KeyRound,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

export type RoleConfig = {
  key: string;
  productName: string;
  workspaceLabel: string;
  brandIcon: LucideIcon;
  nav: NavItem[];
  systemNav?: NavItem[];
  user: { name: string; role: string };
};

export const parentNav: RoleConfig = {
  key: "parent",
  productName: "Kids Oasis",
  workspaceLabel: "Parent Academy",
  brandIcon: Heart,
  nav: [
    { label: "Dashboard", href: "/parent", icon: LayoutDashboard },
    { label: "My Children", href: "/parent/children", icon: Users },
    { label: "Discover", href: "/parent/discover", icon: Search },
    { label: "Bookings", href: "/parent/bookings", icon: CalendarCheck },
    { label: "Enrollments", href: "/parent/enrollments", icon: ClipboardList },
    { label: "Payments", href: "/parent/payments", icon: CreditCard },
    { label: "Messages", href: "/parent/messages", icon: MessageSquare, badge: "3" },
    { label: "Favorites", href: "/parent/favorites", icon: Heart },
    { label: "Events", href: "/parent/events", icon: CalendarDays },
  ],
  user: { name: "Amira Hassan", role: "Parent" },
};

export const ownerNav: RoleConfig = {
  key: "owner",
  productName: "Kids Oasis",
  workspaceLabel: "Academy Management",
  brandIcon: School,
  nav: [
    { label: "Dashboard", href: "/owner", icon: LayoutDashboard },
    { label: "Academy Profile", href: "/owner/profile", icon: GraduationCap },
    { label: "Branches", href: "/owner/branches", icon: Building2 },
    { label: "Programs", href: "/owner/programs", icon: BookOpen },
    { label: "Teachers", href: "/owner/teachers", icon: UserSquare2 },
    { label: "Students", href: "/owner/students", icon: Users },
    { label: "Applications", href: "/owner/applications", icon: FileText, badge: "3" },
    { label: "Bookings", href: "/owner/bookings", icon: CalendarCheck },
    { label: "Reviews", href: "/owner/reviews", icon: Star },
    { label: "Payments", href: "/owner/payments", icon: CreditCard },
    { label: "Analytics", href: "/owner/analytics", icon: BarChart3 },
    { label: "Messages", href: "/owner/messages", icon: MessageSquare },
  ],
  user: { name: "Sarah Jenkins", role: "Academy Director" },
};

export const teacherNav: RoleConfig = {
  key: "teacher",
  productName: "Kids Oasis",
  workspaceLabel: "Teacher Workspace",
  brandIcon: School,
  nav: [
    { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
    { label: "Classes", href: "/teacher/classes", icon: BookOpen },
    { label: "Students", href: "/teacher/students", icon: Users },
    { label: "Attendance", href: "/teacher/attendance", icon: ClipboardCheck },
    { label: "Reports", href: "/teacher/reports", icon: BarChart3 },
    { label: "Assignments", href: "/teacher/assignments", icon: NotebookPen },
    { label: "Messages", href: "/teacher/messages", icon: MessageSquare },
    { label: "Calendar", href: "/teacher/calendar", icon: CalendarDays },
  ],
  user: { name: "Maria Rodriguez", role: "Lead Teacher · Toddlers" },
};

export const adminNav: RoleConfig = {
  key: "admin",
  productName: "Kids Oasis",
  workspaceLabel: "Enterprise",
  brandIcon: ShieldCheck,
  nav: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Academies", href: "/admin/academies", icon: School },
    { label: "Programs", href: "/admin/programs", icon: BookOpen },
    { label: "Categories", href: "/admin/categories", icon: Tags },
    { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
    { label: "Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
    { label: "Blog", href: "/admin/blog", icon: Newspaper },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Roles & Permissions", href: "/admin/roles", icon: KeyRound },
  ],
  systemNav: [
    { label: "Audit Logs", href: "/admin/audit-logs", icon: History },
    { label: "Support", href: "/admin/support", icon: LifeBuoy },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ],
  user: { name: "Alex Mercer", role: "Super Admin" },
};
