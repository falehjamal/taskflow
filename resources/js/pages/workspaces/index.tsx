import { Form, Head, Link } from '@inertiajs/react';
import WorkspaceController from '@/actions/App/Http/Controllers/WorkspaceController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import workspacesRoutes from '@/routes/workspaces';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Workspaces',
        href: workspacesRoutes.index.url(),
    },
];

type Workspace = {
    id: number;
    name: string;
    description: string | null;
    users_count: number;
    projects_count: number;
};

export default function WorkspacesIndex({
    workspaces: workspaceList,
}: {
    workspaces: Workspace[];
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Workspaces" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
            <Heading
                title="Workspaces"
                description="Kelola workspace Anda dan berkolaborasi dengan tim"
            />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Buat workspace</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Buat workspace</DialogTitle>
                            <DialogDescription>
                                Tambah workspace baru untuk mengorganisir
                                project dan mengundang anggota tim.
                            </DialogDescription>
                            <Form
                                {...WorkspaceController.store.form()}
                                className="space-y-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Nama</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                required
                                                placeholder="Workspace Saya"
                                                autoComplete="off"
                                            />
                                            <InputError message={errors.name} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="description">
                                                Deskripsi
                                            </Label>
                                            <Input
                                                id="description"
                                                name="description"
                                                placeholder="Deskripsi (opsional)"
                                                autoComplete="off"
                                            />
                                            <InputError
                                                message={errors.description}
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing && <Spinner />}
                                                Buat
                                            </Button>
                                        </DialogFooter>
                                    </>
                                )}
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {workspaceList.length === 0 ? (
                        <Card className="col-span-full">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <p className="text-muted-foreground mb-4 text-center">
                                    Belum ada workspace. Buat workspace
                                    pertama Anda untuk memulai.
                                </p>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button>Buat workspace</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogTitle>
                                            Buat workspace
                                        </DialogTitle>
                                        <DialogDescription>
                                            Tambah workspace baru untuk
                                            mengorganisir project dan mengundang
                                            anggota tim.
                                        </DialogDescription>
                                        <Form
                                            {...WorkspaceController.store.form()}
                                            className="space-y-4"
                                        >
                                            {({ processing, errors }) => (
                                                <>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="name-empty">
                                                            Nama
                                                        </Label>
                                                        <Input
                                                            id="name-empty"
                                                            name="name"
                                                            required
                                                            placeholder="Workspace Saya"
                                                            autoComplete="off"
                                                        />
                                                        <InputError
                                                            message={errors.name}
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="description-empty">
                                                            Deskripsi
                                                        </Label>
                                                        <Input
                                                            id="description-empty"
                                                            name="description"
                                                            placeholder="Deskripsi (opsional)"
                                                            autoComplete="off"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.description
                                                            }
                                                        />
                                                    </div>
                                                    <DialogFooter>
                                                        <Button
                                                            type="submit"
                                                            disabled={processing}
                                                        >
                                                            {processing && (
                                                                <Spinner />
                                                            )}
                                                            Buat
                                                        </Button>
                                                    </DialogFooter>
                                                </>
                                            )}
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    ) : (
                        workspaceList.map((workspace) => (
                            <Link
                                key={workspace.id}
                                href={workspacesRoutes.show.url(workspace)}
                                prefetch
                            >
                                <Card className="h-full transition-colors hover:bg-muted/50">
                                    <CardHeader>
                                        <CardTitle>{workspace.name}</CardTitle>
                                        <CardDescription>
                                            {workspace.description ||
                                                'No description'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-4 text-sm text-muted-foreground">
                                            <span>
                                                {workspace.users_count} member
                                                {workspace.users_count !== 1
                                                    ? 's'
                                                    : ''}
                                            </span>
                                            <span>
                                                {workspace.projects_count}{' '}
                                                project
                                                {workspace.projects_count !== 1
                                                    ? 's'
                                                    : ''}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
