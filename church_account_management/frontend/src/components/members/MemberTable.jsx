import { useState } from "react";
import MemberRow from "./MemberRow";
import MemberViewModal from "./MemberViewModal";

const members = [
  {
     id: "M001",
  name: "John Doe",
  gender: "Male",
  dob: "14 Mar 2001",
  age: 25,
  maritalStatus: "Single",
  phone: "9800000000",
  email: "john@example.com",
  address: "Kohalpur, Banke",
  ministry: "Youth",
  status: "Active",
  joined: "12 Jun 2022",
  baptized: "Yes",
  memberType: "Regular Member",
  emergencyContact: "James Doe",
  relationship: "Father",
  emergencyPhone: "9811111111",
  },
  {
    id: "M002",
    name: "Mary Smith",
    gender: "Female",
    phone: "9811111111",
    ministry: "Choir",
    status: "Active",
  },
  {
    id: "M003",
    name: "David James",
    gender: "Male",
    phone: "9822222222",
    ministry: "Media",
    status: "Inactive",
  },
];

export default function MemberTable() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-4 text-left">Member ID</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Gender</th>
                <th className="px-6 py-4 text-left">Phone</th>
                <th className="px-6 py-4 text-left">Ministry</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  onView={() => {
                    setSelectedMember(member);
                    setOpen(true);
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <MemberViewModal
        isOpen={open}
        member={selectedMember}
        onClose={() => {
          setOpen(false);
          setSelectedMember(null);
        }}
      />
    </>
  );
}