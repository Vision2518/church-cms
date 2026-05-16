import { BellRing, Building2, ShieldCheck } from "lucide-react";

const settingsGroups = [
  {
    title: "Organization",
    detail: "Church profile, campuses, service schedules, and ministry ownership.",
    icon: Building2
  },
  {
    title: "Access Control",
    detail: "Admin roles, financial permissions, approval policies, and audit scope.",
    icon: ShieldCheck
  },
  {
    title: "Notifications",
    detail: "Giving alerts, member care reminders, weekly summaries, and system emails.",
    icon: BellRing
  }
];

export default function Settings() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-300">
          System administration
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
          Settings
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          Configure organization details, user access, fiscal periods, giving
          categories, and notification preferences.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {settingsGroups.map((group) => {
          const Icon = group.icon;

          return (
            <article
              key={group.title}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="grid size-10 place-items-center rounded-lg bg-slate-900 text-white dark:bg-indigo-500">
                <Icon size={20} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-base font-bold text-slate-950 dark:text-white">
                {group.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {group.detail}
              </p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
