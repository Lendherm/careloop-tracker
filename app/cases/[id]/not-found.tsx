import Link from "next/link";

export default function CaseNotFound() {
    return (
        <main className="mx-auto max-w-xl px-4 py-16 text-center">
            <h1 className="text-2xl font-bold text-[#1F2933]">Case not found</h1>
            <p className="mt-3 text-[#6B7280]">This case doesn&apos;t exist or may have been removed.</p>
            <Link 
                href="/cases"
                className="mt-6 inline-block rounded-md border border-[#0F6B6B] px-4 py-2 font-semibold text-[#0F6B6B] hover:bg-[#E6F2F2]">
                    Back to cases
                </Link>
        </main>
    );    
}