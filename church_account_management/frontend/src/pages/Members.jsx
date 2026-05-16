import { Mail, Phone, UserCheck } from "lucide-react";

const memberSegments = [
  { label: "Active households", value: "486" },
  { label: "New believers class", value: "27" },
  { label: "Care follow-ups", value: "14" }
];

export default function Members() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-300">
          Congregation care
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
          Members
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          Manage household records, member status, ministry participation, pastoral
          care notes, and communication preferences.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {memberSegments.map((segment) => (
          <article
            key={segment.label}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="grid size-10 place-items-center rounded-lg bg-indigo-500 text-white">
              <UserCheck size={20} aria-hidden="true" />
            </span>
            <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">
              {segment.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
              {segment.value}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-950 dark:text-white">
          Communication Channels
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
            <Mail size={20} className="text-indigo-500" aria-hidden="true" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              1,036 email subscribers
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
            <Phone size={20} className="text-emerald-500" aria-hidden="true" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              842 SMS-ready contacts
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
