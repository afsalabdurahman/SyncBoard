import React, { useEffect, useState } from "react";
import { Plus, Search, Mail, X } from "lucide-react";

export const MembersCard = (memberProps) => {
  console.log(memberProps,"Mems")
  const [showInvite, setShowInvite] = useState(false);
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");

  // const [members, setMembers] = useState([
  //   { id: 1, name: "Ava Chen", role: "OWNER", initials: "AC", color: "bg-[#f1776c]" },
  //   { id: 2, name: "Marcus Reed", role: "MEMBER", initials: "MR", color: "bg-[#d59a05]" },
  //   { id: 3, name: "Priya Patel", role: "MEMBER", initials: "PP", color: "bg-[#53b65e]" },
  //   { id: 4, name: "Diego Alvarez", role: "MEMBER", initials: "DA", color: "bg-[#13a9d8]" },
  //   { id: 5, name: "Sofia Müller", role: "MEMBER", initials: "SM", color: "bg-[#9d8bf4]" },
  // ]);

  // const users = [
  //   "Liam Scott",
  //   "Emma Brown",
  //   "Noah Thomas",
  //   "Olivia Clark",
  //   "James Lee",
  // ];
 const [members, setMembers] = useState([]);

 useEffect(() => {
    if (memberProps?.memebrList?.length) {
      const formattedMembers = memberProps?.memebrList.map(
        (member: any, index: number) => ({
          id: index + 1,
          name: member.name,
          role: member.role,
          initials: member.name
            .split(" ")
            .map((word: string) => word[0])
            .join("")
            .toUpperCase(),

          color: `hsl(${(index * 137.5) % 360}, 70%, 55%)`,
        })
      );

      setMembers(formattedMembers);
    }
  }, [memberProps?.memebrList]);





  const addUser = (name) => {
    const words = name.split(" ");
    const initials =
      words[0][0].toUpperCase() + words[1][0].toUpperCase();

    setMembers([
      ...members,
      {
        id: Date.now(),
        name,
        role: "MEMBER",
        initials,
        color: "bg-slate-500",
      },
    ]);
    setSearch("");
    setShowInvite(false);
  };

  const inviteEmail = () => {
    if (!email) return;
    addUser(email);
    setEmail("");
  };
console.log(members,"membrssssss")
  return (
    <div className="w-[320px] h-[280px] rounded-2xl border border-slate-700/50  border-gray-200 bg-[#f7f8fa] shadow-sm overflow-hidden flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-200 shrink-0">
        <h3 className="text-[15px] font-semibold text-[#111827]">
          Members
        </h3>

        <div className="flex items-center gap-3">
          <span className="text-[13px] text-gray-500">
            {members.length}
          </span>

          <button
            onClick={() => setShowInvite(!showInvite)}
            className="h-7 w-7 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Invite Panel */}
      {showInvite && (
        <div className="border-b border-gray-200 bg-white p-4 space-y-3 shrink-0">

          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user..."
              className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-sm outline-none"
            />
          </div>

          {search && (
            <div className="space-y-2 max-h-28 overflow-y-auto">
              {users
                .filter((u) =>
                  u.toLowerCase().includes(search.toLowerCase())
                )
                .map((u) => (
                  <button
                    key={u}
                    onClick={() => addUser(u)}
                    className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    {u}
                  </button>
                ))}
            </div>
          )}

          {/* Email Invite */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail
                size={14}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Invite by email"
                className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-sm outline-none"
              />
            </div>

            <button
              onClick={inviteEmail}
              className="rounded-xl bg-blue-500 px-4 text-sm text-white hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Members List */}
      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
 className="h-8 w-8 rounded-full text-white text-[11px] flex items-center justify-center"
  style={{ backgroundColor: member?.color }}              >
                {member.initials}
              </div>

              <span className="text-[14px] text-[#111827]">
                {member.name}
              </span>
            </div>

            <span
              className={`rounded-full px-2 py-1 text-[10px] tracking-widest ${member.role === "OWNER"
                  ? "bg-blue-100 text-blue-500"
                  : "bg-gray-100 text-gray-500"
                }`}
            >
              {member.role}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};

