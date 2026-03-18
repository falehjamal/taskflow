import { Form, Head } from '@inertiajs/react';
import WorkspaceInvitationController from '@/actions/App/Http/Controllers/WorkspaceInvitationController';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

export default function InvitationShow({
    invitation,
}: {
    invitation: {
        email: string;
        workspace_name: string;
        token: string;
    };
}) {
    return (
        <AuthLayout
            title="Undangan workspace"
            description={`Anda diundang untuk bergabung ke "${invitation.workspace_name}"`}
        >
            <Head title="Terima undangan" />
            <div className="space-y-6">
                <p className="text-muted-foreground text-sm">
                    Terima undangan ini untuk bergabung ke{' '}
                    <strong>{invitation.workspace_name}</strong> sebagai member.
                    Undangan dikirim ke {invitation.email}.
                </p>
                <Form
                    {...WorkspaceInvitationController.accept.form(
                        invitation.token,
                    )}
                >
                    {({ processing }) => (
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                                    Terima undangan
                        </Button>
                    )}
                </Form>
            </div>
        </AuthLayout>
    );
}
