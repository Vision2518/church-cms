import {
  Users,
  UserCheck,
  UserPlus,
  UserMinus
} from "lucide-react";

const stats = [
  {
    title: "Total Members",
    value: 486,
    icon: Users,
    color: "bg-indigo-500"
  },
  {
    title: "Active Members",
    value: 452,
    icon: UserCheck,
    color: "bg-green-500"
  },
  {
    title: "Visitors",
    value: 21,
    icon: UserPlus,
    color: "bg-yellow-500"
  },
  {
    title: "Inactive",
    value: 13,
    icon: UserMinus,
    color: "bg-red-500"
  }
];

export default function MemberStats() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className={`inline-flex rounded-lg p-3 ${item.color} text-white`}>
              <Icon size={22} />
            </div>

            <h3 className="mt-4 text-sm text-slate-500">
              {item.title}
            </h3>

            <p className="mt-2 text-3xl font-bold dark:text-white">
              {item.value}
            </p>
          </div>
        );
      })}
    </section>
  );
}