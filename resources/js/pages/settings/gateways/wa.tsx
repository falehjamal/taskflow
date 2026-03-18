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
    { title: 'WA Gateway', href: gateways.edit.url('wa') },
];

export default function WaGateway({ gateway }: { gateway: Gateway }) {
    const config = gateway.config ?? {};

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="WA Gateway" />

            <h1 className="sr-only">WA Gateway</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Heading
                            variant="small"
                            title="WA Gateway"
                            description="Konfigurasi API atau Baileys untuk WhatsApp"
                        />
                        <Link href={gateways.index.url()}>
                            <Button variant="outline" size="sm">
                                Kembali
                            </Button>
                        </Link>
                    </div>

                    <Form
                        action={GatewaySettingsController.update({ name: 'wa' })}
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
                                        <option value="api">API</option>
                                        <option value="baileys">Baileys (placeholder)</option>
                                    </select>
                                    <InputError message={errors.type} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="config.base_url">Base URL</Label>
                                    <Input
                                        id="config.base_url"
                                        name="config[base_url]"
                                        defaultValue={String(config.base_url ?? '')}
                                        placeholder="https://api.wa.example.com"
                                    />
                                    <InputError message={errors['config.base_url']} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="config.api_key">API Key</Label>
                                    <Input
                                        id="config.api_key"
                                        name="config[api_key]"
                                        type="password"
                                        defaultValue={String(config.api_key ?? '')}
                                        placeholder="Kosongkan jika tidak diubah"
                                        autoComplete="new-password"
                                    />
                                    <InputError message={errors['config.api_key']} />
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
                                                <DialogTitle>Test WA</DialogTitle>
                                                <DialogDescription>
                                                    Kirim pesan percobaan ke nomor berikut (format: 08xxx)
                                                </DialogDescription>
                                            </DialogHeader>
                                            <Form
                                                action={GatewaySettingsController.testWa()}
                                                className="space-y-4"
                                            >
                                                {({ processing: testProcessing }) => (
                                                    <>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="test-to">Nomor WA</Label>
                                                            <Input
                                                                id="test-to"
                                                                name="to"
                                                                type="tel"
                                                                required
                                                                placeholder="08123456789"
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
