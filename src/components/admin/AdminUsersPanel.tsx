import { Eye, PencilLine, Trash2 } from "lucide-react";

type AdminUsersPanelProps = {
  usersTab: "students" | "professionals";
  setUsersTab: (tab: "students" | "professionals") => void;
  usersLoading: boolean;
  usersError: string;
  studentsList: any[];
  selectedStudentId: number | null;
  openStudentDetails: (id: number) => void;
  deleteStudent: (id: number) => Promise<void> | void;
  studentsCurrentPage: number;
  setStudentsCurrentPage: (value: number | ((value: number) => number)) => void;
  professionalUsers: any[];
  openDetailModal: (payload: any) => void;
  deleteProfessional: (backendId: string) => Promise<void> | void;
  professionalsCurrentPage: number;
  setProfessionalsCurrentPage: (value: number | ((value: number) => number)) => void;
  itemsPerPage: number;
};

export default function AdminUsersPanel(props: AdminUsersPanelProps) {
  const {
    usersTab,
    setUsersTab,
    usersLoading,
    usersError,
    studentsList,
    selectedStudentId,
    openStudentDetails,
    deleteStudent,
    studentsCurrentPage,
    setStudentsCurrentPage,
    professionalUsers,
    openDetailModal,
    deleteProfessional,
    professionalsCurrentPage,
    setProfessionalsCurrentPage,
    itemsPerPage,
  } = props;
  const studentsTotalPages = Math.max(1, Math.ceil(studentsList.length / itemsPerPage));
  const professionalsTotalPages = Math.max(1, Math.ceil(professionalUsers.length / itemsPerPage));

  const getProfessionalDetailPayload = (professional: any) => ({
    title: "Professional Details",
    subtitle: professional.email,
    entries: [
      { label: "Name", value: professional.name },
      { label: "Email", value: professional.email },
      { label: "Provider", value: professional.provider },
      { label: "Specialization", value: professional.specialization || "-" },
      { label: "Contact Number", value: professional.contactNumber || "-" },
      { label: "Location", value: professional.location || "-" },
      { label: "Certificates", value: String(professional.certificatesCount) },
      { label: "Reviews", value: String(professional.reviewsCount) },
      {
        label: "Profile Boosted Until",
        value: professional.profileBoostedUntil ? new Date(professional.profileBoostedUntil).toLocaleString() : "-",
      },
      { label: "Joined", value: professional.joinedAt },
    ],
  });

  return (
    <div className="mt-6 overflow-visible rounded-2xl neumorph-admin-card border border-transparent p-4 shadow-[8px_8px_24px_#d0dbd6,-8px_-8px_24px_#ffffff]">
      <div className="flex gap-3 border-b border-slate-200 px-2 py-3 mb-2">
        <button type="button" onClick={() => setUsersTab("students")} className={`rounded-full px-6 py-2 text-xs font-semibold ${usersTab === "students" ? "bg-[#e8f9ee] text-[#178c43] border border-[#bfe9cb]" : "bg-[#f6fefb] text-[#2c5a48] border border-transparent"}`}>Students</button>
        <button type="button" onClick={() => setUsersTab("professionals")} className={`rounded-full px-6 py-2 text-xs font-semibold ${usersTab === "professionals" ? "bg-[#e8f9ee] text-[#178c43] border border-[#bfe9cb]" : "bg-[#f6fefb] text-[#2c5a48] border border-transparent"}`}>Professionals</button>
      </div>

      {usersLoading ? <p className="px-4 py-3 text-sm text-slate-500">Loading users...</p> : null}
      {usersError ? <p className="px-4 py-3 text-sm text-red-600">{usersError}</p> : null}

      {usersTab === "students" ? (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead className="bg-[#f6fefb] text-left text-[#178c43]">
              <tr><th className="px-5 py-3 font-semibold">MEMBER</th><th className="px-5 py-3 font-semibold">NAME</th><th className="px-5 py-3 font-semibold">MEMBERSHIP STATUS</th><th className="px-5 py-3 font-semibold">MEMBER SINCE</th><th className="px-5 py-3 font-semibold text-right">ACTION</th></tr>
            </thead>
            <tbody>
              {studentsList.slice((studentsCurrentPage - 1) * itemsPerPage, studentsCurrentPage * itemsPerPage).map((student) => {
                const isSelected = selectedStudentId === student.id;
                return (
                  <tr key={student.id} onClick={() => openStudentDetails(student.id)} className={`cursor-pointer transition duration-150 border-b border-slate-100 ${isSelected ? "bg-[#e8f9ee]" : "bg-white hover:bg-slate-50"}`}>
                    <td className="px-5 py-4 align-middle"><div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white font-semibold">{student.name.charAt(0).toUpperCase()}</div></td>
                    <td className="px-5 py-4 align-middle"><div className="font-semibold text-slate-800">{student.name}</div><div className="text-xs text-slate-500">{student.email}</div></td>
                    <td className="px-5 py-4 align-middle"><span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Active</span></td>
                    <td className="px-5 py-4 align-middle text-slate-700">{student.joinedAt}</td>
                    <td className="px-5 py-4 align-middle"><div className="flex justify-end gap-2">
                      <button type="button" onClick={(e) => e.stopPropagation()} className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"><PencilLine className="h-3.5 w-3.5" /></button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); openStudentDetails(student.id); }} className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-600 hover:bg-green-100"><Eye className="h-3.5 w-3.5" /></button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); void deleteStudent(student.id); }} className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
            </table>
          </div>
          <div className="mt-3 flex justify-end">
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setStudentsCurrentPage((p) => Math.max(1, p - 1))} disabled={studentsCurrentPage === 1} className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Prev</button>
              {Array.from({ length: studentsTotalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} type="button" onClick={() => setStudentsCurrentPage(page)} className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg border text-xs font-semibold transition ${page === studentsCurrentPage ? "border-[#178c43] bg-[#178c43] text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>{page}</button>
              ))}
              <button type="button" onClick={() => setStudentsCurrentPage((p) => Math.min(studentsTotalPages, p + 1))} disabled={studentsCurrentPage === studentsTotalPages} className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr><th className="px-4 py-3 font-semibold">MEMBER</th><th className="px-4 py-3 font-semibold">NAME</th><th className="px-4 py-3 font-semibold">SPECIALIZATION</th><th className="px-4 py-3 font-semibold">MEMBER SINCE</th><th className="px-4 py-3 text-right font-semibold">ACTION</th></tr>
            </thead>
            <tbody>
              {professionalUsers.slice((professionalsCurrentPage - 1) * itemsPerPage, professionalsCurrentPage * itemsPerPage).map((professional) => (
                <tr key={professional.id} className="cursor-pointer border-b border-slate-100 bg-white transition hover:bg-slate-50" onClick={() => openDetailModal(getProfessionalDetailPayload(professional))}>
                  <td className="px-4 py-4"><div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-300 to-blue-400 flex items-center justify-center text-white font-semibold">{professional.name.charAt(0).toUpperCase()}</div></td>
                  <td className="px-4 py-4"><div className="font-medium text-slate-800">{professional.name}</div><div className="text-xs text-slate-500">{professional.email}</div></td>
                  <td className="px-4 py-4 text-slate-700">{professional.specialization || "-"}</td>
                  <td className="px-4 py-4 text-slate-700">{professional.joinedAt}</td>
                  <td className="px-4 py-4"><div className="flex justify-end gap-2">
                    <button type="button" className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"><PencilLine className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); openDetailModal(getProfessionalDetailPayload(professional)); }} className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-600 hover:bg-green-100"><Eye className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); void deleteProfessional(professional.backendId); }} className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
          <div className="mt-3 flex justify-end">
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setProfessionalsCurrentPage((p) => Math.max(1, p - 1))} disabled={professionalsCurrentPage === 1} className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Prev</button>
              {Array.from({ length: professionalsTotalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} type="button" onClick={() => setProfessionalsCurrentPage(page)} className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg border text-xs font-semibold transition ${page === professionalsCurrentPage ? "border-[#178c43] bg-[#178c43] text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>{page}</button>
              ))}
              <button type="button" onClick={() => setProfessionalsCurrentPage((p) => Math.min(professionalsTotalPages, p + 1))} disabled={professionalsCurrentPage === professionalsTotalPages} className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
