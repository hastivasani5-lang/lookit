import React from "react";
import NeumorphListCard from "./NeumorphListCard";

interface Student {
  id: number;
  name: string;
  email: string;
  joinedAt: string;
}

interface UserDetails {
  [id: number]: {
    role: string;
    provider: string;
  };
}

interface UsersListProps {
  studentsList: Student[];
  userDetailsById: UserDetails;
  selectedStudentId: number | null;
  openStudentDetails: (id: number) => void;
}

const UsersList: React.FC<UsersListProps> = ({ studentsList, userDetailsById, selectedStudentId, openStudentDetails }) => (
  <ul className="flex flex-col gap-3">
    {studentsList.map((student) => {
      const isSelected = selectedStudentId === student.id;
      return (
        <NeumorphListCard
          key={student.id}
          className={isSelected ? "bg-[#e8f9ee] shadow-[2px_2px_8px_#d0dbd6,-2px_-2px_8px_#ffffff]" : "bg-white hover:bg-[#f6fefb]"}
        >
          <div className="flex-1 min-w-[120px] font-semibold text-slate-800">{student.name}
            <div className="text-xs text-slate-500">{student.email}</div>
          </div>
          <div className="flex-1 min-w-[100px]">
            <span className="rounded-full bg-[#eef7ff] px-3 py-1 text-xs font-semibold text-[#2563eb] shadow-sm">
              {userDetailsById[student.id]?.role ?? "student"}
            </span>
          </div>
          <div className="flex-1 min-w-[100px] text-slate-700">{userDetailsById[student.id]?.provider ?? "credentials"}</div>
          <div className="flex-1 min-w-[100px] text-slate-700">{student.joinedAt}</div>
          <div className="flex flex-1 justify-end min-w-[80px]">
            <span className="inline-flex items-center rounded-full border border-[#bfe9cb] bg-[#e8f9ee] px-4 py-1.5 text-xs font-semibold text-[#178c43] shadow-sm">
              View
            </span>
          </div>
        </NeumorphListCard>
      );
    })}
  </ul>
);

export default UsersList;
