import { Form, Head, Link } from '@inertiajs/react';
import GatewaySettingsController from '@/actions/App/Http/Controllers/Settings/GatewaySettingsController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import gateways from '@/routes/gateways';
import type { BreadcrumbItem } from '@/types';

type Gateway = {
    id: number;
    name: string;
    type: string;
    config: Record<string, string | number | null>;
    active: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Gateway Settings', href: gateways.index.url() },
    { title: 'Email Gateway', href: gateways.edit.url('email') },
];

export default function EmailGateway({ gateway }: { gateway: Gateway }) {
    const config = gateway.config ?? {};

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Email Gateway" />

            <h1 className="sr-only">Email Gateway</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Heading
                            variant="small"
                            title="Email Gateway"
                            description="Konfigurasi SMTP atau API untuk mengirim email"
                        />
                        <Link href={gateways.index.url()}>
                            <Button variant="outline" size="sm">
                                Kembali
                            </Button>
                        </Link>
                    </div>

                    <Form
                        action={GatewaySettingsController.update({ name: 'email' })}
                        className="space-y-6"
                        options={{ preserveScroll: true }}
                        transform={(data) => ({
                            ...data,
                            active: data.active === '1' || data.active === true,
                        })}
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label>Tipe</Label>
                                    <select
                                        name="type"
                                        defaultValue={gateway.type}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                    >
                                        <option value="smtp">SMTP</option>
                                        <option value="api">API (SendGrid/Postmark)</option>
                                    </select>
                                    <InputError message={errors.type} />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="config.host">Host</Label>
                                        <Input
                                            id="config.host"
                                            name="config[host]"
                                            defaultValue={String(config.host ?? '')}
                                            placeholder="smtp.example.com"
                                        />
                                        <InputError message={errors['config.host']} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="config.port">Port</Label>
                                        <Input
                                            id="config.port"
                                            name="config[port]"
                                            type="number"
                                            defaultValue={String(config.port ?? 587)}
                                        />
                                        <InputError message={errors['config.port']} />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="config.username">Username</Label>
                                    <Input
                                        id="config.username"
                                        name="config[username]"
                                        type="text"
                                        defaultValue={String(config.username ?? '')}
                                        autoComplete="off"
                                    />
                                    <InputError message={errors['config.username']} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="config.password">Password</Label>
                                    <Input
                                        id="config.password"
                                        name="config[password]"
                                        type="password"
                                        defaultValue={String(config.password ?? '')}
                                        placeholder="Kosongkan jika tidak diubah"
                                        autoComplete="new-password"
                                    />
                                    <InputError message={errors['config.password']} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="config.encryption">Encryption</Label>
                                    <select
                                        id="config.encryption"
                                        name="config[encryption]"
                                        defaultValue={String(config.encryption ?? 'tls')}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                    >
                                        <option value="">None</option>
                                        <option value="tls">TLS</option>
                                        <option value="ssl">SSL</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        name="active"
                                        value="1"
                                        defaultChecked={gateway.active}
                                        className="h-4 w-4 rounded border-input"
                                    />
                                    <Label htmlFor="active">Aktif</Label>
                                </div>

                                <div className="flex gap-2">
                                    <Button type="submit" disabled={processing}>
                                        {processing && <Spinner />}
                                        Simpan
                                    </Button>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button type="button" variant="outline">
                                                Test Kirim
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Test Email</DialogTitle>
                                                <DialogDescription>
                                                    Kirim email percobaan ke alamat berikut
                                                </DialogDescription>
                                            </DialogHeader>
                                            <Form
                                                action={GatewaySettingsController.testEmail()}
                                                className="space-y-4"
                                            >
                                                {({ processing: testProcessing }) => (
                                                    <>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="test-to">Email tujuan</Label>
                                                            <Input
                                                                id="test-to"
                                                                name="to"
                                                                type="email"
                                                                required
                                                                placeholder="user@example.com"
                                                            />
                                                            <InputError message={errors.to} />
                                                        </div>
                                                        <DialogFooter>
                                                            <Button
                                                                type="submit"
                                                                disabled={testProcessing}
                                                            >
                                                                {testProcessing && <Spinner />}
                                                                Kirim Test
                                                            </Button>
                                                        </DialogFooter>
                                                    </>
                                                )}
                                            </Form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
