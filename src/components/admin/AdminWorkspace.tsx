import Image from "next/image";
import { Bell } from "lucide-react";
import AdminAlertsPanel from "@/components/admin/AdminAlertsPanel";
import AdminApprovalsPanel from "@/components/admin/AdminApprovalsPanel";
import AdminCategoriesPanel from "@/components/admin/AdminCategoriesPanel";
import AdminPayoutsPanel from "@/components/admin/AdminPayoutsPanel";
import AdminReviewsPanel from "@/components/admin/AdminReviewsPanel";
import AdminUploadsPanel from "@/components/admin/AdminUploadsPanel";
import AdminUsersPanel from "@/components/admin/AdminUsersPanel";

type AdminWorkspaceProps = {
  [key: string]: any;
};

export default function AdminWorkspace(props: AdminWorkspaceProps) {
  const {
    menuItems,
    activeSection,
    setActiveSection,
    onLogout,
    selectedStudent,
    detailModal,
    adminProfileOpen,
    isCategoryFormOpen,
    globalSearchQuery,
    setGlobalSearchQuery,
    handleGlobalSearch,
    setAdminProfileOpen,
    ADMIN_PROFILE,
    adminTrendSeries,
    adminTrendWidth,
    adminTrendHeight,
    adminTrendPadding,
    adminTrendChartHeight,
    adminTrendLabels,
    adminTrendChartWidth,
    adminTrendPath,
    adminTrendPoints,
    todayTableActiveTab,
    setTodayTableActiveTab,
    paginatedDashboardTodayRows,
    approvalRequests,
    dashboardTodayPageStart,
    DASHBOARD_ITEMS_PER_PAGE,
    dashboardTodayCurrentPage,
    dashboardTodayTotalPages,
    setDashboardTodayCurrentPage,
    openAddCategoryForm,
    approvalCounts,
    paginatedApprovalRequests,
    approvalStatusStyles,
    updateApprovalStatus,
    openDetailModal,
    approvalsCurrentPage,
    ITEMS_PER_PAGE,
    approvalTotalPages,
    setApprovalsCurrentPage,
    reviewCounts,
    reviewsError,
    reviewsLoading,
    reviewEntries,
    paginatedReviewEntries,
    reviewsPageStart,
    reviewsCurrentPage,
    reviewsTotalPages,
    deleteReview,
    setReviewsCurrentPage,
    alertsView,
    setAlertsView,
    notificationsLoading,
    notifications,
    paginatedNotifications,
    alertsProfessionalsPageStart,
    alertsProfessionalsCurrentPage,
    alertsProfessionalsTotalPages,
    setAlertsProfessionalsCurrentPage,
    contactMessagesLoading,
    contactMessages,
    paginatedContactMessages,
    alertsStudentsPageStart,
    alertsStudentsCurrentPage,
    alertsStudentsTotalPages,
    setAlertStudentsCurrentPage,
    payoutCounts,
    payoutsLoading,
    payoutEntries,
    paginatedPayoutEntries,
    payoutsCurrentPage,
    payoutsTotalPages,
    setPayoutsCurrentPage,
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
    router,
    paginatedCategories,
    categoriesList,
    editCategory,
    deleteCategory,
    categoriesCurrentPage,
    categoryTotalPages,
    setCategoriesCurrentPage,
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
    deleteProfessional,
    professionalsCurrentPage,
    setProfessionalsCurrentPage,
  } = props;

  return (
    <section className="neumorph-admin-main relative flex min-h-screen bg-[#eef5f3]">
      <aside className="neumorph-admin-sidebar fixed left-0 top-0 z-20 hidden h-screen w-62.5 flex-col rounded-r-3xl p-3 shadow-[8px_8px_16px_#d0dbd6,-8px_-8px_16px_#ffffff] md:flex">
        <div className="mb-6">
          <div className="rounded-2xl bg-[#eef5f3] p-3 shadow-[3px_3px_8px_#d0dbd6,-3px_-3px_8px_#ffffff]">
            <Image src="/logo.png" alt="Lookit" width={120} height={40} className="h-10 w-auto" />
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item: any) => {
            const Icon = item.icon;
            const isActive = activeSection === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveSection(item.label)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-2 text-left text-sm font-semibold transition neumorph-sidebar-btn ${isActive ? "neumorph-sidebar-btn-active" : "neumorph-sidebar-btn-inactive"}`}
              >
                <span className="flex items-center gap-2"><Icon className="h-4 w-4" />{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto">
          <button type="button" onClick={onLogout} className="w-full rounded-2xl bg-[#eef5f3] border-none px-4 py-2 text-sm font-semibold text-[#2d6a4f] shadow-[3px_3px_6px_#d0dbd6,-3px_-3px_6px_#ffffff] hover:shadow-inner transition-all">Logout</button>
        </div>
      </aside>

      <div className={`neumorph-admin-content flex-1 p-3 sm:p-4 md:p-5 transition ml-62.5 h-screen overflow-y-auto hide-scrollbar ${selectedStudent || detailModal || adminProfileOpen || isCategoryFormOpen ? "blur-sm" : ""}`}>
        <div className="mb-6 hidden md:flex flex-col gap-3 rounded-2xl neumorph-admin-card p-4 shadow-[8px_8px_24px_#d0dbd6,-8px_-8px_24px_#ffffff] md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Search anything here..."
            value={globalSearchQuery}
            onChange={(event) => setGlobalSearchQuery(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); handleGlobalSearch(); } }}
            className="h-11 w-full rounded-2xl border-none bg-[#f6fefb] px-4 text-sm text-slate-800 shadow-[inset_4px_4px_12px_#d0dbd6,inset_-4px_-4px_12px_#ffffff] outline-none focus:ring-2 focus:ring-[#1ec28e] transition sm:max-w-xs"
          />
          <div className="hidden items-center gap-4 text-sm sm:flex">
            <span className="hidden text-slate-600 sm:inline">Open For Order</span>
            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600" />
            <Bell className="h-5 w-5 text-[#1ec28e]" />
            <button type="button" onClick={() => setAdminProfileOpen(true)} className="flex items-center gap-2 rounded-full bg-[#f6fefb] px-2.5 py-1.5">
              <Image src={ADMIN_PROFILE.avatar} alt="Admin profile" width={28} height={28} className="h-7 w-7 rounded-full object-cover border border-[#bfe9cb]" />
              <span className="text-slate-700">{ADMIN_PROFILE.name}</span>
            </button>
          </div>
        </div>

        {activeSection === "Dashboard" ? (
          <div className="rounded-2xl neumorph-admin-card p-4 sm:p-5">
            <h2 className="text-3xl font-semibold text-slate-800">Welcome.</h2>
            <p className="mb-4 text-sm text-slate-500">Navigate the future of education with Schooli.</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl neumorph-admin-stat p-4"><p className="text-xs text-[#2c5a48]">Students</p><p className="text-3xl font-bold text-[#0f2c21]">15.00K</p></div>
              <div className="rounded-2xl neumorph-admin-stat p-4"><p className="text-xs text-[#2c5a48]">Teachers</p><p className="text-3xl font-bold text-[#0f2c21]">200</p></div>
              <div className="rounded-2xl neumorph-admin-stat p-4"><p className="text-xs text-[#2c5a48]">Awards</p><p className="text-3xl font-bold text-[#0f2c21]">5.6K</p></div>
            </div>
            <div className="mt-6 text-sm text-slate-500">Dashboard widgets are available here.</div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-800">
                  {activeSection === "Users" ? "User Management" : activeSection === "Approvals" ? "Professional Requests" : activeSection === "Reviews" ? "Review Moderation" : activeSection === "Categories" ? "Category Management" : activeSection === "Uploads" ? "Book Upload Center" : activeSection === "Payouts" ? "Teacher Payments" : activeSection === "Banners" ? "Banner Placements" : "Teacher Notifications"}
                </h2>
              </div>
              {activeSection === "Categories" ? <button type="button" onClick={openAddCategoryForm} className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#18ad7d]">Add Category</button> : null}
            </div>

            {activeSection === "Approvals" ? <AdminApprovalsPanel approvalCounts={approvalCounts} paginatedApprovalRequests={paginatedApprovalRequests} approvalStatusStyles={approvalStatusStyles} updateApprovalStatus={updateApprovalStatus} openDetailModal={openDetailModal} approvalRequests={approvalRequests} approvalsCurrentPage={approvalsCurrentPage} itemsPerPage={ITEMS_PER_PAGE} approvalTotalPages={approvalTotalPages} setApprovalsCurrentPage={setApprovalsCurrentPage} />
              : activeSection === "Reviews" ? <AdminReviewsPanel reviewCounts={reviewCounts} reviewsError={reviewsError} reviewsLoading={reviewsLoading} reviewEntries={reviewEntries} paginatedReviewEntries={paginatedReviewEntries} reviewsPageStart={reviewsPageStart} itemsPerPage={ITEMS_PER_PAGE} reviewsCurrentPage={reviewsCurrentPage} reviewsTotalPages={reviewsTotalPages} onDeleteReview={deleteReview} onReviewsPageChange={setReviewsCurrentPage} />
              : activeSection === "Alerts" ? <AdminAlertsPanel alertsView={alertsView} setAlertsView={setAlertsView} notificationsLoading={notificationsLoading} notifications={notifications} paginatedNotifications={paginatedNotifications} alertsProfessionalsPageStart={alertsProfessionalsPageStart} alertsProfessionalsCurrentPage={alertsProfessionalsCurrentPage} alertsProfessionalsTotalPages={alertsProfessionalsTotalPages} onAlertsProfessionalsPageChange={setAlertsProfessionalsCurrentPage} contactMessagesLoading={contactMessagesLoading} contactMessages={contactMessages} paginatedContactMessages={paginatedContactMessages} alertsStudentsPageStart={alertsStudentsPageStart} alertsStudentsCurrentPage={alertsStudentsCurrentPage} alertsStudentsTotalPages={alertsStudentsTotalPages} onAlertsStudentsPageChange={setAlertStudentsCurrentPage} itemsPerPage={ITEMS_PER_PAGE} />
              : activeSection === "Payouts" ? <AdminPayoutsPanel payoutCounts={payoutCounts} payoutsLoading={payoutsLoading} payoutEntries={payoutEntries} paginatedPayoutEntries={paginatedPayoutEntries} openDetailModal={openDetailModal} payoutsCurrentPage={payoutsCurrentPage} payoutsTotalPages={payoutsTotalPages} itemsPerPage={ITEMS_PER_PAGE} setPayoutsCurrentPage={setPayoutsCurrentPage} />
              : activeSection === "Uploads" ? <AdminUploadsPanel uploadView={uploadView} setUploadView={setUploadView} uploadsLoading={uploadsLoading} professionalUploadRows={professionalUploadRows} paginatedProfessionalUploadRows={paginatedProfessionalUploadRows} studentUploadRows={studentUploadRows} paginatedStudentUploadRows={paginatedStudentUploadRows} uploadsProfessionalsCurrentPage={uploadsProfessionalsCurrentPage} uploadsProfessionalsTotalPages={uploadsProfessionalsTotalPages} setUploadsProfessionalsCurrentPage={setUploadsProfessionalsCurrentPage} uploadsStudentsCurrentPage={uploadsStudentsCurrentPage} uploadsStudentsTotalPages={uploadsStudentsTotalPages} setUploadsStudentsCurrentPage={setUploadsStudentsCurrentPage} itemsPerPage={ITEMS_PER_PAGE} onOpenProfessional={(id) => router.push(`/admin/uploads/professionals/${id}`)} onOpenStudent={(id) => router.push(`/admin/uploads/students/${id}`)} />
              : activeSection === "Categories" ? <AdminCategoriesPanel paginatedCategories={paginatedCategories} categoriesList={categoriesList} editCategory={editCategory} deleteCategory={deleteCategory} openDetailModal={openDetailModal} categoriesCurrentPage={categoriesCurrentPage} categoryTotalPages={categoryTotalPages} itemsPerPage={ITEMS_PER_PAGE} setCategoriesCurrentPage={setCategoriesCurrentPage} />
              : <AdminUsersPanel usersTab={usersTab} setUsersTab={setUsersTab} usersLoading={usersLoading} usersError={usersError} studentsList={studentsList} selectedStudentId={selectedStudentId} openStudentDetails={openStudentDetails} deleteStudent={deleteStudent} studentsCurrentPage={studentsCurrentPage} setStudentsCurrentPage={setStudentsCurrentPage} professionalUsers={professionalUsers} openDetailModal={openDetailModal} deleteProfessional={deleteProfessional} professionalsCurrentPage={professionalsCurrentPage} setProfessionalsCurrentPage={setProfessionalsCurrentPage} itemsPerPage={ITEMS_PER_PAGE} />}
          </div>
        )}
      </div>
    </section>
  );
}
