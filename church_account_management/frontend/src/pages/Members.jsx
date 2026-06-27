import MemberStats from "../components/members/MemberStats";
import MemberToolbar from "../components/members/MemberToolbar";
import MemberTable from "../components/members/MemberTable";

export default function Members() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-300">
          Congregation Care
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
          Members
        </h1>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Manage church members, visitors, ministries and contact information.
        </p>
      </section>

      <MemberStats />

      <MemberToolbar />

      <MemberTable />
    </div>
  );
}