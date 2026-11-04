export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-sky-800">
        WDD 430 Team Project
      </p>
      <h1 className="text-4xl font-bold text-slate-900">CareLoop Tracker</h1>
      <p className="text-lg text-slate-700">
        Follow a screening result from the day it is issued until treatment or
        closure. Every case has one named owner; overdue, rejected, and
        unassigned work is listed for coordinators to chase.
      </p>
      <ul className="list-disc space-y-2 pl-5 text-slate-700">
        <li>Roles: coordinator, clinician, lab staff</li>
        <li>Cases + timeline from result issued to closure</li>
        <li>Referrals with accept / reject</li>
        <li>Coordinator chase queue and simple dashboard metrics</li>
      </ul>
      <p className="text-sm text-slate-600">
        Scaffold ready for Week 03 implementation. Project docs live in{" "}
        <code>docs/specification.md</code> and <code>docs/constitution.md</code>
        .
      </p>
    </main>
  );
}
