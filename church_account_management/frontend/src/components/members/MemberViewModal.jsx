import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Church,
  Calendar,
  Heart,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

export default function MemberViewModal({ isOpen, onClose, member }) {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl dark:bg-slate-900">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Member Details
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile */}

        <div className="border-b border-slate-200 p-6 dark:border-slate-700">
          <div className="flex flex-col items-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-indigo-100 text-5xl font-bold text-indigo-600">
              {member.name.charAt(0)}
            </div>

            <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
              {member.name}
            </h2>

            <p className="text-slate-500">Member ID : {member.id}</p>

            <span
              className={`mt-4 rounded-full px-4 py-1 text-sm font-semibold ${
                member.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {member.status}
            </span>
          </div>
        </div>

        {/* Content */}

        <div className="space-y-8 p-6">
          {/* Personal */}

          <Section icon={<User size={18} />} title="Personal Information">
            <InfoItem label="Gender" value={member.gender} />

            <InfoItem label="Date of Birth" value={member.dob} />

            <InfoItem label="Age" value={member.age} />

            <InfoItem label="Marital Status" value={member.maritalStatus} />
          </Section>

          {/* Contact */}

          <Section icon={<Phone size={18} />} title="Contact Information">
            <InfoItem label="Phone" value={member.phone} />

            <InfoItem label="Email" value={member.email} />

            <InfoItem label="Address" value={member.address} />
          </Section>

          {/* Church */}

          <Section icon={<Church size={18} />} title="Church Information">
            <InfoItem label="Joined" value={member.joined} />

            <InfoItem label="Baptized" value={member.baptized} />

            <InfoItem label="Ministry" value={member.ministry} />

            <InfoItem label="Member Type" value={member.memberType} />
          </Section>
          {/* Emergency Contact */}

          <Section icon={<ShieldCheck size={18} />} title="Emergency Contact">
            <InfoItem label="Contact Person" value={member.emergencyContact} />

            <InfoItem label="Relationship" value={member.relationship} />

            <InfoItem label="Phone" value={member.emergencyPhone} />
          </Section>

          {/* Membership Information */}

          <Section
            icon={<BadgeCheck size={18} />}
            title="Membership Information"
          >
            <InfoItem label="Membership Status" value={member.status} />

            <InfoItem label="Membership ID" value={member.id} />

            <InfoItem label="Ministry" value={member.ministry} />
          </Section>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-slate-200 p-5 dark:border-slate-700">
          <button className="rounded-lg border border-slate-300 px-5 py-2 font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800">
            Edit
          </button>

          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-700">
        <span className="text-indigo-600">{icon}</span>

        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
      </div>

      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>

      <p className="mt-1 font-semibold text-slate-900 dark:text-white">
        {value || "-"}
      </p>
    </div>
  );
}
