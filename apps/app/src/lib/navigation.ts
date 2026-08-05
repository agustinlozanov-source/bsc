import {
  LayoutDashboard,
  User,
  BookOpen,
  Wallet,
  Users,
  Calendar,
  Target,
  Mail,
  Settings,
  Building2,
  BarChart3,
  Award,
  Network,
  Bot,
  GraduationCap,
  PlusCircle,
  Map,
  Brain,
  Compass,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@bsc/validators";
import { ROLE_DASHBOARD } from "@/lib/roles";

export type NavItem = {
  label: string;
  icon: LucideIcon;
  /** Si falta, el ítem se muestra como "próximamente" (aún sin ruta). */
  href?: string;
};

/**
 * Sidebar por perfil (tomado del blueprint). El ítem Dashboard apunta a la raíz
 * del rol; el resto se irá conectando a su ruta en las siguientes fases.
 */
export const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  professional: [
    { label: "Dashboard", icon: LayoutDashboard, href: ROLE_DASHBOARD.professional },
    { label: "Mi perfil profesional", icon: User, href: "/professional/perfil" },
    { label: "Portal académico", icon: BookOpen, href: "/professional/academico" },
    { label: "Finanzas", icon: Wallet, href: "/professional/finanzas" },
    { label: "Mis alumnos", icon: Users, href: "/professional/alumnos" },
    { label: "Calendario", icon: Calendar },
    { label: "Objetivos y seguimiento", icon: Target },
    { label: "Mensajes", icon: Mail },
    { label: "Configuración", icon: Settings },
  ],
  user: [
    { label: "Dashboard", icon: LayoutDashboard, href: ROLE_DASHBOARD.user },
    { label: "Mi perfil de desarrollo", icon: User },
    { label: "Mis objetivos", icon: Target, href: "/user/objetivos" },
    { label: "Mis cursos", icon: BookOpen, href: "/user/cursos" },
    { label: "Catálogo", icon: Compass, href: "/user/catalogo" },
    { label: "Evaluaciones", icon: BarChart3 },
    { label: "Credenciales", icon: Award },
    { label: "Calendario", icon: Calendar },
    { label: "Mensajes", icon: Mail },
    { label: "Configuración", icon: Settings },
  ],
  enterprise_admin: [
    { label: "Dashboard", icon: LayoutDashboard, href: ROLE_DASHBOARD.enterprise_admin },
    { label: "Mi empresa", icon: Building2 },
    { label: "Mi equipo", icon: Users },
    { label: "Mapa de competencias", icon: Map },
    { label: "Psicometría", icon: Brain },
    { label: "Objetivos", icon: Target },
    { label: "Catálogo de programas", icon: BookOpen },
    { label: "Credenciales del equipo", icon: Award },
    { label: "Mi cuenta", icon: Wallet },
    { label: "Calendario", icon: Calendar },
    { label: "Configuración", icon: Settings },
  ],
  admin: [
    { label: "Dashboard", icon: LayoutDashboard, href: ROLE_DASHBOARD.admin },
    { label: "Gestión", icon: PlusCircle },
    { label: "Profesionales", icon: Users },
    { label: "Alumnos", icon: GraduationCap },
    { label: "Empresas", icon: Building2 },
    { label: "Académico", icon: BookOpen },
    { label: "Metodología BSC", icon: Target },
    { label: "Finanzas", icon: Wallet },
    { label: "Credenciales", icon: Award },
    { label: "Analytics", icon: BarChart3 },
    { label: "Calendario", icon: Calendar },
    { label: "Comunicación", icon: Mail },
    { label: "Configuración", icon: Settings },
  ],
  superadmin: [
    { label: "Dashboard global", icon: LayoutDashboard, href: ROLE_DASHBOARD.superadmin },
    { label: "Red de sucursales", icon: Network },
    { label: "Profesionales", icon: Users },
    { label: "Alumnos", icon: GraduationCap },
    { label: "Empresas", icon: Building2 },
    { label: "Académico global", icon: BookOpen },
    { label: "Metodología BSC", icon: Target },
    { label: "Finanzas globales", icon: Wallet },
    { label: "Motor de credenciales", icon: Award },
    { label: "Agentes IA", icon: Bot },
    { label: "Analytics global", icon: BarChart3 },
    { label: "Configuración del sistema", icon: Settings },
  ],
};
