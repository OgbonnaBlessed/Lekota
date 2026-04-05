import {
  Briefcase,
  Building2,
  CalendarDays,
  ClipboardClock,
  FileBarChart,
  LayoutDashboard,
  LucideAlarmClock,
  LucideProps,
  User,
  Users
} from "lucide-react";

export type Role = "admin" | "tenant_admin" | "staff" | "client";

export const sidebarConfig: Record<
  Role,
  {
    name: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
    href: string;
  }[]
> = {
  admin: [
    { name: "Overview", icon: LayoutDashboard, href: "/admin/overview" },
    { name: "Tenants", icon: Building2, href: "/admin/tenants" },
  ],

  tenant_admin: [
    { name: "Overview", icon: LayoutDashboard, href: "/tenant/overview" },
    { name: "Services", icon: Briefcase, href: "/tenant/services" },
    { name: "Users", icon: Users, href: "/tenant/users" },
    {
      name: "Payment History",
      icon: FileBarChart,
      href: "/tenant/payment-history",
    },
  ],

  staff: [
    { name: "Profile", icon: User, href: "/staff/profile" },
    {
      name: "Availability",
      icon: LucideAlarmClock,
      href: "/staff/availability",
    },
    {
      name: "Schedules",
      icon: CalendarDays,
      href: "/staff/schedules",
    },
  ],

  client: [
    { name: "Profile", icon: User, href: "/client/profile" },
    { name: "Appointments", icon: ClipboardClock, href: "/client/appointments" },
    { name: "Services", icon: Briefcase, href: "/client/services" },
  ],
};
