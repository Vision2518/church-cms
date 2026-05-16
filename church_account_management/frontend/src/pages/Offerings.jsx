import { Banknote, Landmark, ReceiptText } from "lucide-react";

const offeringFunds = [
  { name: "General Fund", amount: "$32,420", status: "Reconciled" },
  { name: "Missions", amount: "$8,640", status: "Pending deposit" },
  { name: "Building Fund", amount: "$7,190", status: "Reconciled" }
];

export default function Offerings() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-300">
              Giving operations
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
              Offerings
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Track Sunday collections, special funds, pledge campaigns, bank deposits,
              and reconciliation workflows.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
            <ReceiptText size={18} aria-hidden="true" />
            12 batches this month
          </span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {offeringFunds.map((fund) => (
          <article
            key={fund.name}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-10 place-items-center rounded-lg bg-emerald-500 text-white">
                {fund.status === "Pending deposit" ? (
                  <Banknote size={20} aria-hidden="true" />
                ) : (
                  <Landmark size={20} aria-hidden="true" />
                )}
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {fund.status}
              </span>
            </div>
            <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">
              {fund.name}
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
              {fund.amount}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
