import React from "react";
import UsersList from "./UsersList";

interface UsersSectionProps {
  studentsList: any[];
  userDetailsById: any;
  selectedStudentId: number | null;
  openStudentDetails: (id: number) => void;
  usersLoading: boolean;
  usersError: string;
  usersTab: "students" | "professionals";
  setUsersTab: (tab: "students" | "professionals") => void;
}

const UsersSection: React.FC<UsersSectionProps> = ({
  studentsList,
  userDetailsById,
  selectedStudentId,
  openStudentDetails,
  usersLoading,
  usersError,
  usersTab,
  setUsersTab,
}) => (
  <div className="mt-6 overflow-visible rounded-2xl neumorph-admin-card border border-transparent p-4 shadow-[8px_8px_24px_#d0dbd6,-8px_-8px_24px_#ffffff]">
    <div className="border-b border-slate-200 px-4 py-3">
      <h3 className="font-semibold text-slate-800">Users</h3>
      <p className="text-sm text-slate-500">Switch between students and professionals.</p>
    </div>
    <div className="flex gap-3 border-b border-slate-200 px-2 py-3 mb-2">
      <button
        type="button"
        onClick={() => setUsersTab("students")}
        className={`rounded-full px-6 py-2 text-xs font-semibold neumorph-admin-btn transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1ec28e] focus:ring-offset-2 shadow-[4px_4px_12px_#d0dbd6,-4px_-4px_12px_#ffffff] ${
          usersTab === "students"
            ? "bg-[#e8f9ee] text-[#178c43] border border-[#bfe9cb]"
            : "bg-[#f6fefb] text-[#2c5a48] border border-transparent hover:shadow-inner"
        }`}
      >
        Students
      </button>
      <button
        type="button"
        onClick={() => setUsersTab("professionals")}
        className={`rounded-full px-6 py-2 text-xs font-semibold neumorph-admin-btn transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1ec28e] focus:ring-offset-2 shadow-[4px_4px_12px_#d0dbd6,-4px_-4px_12px_#ffffff] ${
          usersTab === "professionals"
            ? "bg-[#e8f9ee] text-[#178c43] border border-[#bfe9cb]"
            : "bg-[#f6fefb] text-[#2c5a48] border border-transparent hover:shadow-inner"
        }`}
      >
        Professionals
      </button>
    </div>
    {usersLoading ? <p className="px-4 py-3 text-sm text-slate-500">Loading users...</p> : null}
    {usersError ? <p className="px-4 py-3 text-sm text-red-600">{usersError}</p> : null}
    {usersTab === "students" ? (
      <div className="overflow-x-auto">
        <UsersList
          studentsList={studentsList}
          userDetailsById={userDetailsById}
          selectedStudentId={selectedStudentId}
          openStudentDetails={openStudentDetails}
        />
      </div>
    ) : (
      <div className="overflow-x-auto">
        {/* Add ProfessionalsList here if needed */}
        <p className="px-4 py-3 text-sm text-slate-500">Professionals list coming soon.</p>
      </div>
    )}
  </div>
);

export default UsersSection;
