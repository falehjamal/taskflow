import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import gateways from '@/routes/gateways';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gateway Settings',
        href: gateways.index.url(),
    },
];

const GATEWAY_ITEMS = [
    { name: 'email', title: 'Email Gateway', description: 'SMTP atau API (SendGrid, Postmark)' },
    { name: 'wa', title: 'WA Gateway', description: 'API atau Baileys connector' },
];

export default function GatewaysIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gateway Settings" />

            <h1 className="sr-only">Gateway Settings</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Gateway Settings"
                        description="Konfigurasi Email dan WhatsApp untuk notifikasi"
                    />

                    <div className="space-y-4">
                        {GATEWAY_ITEMS.map((item) => (
                            <Link
                                key={item.name}
                                href={gateways.edit.url(item.name)}
                                className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
                            >
                                <h3 className="font-medium">{item.title}</h3>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    {item.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
