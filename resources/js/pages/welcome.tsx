import { Head, Link, usePage } from '@inertiajs/react';
import {
    CheckSquare2,
    ListTodo,
    Calendar,
    Zap,
} from 'lucide-react';
import { dashboard, login, register } from '@/routes';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="TaskFlow - Kelola Tugas Lebih Produktif">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <header className="border-b border-[#e3e3e0] dark:border-[#3E3E3A]">
                    <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
                        <Link
                            href="/"
                            className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]"
                        >
                            TaskFlow
                        </Link>
                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded-lg bg-[#28A745] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#218838] dark:bg-[#34c759] dark:text-white dark:hover:bg-[#2d9545]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-lg px-5 py-2.5 text-sm font-medium text-[#1b1b18] transition hover:bg-[#f5f5f5] dark:text-[#EDEDEC] dark:hover:bg-[#1a1a1a]"
                                    >
                                        Masuk
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-lg bg-[#28A745] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#218838] dark:bg-[#34c759] dark:text-white dark:hover:bg-[#2d9545]"
                                        >
                                            Daftar Gratis
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <main>
                    {/* Hero Section */}
                    <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                                Kelola tugas dengan
                                <span className="block text-[#28A745] dark:text-[#34c759]">
                                    lebih produktif
                                </span>
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-[#706f6c] dark:text-[#A1A09A]">
                                Buat, prioritaskan, dan selesaikan tugas dengan mudah.
                                TaskFlow membantu Anda tetap terorganisir dan fokus
                                pada hal yang penting.
                            </p>
                            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="w-full rounded-lg bg-[#28A745] px-8 py-3.5 text-base font-medium text-white transition hover:bg-[#218838] dark:bg-[#34c759] dark:hover:bg-[#2d9545] sm:w-auto"
                                    >
                                        Buka Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={register()}
                                            className="w-full rounded-lg bg-[#28A745] px-8 py-3.5 text-base font-medium text-white transition hover:bg-[#218838] dark:bg-[#34c759] dark:hover:bg-[#2d9545] sm:w-auto"
                                        >
                                            Mulai Gratis
                                        </Link>
                                        <Link
                                            href={login()}
                                            className="w-full rounded-lg border border-[#e3e3e0] bg-white px-8 py-3.5 text-base font-medium text-[#1b1b18] transition hover:bg-[#f5f5f5] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC] dark:hover:bg-[#1a1a1a] sm:w-auto"
                                        >
                                            Sudah punya akun?
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="border-t border-[#e3e3e0] bg-white dark:border-[#3E3E3A] dark:bg-[#161615]">
                        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                    Fitur yang Anda butuhkan
                                </h2>
                                <p className="mt-4 text-lg text-[#706f6c] dark:text-[#A1A09A]">
                                    Semua yang diperlukan untuk mengelola tugas
                                    sehari-hari.
                                </p>
                            </div>
                            <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-2 lg:gap-12">
                                <div className="flex gap-4 rounded-xl border border-[#e3e3e0] bg-[#FDFDFC] p-6 dark:border-[#3E3E3A] dark:bg-[#0a0a0a]">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#28A745]/10 dark:bg-[#34c759]/20">
                                        <CheckSquare2 className="h-6 w-6 text-[#28A745] dark:text-[#34c759]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Buat & Prioritaskan
                                        </h3>
                                        <p className="mt-2 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                            Buat daftar tugas dengan prioritas dan
                                            deadline yang jelas.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 rounded-xl border border-[#e3e3e0] bg-[#FDFDFC] p-6 dark:border-[#3E3E3A] dark:bg-[#0a0a0a]">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#28A745]/10 dark:bg-[#34c759]/20">
                                        <ListTodo className="h-6 w-6 text-[#28A745] dark:text-[#34c759]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Organisasi Proyek
                                        </h3>
                                        <p className="mt-2 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                            Kelompokkan tugas ke dalam proyek
                                            untuk organisasi yang lebih baik.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 rounded-xl border border-[#e3e3e0] bg-[#FDFDFC] p-6 dark:border-[#3E3E3A] dark:bg-[#0a0a0a]">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#28A745]/10 dark:bg-[#34c759]/20">
                                        <Calendar className="h-6 w-6 text-[#28A745] dark:text-[#34c759]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Jadwal & Deadline
                                        </h3>
                                        <p className="mt-2 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                            Atur deadline dan jadwal untuk
                                            menyelesaikan tugas tepat waktu.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 rounded-xl border border-[#e3e3e0] bg-[#FDFDFC] p-6 dark:border-[#3E3E3A] dark:bg-[#0a0a0a]">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#28A745]/10 dark:bg-[#34c759]/20">
                                        <Zap className="h-6 w-6 text-[#28A745] dark:text-[#34c759]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Cepat & Responsif
                                        </h3>
                                        <p className="mt-2 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                            Antarmuka modern yang cepat dan ringan
                                            di semua perangkat.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
                        <div className="mx-auto max-w-2xl rounded-2xl bg-[#28A745] px-8 py-16 text-center dark:bg-[#218838]">
                            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                Siap untuk mulai?
                            </h2>
                            <p className="mt-4 text-lg text-green-100">
                                Daftar gratis dan buat akun Anda dalam hitungan
                                detik.
                            </p>
                            {!auth.user && (
                                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                    <Link
                                        href={register()}
                                        className="w-full rounded-lg bg-white px-8 py-3.5 text-base font-medium text-[#28A745] transition hover:bg-green-50 dark:text-[#34c759] sm:w-auto"
                                    >
                                        Daftar Gratis
                                    </Link>
                                    <Link
                                        href={login()}
                                        className="w-full rounded-lg border border-white/30 bg-white/10 px-8 py-3.5 text-base font-medium text-white transition hover:bg-white/20 sm:w-auto"
                                    >
                                        Masuk
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>
                </main>

                <footer className="border-t border-[#e3e3e0] dark:border-[#3E3E3A]">
                    <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
                        <p className="text-center text-sm text-[#706f6c] dark:text-[#A1A09A]">
                            &copy; {new Date().getFullYear()} TaskFlow. Kelola
                            tugas dengan lebih produktif.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
