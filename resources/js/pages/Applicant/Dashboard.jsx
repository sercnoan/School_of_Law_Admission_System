import PortalLayout from '@/layouts/portal-layout';
import { Head, Link } from '@inertiajs/react';
import { GraduationCap, FileText, CalendarDays, ClipboardList, User, ChevronRight } from 'lucide-react';

const sections = [
    { href: '/personal-details', icon: User, title: 'Personal information', description: 'Your applicant details.' },
    { href: '/applicant/program', icon: GraduationCap, title: 'Choose program', description: 'Juris Doctor or Master of Legal Studies.' },
    { href: '/applicant/requirements', icon: FileText, title: 'Documents', description: 'Upload requirements and check feedback.' },
    { href: '/applicant/examination', icon: CalendarDays, title: 'Examination', description: 'Available schedules and your booking.' },
    { href: '/applicant/status', icon: ClipboardList, title: 'Application status', description: 'Review progress, results, and next steps.' },
];

export default function Dashboard() {
    return (
        <>
            <Head title="Applicant Dashboard" />
            <PortalLayout audience="applicant">
                <div className="mb-6">
                    <h1 className="text-gray-900">Applicant Dashboard</h1>
                    <p className="mt-2 text-sm text-gray-500">Manage your admission application.</p>
                </div>

                <section aria-labelledby="application-links-heading" className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="border-b border-gray-100 px-4 py-3 sm:px-5">
                        <h2 id="application-links-heading" className="text-sm font-semibold text-gray-900">Your application</h2>
                    </div>
                    <nav aria-label="Application sections" className="divide-y divide-gray-100">
                        {sections.map(({ href, icon: Icon, title, description }) => (
                            <Link key={href} href={href} className="group flex items-center gap-3 px-4 py-4 transition-colors hover:bg-[#faf5f6] sm:gap-4 sm:px-5">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5e9ec] text-[#812b37]">
                                    <Icon size={18} strokeWidth={1.8} />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block text-sm font-semibold text-gray-900">{title}</span>
                                    <span className="mt-0.5 block text-xs leading-5 text-gray-500">{description}</span>
                                </span>
                                <ChevronRight size={17} className="shrink-0 text-gray-400 group-hover:text-[#812b37]" />
                            </Link>
                        ))}
                    </nav>
                </section>
            </PortalLayout>
        </>
    );
}
