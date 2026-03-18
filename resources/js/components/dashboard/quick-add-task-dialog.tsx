import { Form } from '@inertiajs/react';
import { useState } from 'react';
import TaskController from '@/actions/App/Http/Controllers/TaskController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Project = {
    id: number;
    name: string;
    workspace: { id: number; name: string };
};

const STATUS_OPTIONS = [
    { value: 'todo', label: 'Todo' },
    { value: 'doing', label: 'Doing' },
    { value: 'done', label: 'Done' },
];

const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
];

export function QuickAddTaskDialog({
    projects,
    trigger,
    filters = {},
}: {
    projects: Project[];
    trigger: React.ReactNode;
    filters?: Record<string, string | undefined>;
}) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(
        projects[0] ?? null,
    );

    if (projects.length === 0) {
        return (
            <Button disabled size="sm">
                Tambah task
            </Button>
        );
    }

    const project = selectedProject ?? projects[0];
    const action = TaskController.store.url({
        workspace: { id: project.workspace.id },
        project: { id: project.id },
    });

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah task</DialogTitle>
                    <DialogDescription>
                        Buat task baru. Pilih project terlebih dahulu.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    action={action}
                    method="post"
                    className="space-y-4"
                    data={{
                        redirect: 'dashboard',
                        ...Object.fromEntries(
                            Object.entries(filters).filter(
                                ([, v]) => v !== undefined && v !== '',
                            ),
                        ),
                    }}
                >
                    <div className="grid gap-2">
                        <Label htmlFor="quick-project">Project</Label>
                        <select
                            id="quick-project"
                            value={project.id}
                            onChange={(e) => {
                                const p = projects.find(
                                    (x) => x.id === Number(e.target.value),
                                );
                                if (p) setSelectedProject(p);
                            }}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        >
                            {projects.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} ({p.workspace?.name})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="quick-title">Judul</Label>
                        <Input
                            id="quick-title"
                            name="title"
                            required
                            placeholder="Judul task"
                            autoComplete="off"
                        />
                        <InputError message={undefined} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="quick-description">Deskripsi</Label>
                        <Input
                            id="quick-description"
                            name="description"
                            placeholder="Opsional"
                            autoComplete="off"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="grid gap-2">
                            <Label htmlFor="quick-status">Status</Label>
                            <select
                                id="quick-status"
                                name="status"
                                defaultValue="todo"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                            >
                                {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="quick-priority">Priority</Label>
                            <select
                                id="quick-priority"
                                name="priority"
                                defaultValue="medium"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                            >
                                {PRIORITY_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="quick-due_date">Due date</Label>
                        <Input id="quick-due_date" name="due_date" type="date" />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Simpan</Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
