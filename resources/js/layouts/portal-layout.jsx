import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { LayoutDashboard, FileText, CalendarDays, Users, UserCheck, Award, UserRound, GraduationCap, ClipboardList, Menu, X, LogOut, ChevronRight } from 'lucide-react';

const applicantNavigation = [
    ['/applicant/dashboard', 'Overview', LayoutDashboard],
    ['/personal-details', 'Personal information', UserRound],
    ['/applicant/program', 'Choose program', GraduationCap],
    ['/applicant/requirements', 'Documents', FileText],
    ['/applicant/examination', 'Examination', CalendarDays],
    ['/applicant/status', 'Application status', ClipboardList],
];
const adminNavigation = [
    ['/admin/dashboard', 'Overview', LayoutDashboard],
    ['/admin/applications', 'Applications', FileText],
    ['/admin/examination-schedules', 'Exam schedules', CalendarDays],
    ['/admin/examinees', 'Examinees', Users],
    ['/admin/interviewees', 'Interviewees', UserCheck],
    ['/admin/final-list', 'Final list', Award],
];

export default function PortalLayout({ audience, children }) {
    const { url, props } = usePage();
    const isAdmin = audience === 'admin';
    const navigation = isAdmin ? adminNavigation : applicantNavigation;
    const path = url.split('?')[0];
    const active = navigation.find(([href]) => path === href || path.startsWith(`${href}/`)) || navigation[0];
    const name = props.auth?.user?.name || (isAdmin ? 'Administrator' : 'Applicant');
    const [open, setOpen] = useState(false);
    const closeButton = useRef(null);
    const menuButton = useRef(null);
    const drawer = useRef(null);

    useEffect(() => { setOpen(false); }, [url]);
    useEffect(() => {
        const desktop = window.matchMedia('(min-width: 1024px)');
        const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
        desktop.addEventListener('change', closeOnDesktop);
        return () => desktop.removeEventListener('change', closeOnDesktop);
    }, []);
    useEffect(() => {
        if (!open) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeButton.current?.focus();
        const onKey = (event) => {
            if (event.key === 'Escape') setOpen(false);
            if (event.key !== 'Tab') return;
            const items = [...drawer.current.querySelectorAll('a, button')].filter((el) => el.getClientRects().length);
            const first = items[0], last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        };
        document.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKey);
            menuButton.current?.focus();
        };
    }, [open]);

    return (
        <div className="law-portal">
            <a className="portal-skip" href="#portal-main">Skip to content</a>
            {open && <button className="portal-scrim" onClick={() => setOpen(false)} aria-label="Close navigation" tabIndex={-1} />}
            <aside ref={drawer} id="portal-navigation" className={`portal-sidebar ${open ? 'is-open' : ''}`} aria-label="Main navigation" role={open ? 'dialog' : undefined} aria-modal={open || undefined}>
                <Link href={navigation[0][0]} className="portal-brand">
                    <img src="/Images/law-logo.jpeg" alt="USeP School of Law crest" />
                    <span><strong>School of Law</strong><small>UNIVERSITY OF SOUTHEASTERN PHILIPPINES</small></span>
                </Link>
                <button ref={closeButton} className="portal-close" onClick={() => setOpen(false)} aria-label="Close navigation"><X size={20} /></button>
                <div className="portal-workspace"><span className="portal-dot" />{isAdmin ? 'Admissions administration' : 'Applicant portal'}</div>
                <p className="portal-nav-label">{isAdmin ? 'Manage admissions' : 'Your application'}</p>
                <nav>
                    {navigation.map(([href, label, Icon]) => (
                        <Link key={href} href={href} className={`portal-nav-link ${href === active[0] ? 'is-active' : ''}`} aria-current={href === active[0] ? 'page' : undefined} onClick={() => setOpen(false)}>
                            <Icon size={19} strokeWidth={1.7} /><span>{label}</span>{href === active[0] && <ChevronRight size={15} />}
                        </Link>
                    ))}
                </nav>
                <div className="portal-sidebar-bottom">
                    <div className="portal-account"><span className="portal-avatar">{name.slice(0, 1).toUpperCase()}</span><span><strong>{name}</strong><small>{isAdmin ? 'Administrator' : 'Applicant'}</small></span></div>
                    <Link href="/logout" method="post" as="button" className="portal-signout"><LogOut size={17} />Sign out</Link>
                </div>
            </aside>
            <div className="portal-workarea" inert={open || undefined}>
                <header className="portal-topbar">
                    <button ref={menuButton} className="portal-menu" onClick={() => setOpen(true)} aria-label="Open navigation" aria-expanded={open} aria-controls="portal-navigation"><Menu size={22} /></button>
                    <div className="portal-breadcrumb"><span>{isAdmin ? 'Admissions' : 'Applicant portal'}</span><ChevronRight size={14} /><strong>{active[1]}</strong></div>
                    <span className="portal-topbar-label">USeP <span>School of Law</span></span>
                </header>
                <main id="portal-main" tabIndex={-1} className="portal-content">{children}</main>
                <footer className="portal-footer">USeP School of Law <span>Admission Management System</span></footer>
            </div>
        </div>
    );
}
