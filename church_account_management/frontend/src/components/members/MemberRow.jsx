import { Eye, Pencil, Trash2 } from "lucide-react";

export default function MemberRow({ member, onView }) {
  return (
    <tr className="border-t dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
      <td className="px-6 py-4">{member.id}</td>

      <td className="px-6 py-4 font-medium dark:text-white">{member.name}</td>

      <td className="px-6 py-4">{member.gender}</td>

      <td className="px-6 py-4">{member.phone}</td>

      <td className="px-6 py-4">{member.ministry}</td>

      <td className="px-6 py-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            member.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {member.status}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex justify-center gap-3">
          <button
            onClick={onView}
            className="text-blue-600 hover:text-blue-800"
          >
            <Eye size={18} />
          </button>

          <button className="text-yellow-600 hover:text-yellow-800">
            <Pencil size={18} />
          </button>

          <button className="text-red-600 hover:text-red-800">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}
