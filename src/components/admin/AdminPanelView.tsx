"use client";

import Image from "next/image";
import {
  Bell,
  ClipboardList,
  DollarSign,
  FolderTree,
  Home,
  ShieldCheck,
  UploadCloud,
  Users,
  BellRing,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SiteLogo from "@/components/SiteLogo";
import AdminAlertsPanel from "@/components/admin/AdminAlertsPanel";
import AdminApprovalsPanel from "@/components/admin/AdminApprovalsPanel";
import AdminCategoriesPanel from "@/components/admin/AdminCategoriesPanel";
import AdminPayoutsPanel from "@/components/admin/AdminPayoutsPanel";
import AdminPanelModals from "@/components/admin/AdminPanelModals";
import AdminReviewsPanel from "@/components/admin/AdminReviewsPanel";
import AdminUploadsPanel from "@/components/admin/AdminUploadsPanel";
import AdminUsersPanel from "@/components/admin/AdminUsersPanel";
import AdminWorkspace from "@/components/admin/AdminWorkspace";

import type { ProfessionalNotification } from "@/types/notifications";
const ADMIN_PROFILE = {
  name: "Admin",
  email: "jenilgadhiya@gmail.com",
  avatar: "/pro1.jpeg",
};

type AdminSection =
  | "Dashboard"
  | "Users"
  | "Approvals"
  | "Reviews"
  | "Categories"
  | "Uploads"
  | "Payouts"
  | "Alerts";

type ApprovalStatus = "pending" | "approved" | "rejected";

type ApprovalRequest = {
  id: string;
  name: string;
  email: string;
  specialization: string;
  updated: string;
  status: ApprovalStatus;
  provider: "credentials" | "google";
  approvalReviewedBy: string | null;
  approvalReviewedAt: string | null;
  approvalNote: string | null;
};

type ReviewEntry = {
  id: string;
  userName: string;
  professionalName: string;
  professionalDetails: string;
  review: string;
  rating: number;
  createdAt: string;
  flagged: boolean;
};

type AdminReviewRecord = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  professionalId: string;
  professionalName: string;
  rating: number;
  review: string;
  createdAt: string;
};

type PayoutStatus = "pending" | "completed";

type PayoutEntry = {
  id: number;
  professionalName: string;
  professionalEmail: string;
  plan: string;
  amount: string;
  transactionId: string;
  paidAt: string;
  status: PayoutStatus;
};

type AdminPaymentRecord = {
  id: string;
  studentName: string;
  studentEmail: string;
  professionalName: string;
  plan: string;
  amount: string;
  transactionId: string;
  paidAt: string;
  status: "completed";
};

type UploadView = "professional-uploads" | "student-purchases";

type AlertsView = "professionals" | "students";

type ProfessionalUploadSummary = {
  id: string;
  name: string;
  email: string;
  categories: string[];
  booksCount: number;
  videosCount: number;
  lastUpdated: string;
};

type StudentActivitySummary = {
  id: string;
  name: string;
  email: string;
  purchasedBooksCount: number;
  watchedVideosCount: number;
  lastActivity: string;
};

type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  agreedToTerms: boolean;
  createdAt: string;
};

type DetailModalState = {
  title: string;
  subtitle?: string;
  entries: Array<{ label: string; value: string }>;
};

type StudentCategory = "Science" | "Arts" | "Commerce" | "Technology" | "Sports";

type AdminStudent = {
  id: number;
  name: string;
  email: string;
  category: StudentCategory;
  grade: string;
  age: number;
  phone: string;
  guardian: string;
  address: string;
  marks: number;
  progress: string;
  joinedAt: string;
};

type ProfessionalCategory = {
  id: number;
  name: string;
  type: string;
  description: string;
  professionals: number;
};

type AdminUserDetails = {
  id: number;
  backendId: string;
  role: "student" | "professional";
  provider: "credentials" | "google";
  specialization: string;
  contactNumber: string;
  location: string;
  certificatesCount: number;
  reviewsCount: number;
  profileBoostedUntil: string | null;
  createdAt: string;
};

type AdminProfessionalUser = {
  id: number;
  backendId: string;
  name: string;
  email: string;
  provider: "credentials" | "google";
  specialization: string;
  contactNumber: string;
  location: string;
  certificatesCount: number;
  reviewsCount: number;
  profileBoostedUntil: string | null;
  joinedAt: string;
};

const menuItems: Array<{ label: AdminSection; icon: typeof Home }> = [
  { label: "Dashboard", icon: Home },
  { label: "Users", icon: Users },
  { label: "Approvals", icon: ShieldCheck },
  { label: "Reviews", icon: ClipboardList },
  { label: "Categories", icon: FolderTree },
  { label: "Uploads", icon: UploadCloud },
  { label: "Payouts", icon: DollarSign },
  { label: "Alerts", icon: BellRing },
];

const initialApprovalRequests: ApprovalRequest[] = [
  {
    id: "placeholder-1",
    name: "Pending professional",
    email: "-",
    specialization: "-",
    updated: "Today",
    status: "pending",
    provider: "credentials",
    approvalReviewedBy: null,
    approvalReviewedAt: null,
    approvalNote: null,
  },
  {
    id: "placeholder-2",
    name: "Pending professional",
    email: "-",
    specialization: "-",
    updated: "Yesterday",
    status: "pending",
    provider: "credentials",
    approvalReviewedBy: null,
    approvalReviewedAt: null,
    approvalNote: null,
  },
];

const initialReviewEntries: ReviewEntry[] = [];

const initialPayoutEntries: PayoutEntry[] = [
  {
    id: 1,
    professionalName: "Riya Sharma",
    professionalEmail: "riya.sharma@example.com",
    plan: "Pro (1 month boost)",
    amount: "₹799",
    transactionId: "TXN-PRF-12091",
    paidAt: "Today, 10:24 AM",
    status: "completed",
  },
  {
    id: 2,
    professionalName: "Aarav Mehta",
    professionalEmail: "aarav.mehta@example.com",
    plan: "Starter (1 week boost)",
    amount: "₹299",
    transactionId: "TXN-PRF-12088",
    paidAt: "Today, 09:02 AM",
    status: "pending",
  },
  {
    id: 3,
    professionalName: "Neha Verma",
    professionalEmail: "neha.verma@example.com",
    plan: "Elite (3 month boost)",
    amount: "₹1499",
    transactionId: "TXN-PRF-12076",
    paidAt: "Yesterday, 06:45 PM",
    status: "completed",
  },
  {
    id: 4,
    professionalName: "Kunal Patel",
    professionalEmail: "kunal.patel@example.com",
    plan: "Premium (2 month boost)",
    amount: "₹1199",
    transactionId: "TXN-PRF-12063",
    paidAt: "2 days ago",
    status: "pending",
  },
];

const initialStudents: AdminStudent[] = [
  {
    id: 1,
    name: "Ava Johnson",
    email: "ava.johnson@example.com",
    category: "Science",
    grade: "Grade 10",
    age: 15,
    phone: "+1 555 101 2001",
    guardian: "Michael Johnson",
    address: "12 Elm Street, Boston, MA",
    marks: 92,
    progress: "Excellent",
    joinedAt: "2026-01-12",
  },
  {
    id: 2,
    name: "Noah Williams",
    email: "noah.williams@example.com",
    category: "Arts",
    grade: "Grade 11",
    age: 16,
    phone: "+1 555 101 2002",
    guardian: "Sarah Williams",
    address: "84 Maple Avenue, Austin, TX",
    marks: 88,
    progress: "Very Good",
    joinedAt: "2025-11-28",
  },
  {
    id: 3,
    name: "Mia Patel",
    email: "mia.patel@example.com",
    category: "Commerce",
    grade: "Grade 12",
    age: 17,
    phone: "+1 555 101 2003",
    guardian: "Rohan Patel",
    address: "221 Pine Road, Seattle, WA",
    marks: 95,
    progress: "Excellent",
    joinedAt: "2025-09-05",
  },
  {
    id: 4,
    name: "Ethan Lee",
    email: "ethan.lee@example.com",
    category: "Technology",
    grade: "Grade 9",
    age: 14,
    phone: "+1 555 101 2004",
    guardian: "Grace Lee",
    address: "67 Cedar Lane, San Jose, CA",
    marks: 90,
    progress: "Good",
    joinedAt: "2026-02-02",
  },
  {
    id: 5,
    name: "Sophia Martin",
    email: "sophia.martin@example.com",
    category: "Sports",
    grade: "Grade 10",
    age: 15,
    phone: "+1 555 101 2005",
    guardian: "Laura Martin",
    address: "19 River Street, Denver, CO",
    marks: 86,
    progress: "Good",
    joinedAt: "2025-12-19",
  },
];

const initialProfessionalCategories: ProfessionalCategory[] = [
  {
    id: 1,
    name: "Web Development",
    type: "Technology",
    description: "Frontend, backend, and full-stack professionals.",
    professionals: 38,
  },
  {
    id: 2,
    name: "UI/UX Design",
    type: "Design",
    description: "Product designers, UI designers, and UX researchers.",
    professionals: 21,
  },
  {
    id: 3,
    name: "Digital Marketing",
    type: "Marketing",
    description: "SEO, social media, paid ads, and growth specialists.",
    professionals: 26,
  },
  {
    id: 4,
    name: "Data Science",
    type: "Analytics",
    description: "Data analysts, ML engineers, and AI practitioners.",
    professionals: 14,
  },
  {
    id: 5,
    name: "Business Consulting",
    type: "Business",
    description: "Business strategy, operations, and consulting experts.",
    professionals: 17,
  },
];

const editableStudentFields: Array<{
  key: Exclude<keyof AdminStudent, "id" | "age" | "marks">;
  label: string;
}> = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "category", label: "Category" },
  { key: "grade", label: "Grade" },
  { key: "phone", label: "Phone" },
  { key: "guardian", label: "Guardian" },
  { key: "address", label: "Address" },
  { key: "progress", label: "Progress" },
];

const approvalStatusStyles: Record<
  ApprovalStatus,
  { row: string; pill: string; label: string }
> = {
  pending: {
    row: "bg-white",
    pill: "border border-amber-200 bg-amber-50 text-amber-700",
    label: "Pending",
  },
  approved: {
    row: "bg-[#f0fbf4]",
    pill: "border border-[#bfe9cb] bg-[#e8f9ee] text-[#178c43]",
    label: "Approved",
  },
  rejected: {
    row: "bg-[#fff1f1]",
    pill: "border border-[#f5c1c1] bg-[#ffe7e7] text-[#cc2a2a]",
    label: "Rejected",
  },
};

export default function AdminPanelView() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<AdminSection>("Dashboard");
  const [studentsList, setStudentsList] = useState(initialStudents);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [studentDraft, setStudentDraft] = useState<AdminStudent | null>(null);
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(initialApprovalRequests);
  const [reviewEntries, setReviewEntries] = useState(initialReviewEntries);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");
  const [payoutEntries, setPayoutEntries] = useState(initialPayoutEntries);
  const [payoutsLoading, setPayoutsLoading] = useState(false);
  const [uploadView, setUploadView] = useState<UploadView>("professional-uploads");
  const [alertsView, setAlertsView] = useState<AlertsView>("professionals");
  const [alertsProfessionalsCurrentPage, setAlertsProfessionalsCurrentPage] = useState(1);
  const [alertsStudentsCurrentPage, setAlertStudentsCurrentPage] = useState(1);
  const [detailModal, setDetailModal] = useState<DetailModalState | null>(null);
  const [categoriesList, setCategoriesList] = useState(initialProfessionalCategories);
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [notifications, setNotifications] = useState<ProfessionalNotification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [contactMessagesLoading, setContactMessagesLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [usersTab, setUsersTab] = useState<"students" | "professionals">("students");
  const [userDetailsById, setUserDetailsById] = useState<Record<number, AdminUserDetails>>({});
  const [professionalUsers, setProfessionalUsers] = useState<AdminProfessionalUser[]>([]);
  const [professionalUploadRows, setProfessionalUploadRows] = useState<ProfessionalUploadSummary[]>([]);
  const [studentUploadRows, setStudentUploadRows] = useState<StudentActivitySummary[]>([]);
  const [uploadsLoading, setUploadsLoading] = useState(false);
  const [adminProfileOpen, setAdminProfileOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [studentsCurrentPage, setStudentsCurrentPage] = useState(1);
  const [professionalsCurrentPage, setProfessionalsCurrentPage] = useState(1);
  const [reviewsCurrentPage, setReviewsCurrentPage] = useState(1);
  const [approvalsCurrentPage, setApprovalsCurrentPage] = useState(1);
  const [categoriesCurrentPage, setCategoriesCurrentPage] = useState(1);
  const [uploadsProfessionalsCurrentPage, setUploadsProfessionalsCurrentPage] = useState(1);
  const [uploadsStudentsCurrentPage, setUploadsStudentsCurrentPage] = useState(1);
  const [payoutsCurrentPage, setPayoutsCurrentPage] = useState(1);
  const [todayTableActiveTab, setTodayTableActiveTab] = useState<"Student" | "Teacher" | "Notification">("Student");
  const [dashboardTodayCurrentPage, setDashboardTodayCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const DASHBOARD_ITEMS_PER_PAGE = 10;
  const approvalTotalPages = Math.max(1, Math.ceil(approvalRequests.length / ITEMS_PER_PAGE));
  const approvalPageStart = (approvalsCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedApprovalRequests = approvalRequests.slice(approvalPageStart, approvalPageStart + ITEMS_PER_PAGE);
  const categoryTotalPages = Math.max(1, Math.ceil(categoriesList.length / ITEMS_PER_PAGE));
  const categoryPageStart = (categoriesCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCategories = categoriesList.slice(categoryPageStart, categoryPageStart + ITEMS_PER_PAGE);
  const uploadsProfessionalsTotalPages = Math.max(1, Math.ceil(professionalUploadRows.length / ITEMS_PER_PAGE));
  const uploadsProfessionalsPageStart = (uploadsProfessionalsCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProfessionalUploadRows = professionalUploadRows.slice(
    uploadsProfessionalsPageStart,
    uploadsProfessionalsPageStart + ITEMS_PER_PAGE,
  );
  const uploadsStudentsTotalPages = Math.max(1, Math.ceil(studentUploadRows.length / ITEMS_PER_PAGE));
  const uploadsStudentsPageStart = (uploadsStudentsCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStudentUploadRows = studentUploadRows.slice(uploadsStudentsPageStart, uploadsStudentsPageStart + ITEMS_PER_PAGE);
  const payoutsTotalPages = Math.max(1, Math.ceil(payoutEntries.length / ITEMS_PER_PAGE));
  const payoutsPageStart = (payoutsCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPayoutEntries = payoutEntries.slice(payoutsPageStart, payoutsPageStart + ITEMS_PER_PAGE);
  const alertsProfessionalsTotalPages = Math.max(1, Math.ceil(notifications.length / ITEMS_PER_PAGE));
  const alertsProfessionalsPageStart = (alertsProfessionalsCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNotifications = notifications.slice(
    alertsProfessionalsPageStart,
    alertsProfessionalsPageStart + ITEMS_PER_PAGE,
  );
  const alertsStudentsTotalPages = Math.max(1, Math.ceil(contactMessages.length / ITEMS_PER_PAGE));
  const alertsStudentsPageStart = (alertsStudentsCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedContactMessages = contactMessages.slice(alertsStudentsPageStart, alertsStudentsPageStart + ITEMS_PER_PAGE);
  const reviewsTotalPages = Math.max(1, Math.ceil(reviewEntries.length / ITEMS_PER_PAGE));
  const reviewsPageStart = (reviewsCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedReviewEntries = reviewEntries.slice(reviewsPageStart, reviewsPageStart + ITEMS_PER_PAGE);
  const now = new Date();
  const isSameCalendarDay = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return false;
    }

    return (
      parsed.getFullYear() === now.getFullYear() &&
      parsed.getMonth() === now.getMonth() &&
      parsed.getDate() === now.getDate()
    );
  };

  const dashboardTodayRows =
    todayTableActiveTab === "Student"
      ? studentsList
          .filter((student) => isSameCalendarDay(student.joinedAt))
          .map((student) => ({
          id: `student-${student.id}`,
          name: student.name,
          email: student.email,
          meta: student.grade || "-",
          status: "Active",
          updated: student.joinedAt || "-",
        }))
      : todayTableActiveTab === "Teacher"
        ? professionalUsers
            .filter((professional) => isSameCalendarDay(professional.joinedAt))
            .map((professional) => ({
            id: `teacher-${professional.id}`,
            name: professional.name,
            email: professional.email,
            meta: professional.specialization || "-",
            status: "Active",
            updated: professional.joinedAt || "-",
          }))
        : notifications
            .filter((notification) => isSameCalendarDay(notification.createdAt))
            .map((notification) => ({
            id: notification.id,
            name: notification.professionalName,
            email: notification.professionalEmail,
            meta: "Alert",
            status: "Sent",
            updated: new Date(notification.createdAt).toLocaleString(),
          }));

  const dashboardTodayTotalPages = Math.max(1, Math.ceil(dashboardTodayRows.length / DASHBOARD_ITEMS_PER_PAGE));
  const dashboardTodayPageStart = (dashboardTodayCurrentPage - 1) * DASHBOARD_ITEMS_PER_PAGE;
  const paginatedDashboardTodayRows = dashboardTodayRows.slice(
    dashboardTodayPageStart,
    dashboardTodayPageStart + DASHBOARD_ITEMS_PER_PAGE,
  );
  const adminTrendLabels = ["January", "February", "March", "April", "May", "June", "July"];
  const adminTrendSeries = [
    { label: "Approvals", color: "#ff5b7a", values: [34, 55, 10, 36, 76, 54, 64] },
    { label: "Alerts", color: "#3498db", values: [12, 85, 82, 15, 43, 66, 12] },
  ];
  const adminTrendMax = Math.max(...adminTrendSeries.flatMap((series) => series.values), 1);
  const adminTrendWidth = 470;
  const adminTrendHeight = 220;
  const adminTrendPadding = { top: 18, right: 20, bottom: 34, left: 42 };
  const adminTrendChartWidth = adminTrendWidth - adminTrendPadding.left - adminTrendPadding.right;
  const adminTrendChartHeight = adminTrendHeight - adminTrendPadding.top - adminTrendPadding.bottom;

  const adminTrendPoints = adminTrendSeries.map((series) =>
    series.values.map((value, index) => {
      const x = adminTrendPadding.left + (adminTrendChartWidth / (adminTrendLabels.length - 1)) * index;
      const y =
        adminTrendPadding.top +
        adminTrendChartHeight - (value / adminTrendMax) * adminTrendChartHeight;
      return { x, y, value };
    }),
  );

  const adminTrendPath = adminTrendPoints.map((points) => points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" "));

  const selectedStudent = studentsList.find((student) => student.id === selectedStudentId) ?? null;
  const selectedStudentMeta = selectedStudent ? userDetailsById[selectedStudent.id] : null;
  const editingStudent = studentsList.find((student) => student.id === editingStudentId) ?? null;

  const handleGlobalSearch = () => {
    const query = globalSearchQuery.trim().toLowerCase();
    if (!query) {
      return;
    }

    const menuMatch = menuItems.find((item) => item.label.toLowerCase().includes(query));
    if (menuMatch) {
      setActiveSection(menuMatch.label);
      return;
    }

    const studentMatch = studentsList.find((student) => `${student.name} ${student.email}`.toLowerCase().includes(query));
    if (studentMatch) {
      setActiveSection("Users");
      setUsersTab("students");
      setSelectedStudentId(studentMatch.id);
      return;
    }

    const professionalMatch = professionalUsers.find((professional) =>
      `${professional.name} ${professional.email} ${professional.specialization}`.toLowerCase().includes(query),
    );
    if (professionalMatch) {
      setActiveSection("Users");
      setUsersTab("professionals");
      return;
    }

    if (approvalRequests.some((request) => `${request.name} ${request.email} ${request.specialization}`.toLowerCase().includes(query))) {
      setActiveSection("Approvals");
      return;
    }

    if (reviewEntries.some((review) => `${review.userName} ${review.professionalName} ${review.review}`.toLowerCase().includes(query))) {
      setActiveSection("Reviews");
      return;
    }

    if (categoriesList.some((category) => `${category.name} ${category.type} ${category.description}`.toLowerCase().includes(query))) {
      setActiveSection("Categories");
      return;
    }

    if (
      professionalUploadRows.some((upload) => `${upload.name} ${upload.email} ${upload.categories.join(" ")}`.toLowerCase().includes(query)) ||
      studentUploadRows.some((upload) => `${upload.name} ${upload.email}`.toLowerCase().includes(query))
    ) {
      setActiveSection("Uploads");
      return;
    }

    if (payoutEntries.some((payout) => `${payout.professionalName} ${payout.professionalEmail} ${payout.transactionId}`.toLowerCase().includes(query))) {
      setActiveSection("Payouts");
      return;
    }

    if (
      notifications.some((notification) =>
        `${notification.professionalName} ${notification.summary} ${notification.details ?? ""}`.toLowerCase().includes(query),
      ) ||
      contactMessages.some((message) => `${message.name} ${message.email} ${message.subject} ${message.message}`.toLowerCase().includes(query))
    ) {
      setActiveSection("Alerts");
    }
  };

  const updateApprovalStatus = async (professionalId: string, status: Exclude<ApprovalStatus, "pending">) => {
    try {
      const response = await fetch("/api/admin/professionals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ professionalId, status, reviewedBy: "Admin" }),
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json().catch(() => ({}))) as {
        professional?: {
          id: string;
          approvalStatus: ApprovalStatus;
          approvalReviewedBy: string | null;
          approvalReviewedAt: string | null;
          approvalNote: string | null;
        };
      };

      setApprovalRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === professionalId
            ? {
                ...request,
                status: payload.professional?.approvalStatus ?? status,
                updated: "Just now",
                approvalReviewedBy: payload.professional?.approvalReviewedBy ?? "Admin",
                approvalReviewedAt: payload.professional?.approvalReviewedAt ?? new Date().toISOString(),
                approvalNote: payload.professional?.approvalNote ?? request.approvalNote,
              }
            : request,
        ),
      );
    } catch {
      return;
    }
  };

  const approvalCounts = approvalRequests.reduce(
    (counts, request) => {
      counts.total += 1;
      if (request.status === "pending") counts.pending += 1;
      if (request.status === "approved") counts.approved += 1;
      if (request.status === "rejected") counts.rejected += 1;
      return counts;
    },
    { total: 0, pending: 0, approved: 0, rejected: 0 },
  );

  const deleteReview = async (id: string) => {
    try {
      const response = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: id }),
      });

      if (!response.ok) {
        return;
      }

      setReviewEntries((currentReviews) => currentReviews.filter((review) => review.id !== id));
    } catch {
      return;
    }
  };

  const reviewCounts = reviewEntries.reduce(
    (counts, review) => {
      counts.total += 1;
      if (review.flagged) counts.flagged += 1;
      return counts;
    },
    { total: 0, flagged: 0 },
  );

  const payoutCounts = payoutEntries.reduce(
    (counts, entry) => {
      counts.total += 1;
      if (entry.status === "pending") counts.pending += 1;
      if (entry.status === "completed") counts.completed += 1;
      return counts;
    },
    { total: 0, pending: 0, completed: 0 },
  );

  const resetCategoryForm = () => {
    setCategoryName("");
    setCategoryType("");
    setCategoryDescription("");
    setEditingCategoryId(null);
  };

  const openAddCategoryForm = () => {
    resetCategoryForm();
    setIsCategoryFormOpen(true);
  };

  const closeCategoryForm = () => {
    setIsCategoryFormOpen(false);
    resetCategoryForm();
  };

  const saveCategory = () => {
    const name = categoryName.trim();
    const type = categoryType.trim();
    const description = categoryDescription.trim();

    if (!name || !type || !description) {
      return;
    }

    if (editingCategoryId !== null) {
      setCategoriesList((current) =>
        current.map((category) =>
          category.id === editingCategoryId
            ? {
                ...category,
                name,
                type,
                description,
              }
            : category,
        ),
      );
      closeCategoryForm();
      return;
    }

    const nextId = categoriesList.length > 0 ? Math.max(...categoriesList.map((category) => category.id)) + 1 : 1;

    setCategoriesList((current) => [
      {
        id: nextId,
        name,
        type,
        description,
        professionals: 0,
      },
      ...current,
    ]);
    closeCategoryForm();
  };

  const editCategory = (categoryId: number) => {
    const category = categoriesList.find((item) => item.id === categoryId);
    if (!category) {
      return;
    }

    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setCategoryType(category.type);
    setCategoryDescription(category.description);
    setIsCategoryFormOpen(true);
  };

  const deleteCategory = (categoryId: number) => {
    setCategoriesList((current) => current.filter((category) => category.id !== categoryId));

    if (editingCategoryId === categoryId) {
      resetCategoryForm();
    }
  };

  const openDetailModal = (payload: DetailModalState) => {
    setDetailModal(payload);
  };

  useEffect(() => {
    if (activeSection !== "Users") {
      setSelectedStudentId(null);
      setEditingStudentId(null);
      setStudentDraft(null);
      setUsersTab("students");
    }
  }, [activeSection]);

  const openStudentDetails = (studentId: number) => {
    setSelectedStudentId(studentId);
  };

  const openEditStudent = (studentId: number) => {
    const student = studentsList.find((item) => item.id === studentId) ?? null;

    if (!student) return;

    setSelectedStudentId(studentId);
    setEditingStudentId(studentId);
    setStudentDraft({ ...student });
  };

  const closeEditStudent = () => {
    setEditingStudentId(null);
    setStudentDraft(null);
  };

  const saveStudent = () => {
    if (!studentDraft) return;

    setStudentsList((currentStudents) =>
      currentStudents.map((student) => (student.id === studentDraft.id ? studentDraft : student)),
    );
    setSelectedStudentId(studentDraft.id);
    closeEditStudent();
  };

  const deleteStudent = async (studentId: number) => {
    const userDetails = userDetailsById[studentId];

    if (!userDetails?.backendId) {
      return;
    }

    const confirmed = window.confirm("Delete this student permanently?");
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userDetails.backendId }),
      });

      if (!response.ok) {
        return;
      }

      setStudentsList((currentStudents) => currentStudents.filter((student) => student.id !== studentId));
      setUserDetailsById((currentDetails) => {
        const nextDetails = { ...currentDetails };
        delete nextDetails[studentId];
        return nextDetails;
      });

      if (selectedStudentId === studentId) {
        const remainingStudents = studentsList.filter((student) => student.id !== studentId);
        setSelectedStudentId(remainingStudents[0]?.id ?? null);
      }

      if (editingStudentId === studentId) {
        closeEditStudent();
      }
    } catch {
      return;
    }
  };

  const deleteProfessional = async (backendId: string) => {
    const professional = professionalUsers.find((entry) => entry.backendId === backendId);

    if (!professional) {
      return;
    }

    const confirmed = window.confirm("Delete this professional permanently?");
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: backendId }),
      });

      if (!response.ok) {
        return;
      }

      setProfessionalUsers((currentProfessionals) => currentProfessionals.filter((entry) => entry.backendId !== backendId));
      setApprovalRequests((currentRequests) => currentRequests.filter((request) => request.id !== backendId));

      if (detailModal?.title === "Professional Details" && detailModal.subtitle === professional.email) {
        setDetailModal(null);
      }
    } catch {
      return;
    }
  };

  useEffect(() => {
    if (activeSection !== "Reviews") {
      return;
    }

    const loadReviews = async () => {
      setReviewsLoading(true);
      setReviewsError("");

      try {
        const response = await fetch("/api/admin/reviews", { cache: "no-store" });
        const payload = (await response.json().catch(() => ({}))) as {
          message?: string;
          reviews?: AdminReviewRecord[];
        };

        if (!response.ok) {
          setReviewEntries([]);
          setReviewsError(payload.message || "Unable to load reviews.");
          return;
        }

        const blockedWords = ["waste of time", "useless", "terrible", "rude", "incompetent"];
        const records = Array.isArray(payload.reviews) ? payload.reviews : [];

        setReviewEntries(
          records.map((entry) => {
            const message = typeof entry.review === "string" ? entry.review : "";
            const normalized = message.toLowerCase();
            const isFlagged = blockedWords.some((word) => normalized.includes(word));

            return {
              id: entry.id,
              userName: entry.studentName,
              professionalName: entry.professionalName,
              professionalDetails: entry.studentEmail,
              review: message,
              rating: entry.rating,
              createdAt: new Date(entry.createdAt).toLocaleString(),
              flagged: isFlagged,
            };
          }),
        );
      } catch {
        setReviewEntries([]);
        setReviewsError("Unable to load reviews.");
      } finally {
        setReviewsLoading(false);
      }
    };

    void loadReviews();
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== "Alerts") {
      return;
    }

    setAlertsView("professionals");

    const loadNotifications = async () => {
      setNotificationsLoading(true);
      setContactMessagesLoading(true);

      try {
        const [notificationsResponse, contactMessagesResponse] = await Promise.all([
          fetch("/api/admin/notifications", { cache: "no-store" }),
          fetch("/api/admin/contact-messages", { cache: "no-store" }),
        ]);

        if (!notificationsResponse.ok) {
          setNotifications([]);
        } else {
          const data = (await notificationsResponse.json()) as { notifications?: ProfessionalNotification[] };
          setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
        }

        if (!contactMessagesResponse.ok) {
          setContactMessages([]);
        } else {
          const data = (await contactMessagesResponse.json()) as { messages?: ContactMessage[] };
          setContactMessages(Array.isArray(data.messages) ? data.messages : []);
        }
      } catch {
        setNotifications([]);
        setContactMessages([]);
      } finally {
        setNotificationsLoading(false);
        setContactMessagesLoading(false);
      }
    };

    void loadNotifications();
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== "Approvals") {
      return;
    }

    setApprovalsCurrentPage(1);

    const loadApprovals = async () => {
      try {
        const response = await fetch("/api/admin/professionals", { cache: "no-store" });
        const payload = (await response.json().catch(() => ({}))) as {
          message?: string;
          professionals?: Array<{
            id: string;
            name: string;
            email: string;
            specialization: string;
            provider: "credentials" | "google";
            approvalStatus: ApprovalStatus;
            approvalReviewedBy: string | null;
            approvalReviewedAt: string | null;
            approvalNote: string | null;
            createdAt: string;
          }>;
        };

        if (!response.ok) {
          setApprovalRequests([]);
          return;
        }

        const professionals = Array.isArray(payload.professionals) ? payload.professionals : [];
        setApprovalRequests(
          professionals.map((professional) => ({
            id: professional.id,
            name: professional.name,
            email: professional.email,
            specialization: professional.specialization || "-",
            updated: new Date(professional.createdAt).toLocaleDateString(),
            status: professional.approvalStatus,
            provider: professional.provider,
            approvalReviewedBy: professional.approvalReviewedBy,
            approvalReviewedAt: professional.approvalReviewedAt,
            approvalNote: professional.approvalNote,
          })),
        );
      } catch {
        setApprovalRequests([]);
      }
    };

    void loadApprovals();
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== "Categories") {
      return;
    }

    setCategoriesCurrentPage(1);
  }, [activeSection]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(approvalRequests.length / ITEMS_PER_PAGE));
    setApprovalsCurrentPage((currentPage) => Math.min(currentPage, totalPages));
  }, [approvalRequests.length]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(categoriesList.length / ITEMS_PER_PAGE));
    setCategoriesCurrentPage((currentPage) => Math.min(currentPage, totalPages));
  }, [categoriesList.length]);

  useEffect(() => {
    if (activeSection !== "Users") {
      return;
    }

    const loadUsers = async () => {
      setUsersLoading(true);
      setUsersError("");

      try {
        const response = await fetch("/api/admin/users", { cache: "no-store" });
        const payload = (await response.json().catch(() => ({}))) as {
          message?: string;
          users?: Array<{
            id: string;
            name: string;
            email: string;
            role: "student" | "professional";
            provider: "credentials" | "google";
            specialization: string;
            contactNumber: string;
            location: string;
            certificates: string[];
            reviews: string[];
            profileBoostedUntil: string | null;
            createdAt: string;
          }>;
        };

        if (!response.ok) {
          setStudentsList([]);
          setUserDetailsById({});
          setProfessionalUsers([]);
          setUsersError(payload.message || "Unable to load users.");
          return;
        }

        const users = Array.isArray(payload.users) ? payload.users : [];
        const studentUsers = users.filter((user) => user.role === "student");
        const professionalUsers = users.filter((user) => user.role === "professional");

        const mappedStudents: AdminStudent[] = studentUsers.map((user, index) => ({
          id: index + 1,
          name: user.name,
          email: user.email,
          category: "Science",
          grade: "Student",
          age: 0,
          phone: user.contactNumber || "-",
          guardian: user.provider,
          address: user.location || "-",
          marks: 0,
          progress: user.specialization || "-",
          joinedAt: new Date(user.createdAt).toLocaleDateString(),
        }));

        const details = studentUsers.reduce<Record<number, AdminUserDetails>>((accumulator, user, index) => {
          const id = index + 1;
          accumulator[id] = {
            id,
            backendId: user.id,
            role: user.role,
            provider: user.provider,
            specialization: user.specialization,
            contactNumber: user.contactNumber,
            location: user.location,
            certificatesCount: user.certificates.length,
            reviewsCount: user.reviews.length,
            profileBoostedUntil: user.profileBoostedUntil,
            createdAt: user.createdAt,
          };
          return accumulator;
        }, {});

        const mappedProfessionals: AdminProfessionalUser[] = professionalUsers.map((user, index) => ({
          id: index + 1,
          backendId: user.id,
          name: user.name,
          email: user.email,
          provider: user.provider,
          specialization: user.specialization,
          contactNumber: user.contactNumber,
          location: user.location,
          certificatesCount: user.certificates.length,
          reviewsCount: user.reviews.length,
          profileBoostedUntil: user.profileBoostedUntil,
          joinedAt: new Date(user.createdAt).toLocaleDateString(),
        }));

        setStudentsList(mappedStudents);
        setUserDetailsById(details);
        setProfessionalUsers(mappedProfessionals);
      } catch {
        setStudentsList([]);
        setUserDetailsById({});
        setProfessionalUsers([]);
        setUsersError("Unable to load users.");
      } finally {
        setUsersLoading(false);
      }
    };

    void loadUsers();
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== "Uploads") {
      return;
    }

    setUploadsProfessionalsCurrentPage(1);
    setUploadsStudentsCurrentPage(1);

    const loadUploads = async () => {
      setUploadsLoading(true);

      try {
        const response = await fetch("/api/admin/uploads", { cache: "no-store" });
        const payload = (await response.json().catch(() => ({}))) as {
          professionals?: ProfessionalUploadSummary[];
          students?: StudentActivitySummary[];
        };

        if (!response.ok) {
          setProfessionalUploadRows([]);
          setStudentUploadRows([]);
          return;
        }

        setProfessionalUploadRows(Array.isArray(payload.professionals) ? payload.professionals : []);
        setStudentUploadRows(Array.isArray(payload.students) ? payload.students : []);
      } catch {
        setProfessionalUploadRows([]);
        setStudentUploadRows([]);
      } finally {
        setUploadsLoading(false);
      }
    };

    void loadUploads();
  }, [activeSection]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(professionalUploadRows.length / ITEMS_PER_PAGE));
    setUploadsProfessionalsCurrentPage((currentPage) => Math.min(currentPage, totalPages));
  }, [professionalUploadRows.length]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(studentUploadRows.length / ITEMS_PER_PAGE));
    setUploadsStudentsCurrentPage((currentPage) => Math.min(currentPage, totalPages));
  }, [studentUploadRows.length]);

  useEffect(() => {
    if (activeSection !== "Payouts") {
      return;
    }

    setPayoutsCurrentPage(1);

    const loadPayouts = async () => {
      setPayoutsLoading(true);

      try {
        const response = await fetch("/api/admin/payments", { cache: "no-store" });
        const payload = (await response.json().catch(() => ({}))) as {
          payments?: AdminPaymentRecord[];
        };

        if (!response.ok) {
          return;
        }

        const dynamicRows = (Array.isArray(payload.payments) ? payload.payments : []).map((payment, index) => ({
          id: 100000 + index,
          professionalName: payment.studentName,
          professionalEmail: payment.studentEmail,
          plan: `${payment.plan} • ${payment.professionalName}`,
          amount: payment.amount,
          transactionId: payment.transactionId,
          paidAt: new Date(payment.paidAt).toLocaleString(),
          status: payment.status,
        } satisfies PayoutEntry));

        setPayoutEntries([...dynamicRows, ...initialPayoutEntries]);
      } finally {
        setPayoutsLoading(false);
      }
    };

    void loadPayouts();
  }, [activeSection]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(payoutEntries.length / ITEMS_PER_PAGE));
    setPayoutsCurrentPage((currentPage) => Math.min(currentPage, totalPages));
  }, [payoutEntries.length]);

  useEffect(() => {
    if (activeSection !== "Alerts") {
      return;
    }

    setAlertsProfessionalsCurrentPage(1);
    setAlertStudentsCurrentPage(1);
  }, [activeSection]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(notifications.length / ITEMS_PER_PAGE));
    setAlertsProfessionalsCurrentPage((currentPage) => Math.min(currentPage, totalPages));
  }, [notifications.length]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(contactMessages.length / ITEMS_PER_PAGE));
    setAlertStudentsCurrentPage((currentPage) => Math.min(currentPage, totalPages));
  }, [contactMessages.length]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(reviewEntries.length / ITEMS_PER_PAGE));
    setReviewsCurrentPage((currentPage) => Math.min(currentPage, totalPages));
  }, [reviewEntries.length]);

  useEffect(() => {
    if (activeSection !== "Reviews") {
      return;
    }

    setReviewsCurrentPage(1);
  }, [activeSection]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(dashboardTodayRows.length / DASHBOARD_ITEMS_PER_PAGE));
    setDashboardTodayCurrentPage((currentPage) => Math.min(currentPage, totalPages));
  }, [dashboardTodayRows.length]);

  useEffect(() => {
    if (activeSection !== "Dashboard") {
      return;
    }

    setDashboardTodayCurrentPage(1);
  }, [todayTableActiveTab, activeSection]);

  const onLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#eef5f3] p-3 sm:p-4 md:p-6 font-sans">
      <section className="flex min-h-[calc(100vh-1.5rem)] w-full overflow-hidden rounded-[28px] neumorph-admin-main bg-[#eef5f3] font-sans">
        <aside className="fixed left-0 top-0 z-30 h-full w-[250px] border-r border-slate-100 bg-[#eef5f3] px-4 py-5 flex flex-col neumorph-admin-sidebar">
          <div className="pb-6">
            <SiteLogo size="sidebar" priority />
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveSection(item.label)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-2 text-left text-sm font-semibold transition neumorph-sidebar-btn ${
                    isActive
                      ? "neumorph-sidebar-btn-active"
                      : "neumorph-sidebar-btn-inactive"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                </button>
              );
            })}
                <style>{`
                  .neumorph-btn, .neumorph-sidebar-btn {
                    background: #eef5f3;
                    box-shadow: 6px 6px 12px #d0dbd6, -6px -6px 12px #ffffff;
                    border-radius: 1rem;
                    color: #2c5a48;
                    font-weight: 600;
                    transition: all 0.2s;
                  }
                  .neumorph-btn-active, .neumorph-sidebar-btn-active {
                    background: #2d6a4f !important;
                    color: #fff !important;
                    box-shadow: 8px 8px 16px #d0dbd6, -8px -8px 16px #ffffff !important;
                  }
                  .neumorph-btn:hover:not(.neumorph-btn-active), .neumorph-sidebar-btn:hover:not(.neumorph-sidebar-btn-active) {
                    box-shadow: 3px 3px 6px #d0dbd6, -3px -3px 6px #ffffff;
                  }
                  .neumorph-btn:active {
                    box-shadow: 2px 2px 4px #d0dbd6, -2px -2px 4px #ffffff;
                  }
                `}</style>
          </nav>

          <div className="mt-auto">
            <button
              type="button"
              onClick={onLogout}
              className="w-full rounded-2xl bg-[#eef5f3] border-none px-4 py-2 text-sm font-semibold text-[#2d6a4f] shadow-[3px_3px_6px_#d0dbd6,-3px_-3px_6px_#ffffff] hover:shadow-inner transition-all"
            >
              Logout
            </button>
          </div>
        </aside>

        <div className={`neumorph-admin-content flex-1 p-3 sm:p-4 md:p-5 transition ml-[250px] h-screen overflow-y-auto hide-scrollbar ${selectedStudent || detailModal || adminProfileOpen || isCategoryFormOpen ? "blur-sm" : ""}`}>
                <style>{`
                  .hide-scrollbar {
                    scrollbar-width: none; /* Firefox */
                    -ms-overflow-style: none; /* IE 10+ */
                  }
                  .hide-scrollbar::-webkit-scrollbar {
                    display: none; /* Chrome/Safari/Webkit */
                  }
                `}</style>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl neumorph-admin-card p-4 shadow-[8px_8px_24px_#d0dbd6,-8px_-8px_24px_#ffffff]">
            <input
              type="text"
              placeholder="Search anything here..."
              value={globalSearchQuery}
              onChange={(event) => setGlobalSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleGlobalSearch();
                }
              }}
              className="h-11 w-full max-w-xs rounded-2xl border-none bg-[#f6fefb] px-4 text-sm text-slate-800 shadow-[inset_4px_4px_12px_#d0dbd6,inset_-4px_-4px_12px_#ffffff] outline-none focus:ring-2 focus:ring-[#1ec28e] transition"
              style={{ boxShadow: 'inset 4px 4px 12px #d0dbd6, inset -4px -4px 12px #ffffff' }}
            />
            <div className="flex items-center gap-4 text-sm">
              <span className="hidden text-slate-600 sm:inline">Open For Order</span>
              <span className="h-2.5 w-2.5 rounded-full bg-[#1ec28e] shadow-[1px_1px_3px_#bfe9cb,-1px_-1px_3px_#ffffff]" />
              <Bell className="h-5 w-5 text-[#1ec28e]" />
              <button
                type="button"
                onClick={() => setAdminProfileOpen(true)}
                className="flex items-center gap-2 rounded-full bg-[#f6fefb] px-2.5 py-1.5 shadow-[2px_2px_8px_#d0dbd6,-2px_-2px_8px_#ffffff] transition hover:shadow-inner"
                aria-label="Open admin profile"
                title={ADMIN_PROFILE.email}
              >
                <Image
                  src={ADMIN_PROFILE.avatar}
                  alt="Admin profile"
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-cover border border-[#bfe9cb]"
                />
                <span className="text-slate-700">{ADMIN_PROFILE.name}</span>
              </button>
            </div>
          </div>

          <div className="mb-4 flex gap-2 overflow-x-auto rounded-xl neumorph-admin-card p-2 lg:hidden">
            {menuItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveSection(item.label)}
                className={`whitespace-nowrap rounded-2xl px-4 py-1.5 text-xs font-semibold neumorph-admin-btn transition ${
                  activeSection === item.label
                    ? "bg-[#2d6a4f] text-white shadow-[8px_8px_16px_#d0dbd6,-8px_-8px_16px_#ffffff]"
                    : "bg-[#eef5f3] text-[#2c5a48] shadow-[3px_3px_6px_#d0dbd6,-3px_-3px_6px_#ffffff] hover:shadow-inner"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
      <style>{`
        .neumorph-admin-sidebar {
          background: #eef5f3;
          box-shadow: 12px 12px 24px #d0dbd6, -12px -12px 24px #ffffff;
          transition: all 0.25s cubic-bezier(0.2, 0, 0, 1);
        }
        .neumorph-admin-btn {
          background: #eef5f3;
          box-shadow: 3px 3px 6px #d0dbd6, -3px -3px 6px #ffffff;
          transition: all 0.2s;
        }
        .neumorph-admin-btn:active {
          box-shadow: 1px 1px 2px #d0dbd6, -1px -1px 2px #ffffff;
        }
      `}</style>

          {activeSection === "Dashboard" ? (
            <div className="rounded-2xl neumorph-admin-card p-4 sm:p-5">
              <h2 className="text-3xl font-semibold text-slate-800">Welcome.</h2>
              <p className="mb-4 text-sm text-slate-500">Navigate the future of education with Schooli.</p>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl neumorph-admin-stat p-4">
                  <p className="text-xs text-[#2c5a48]">Students</p>
                  <p className="text-3xl font-bold text-[#0f2c21]">15.00K</p>
                </div>
                <div className="rounded-2xl neumorph-admin-stat p-4">
                  <p className="text-xs text-[#2c5a48]">Teachers</p>
                  <p className="text-3xl font-bold text-[#0f2c21]">200</p>
                </div>
                <div className="rounded-2xl neumorph-admin-stat p-4">
                  <p className="text-xs text-[#2c5a48]">Awards</p>
                  <p className="text-3xl font-bold text-[#0f2c21]">5.6K</p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                <div className="space-y-4">
                  <div className="h-[360px] rounded-2xl neumorph-admin-card border border-transparent p-4 !bg-white">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800">Admin Activity Trend</h3>
                        <p className="text-xs text-slate-500">Approvals and alerts across recent months.</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        {adminTrendSeries.map((series) => (
                          <span key={series.label} className="inline-flex items-center gap-2">
                            <svg viewBox="0 0 10 10" aria-hidden="true" className="h-2.5 w-2.5">
                              <circle cx="5" cy="5" r="5" fill={series.color} />
                            </svg>
                            {series.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <svg viewBox={`0 0 ${adminTrendWidth} ${adminTrendHeight}`} className="h-[245px] w-full">
                      {[0, 20, 40, 60, 80, 100].map((tick) => {
                        const y = adminTrendPadding.top + adminTrendChartHeight - (tick / 100) * adminTrendChartHeight;
                        return (
                          <g key={tick}>
                            <line x1={adminTrendPadding.left} y1={y} x2={adminTrendWidth - adminTrendPadding.right} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                            <text x={10} y={y + 4} fill="#94a3b8" fontSize="10">
                              {tick}
                            </text>
                          </g>
                        );
                      })}

                      {adminTrendLabels.map((label, index) => {
                        const x = adminTrendPadding.left + (adminTrendChartWidth / (adminTrendLabels.length - 1)) * index;
                        return (
                          <text key={label} x={x} y={adminTrendHeight - 10} textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="500">
                            {label}
                          </text>
                        );
                      })}

                      {adminTrendPath.map((path, seriesIndex) => (
                        <path
                          key={adminTrendSeries[seriesIndex].label}
                          d={path}
                          fill="none"
                          stroke={adminTrendSeries[seriesIndex].color}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ))}

                      {adminTrendPoints.map((points, seriesIndex) =>
                        points.map((point, pointIndex) => (
                          <g key={`${adminTrendSeries[seriesIndex].label}-${pointIndex}`}>
                            <circle cx={point.x} cy={point.y} r="4" fill={adminTrendSeries[seriesIndex].color} />
                            <circle cx={point.x} cy={point.y} r="8" fill="transparent" />
                          </g>
                        )),
                      )}
                    </svg>

                    <p className="mt-1 text-center text-xs text-slate-500">Month</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-[360px] rounded-2xl neumorph-admin-card border border-transparent p-4">
                          <style>{`
                            .neumorph-admin-main {
                              background: #eef5f3;
                              box-shadow: 20px 20px 40px #d0dbd6, -20px -20px 40px #ffffff;
                            }
                            .neumorph-admin-content {
                              background: #eef5f3;
                            }
                            .neumorph-admin-card {
                              background: #eef5f3;
                              box-shadow: 12px 12px 24px #d0dbd6, -12px -12px 24px #ffffff;
                              transition: all 0.25s cubic-bezier(0.2, 0, 0, 1);
                            }
                            .neumorph-admin-stat {
                              background: #eef5f3;
                              box-shadow: 8px 8px 16px #d0dbd6, -8px -8px 16px #ffffff;
                              transition: all 0.2s;
                            }
                            .neumorph-admin-stat:active {
                              box-shadow: 1px 1px 2px #d0dbd6, -1px -1px 2px #ffffff;
                            }
                          `}</style>
                    <div className="h-full rounded-xl border border-slate-200 bg-white p-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <button type="button" className="text-sm font-semibold text-slate-500">2015</button>
                        <div className="flex items-center gap-3 text-slate-700">
                          <button type="button" className="text-lg leading-none text-slate-400">&lt;</button>
                          <p className="text-sm font-semibold tracking-wide">APRIL</p>
                          <button type="button" className="text-lg leading-none text-slate-400">&gt;</button>
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-7 border border-slate-100 bg-slate-50">
                        {[
                          "Sunday",
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                        ].map((day) => (
                          <div key={day} className="border-r border-slate-100 px-2 py-1.5 text-[11px] font-medium text-slate-500 last:border-r-0">
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 border-x border-b border-slate-100 bg-white text-[11px]">
                        {[
                          { day: 29, muted: true },
                          { day: 30, muted: true },
                          { day: 31, muted: true },
                          { day: 1, event: "NYU Engine..", tone: "bg-emerald-400" },
                          { day: 2 },
                          { day: 3 },
                          { day: 4 },
                          { day: 5, event: "John Hopk..", tone: "bg-cyan-400", active: true },
                          { day: 6 },
                          { day: 7 },
                          { day: 8 },
                          { day: 9 },
                          { day: 10 },
                          { day: 11 },
                          { day: 12 },
                          { day: 13, event: "Spring Dem..", tone: "bg-emerald-400" },
                          { day: 14 },
                          { day: 15 },
                          { day: 16 },
                          { day: 17, event: "Lehigh Co..", tone: "bg-orange-500" },
                          { day: 18 },
                          { day: 19 },
                          { day: 20 },
                          { day: 21 },
                          { day: 22 },
                          { day: 23, event: "UBC Job Fai..", tone: "bg-emerald-400" },
                          { day: 24, event: "Spring De..", tone: "bg-emerald-400" },
                          { day: 25 },
                          { day: 26 },
                          { day: 27 },
                          { day: 28 },
                          { day: 29 },
                          { day: 30, event: "NYU Engine..", tone: "bg-emerald-400" },
                          { day: 1, muted: true },
                          { day: 2, muted: true },
                          { day: 3, muted: true },
                          { day: 4, muted: true },
                          { day: 5, muted: true },
                          { day: 6, muted: true },
                          { day: 7, muted: true },
                          { day: 8, muted: true },
                          { day: 9, muted: true },
                        ].map((cell, index) => (
                          <div
                            key={`${cell.day}-${index}`}
                            className={`min-h-[32px] border-r border-t border-slate-100 px-1 py-0.5 align-top text-slate-700 ${
                              cell.active ? "bg-[#eef9ff]" : "bg-white"
                            } ${index % 7 === 6 ? "border-r-0" : ""}`}
                          >
                            <p className={`text-[10px] ${cell.muted ? "text-slate-300" : "text-slate-500"}`}>{cell.day}</p>
                            {cell.event ? (
                              <p className="mt-1 inline-flex items-center gap-1 truncate text-[10px] text-slate-500">
                                <span className={`h-1.5 w-1.5 rounded-full ${cell.tone}`} />
                                {cell.event}
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl neumorph-admin-card border border-transparent p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-800">Today</h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTodayTableActiveTab("Student")}
                      className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                        todayTableActiveTab === "Student"
                          ? "border-[#bfe9cb] bg-[#e8f9ee] text-[#178c43]"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setTodayTableActiveTab("Teacher")}
                      className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                        todayTableActiveTab === "Teacher"
                          ? "border-[#bfe9cb] bg-[#e8f9ee] text-[#178c43]"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Teacher
                    </button>
                    <button
                      type="button"
                      onClick={() => setTodayTableActiveTab("Notification")}
                      className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                        todayTableActiveTab === "Notification"
                          ? "border-[#bfe9cb] bg-[#e8f9ee] text-[#178c43]"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Notification
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">
                          {todayTableActiveTab === "Student" && "Grade"}
                          {todayTableActiveTab === "Teacher" && "Specialization"}
                          {todayTableActiveTab === "Notification" && "Type"}
                        </th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayTableActiveTab === "Student" && paginatedDashboardTodayRows.map((request) => (
                        <tr key={request.id} className="border-t border-slate-100 text-slate-700">
                          <td className="px-4 py-3 font-medium text-slate-800">{request.name}</td>
                          <td className="px-4 py-3">{request.email}</td>
                          <td className="px-4 py-3">{request.meta}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex rounded-full bg-[#e8f9ee] px-2.5 py-1 text-xs font-semibold text-[#178c43]">
                              {request.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">{request.updated}</td>
                        </tr>
                      ))}

                      {todayTableActiveTab === "Teacher" && paginatedDashboardTodayRows.map((request) => (
                        <tr key={request.id} className="border-t border-slate-100 text-slate-700">
                          <td className="px-4 py-3 font-medium text-slate-800">{request.name}</td>
                          <td className="px-4 py-3">{request.email}</td>
                          <td className="px-4 py-3">{request.meta}</td>
                          <td className="px-4 py-3">
                            <span
                              className="inline-flex rounded-full bg-[#e8f9ee] px-2.5 py-1 text-xs font-semibold text-[#178c43]"
                            >
                              {request.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">{request.updated}</td>
                        </tr>
                      ))}

                      {todayTableActiveTab === "Notification" && paginatedDashboardTodayRows.map((request) => (
                        <tr key={request.id} className="border-t border-slate-100 text-slate-700">
                          <td className="px-4 py-3 font-medium text-slate-800">{request.name}</td>
                          <td className="px-4 py-3">{request.email}</td>
                          <td className="px-4 py-3">{request.meta}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex rounded-full bg-[#e7f4ff] px-2.5 py-1 text-xs font-semibold text-[#2c6fb8]">
                              Sent
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">{request.updated}</td>
                        </tr>
                      ))}

                      {dashboardTodayRows.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-4 text-center text-sm text-slate-500">
                            No records available.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>

                {dashboardTodayRows.length > 0 ? (
                  <div className="mt-3 rounded-[24px] border border-slate-300 bg-slate-100 px-4 py-3 sm:px-5">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                        <span>
                          Showing {Math.min(dashboardTodayPageStart + 1, dashboardTodayRows.length)} to {Math.min(dashboardTodayPageStart + DASHBOARD_ITEMS_PER_PAGE, dashboardTodayRows.length)} of {dashboardTodayRows.length} entries
                        </span>
                        <span className="rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          Page {dashboardTodayCurrentPage} / {dashboardTodayTotalPages}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setDashboardTodayCurrentPage((page) => Math.max(1, page - 1))}
                          disabled={dashboardTodayCurrentPage === 1}
                          className="inline-flex h-10 items-center rounded-2xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                        >
                          Prev
                        </button>

                        <div className="flex flex-wrap items-center gap-2">
                          {Array.from({ length: dashboardTodayTotalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              type="button"
                              onClick={() => setDashboardTodayCurrentPage(page)}
                              className={`inline-flex h-10 min-w-10 items-center justify-center rounded-2xl border text-sm font-semibold transition ${
                                page === dashboardTodayCurrentPage
                                  ? "border-emerald-700 bg-emerald-700 text-white shadow-[0_8px_20px_rgba(16,185,129,0.32)]"
                                  : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-white"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setDashboardTodayCurrentPage((page) =>
                              Math.min(dashboardTodayTotalPages, page + 1),
                            )
                          }
                          disabled={dashboardTodayCurrentPage === dashboardTodayTotalPages}
                          className="inline-flex h-10 items-center rounded-2xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800">
                    {activeSection === "Users"
                      ? "User Management"
                      : activeSection === "Approvals"
                        ? "Professional Requests"
                        : activeSection === "Reviews"
                          ? "Review Moderation"
                          : activeSection === "Categories"
                            ? "Category Management"
                            : activeSection === "Uploads"
                              ? "Book Upload Center"
                              : activeSection === "Payouts"
                                ? "Teacher Payments"
                                : "Teacher Notifications"}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {activeSection === "Users" && "Manage account status, roles, and access permissions."}
                    {activeSection === "Approvals" && "Approve or reject pending professional onboarding requests."}
                    {activeSection === "Reviews" && "Review, approve, or remove reported platform feedback."}
                    {activeSection === "Categories" && "Manage all professional categories in one place."}
                    {activeSection === "Uploads" && "Upload books and assign metadata for publishing."}
                    {activeSection === "Payouts" && "Track payouts and settle teacher earnings securely."}
                    {activeSection === "Alerts" && "Professional updates and contact form submissions appear here automatically."}
                  </p>
                </div>

                {activeSection === "Categories" ? (
                  <button
                    type="button"
                    onClick={openAddCategoryForm}
                    className="rounded-full bg-[#1ec28e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#18ad7d]"
                  >
                    Add Category
                  </button>
                ) : null}
              </div>

              {activeSection === "Approvals" ? (
                <AdminApprovalsPanel
                  approvalCounts={approvalCounts}
                  paginatedApprovalRequests={paginatedApprovalRequests}
                  approvalStatusStyles={approvalStatusStyles}
                  updateApprovalStatus={updateApprovalStatus}
                  openDetailModal={openDetailModal}
                  approvalRequests={approvalRequests}
                  approvalsCurrentPage={approvalsCurrentPage}
                  itemsPerPage={ITEMS_PER_PAGE}
                  approvalTotalPages={approvalTotalPages}
                  setApprovalsCurrentPage={setApprovalsCurrentPage}
                />
              ) : activeSection === "Reviews" ? (
                <AdminReviewsPanel
                  reviewCounts={reviewCounts}
                  reviewsError={reviewsError}
                  reviewsLoading={reviewsLoading}
                  reviewEntries={reviewEntries}
                  paginatedReviewEntries={paginatedReviewEntries}
                  reviewsPageStart={reviewsPageStart}
                  itemsPerPage={ITEMS_PER_PAGE}
                  reviewsCurrentPage={reviewsCurrentPage}
                  reviewsTotalPages={reviewsTotalPages}
                  onDeleteReview={deleteReview}
                  onReviewsPageChange={setReviewsCurrentPage}
                />
              ) : activeSection === "Alerts" ? (
                <AdminAlertsPanel
                  alertsView={alertsView}
                  setAlertsView={setAlertsView}
                  notificationsLoading={notificationsLoading}
                  notifications={notifications}
                  paginatedNotifications={paginatedNotifications}
                  alertsProfessionalsPageStart={alertsProfessionalsPageStart}
                  alertsProfessionalsCurrentPage={alertsProfessionalsCurrentPage}
                  alertsProfessionalsTotalPages={alertsProfessionalsTotalPages}
                  onAlertsProfessionalsPageChange={setAlertsProfessionalsCurrentPage}
                  contactMessagesLoading={contactMessagesLoading}
                  contactMessages={contactMessages}
                  paginatedContactMessages={paginatedContactMessages}
                  alertsStudentsPageStart={alertsStudentsPageStart}
                  alertsStudentsCurrentPage={alertsStudentsCurrentPage}
                  alertsStudentsTotalPages={alertsStudentsTotalPages}
                  onAlertsStudentsPageChange={setAlertStudentsCurrentPage}
                  itemsPerPage={ITEMS_PER_PAGE}
                />
              ) : activeSection === "Payouts" ? (
                <AdminPayoutsPanel
                  payoutCounts={payoutCounts}
                  payoutsLoading={payoutsLoading}
                  payoutEntries={payoutEntries}
                  paginatedPayoutEntries={paginatedPayoutEntries}
                  openDetailModal={openDetailModal}
                  payoutsCurrentPage={payoutsCurrentPage}
                  payoutsTotalPages={payoutsTotalPages}
                  itemsPerPage={ITEMS_PER_PAGE}
                  setPayoutsCurrentPage={setPayoutsCurrentPage}
                />
              ) : activeSection === "Uploads" ? (
                <AdminUploadsPanel
                  uploadView={uploadView}
                  setUploadView={setUploadView}
                  uploadsLoading={uploadsLoading}
                  professionalUploadRows={professionalUploadRows}
                  paginatedProfessionalUploadRows={paginatedProfessionalUploadRows}
                  studentUploadRows={studentUploadRows}
                  paginatedStudentUploadRows={paginatedStudentUploadRows}
                  uploadsProfessionalsCurrentPage={uploadsProfessionalsCurrentPage}
                  uploadsProfessionalsTotalPages={uploadsProfessionalsTotalPages}
                  setUploadsProfessionalsCurrentPage={setUploadsProfessionalsCurrentPage}
                  uploadsStudentsCurrentPage={uploadsStudentsCurrentPage}
                  uploadsStudentsTotalPages={uploadsStudentsTotalPages}
                  setUploadsStudentsCurrentPage={setUploadsStudentsCurrentPage}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onOpenProfessional={(id: string) => router.push(`/admin/uploads/professionals/${id}`)}
                  onOpenStudent={(id: string) => router.push(`/admin/uploads/students/${id}`)}
                />
              ) : activeSection === "Categories" ? (
                <AdminCategoriesPanel
                  paginatedCategories={paginatedCategories}
                  categoriesList={categoriesList}
                  editCategory={editCategory}
                  deleteCategory={deleteCategory}
                  openDetailModal={openDetailModal}
                  categoriesCurrentPage={categoriesCurrentPage}
                  categoryTotalPages={categoryTotalPages}
                  itemsPerPage={ITEMS_PER_PAGE}
                  setCategoriesCurrentPage={setCategoriesCurrentPage}
                />
              ) : activeSection === "Users" ? (
                <AdminUsersPanel
                  usersTab={usersTab}
                  setUsersTab={setUsersTab}
                  usersLoading={usersLoading}
                  usersError={usersError}
                  studentsList={studentsList}
                  selectedStudentId={selectedStudentId}
                  openStudentDetails={openStudentDetails}
                  deleteStudent={deleteStudent}
                  studentsCurrentPage={studentsCurrentPage}
                  setStudentsCurrentPage={setStudentsCurrentPage}
                  professionalUsers={professionalUsers}
                  openDetailModal={openDetailModal}
                  deleteProfessional={deleteProfessional}
                  professionalsCurrentPage={professionalsCurrentPage}
                  setProfessionalsCurrentPage={setProfessionalsCurrentPage}
                  itemsPerPage={ITEMS_PER_PAGE}
                />
              ) : (
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-[#fff9fa] p-4">
                    <p className="text-sm text-slate-500">Total Records</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-800">24</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-[#fff9fa] p-4">
                    <p className="text-sm text-slate-500">Pending</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-800">08</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-[#fff9fa] p-4">
                    <p className="text-sm text-slate-500">Status</p>
                    <p className="mt-1 text-2xl font-semibold text-[#1ec28e]">Active</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <AdminPanelModals
        isCategoryFormOpen={isCategoryFormOpen}
        editingCategoryId={editingCategoryId}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        categoryType={categoryType}
        setCategoryType={setCategoryType}
        categoryDescription={categoryDescription}
        setCategoryDescription={setCategoryDescription}
        closeCategoryForm={closeCategoryForm}
        saveCategory={saveCategory}
        adminProfileOpen={adminProfileOpen}
        setAdminProfileOpen={setAdminProfileOpen}
        ADMIN_PROFILE={ADMIN_PROFILE}
        onLogout={onLogout}
        detailModal={detailModal}
        setDetailModal={setDetailModal}
        selectedStudent={selectedStudent}
        editingStudent={editingStudent}
        setSelectedStudentId={setSelectedStudentId}
        selectedStudentMeta={selectedStudentMeta}
        studentDraft={studentDraft}
        editableStudentFields={editableStudentFields}
        setStudentDraft={setStudentDraft}
        closeEditStudent={closeEditStudent}
        saveStudent={saveStudent}
      />
    </main>
  );
}
