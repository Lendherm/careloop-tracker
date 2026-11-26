import CaseForm from '@/components/CaseForm';
import { requireUser } from '@/lib/current-user';

export default async function NewCasePage() {
    await requireUser();

    return (
        <main className='mx-auto max-w-5xl px-4 py-10'>
            <h1 className='mb-2 text-3xl font-bold text-[#1F2933]'>Create a case</h1>
            <p className='mb-6 text-[#6B7200]'>You will be the owner of the new case</p>
            <CaseForm />
        </main>
    );
}