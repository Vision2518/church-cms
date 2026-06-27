import { Plus, Search } from "lucide-react";

export default function MemberToolbar() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex flex-1 flex-col gap-3 md:flex-row">

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search members..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          <select className="rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <select className="rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
            <option>All Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

        </div>

        <button className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700">
          <Plus size={18} />
          Add Member
        </button>
      </div>
    </section>
  );
}