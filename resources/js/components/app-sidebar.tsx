import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import workspaces from '@/routes/workspaces';
import { edit as editAppearance } from '@/routes/appearance';
import gateways from '@/routes/gateways';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.url(),
        icon: LayoutGrid,
    },
    {
        title: 'Workspaces',
        href: workspaces.index.url(),
        icon: Users,
    },
];

const baseSettingsNavItems: NavItem[] = [
    { title: 'Profil', href: edit(), icon: null },
    { title: 'Keamanan', href: editSecurity(), icon: null },
    { title: 'Tampilan', href: editAppearance(), icon: null },
];

const adminSettingsNavItems: NavItem[] = [
    { title: 'Email Gateway', href: gateways.edit.url('email'), icon: null },
    { title: 'WA Gateway', href: gateways.edit.url('wa'), icon: null },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: { is_administrator?: boolean } } }>().props;
    const isAdmin = auth?.user?.is_administrator ?? false;
    const settingsNavItems: NavItem[] = [
        ...baseSettingsNavItems,
        ...(isAdmin ? adminSettingsNavItems : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard.url()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} groupLabel="Platform" />
                <NavMain items={settingsNavItems} groupLabel="Setting" />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
