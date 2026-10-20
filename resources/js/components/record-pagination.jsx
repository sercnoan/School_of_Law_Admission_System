import { useEffect, useMemo, useState } from 'react';

export function useRecordPagination(records, resetKey, perPage = 10) {
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(records.length / perPage));

    useEffect(() => {
        setPage(1);
    }, [resetKey]);

    useEffect(() => {
        setPage((current) => Math.min(current, totalPages));
    }, [totalPages]);

    const pageRecords = useMemo(() => {
        const start = (page - 1) * perPage;
        return records.slice(start, start + perPage);
    }, [records, page, perPage]);

    return {
        page,
        setPage,
        totalPages,
        pageRecords,
        firstRecord: records.length ? (page - 1) * perPage + 1 : 0,
        lastRecord: Math.min(page * perPage, records.length),
    };
}

export default function RecordPagination({
    page,
    totalPages,
    totalRecords,
    firstRecord,
    lastRecord,
    onPageChange,
}) {
    if (totalRecords === 0) return null;

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
        .filter((number) =>
            number === 1 ||
            number === totalPages ||
            Math.abs(number - page) <= 1
        );

    return (
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
                Showing <strong>{firstRecord}</strong>–<strong>{lastRecord}</strong> of{' '}
                <strong>{totalRecords}</strong> records
            </p>

            <div className="flex flex-wrap items-center gap-1.5">
                <PageButton disabled={page === 1} onClick={() => onPageChange(page - 1)}>
                    Previous
                </PageButton>

                {pages.map((number, index) => {
                    const previous = pages[index - 1];
                    return (
                        <span key={number} className="contents">
                            {previous && number - previous > 1 && (
                                <span className="px-1 text-gray-400">…</span>
                            )}
                            <button
                                type="button"
                                onClick={() => onPageChange(number)}
                                aria-current={number === page ? 'page' : undefined}
                                className={`min-h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${
                                    number === page
                                        ? 'bg-[#922b2b] text-white'
                                        : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {number}
                            </button>
                        </span>
                    );
                })}

                <PageButton disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
                    Next
                </PageButton>
            </div>
        </div>
    );
}

function PageButton({ disabled, onClick, children }) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="min-h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
            {children}
        </button>
    );
}
