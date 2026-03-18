import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProjectController from '@/actions/App/Http/Controllers/ProjectController';
import WorkspaceController from '@/actions/App/Http/Controllers/WorkspaceController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
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
    DialogClose,
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
import members from '@/routes/workspaces/members';
import workspaces from '@/routes/workspaces';
import type { BreadcrumbItem } from '@/types';

type User = {
    id: number;
    name: string;
    email: string;
    pivot: { role: string };
};

type Project = {
    id: number;
    name: string;
    description: string | null;
    start_date: string | null;
    due_date: string | null;
};

type Workspace = {
    id: number;
    name: string;
    description: string | null;
    users: User[];
    projects: Project[];
    users_count: number;
    projects_count: number;
};

export default function WorkspaceShow({
    workspace,
    canManage,
}: {
    workspace: Workspace;
    canManage: boolean;
}) {
    const { flash } = usePage().props as {
        flash?: {
            invitation_url?: string;
            success?: string;
            error?: string;
            info?: string;
        };
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Workspaces', href: workspaces.index.url() },
        {
            title: workspace.name,
            href: workspaces.show.url(workspace),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={workspace.name} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {flash?.invitation_url && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                            Undangan dibuat. Bagikan tautan ini:
                        </p>
                        <code className="mt-2 block break-all rounded bg-green-100 px-2 py-1 text-xs dark:bg-green-900">
                            {window.location.origin}
                            {flash.invitation_url}
                        </code>
                    </div>
                )}

                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                        {flash.success}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            {workspace.name}
                        </h1>
                        {workspace.description && (
                            <p className="text-muted-foreground mt-1 text-sm">
                                {workspace.description}
                            </p>
                        )}
                    </div>
                    {canManage && (
                        <div className="flex gap-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Ubah</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>Ubah workspace</DialogTitle>
                                    <DialogDescription>
                                        Perbarui nama dan deskripsi workspace.
                                    </DialogDescription>
                                    <Form
                                        {...WorkspaceController.update.form(
                                            workspace,
                                        )}
                                        className="space-y-4"
                                    >
                                        {({ processing, errors }) => (
                                            <>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="edit-name">
                                                        Nama
                                                    </Label>
                                                    <Input
                                                        id="edit-name"
                                                        name="name"
                                                        defaultValue={
                                                            workspace.name
                                                        }
                                                        required
                                                        autoComplete="off"
                                                    />
                                                    <InputError
                                                        message={errors.name}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="edit-description">
                                                        Deskripsi
                                                    </Label>
                                                    <Input
                                                        id="edit-description"
                                                        name="description"
                                                        defaultValue={
                                                            workspace.description ||
                                                            ''
                                                        }
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
                                                        Simpan
                                                    </Button>
                                                </DialogFooter>
                                            </>
                                        )}
                                    </Form>
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="destructive">
                                        Hapus
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>
                                        Hapus workspace?
                                    </DialogTitle>
                                    <DialogDescription>
                                        Workspace dan semua project di dalamnya
                                        akan terhapus permanen. Tindakan ini
                                        tidak dapat dibatalkan.
                                    </DialogDescription>
                                    <Form
                                        {...WorkspaceController.destroy.form(
                                            workspace,
                                        )}
                                    >
                                        {({ processing }) => (
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                    >
                                                        Batal
                                                    </Button>
                                                </DialogClose>
                                                <Button
                                                    type="submit"
                                                    variant="destructive"
                                                    disabled={processing}
                                                >
                                                    {processing && (
                                                        <Spinner />
                                                    )}
                                                    Hapus
                                                </Button>
                                            </DialogFooter>
                                        )}
                                    </Form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Members</CardTitle>
                                    <CardDescription>
                                        {workspace.users_count} member
                                        {workspace.users_count !== 1 ? 's' : ''}
                                    </CardDescription>
                                </div>
                                {canManage && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size="sm">
                                                Undang
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle>
                                                Undang member
                                            </DialogTitle>
                                            <DialogDescription>
                                                Kirim undangan untuk bergabung
                                                ke workspace ini.
                                            </DialogDescription>
                                            <Form
                                                {...WorkspaceController.invite.form(
                                                    workspace,
                                                )}
                                                className="space-y-4"
                                            >
                                                {({ processing, errors }) => (
                                                    <>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="email">
                                                                Email
                                                            </Label>
                                                            <Input
                                                                id="email"
                                                                name="email"
                                                                type="email"
                                                                required
                                                                placeholder="user@example.com"
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors.email
                                                                }
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="role">
                                                                Peran
                                                            </Label>
                                                            <select
                                                                id="role"
                                                                name="role"
                                                                defaultValue="member"
                                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                            >
                                                                <option value="member">
                                                                    Member
                                                                </option>
                                                                <option value="owner">
                                                                    Owner
                                                                </option>
                                                            </select>
                                                            <InputError
                                                                message={
                                                                    errors.role
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
                                                                Undang
                                                            </Button>
                                                        </DialogFooter>
                                                    </>
                                                )}
                                            </Form>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {workspace.users.map((user) => (
                                    <li
                                        key={user.id}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {user.name}
                                            </p>
                                            <p className="text-muted-foreground text-sm">
                                                {user.email}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={
                                                    user.pivot.role === 'owner'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {user.pivot.role}
                                            </Badge>
                                            {canManage &&
                                                user.pivot.role !== 'owner' && (
                                                    <>
                                                        <Form
                                                            {...members.update.form(
                                                                {
                                                                    workspace,
                                                                    user,
                                                                },
                                                            )}
                                                            className="inline"
                                                        >
                                                            <select
                                                                name="role"
                                                                defaultValue={
                                                                    user.pivot
                                                                        .role
                                                                }
                                                                onChange={(e) =>
                                                                    e.target
                                                                        .form
                                                                        ?.requestSubmit()
                                                                }
                                                                className="h-8 w-24 rounded-md border border-input bg-transparent px-2 text-sm"
                                                            >
                                                                <option value="member">
                                                                    Member
                                                                </option>
                                                                <option value="owner">
                                                                    Owner
                                                                </option>
                                                            </select>
                                                        </Form>
                                                        <Form
                                                            {...members.remove.form(
                                                                {
                                                                    workspace,
                                                                    user,
                                                                },
                                                            )}
                                                        >
                                                            <Button
                                                                type="submit"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-destructive hover:text-destructive"
                                                            >
                                                                Hapus
                                                            </Button>
                                                        </Form>
                                                    </>
                                                )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Projects</CardTitle>
                                    <CardDescription>
                                        {workspace.projects_count} project
                                        {workspace.projects_count !== 1
                                            ? 's'
                                            : ''}
                                    </CardDescription>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="sm">
                                            Tambah project
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogTitle>
                                            Buat project
                                        </DialogTitle>
                                        <DialogDescription>
                                            Tambah project baru ke workspace
                                            ini.
                                        </DialogDescription>
                                        <Form
                                            {...ProjectController.store.form(
                                                workspace,
                                            )}
                                            className="space-y-4"
                                        >
                                            {({ processing, errors }) => (
                                                <>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="project-name">
                                                            Nama
                                                        </Label>
                                                        <Input
                                                            id="project-name"
                                                            name="name"
                                                            required
                                                            placeholder="Nama project"
                                                            autoComplete="off"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.name
                                                            }
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="project-description">
                                                            Deskripsi
                                                        </Label>
                                                        <Input
                                                            id="project-description"
                                                            name="description"
                                                            placeholder="Opsional"
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="start_date">
                                                                Start date
                                                            </Label>
                                                            <Input
                                                                id="start_date"
                                                                name="start_date"
                                                                type="date"
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="due_date">
                                                                Due date
                                                            </Label>
                                                            <Input
                                                                id="due_date"
                                                                name="due_date"
                                                                type="date"
                                                            />
                                                        </div>
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
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {workspace.projects.length === 0 ? (
                                    <li className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
                                        Belum ada project
                                    </li>
                                ) : (
                                    workspace.projects.map((project) => (
                                        <li
                                            key={project.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <Link
                                                href={workspaces.projects.show.url(
                                                    { workspace, project },
                                                )}
                                                className="flex-1 hover:opacity-80"
                                            >
                                                <p className="font-medium">
                                                    {project.name}
                                                </p>
                                                {(project.start_date ||
                                                    project.due_date) && (
                                                    <p className="text-muted-foreground text-sm">
                                                        {project.start_date &&
                                                            new Date(
                                                                project.start_date,
                                                            ).toLocaleDateString()}
                                                        {project.start_date &&
                                                            project.due_date &&
                                                            ' — '}
                                                        {project.due_date &&
                                                            new Date(
                                                                project.due_date,
                                                            ).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </Link>
                                            <div className="flex gap-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            Ubah
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogTitle>
                                                            Ubah project
                                                        </DialogTitle>
                                                        <Form
                                                            {...ProjectController.update.form(
                                                                {
                                                                    workspace,
                                                                    project,
                                                                },
                                                            )}
                                                            className="space-y-4"
                                                        >
                                                            {({
                                                                processing,
                                                                errors,
                                                            }) => (
                                                                <>
                                                                    <div className="grid gap-2">
                                                                        <Label htmlFor="edit-project-name">
                                                                            Nama
                                                                        </Label>
                                                                        <Input
                                                                            id="edit-project-name"
                                                                            name="name"
                                                                            defaultValue={
                                                                                project.name
                                                                            }
                                                                            required
                                                                            autoComplete="off"
                                                                        />
                                                                        <InputError
                                                                            message={
                                                                                errors.name
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div className="grid gap-2">
                                                                        <Label htmlFor="edit-project-description">
                                                                            Deskripsi
                                                                        </Label>
                                                                        <Input
                                                                            id="edit-project-description"
                                                                            name="description"
                                                                            defaultValue={
                                                                                project.description ||
                                                                                ''
                                                                            }
                                                                            autoComplete="off"
                                                                        />
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        <div className="grid gap-2">
                                                                            <Label htmlFor="edit-start_date">
                                                                                Start date
                                                                            </Label>
                                                                            <Input
                                                                                id="edit-start_date"
                                                                                name="start_date"
                                                                                type="date"
                                                                                defaultValue={
                                                                                    project.start_date?.slice(
                                                                                        0,
                                                                                        10,
                                                                                    ) ||
                                                                                    ''
                                                                                }
                                                                            />
                                                                        </div>
                                                                        <div className="grid gap-2">
                                                                            <Label htmlFor="edit-due_date">
                                                                                Due date
                                                                            </Label>
                                                                            <Input
                                                                                id="edit-due_date"
                                                                                name="due_date"
                                                                                type="date"
                                                                                defaultValue={
                                                                                    project.due_date?.slice(
                                                                                        0,
                                                                                        10,
                                                                                    ) ||
                                                                                    ''
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <DialogFooter>
                                                                        <Button
                                                                            type="submit"
                                                                            disabled={
                                                                                processing
                                                                            }
                                                                        >
                                                                            {processing && (
                                                                                <Spinner />
                                                                            )}
                                                                            Save
                                                                        </Button>
                                                                    </DialogFooter>
                                                                </>
                                                            )}
                                                        </Form>
                                                    </DialogContent>
                                                </Dialog>
                                                <Form
                                                    {...ProjectController.destroy.form(
                                                        {
                                                            workspace,
                                                            project,
                                                        },
                                                    )}
                                                >
                                                    <Button
                                                        type="submit"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                    Hapus
                                                </Button>
                                                </Form>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
