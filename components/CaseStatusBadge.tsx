import { CaseStatus } from "@/lib/types";

const labels: Record<CaseStatus, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    referred: 'Referred',
    treated: 'Treated',
    closed: 'Closed',
};

const styles: Record<CaseStatus, string> = {
    open: 'bg-[#E6F2F2] text-[#0F6b6b]',
    in_progress: 'bg-amber-100 text-amber-900',
    referred: 'bg-[#F8E9E4] text-[#9A3B23]',
    treated: 'bg-green-100 text-green-900',
    closed: 'bg-gray-200 text-gray-800',
};

export default function CaseStatusBadge({ status }: { status: CaseStatus }) {
    return (
        <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${styles[status]}`}>
            {labels[status]}
        </span>
    );
}