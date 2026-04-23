import { Eye } from "lucide-react";

type UploadView = "professional-uploads" | "student-purchases";

type AdminUploadsPanelProps = {
  uploadView: UploadView;
  setUploadView: (view: UploadView) => void;
  uploadsLoading: boolean;
  professionalUploadRows: any[];
  paginatedProfessionalUploadRows: any[];
  studentUploadRows: any[];
  paginatedStudentUploadRows: any[];
  uploadsProfessionalsCurrentPage: number;
  uploadsProfessionalsTotalPages: number;
  setUploadsProfessionalsCurrentPage: (value: number | ((value: number) => number)) => void;
  uploadsStudentsCurrentPage: number;
  uploadsStudentsTotalPages: number;
  setUploadsStudentsCurrentPage: (value: number | ((value: number) => number)) => void;
  itemsPerPage: number;
  onOpenProfessional: (id: string) => void;
  onOpenStudent: (id: string) => void;
};

export default function AdminUploadsPanel(props: AdminUploadsPanelProps) {
  const {
    uploadView,
    setUploadView,
    uploadsLoading,
    professionalUploadRows,
    paginatedProfessionalUploadRows,
    studentUploadRows,
    paginatedStudentUploadRows,
    uploadsProfessionalsCurrentPage,
    uploadsProfessionalsTotalPages,
    setUploadsProfessionalsCurrentPage,
    uploadsStudentsCurrentPage,
    uploadsStudentsTotalPages,
    setUploadsStudentsCurrentPage,
    itemsPerPage,
    onOpenProfessional,
    onOpenStudent,
  } = props;

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex w-full max-w-sm items-center gap-2 rounded-xl bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setUploadView("professional-uploads")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              uploadView === "professional-uploads" ? "bg-[#2d6a4f] text-white" : "text-slate-600 hover:bg-white"
            }`}
          >
            Professional Uploads
          </button>
          <button
            type="button"
            onClick={() => setUploadView("student-purchases")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              uploadView === "student-purchases" ? "bg-[#2d6a4f] text-white" : "text-slate-600 hover:bg-white"
            }`}
          >
            Student Purchases
          </button>
        </div>
      </div>

      {uploadView === "professional-uploads" ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3"><h3 className="font-semibold text-slate-800">Professionals</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-[15px]">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Categories</th><th className="px-4 py-3">Books</th><th className="px-4 py-3">Videos</th><th className="px-4 py-3 text-right">View</th></tr>
              </thead>
              <tbody>
                {uploadsLoading ? (
                  <tr><td colSpan={6} className="px-4 py-4 text-base text-slate-500">Loading professionals...</td></tr>
                ) : professionalUploadRows.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-4 text-base text-slate-500">No professionals found.</td></tr>
                ) : paginatedProfessionalUploadRows.map((professional) => (
                  <tr key={professional.id} className="border-t border-slate-100 text-slate-700">
                    <td className="px-4 py-3 font-medium text-slate-800">{professional.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{professional.email}</td>
                    <td className="px-4 py-3">{professional.categories.length}</td>
                    <td className="px-4 py-3">{professional.booksCount}</td>
                    <td className="px-4 py-3">{professional.videosCount}</td>
                    <td className="px-4 py-3"><div className="flex justify-end"><button type="button" onClick={() => onOpenProfessional(professional.id)} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"><Eye className="h-3.5 w-3.5" />View</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {professionalUploadRows.length > 0 ? (
            <div className="px-4 py-3 flex justify-end">
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setUploadsProfessionalsCurrentPage((p) => p - 1)} disabled={uploadsProfessionalsCurrentPage === 1} className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Prev</button>
                {Array.from({ length: uploadsProfessionalsTotalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} type="button" onClick={() => setUploadsProfessionalsCurrentPage(page)} className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg border text-xs font-semibold transition ${page === uploadsProfessionalsCurrentPage ? "border-[#178c43] bg-[#178c43] text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>{page}</button>
                ))}
                <button type="button" onClick={() => setUploadsProfessionalsCurrentPage((p) => p + 1)} disabled={uploadsProfessionalsCurrentPage === uploadsProfessionalsTotalPages} className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Next</button>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3"><h3 className="font-semibold text-slate-800">Students</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-[15px]">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Purchased Books</th><th className="px-4 py-3">Watched Videos</th><th className="px-4 py-3">Last Activity</th><th className="px-4 py-3 text-right">View</th></tr>
              </thead>
              <tbody>
                {uploadsLoading ? (
                  <tr><td colSpan={6} className="px-4 py-4 text-base text-slate-500">Loading students...</td></tr>
                ) : studentUploadRows.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-4 text-base text-slate-500">No students found.</td></tr>
                ) : paginatedStudentUploadRows.map((student) => (
                  <tr key={student.id} className="border-t border-slate-100 text-slate-700">
                    <td className="px-4 py-3 font-medium text-slate-800">{student.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{student.email}</td>
                    <td className="px-4 py-3">{student.purchasedBooksCount}</td>
                    <td className="px-4 py-3">{student.watchedVideosCount}</td>
                    <td className="px-4 py-3">{new Date(student.lastActivity).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><div className="flex justify-end"><button type="button" onClick={() => onOpenStudent(student.id)} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"><Eye className="h-3.5 w-3.5" />View</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {studentUploadRows.length > 0 ? (
            <div className="px-4 py-3 flex justify-end">
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setUploadsStudentsCurrentPage((p) => p - 1)} disabled={uploadsStudentsCurrentPage === 1} className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Prev</button>
                {Array.from({ length: uploadsStudentsTotalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} type="button" onClick={() => setUploadsStudentsCurrentPage(page)} className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg border text-xs font-semibold transition ${page === uploadsStudentsCurrentPage ? "border-[#178c43] bg-[#178c43] text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>{page}</button>
                ))}
                <button type="button" onClick={() => setUploadsStudentsCurrentPage((p) => p + 1)} disabled={uploadsStudentsCurrentPage === uploadsStudentsTotalPages} className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Next</button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
