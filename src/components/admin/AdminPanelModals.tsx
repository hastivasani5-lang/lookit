import Image from "next/image";
import { X } from "lucide-react";

type AdminPanelModalsProps = {
  [key: string]: any;
};

export default function AdminPanelModals(props: AdminPanelModalsProps) {
  const {
    isCategoryFormOpen,
    editingCategoryId,
    categoryName,
    setCategoryName,
    categoryType,
    setCategoryType,
    categoryDescription,
    setCategoryDescription,
    closeCategoryForm,
    saveCategory,
    adminProfileOpen,
    setAdminProfileOpen,
    ADMIN_PROFILE,
    onLogout,
    detailModal,
    setDetailModal,
    selectedStudent,
    editingStudent,
    setSelectedStudentId,
    selectedStudentMeta,
    studentDraft,
    editableStudentFields,
    setStudentDraft,
    closeEditStudent,
    saveStudent,
  } = props;

  return (
    <>
      {isCategoryFormOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-4 shadow-2xl sm:p-5">
            <h3 className="text-base font-semibold text-slate-800">{editingCategoryId !== null ? "Edit Professional Category" : "Add Professional Category"}</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input type="text" value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="Category name" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#1ec28e]" />
              <input type="text" value={categoryType} onChange={(event) => setCategoryType(event.target.value)} placeholder="Category type" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#1ec28e]" />
              <textarea value={categoryDescription} onChange={(event) => setCategoryDescription(event.target.value)} placeholder="Category description" rows={4} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#1ec28e] sm:col-span-2" />
            </div>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={closeCategoryForm} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">Cancel</button>
              <button type="button" onClick={saveCategory} className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#18ad7d]">{editingCategoryId !== null ? "Update Category" : "Add Category"}</button>
            </div>
          </div>
        </div>
      ) : null}

      {adminProfileOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div><h3 className="text-lg font-semibold text-slate-800">Admin Profile</h3><p className="text-sm text-slate-500">Manage your admin session from here.</p></div>
              <button type="button" onClick={() => setAdminProfileOpen(false)} className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <Image src={ADMIN_PROFILE.avatar} alt="Admin profile" width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
                <div><p className="text-base font-semibold text-slate-800">{ADMIN_PROFILE.name}</p><p className="text-sm text-slate-500">System Administrator</p><p className="text-sm text-slate-600">{ADMIN_PROFILE.email}</p></div>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setAdminProfileOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">Close</button>
              <button type="button" onClick={onLogout} className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#18ad7d]">Logout</button>
            </div>
          </div>
        </div>
      ) : null}

      {detailModal ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div><h3 className="text-lg font-semibold text-slate-800">{detailModal.title}</h3>{detailModal.subtitle ? <p className="text-sm text-slate-500">{detailModal.subtitle}</p> : null}</div>
              <button type="button" onClick={() => setDetailModal(null)} className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {detailModal.entries.map((entry: any) => (
                <div key={entry.label} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{entry.label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{entry.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {selectedStudent && !editingStudent ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div><h3 className="text-lg font-semibold text-slate-800">User Details</h3><p className="text-sm text-slate-500">Complete backend user details.</p></div>
              <button type="button" onClick={() => setSelectedStudentId(null)} className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="rounded-2xl bg-[#f8fafc] p-5">
                <p className="text-sm text-slate-500">Role</p><p className="mt-1 text-lg font-semibold text-slate-800">{selectedStudentMeta?.role ?? "student"}</p>
                <p className="mt-4 text-sm text-slate-500">Name</p><p className="mt-1 text-lg font-semibold text-slate-800">{selectedStudent.name}</p>
                <p className="mt-4 text-sm text-slate-500">Email</p><p className="mt-1 text-sm font-medium text-slate-800">{selectedStudent.email}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {editingStudent && studentDraft ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div><h3 className="text-lg font-semibold text-slate-800">Edit Student</h3><p className="text-sm text-slate-500">Update the student record and save changes.</p></div>
              <button type="button" onClick={closeEditStudent} className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {editableStudentFields.map((field: any) => (
                <label key={field.key} className="space-y-1 text-sm">
                  <span className="text-slate-500">{field.label}</span>
                  <input value={studentDraft[field.key]} onChange={(event) => setStudentDraft((current: any) => (current ? { ...current, [field.key]: event.target.value } : current))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#1ec28e]" />
                </label>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={closeEditStudent} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">Cancel</button>
              <button type="button" onClick={saveStudent} className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#18ad7d]">Save Changes</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
