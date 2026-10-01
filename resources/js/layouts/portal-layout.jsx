import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import {
    LayoutDashboard,
    FileText,
    CalendarDays,
    Users,
    UserCheck,
    Award,
    UserRound,
    GraduationCap,
    ClipboardList,
    Menu,
    X,
    LogOut,
    ChevronRight,
    ShieldCheck,
} from 'lucide-react';

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
    const active =
        navigation.find(
            ([href]) => path === href || path.startsWith(`${href}/`),
        ) || navigation[0];
    const name =
        props.auth?.user?.name || (isAdmin ? 'Administrator' : 'Applicant');
    const [open, setOpen] = useState(false);
    const [privacyOpen, setPrivacyOpen] = useState(false);
    const closeButton = useRef(null);
    const menuButton = useRef(null);
    const drawer = useRef(null);
    const privacyButton = useRef(null);
    const privacyStorageKey = `law-privacy-notice-v1:${props.auth?.user?.id || 'applicant'}`;

    useEffect(() => {
        setOpen(false);
    }, [url]);
    useEffect(() => {
        if (isAdmin) return;

        try {
            setPrivacyOpen(
                localStorage.getItem(privacyStorageKey) !== 'acknowledged',
            );
        } catch {
            setPrivacyOpen(true);
        }
    }, [isAdmin, privacyStorageKey]);
    useEffect(() => {
        const desktop = window.matchMedia('(min-width: 1024px)');
        const closeOnDesktop = () => {
            if (desktop.matches) setOpen(false);
        };
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
            const items = [
                ...drawer.current.querySelectorAll('a, button'),
            ].filter((el) => el.getClientRects().length);
            const first = items[0],
                last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            }
            if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKey);
            menuButton.current?.focus();
        };
    }, [open]);
    useEffect(() => {
        if (!privacyOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        privacyButton.current?.focus();

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [privacyOpen]);

    const acknowledgePrivacyNotice = () => {
        try {
            localStorage.setItem(privacyStorageKey, 'acknowledged');
        } catch {
            // The notice can still be acknowledged when browser storage is disabled.
        }

        setPrivacyOpen(false);
    };

    return (
        <div className="law-portal">
            <a className="portal-skip" href="#portal-main">
                Skip to content
            </a>
            {open && (
                <button
                    className="portal-scrim"
                    onClick={() => setOpen(false)}
                    aria-label="Close navigation"
                    tabIndex={-1}
                />
            )}
            <aside
                ref={drawer}
                id="portal-navigation"
                className={`portal-sidebar ${open ? 'is-open' : ''}`}
                aria-label="Main navigation"
                role={open ? 'dialog' : undefined}
                aria-modal={open || undefined}
                inert={privacyOpen || undefined}
            >
                <Link href={navigation[0][0]} className="portal-brand">
                    <img
                        src="/Images/law-logo.jpeg"
                        alt="USeP School of Law crest"
                    />
                    <span>
                        <strong>School of Law</strong>
                        <small>UNIVERSITY OF SOUTHEASTERN PHILIPPINES</small>
                    </span>
                </Link>
                <button
                    ref={closeButton}
                    className="portal-close"
                    onClick={() => setOpen(false)}
                    aria-label="Close navigation"
                >
                    <X size={20} />
                </button>
                <div className="portal-workspace">
                    <span className="portal-dot" />
                    {isAdmin ? 'Admissions administration' : 'Applicant portal'}
                </div>
                <p className="portal-nav-label">
                    {isAdmin ? 'Manage admissions' : 'Your application'}
                </p>
                <nav>
                    {navigation.map(([href, label, Icon]) => (
                        <Link
                            key={href}
                            href={href}
                            className={`portal-nav-link ${href === active[0] ? 'is-active' : ''}`}
                            aria-current={
                                href === active[0] ? 'page' : undefined
                            }
                            onClick={() => setOpen(false)}
                        >
                            <Icon size={19} strokeWidth={1.7} />
                            <span>{label}</span>
                            {href === active[0] && <ChevronRight size={15} />}
                        </Link>
                    ))}
                </nav>
                <div className="portal-sidebar-bottom">
                    <div className="portal-account">
                        <span className="portal-avatar">
                            {name.slice(0, 1).toUpperCase()}
                        </span>
                        <span>
                            <strong>{name}</strong>
                            <small>
                                {isAdmin ? 'Administrator' : 'Applicant'}
                            </small>
                        </span>
                    </div>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="portal-signout"
                    >
                        <LogOut size={17} />
                        Sign out
                    </Link>
                </div>
            </aside>
            <div
                className="portal-workarea"
                inert={open || privacyOpen || undefined}
            >
                <header className="portal-topbar">
                    <button
                        ref={menuButton}
                        className="portal-menu"
                        onClick={() => setOpen(true)}
                        aria-label="Open navigation"
                        aria-expanded={open}
                        aria-controls="portal-navigation"
                    >
                        <Menu size={22} />
                    </button>
                    <div className="portal-breadcrumb">
                        <span>
                            {isAdmin ? 'Admissions' : 'Applicant portal'}
                        </span>
                        <ChevronRight size={14} />
                        <strong>{active[1]}</strong>
                    </div>
                    <span className="portal-topbar-label">
                        USeP <span>School of Law</span>
                    </span>
                </header>
                <main id="portal-main" tabIndex={-1} className="portal-content">
                    {children}
                </main>
                <footer className="portal-footer">
                    USeP School of Law
                    <span>
                        {!isAdmin && (
                            <button
                                type="button"
                                onClick={() => setPrivacyOpen(true)}
                            >
                                Privacy notice
                            </button>
                        )}
                        Admission Management System
                    </span>
                </footer>
            </div>
            {!isAdmin && privacyOpen && (
                <div className="privacy-notice-backdrop" role="presentation">
                    <section
                        className="privacy-notice"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="privacy-notice-title"
                        aria-describedby="privacy-notice-description"
                    >
                        <div className="privacy-notice-icon" aria-hidden="true">
                            <ShieldCheck size={26} />
                        </div>
                        <p className="privacy-notice-eyebrow">
                            Applicant information
                        </p>
                        <h2 id="privacy-notice-title">Data Privacy Notice</h2>
                        <div
                            id="privacy-notice-description"
                            className="privacy-notice-body"
                        >
                            <p>
                                The USeP School of Law Admission Management
                                System collects the personal, contact, academic,
                                demographic, and supporting-document information
                                you provide during your application.
                            </p>
                            <p>
                                Your information will be used to verify your
                                eligibility, evaluate and process your
                                application, schedule admission activities,
                                communicate results, and maintain official
                                admission records. Access is limited to
                                authorized school personnel and service
                                providers responsible for operating the system.
                            </p>
                            <p>
                                Please provide accurate information and upload
                                only documents required for admission. You may
                                contact the School of Law or the University Data
                                Protection Office to ask about the processing of
                                your data or to request access or correction,
                                subject to applicable school policies and law.
                            </p>
                        </div>
                        <p className="privacy-notice-footnote">
                            Selecting “I understand” confirms that you have read
                            this notice. It does not waive your data privacy
                            rights.
                        </p>
                        <button
                            ref={privacyButton}
                            type="button"
                            className="privacy-notice-action"
                            onClick={acknowledgePrivacyNotice}
                        >
                            I understand
                        </button>
                    </section>
                </div>
            )}
        </div>
    );
}
