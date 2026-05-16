import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  HandCoins,
  Users
} from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const kpis = [
  {
    label: "Church Offerings",
    value: currencyFormatter.format(48250),
    trend: "+12.8%",
    trendLabel: "from last month",
    positive: true,
    icon: HandCoins,
    accent: "bg-emerald-500"
  },
  {
    label: "Active Members",
    value: "1,284",
    trend: "+38",
    trendLabel: "new this quarter",
    positive: true,
    icon: Users,
    accent: "bg-indigo-500"
  },
  {
    label: "Total Tithing",
    value: currencyFormatter.format(91300),
    trend: "-2.4%",
    trendLabel: "against target",
    positive: false,
    icon: CreditCard,
    accent: "bg-slate-700"
  }
];

const weeklyOfferings = [
  { week: "May 5", amount: 11200 },
  { week: "May 12", amount: 12650 },
  { week: "May 19", amount: 10875 },
  { week: "May 26", amount: 13525 }
];

const recentActivities = [
  {
    title: "Sunday service offering counted",
    detail: "Main sanctuary batch reconciled",
    amount: currencyFormatter.format(13525)
  },
  {
    title: "New member household added",
    detail: "A family of four joined Grace Chapel",
    amount: "4 members"
  },
  {
    title: "Mission fund transfer prepared",
    detail: "Awaiting treasurer approval",
    amount: currencyFormatter.format(4200)
  }
];

export default function Dashboard() {
  const maxOffering = Math.max(...weeklyOfferings.map((item) => item.amount));

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-300">
              Stewardship snapshot
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              Welcome back, Grace Admin
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Monitor giving health, member engagement, and monthly tithe progress
              from a single financial command center.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
            <CalendarDays
              size={20}
              className="text-indigo-600 dark:text-indigo-300"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Reporting period
              </p>
              <p className="text-sm font-semibold text-slate-950 dark:text-white">
                May 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {kpis.map((item) => {
          const Icon = item.icon;
          const TrendIcon = item.positive ? ArrowUpRight : ArrowDownRight;

          return (
            <article
              key={item.label}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                    {item.value}
                  </p>
                </div>
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-lg ${item.accent} text-white shadow-sm`}
                >
                  <Icon size={22} aria-hidden="true" />
                </span>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${
                    item.positive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                  }`}
                >
                  <TrendIcon size={14} aria-hidden="true" />
                  {item.trend}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {item.trendLabel}
                </span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-950 dark:text-white">
                Weekly Offering Flow
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Sunday deposits recorded this month
              </p>
            </div>
            <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
              Live ledger
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {weeklyOfferings.map((item) => (
              <div key={item.week} className="grid gap-2 sm:grid-cols-[80px_1fr_100px] sm:items-center">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {item.week}
                </span>
                <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                    style={{ width: `${Math.round((item.amount / maxOffering) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-950 sm:text-right dark:text-white">
                  {currencyFormatter.format(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-950 dark:text-white">
            Recent Activity
          </h3>
          <div className="mt-5 space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.title}
                className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {activity.detail}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-emerald-600 dark:text-emerald-300">
                    {activity.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
