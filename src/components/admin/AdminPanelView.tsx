"use client";

import Image from "next/image";
import {
  Bell,
  ClipboardList,
  DollarSign,
  FolderTree,
  Home,
  MoreHorizontal,
  PencilLine,
  ShieldCheck,
  Trash2,
  X,
  UploadCloud,
  Users,
  BellRing,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { ProfessionalNotification } from "@/types/notifications";

const students = [
  { name: "Evelyn Harper", id: "PRE43178", marks: 1185, percent: "98%" },
  { name: "Diana Plenty", id: "PRE43174", marks: 1165, percent: "91%" },
  { name: "John Millar", id: "PRE43187", marks: 1175, percent: "92%" },
];
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
  id: number;
  userName: string;
  professionalName: string;
  professionalDetails: string;
  review: string;
  rating: number;
  createdAt: string;
  flagged: boolean;
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

const initialReviewEntries: ReviewEntry[] = [
  {
    id: 1,
    userName: "Avery Stone",
    professionalName: "Dr. Maya Patel",
    professionalDetails: "Mathematics Tutor · 8 years experience · Online",
    review: "Excellent explanations and very patient. My grades improved within weeks.",
    rating: 5,
    createdAt: "Today",
    flagged: false,
  },
  {
    id: 2,
    userName: "Noah Kim",
    professionalName: "Jordan Reed",
    professionalDetails: "Career Coach · Interview Prep · San Francisco",
    review: "This was a waste of time and the coach was useless.",
    rating: 1,
    createdAt: "Yesterday",
    flagged: true,
  },
  {
    id: 3,
    userName: "Lina Gomez",
    professionalName: "Priya Shah",
    professionalDetails: "Physics Instructor · Exam Preparation · Hybrid",
    review: "Very helpful and organized. The session notes were clear and easy to follow.",
    rating: 5,
    createdAt: "2 days ago",
    flagged: false,
  },
  {
    id: 4,
    userName: "Ethan Brooks",
    professionalName: "Michael Chen",
    professionalDetails: "Coding Mentor · JavaScript & React · Remote",
    review: "Terrible experience. The professional was rude and completely incompetent.",
    rating: 1,
    createdAt: "3 days ago",
    flagged: true,
  },
];

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
  const [payoutEntries, setPayoutEntries] = useState(initialPayoutEntries);
  const [payoutsLoading, setPayoutsLoading] = useState(false);
  const [uploadView, setUploadView] = useState<UploadView>("professional-uploads");
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

  const selectedStudent = studentsList.find((student) => student.id === selectedStudentId) ?? null;
  const selectedStudentMeta = selectedStudent ? userDetailsById[selectedStudent.id] : null;
  const editingStudent = studentsList.find((student) => student.id === editingStudentId) ?? null;

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

  const deleteReview = (id: number) => {
    setReviewEntries((currentReviews) => currentReviews.filter((review) => review.id !== id));
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

  const deleteStudent = (studentId: number) => {
    setStudentsList((currentStudents) => currentStudents.filter((student) => student.id !== studentId));

    if (selectedStudentId === studentId) {
      const remainingStudents = studentsList.filter((student) => student.id !== studentId);
      setSelectedStudentId(remainingStudents[0]?.id ?? null);
    }

    if (editingStudentId === studentId) {
      closeEditStudent();
    }
  };

  useEffect(() => {
    if (activeSection !== "Alerts") {
      return;
    }

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
    if (activeSection !== "Payouts") {
      return;
    }

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

  const onLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#eef5f3] p-3 sm:p-4 md:p-6 font-sans">
      <section className="flex min-h-[calc(100vh-1.5rem)] w-full overflow-hidden rounded-[28px] neumorph-admin-main bg-[#eef5f3] font-sans">
        <aside className="fixed left-0 top-0 z-30 h-full w-[250px] border-r border-slate-100 bg-[#eef5f3] px-4 py-5 flex flex-col neumorph-admin-sidebar">
          <div className="pb-6">
            <span className="text-2xl font-bold tracking-[0.12em] text-slate-900">LOOKIT</span>
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

              <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
                <div className="space-y-4">
                  <div className="rounded-2xl neumorph-admin-card border border-transparent p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800">Star Students</h3>
                      <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="h-4 w-4" /></button>
                    </div>
                    <table className="w-full text-sm">
                      <thead className="text-left text-slate-400">
                        <tr>
                          <th className="py-2">Name</th>
                          <th className="py-2">ID</th>
                          <th className="py-2">Marks</th>
                          <th className="py-2">Percent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id} className="border-t border-slate-100 text-slate-700">
                            <td className="py-2.5">{student.name}</td>
                            <td className="py-2.5">{student.id}</td>
                            <td className="py-2.5">{student.marks}</td>
                            <td className="py-2.5">{student.percent}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="rounded-2xl neumorph-admin-card border border-transparent p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800">Notifications</h3>
                      <button className="text-sm text-slate-400 hover:text-slate-600">View all</button>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="rounded-lg bg-[#f8f9ff] px-3 py-2">Emergency School Closure</div>
                      <div className="rounded-lg bg-[#f8f9ff] px-3 py-2">New Extracurricular Clubs</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl neumorph-admin-card border border-transparent p-4">
                    <h3 className="font-semibold text-slate-800">Course Statistics</h3>
                    <div className="mx-auto mt-4 grid h-40 w-40 place-items-center rounded-full neumorph-admin-stat p-3">
                      <div className="grid h-full w-full place-items-center rounded-full bg-[#eef5f3] text-center">
                        <p className="text-xs text-slate-400">Total</p>
                        <p className="text-2xl font-bold text-slate-800">15000</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl neumorph-admin-card border border-transparent p-4">
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
                    <h3 className="font-semibold text-slate-800">Total Exams</h3>
                    <p className="mt-2 text-4xl font-bold text-slate-800">256</p>
                    <p className="mt-1 text-xs text-slate-500">Here is your total exams ratio this month.</p>
                  </div>
                </div>
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
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-[#f8fafc] p-4">
                      <p className="text-sm text-slate-500">Total Requests</p>
                      <p className="mt-1 text-2xl font-semibold text-slate-800">{approvalCounts.total}</p>
                    </div>
                    <div className="rounded-xl bg-[#f8fafc] p-4">
                      <p className="text-sm text-slate-500">Pending</p>
                      <p className="mt-1 text-2xl font-semibold text-slate-800">{approvalCounts.pending}</p>
                    </div>
                    <div className="rounded-xl bg-[#f8fafc] p-4">
                      <p className="text-sm text-slate-500">Approved</p>
                      <p className="mt-1 text-2xl font-semibold text-[#178c43]">{approvalCounts.approved}</p>
                    </div>
                    <div className="rounded-xl bg-[#f8fafc] p-4">
                      <p className="text-sm text-slate-500">Rejected</p>
                      <p className="mt-1 text-2xl font-semibold text-[#cc2a2a]">{approvalCounts.rejected}</p>
                    </div>
                  </div>

                  <ul className="mt-5 flex flex-col gap-3">
                    {approvalRequests.map((request) => {
                      const statusStyle = approvalStatusStyles[request.status];
                      return (
                        <li key={request.id} className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl neumorph-admin-card p-4 shadow-[4px_4px_16px_#d0dbd6,-4px_-4px_16px_#ffffff] ${statusStyle.row}`}>
                          <div className="flex-1 min-w-[120px] font-medium text-slate-800">{request.name}</div>
                          <div className="flex-1 min-w-[120px] text-slate-700">{request.specialization || '-'}</div>
                          <div className="flex-1 min-w-[100px] text-slate-700">{request.updated}</div>
                          <div className="flex-1 min-w-[100px]">
                            <span className={`inline-flex min-w-24 items-center justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyle.pill}`}>
                              {statusStyle.label}
                            </span>
                          </div>
                          <div className="flex flex-1 justify-end gap-2 min-w-[180px]">
                            <button
                              type="button"
                              onClick={() => updateApprovalStatus(request.id, "approved")}
                              className="rounded-full border border-[#bfe9cb] bg-[#e8f9ee] px-3 py-1.5 text-xs font-semibold text-[#178c43] transition hover:bg-[#dff6e8]"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => updateApprovalStatus(request.id, "rejected")}
                              className="rounded-full border border-[#f5c1c1] bg-[#ffe7e7] px-3 py-1.5 text-xs font-semibold text-[#cc2a2a] transition hover:bg-[#ffdcdc]"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                openDetailModal({
                                  title: "Approval Request Details",
                                  entries: [
                                    { label: "Name", value: request.name },
                                    { label: "Type", value: request.specialization },
                                    { label: "Updated", value: request.updated },
                                    { label: "Status", value: request.status },
                                  ],
                                })
                              }
                              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : activeSection === "Reviews" ? (
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-[#f8fafc] p-4">
                      <p className="text-sm text-slate-500">Total Reviews</p>
                      <p className="mt-1 text-2xl font-semibold text-slate-800">{reviewCounts.total}</p>
                    </div>
                    <div className="rounded-xl bg-[#f8fafc] p-4">
                      <p className="text-sm text-slate-500">Flagged Reviews</p>
                      <p className="mt-1 text-2xl font-semibold text-[#cc2a2a]">{reviewCounts.flagged}</p>
                    </div>
                  </div>

                  <ul className="mt-5 flex flex-col gap-3">
                    {reviewEntries.map((review) => (
                      <li
                        key={review.id}
                        className={`flex flex-wrap items-center gap-4 rounded-2xl neumorph-admin-card p-4 shadow-[4px_4px_16px_#d0dbd6,-4px_-4px_16px_#ffffff] ${review.flagged ? "bg-[#fff1f1]" : "bg-white"}`}
                      >
                        <div className="flex-1 min-w-[120px] font-medium text-slate-800">{review.userName}</div>
                        <div className="flex-1 min-w-[120px]">
                          <div className="font-medium text-slate-800">{review.professionalName}</div>
                          <div className="text-xs text-slate-500">{review.professionalDetails}</div>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <div className="max-w-xl space-y-1">
                            <p className="text-slate-700">{review.review}</p>
                            {review.flagged ? (
                              <span className="inline-flex rounded-full border border-[#f5c1c1] bg-[#ffe7e7] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#cc2a2a]">
                                Flagged as inappropriate
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex-1 min-w-[60px] font-semibold text-slate-800">{review.rating}/5</div>
                        <div className="flex-1 min-w-[100px] text-slate-600">{review.createdAt}</div>
                        <div className="flex flex-1 justify-end min-w-[120px]">
                          <button
                            type="button"
                            onClick={() => deleteReview(review.id)}
                            className="inline-flex items-center gap-1 rounded-full border border-[#f5c1c1] bg-[#ffe7e7] px-3 py-1.5 text-xs font-semibold text-[#cc2a2a] transition hover:bg-[#ffdcdc]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : activeSection === "Alerts" ? (
                <div className="mt-6 space-y-5">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">Professional Notifications</h3>
                        <p className="text-sm text-slate-500">Latest profile, certificate, and upgrade changes from professionals.</p>
                      </div>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                      {notificationsLoading ? (
                        <div className="bg-white p-4 text-sm text-slate-500">Loading notifications...</div>
                      ) : notifications.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                          {notifications.map((notification) => (
                            <div key={notification.id} className="bg-white p-4">
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div className="space-y-1">
                                  <p className="font-semibold text-slate-800">{notification.professionalName}</p>
                                  <p className="text-xs text-slate-500">{notification.professionalEmail}</p>
                                  <p className="text-sm text-slate-700">{notification.summary}</p>
                                  <p className="text-xs text-slate-500">{notification.details}</p>
                                </div>
                                <span className="inline-flex w-fit rounded-full border border-[#dbeafe] bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#2563eb]">
                                  {new Date(notification.createdAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white p-4 text-sm text-slate-500">No professional updates yet.</div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">Contact Form Submissions</h3>
                        <p className="text-sm text-slate-500">Messages submitted from the Contact page form.</p>
                      </div>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                      {contactMessagesLoading ? (
                        <div className="bg-white p-4 text-sm text-slate-500">Loading contact submissions...</div>
                      ) : contactMessages.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-slate-500">
                              <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3">Subject</th>
                                <th className="px-4 py-3">Message</th>
                                <th className="px-4 py-3">Submitted</th>
                              </tr>
                            </thead>
                            <tbody>
                              {contactMessages.map((entry) => (
                                <tr key={entry.id} className="border-t border-slate-100 text-slate-700">
                                  <td className="px-4 py-3 font-medium text-slate-800">{entry.name}</td>
                                  <td className="px-4 py-3">{entry.email}</td>
                                  <td className="px-4 py-3">{entry.phone || "-"}</td>
                                  <td className="px-4 py-3">{entry.subject}</td>
                                  <td className="px-4 py-3 max-w-[340px]">
                                    <p className="line-clamp-3">{entry.message}</p>
                                  </td>
                                  <td className="px-4 py-3 text-xs text-slate-500">{new Date(entry.createdAt).toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="bg-white p-4 text-sm text-slate-500">No contact submissions yet.</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : activeSection === "Payouts" ? (
                <div className="mt-6 space-y-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-sm text-slate-500">Total Payments</p>
                      <p className="mt-1 text-2xl font-semibold text-slate-800">{payoutCounts.total}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-sm text-slate-500">Pending</p>
                      <p className="mt-1 text-2xl font-semibold text-amber-600">{payoutCounts.pending}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-sm text-slate-500">Completed</p>
                      <p className="mt-1 text-2xl font-semibold text-[#178c43]">{payoutCounts.completed}</p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-left text-slate-500">
                        <tr>
                          <th className="px-4 py-3">Professional</th>
                          <th className="px-4 py-3">Plan</th>
                          <th className="px-4 py-3">Amount</th>
                          <th className="px-4 py-3">Transaction ID</th>
                          <th className="px-4 py-3">Paid At</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">View</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payoutsLoading ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-4 text-sm text-slate-500">Loading payments...</td>
                          </tr>
                        ) : payoutEntries.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-4 text-sm text-slate-500">No payments yet.</td>
                          </tr>
                        ) : payoutEntries.map((entry) => (
                          <tr key={entry.id} className="border-t border-slate-100 text-slate-700">
                            <td className="px-4 py-3">
                              <div className="font-medium text-slate-800">{entry.professionalName}</div>
                              <div className="text-xs text-slate-500">{entry.professionalEmail}</div>
                            </td>
                            <td className="px-4 py-3">{entry.plan}</td>
                            <td className="px-4 py-3 font-semibold text-slate-800">{entry.amount}</td>
                            <td className="px-4 py-3 text-xs text-slate-600">{entry.transactionId}</td>
                            <td className="px-4 py-3">{entry.paidAt}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                                  entry.status === "completed"
                                    ? "border border-[#bfe9cb] bg-[#e8f9ee] text-[#178c43]"
                                    : "border border-amber-200 bg-amber-50 text-amber-700"
                                }`}
                              >
                                {entry.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() =>
                                    openDetailModal({
                                      title: "Payout Details",
                                      entries: [
                                        { label: "Professional", value: entry.professionalName },
                                        { label: "Email", value: entry.professionalEmail },
                                        { label: "Plan", value: entry.plan },
                                        { label: "Amount", value: entry.amount },
                                        { label: "Transaction ID", value: entry.transactionId },
                                        { label: "Paid At", value: entry.paidAt },
                                        { label: "Status", value: entry.status },
                                      ],
                                    })
                                  }
                                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  View
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : activeSection === "Uploads" ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex w-full max-w-sm items-center gap-2 rounded-xl bg-slate-50 p-1">
                      <button
                        type="button"
                        onClick={() => setUploadView("professional-uploads")}
                        className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                          uploadView === "professional-uploads"
                            ? "bg-[#1ec28e] text-white"
                            : "text-slate-600 hover:bg-white"
                        }`}
                      >
                        Professional Uploads
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadView("student-purchases")}
                        className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                          uploadView === "student-purchases"
                            ? "bg-[#1ec28e] text-white"
                            : "text-slate-600 hover:bg-white"
                        }`}
                      >
                        Student Purchases
                      </button>
                    </div>
                  </div>

                  {uploadView === "professional-uploads" ? (
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <div className="border-b border-slate-200 px-4 py-3">
                        <h3 className="font-semibold text-slate-800">Professionals</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 text-left text-slate-500">
                            <tr>
                              <th className="px-4 py-3">Name</th>
                              <th className="px-4 py-3">Email</th>
                              <th className="px-4 py-3">Categories</th>
                              <th className="px-4 py-3">Books</th>
                              <th className="px-4 py-3">Videos</th>
                              <th className="px-4 py-3 text-right">View</th>
                            </tr>
                          </thead>
                          <tbody>
                            {uploadsLoading ? (
                              <tr>
                                <td colSpan={6} className="px-4 py-4 text-sm text-slate-500">Loading professionals...</td>
                              </tr>
                            ) : professionalUploadRows.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="px-4 py-4 text-sm text-slate-500">No professionals found.</td>
                              </tr>
                            ) : (
                              professionalUploadRows.map((professional) => (
                                <tr key={professional.id} className="border-t border-slate-100 text-slate-700">
                                  <td className="px-4 py-3 font-medium text-slate-800">{professional.name}</td>
                                  <td className="px-4 py-3 text-xs text-slate-600">{professional.email}</td>
                                  <td className="px-4 py-3">{professional.categories.length}</td>
                                  <td className="px-4 py-3">{professional.booksCount}</td>
                                  <td className="px-4 py-3">{professional.videosCount}</td>
                                  <td className="px-4 py-3">
                                    <div className="flex justify-end">
                                      <button
                                        type="button"
                                        onClick={() => router.push(`/admin/uploads/professionals/${professional.id}`)}
                                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                      >
                                        <Eye className="h-3.5 w-3.5" />
                                        View
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <div className="border-b border-slate-200 px-4 py-3">
                        <h3 className="font-semibold text-slate-800">Students</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 text-left text-slate-500">
                            <tr>
                              <th className="px-4 py-3">Name</th>
                              <th className="px-4 py-3">Email</th>
                              <th className="px-4 py-3">Purchased Books</th>
                              <th className="px-4 py-3">Watched Videos</th>
                              <th className="px-4 py-3">Last Activity</th>
                              <th className="px-4 py-3 text-right">View</th>
                            </tr>
                          </thead>
                          <tbody>
                            {uploadsLoading ? (
                              <tr>
                                <td colSpan={6} className="px-4 py-4 text-sm text-slate-500">Loading students...</td>
                              </tr>
                            ) : studentUploadRows.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="px-4 py-4 text-sm text-slate-500">No students found.</td>
                              </tr>
                            ) : (
                              studentUploadRows.map((student) => (
                                <tr key={student.id} className="border-t border-slate-100 text-slate-700">
                                  <td className="px-4 py-3 font-medium text-slate-800">{student.name}</td>
                                  <td className="px-4 py-3 text-xs text-slate-600">{student.email}</td>
                                  <td className="px-4 py-3">{student.purchasedBooksCount}</td>
                                  <td className="px-4 py-3">{student.watchedVideosCount}</td>
                                  <td className="px-4 py-3">{new Date(student.lastActivity).toLocaleDateString()}</td>
                                  <td className="px-4 py-3">
                                    <div className="flex justify-end">
                                      <button
                                        type="button"
                                        onClick={() => router.push(`/admin/uploads/students/${student.id}`)}
                                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                      >
                                        <Eye className="h-3.5 w-3.5" />
                                        View
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ) : activeSection === "Categories" ? (
                <div className="mt-6 space-y-5">
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-left text-slate-500">
                        <tr>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Type</th>
                          <th className="px-4 py-3">Description</th>
                          <th className="px-4 py-3">Professionals</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoriesList.map((category) => (
                          <tr key={category.id} className="border-t border-slate-100 text-slate-700">
                            <td className="px-4 py-3 font-medium text-slate-800">{category.name}</td>
                            <td className="px-4 py-3">{category.type}</td>
                            <td className="px-4 py-3">{category.description}</td>
                            <td className="px-4 py-3">{category.professionals}</td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => editCategory(category.id)}
                                  className="inline-flex items-center gap-1 rounded-full border border-[#bfe9cb] bg-[#e8f9ee] px-3 py-1.5 text-xs font-semibold text-[#178c43] transition hover:bg-[#dff6e8]"
                                >
                                  <PencilLine className="h-3.5 w-3.5" />
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteCategory(category.id)}
                                  className="inline-flex items-center gap-1 rounded-full border border-[#f5c1c1] bg-[#ffe7e7] px-3 py-1.5 text-xs font-semibold text-[#cc2a2a] transition hover:bg-[#ffdcdc]"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Delete
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    openDetailModal({
                                      title: "Professional Category Details",
                                      entries: [
                                        { label: "Category", value: category.name },
                                        { label: "Type", value: category.type },
                                        { label: "Description", value: category.description },
                                        { label: "Professionals", value: String(category.professionals) },
                                      ],
                                    })
                                  }
                                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  View
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : activeSection === "Users" ? (
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
                      <table className="w-full text-sm">
                        <thead className="bg-[#f6fefb] text-left text-[#178c43]">
                          <tr>
                            <th className="px-5 py-3 font-semibold">Name</th>
                            <th className="px-5 py-3 font-semibold">Role</th>
                            <th className="px-5 py-3 font-semibold">Provider</th>
                            <th className="px-5 py-3 font-semibold">Joined</th>
                            <th className="px-5 py-3 font-semibold text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentsList.map((student) => {
                            const isSelected = selectedStudentId === student.id;
                            return (
                              <tr
                                key={student.id}
                                onClick={() => openStudentDetails(student.id)}
                                className={`cursor-pointer transition duration-150 ${
                                  isSelected
                                    ? "bg-[#e8f9ee] shadow-[2px_2px_8px_#d0dbd6,-2px_-2px_8px_#ffffff]"
                                    : "bg-white hover:bg-[#f6fefb]"
                                }`}
                                style={{ borderRadius: '18px', marginBottom: '8px' }}
                              >
                                <td className="px-5 py-4 align-middle">
                                  <div className="font-semibold text-slate-800">{student.name}</div>
                                  <div className="text-xs text-slate-500">{student.email}</div>
                                </td>
                                <td className="px-5 py-4 align-middle">
                                  <span className="rounded-full bg-[#eef7ff] px-3 py-1 text-xs font-semibold text-[#2563eb] shadow-sm">
                                    {userDetailsById[student.id]?.role ?? "student"}
                                  </span>
                                </td>
                                <td className="px-5 py-4 align-middle text-slate-700">{userDetailsById[student.id]?.provider ?? "credentials"}</td>
                                <td className="px-5 py-4 align-middle text-slate-700">{student.joinedAt}</td>
                                <td className="px-5 py-4 align-middle">
                                  <div className="flex justify-end">
                                    <span className="inline-flex items-center rounded-full border border-[#bfe9cb] bg-[#e8f9ee] px-4 py-1.5 text-xs font-semibold text-[#178c43] shadow-sm">
                                      View
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-left text-slate-500">
                          <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Specialization</th>
                            <th className="px-4 py-3">Provider</th>
                            <th className="px-4 py-3">Joined</th>
                            <th className="px-4 py-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {professionalUsers.map((professional) => (
                            <tr
                              key={professional.id}
                              className="cursor-pointer border-t border-slate-100 bg-white transition hover:bg-slate-50"
                              onClick={() =>
                                openDetailModal({
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
                                })
                              }
                            >
                              <td className="px-4 py-4">
                                <div className="font-medium text-slate-800">{professional.name}</div>
                                <div className="text-xs text-slate-500">{professional.email}</div>
                              </td>
                              <td className="px-4 py-4 text-slate-700">{professional.specialization || "-"}</td>
                              <td className="px-4 py-4 text-slate-700">{professional.provider}</td>
                              <td className="px-4 py-4 text-slate-700">{professional.joinedAt}</td>
                              <td className="px-4 py-4">
                                <div className="flex justify-end">
                                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                                    View
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
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

      {isCategoryFormOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-4 shadow-2xl sm:p-5">
            <h3 className="text-base font-semibold text-slate-800">
              {editingCategoryId !== null ? "Edit Professional Category" : "Add Professional Category"}
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                placeholder="Category name"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#1ec28e]"
              />
              <input
                type="text"
                value={categoryType}
                onChange={(event) => setCategoryType(event.target.value)}
                placeholder="Category type"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#1ec28e]"
              />
              <textarea
                value={categoryDescription}
                onChange={(event) => setCategoryDescription(event.target.value)}
                placeholder="Category description"
                rows={4}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#1ec28e] sm:col-span-2"
              />
            </div>

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={closeCategoryForm}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveCategory}
                className="rounded-full bg-[#1ec28e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#18ad7d]"
              >
                {editingCategoryId !== null ? "Update Category" : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {adminProfileOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Admin Profile</h3>
                <p className="text-sm text-slate-500">Manage your admin session from here.</p>
              </div>
              <button
                type="button"
                onClick={() => setAdminProfileOpen(false)}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <Image
                  src={ADMIN_PROFILE.avatar}
                  alt="Admin profile"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <p className="text-base font-semibold text-slate-800">{ADMIN_PROFILE.name}</p>
                  <p className="text-sm text-slate-500">System Administrator</p>
                  <p className="text-sm text-slate-600">{ADMIN_PROFILE.email}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setAdminProfileOpen(false)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full bg-[#1ec28e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#18ad7d]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {detailModal ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{detailModal.title}</h3>
                {detailModal.subtitle ? <p className="text-sm text-slate-500">{detailModal.subtitle}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => setDetailModal(null)}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {detailModal.entries.map((entry) => (
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
              <div>
                <h3 className="text-lg font-semibold text-slate-800">User Details</h3>
                <p className="text-sm text-slate-500">Complete backend user details.</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentId(null)}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="rounded-2xl bg-[#f8fafc] p-5">
                <p className="text-sm text-slate-500">Role</p>
                <p className="mt-1 text-lg font-semibold text-slate-800">{selectedStudentMeta?.role ?? "student"}</p>
                <p className="mt-4 text-sm text-slate-500">Name</p>
                <p className="mt-1 text-lg font-semibold text-slate-800">{selectedStudent.name}</p>
                <p className="mt-4 text-sm text-slate-500">Email</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{selectedStudent.email}</p>
                <p className="mt-4 text-sm text-slate-500">Backend ID</p>
                <p className="mt-1 text-xs font-medium text-slate-800 break-all">{selectedStudentMeta?.backendId ?? "-"}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1 text-sm">
                  <span className="text-slate-500">Provider</span>
                  <input value={selectedStudentMeta?.provider ?? "-"} readOnly className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none" />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="text-slate-500">Joined</span>
                  <input value={selectedStudentMeta ? new Date(selectedStudentMeta.createdAt).toLocaleString() : "-"} readOnly className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none" />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="text-slate-500">Contact Number</span>
                  <input value={selectedStudentMeta?.contactNumber || "-"} readOnly className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none" />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="text-slate-500">Specialization</span>
                  <input value={selectedStudentMeta?.specialization || "-"} readOnly className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none" />
                </label>
                <label className="space-y-1 text-sm sm:col-span-2">
                  <span className="text-slate-500">Location</span>
                  <textarea value={selectedStudentMeta?.location || "-"} readOnly rows={2} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none" />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="text-slate-500">Certificates</span>
                  <input value={String(selectedStudentMeta?.certificatesCount ?? 0)} readOnly className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none" />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="text-slate-500">Reviews</span>
                  <input value={String(selectedStudentMeta?.reviewsCount ?? 0)} readOnly className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none" />
                </label>
                <label className="space-y-1 text-sm sm:col-span-2">
                  <span className="text-slate-500">Profile Boosted Until</span>
                  <input value={selectedStudentMeta?.profileBoostedUntil ? new Date(selectedStudentMeta.profileBoostedUntil).toLocaleString() : "-"} readOnly className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none" />
                </label>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {editingStudent && studentDraft ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Edit Student</h3>
                <p className="text-sm text-slate-500">Update the student record and save changes.</p>
              </div>
              <button
                type="button"
                onClick={closeEditStudent}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {editableStudentFields.map((field) => (
                <label key={field.key} className="space-y-1 text-sm">
                  <span className="text-slate-500">{field.label}</span>
                  <input
                    value={studentDraft[field.key]}
                    onChange={(event) =>
                      setStudentDraft((current) =>
                        current
                          ? {
                              ...current,
                              [field.key]:
                                field.key === "category"
                                  ? (event.target.value as StudentCategory)
                                  : event.target.value,
                            }
                          : current,
                      )
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#1ec28e]"
                  />
                </label>
              ))}
              <label className="space-y-1 text-sm">
                <span className="text-slate-500">Age</span>
                <input
                  type="number"
                  value={studentDraft.age}
                  onChange={(event) =>
                    setStudentDraft((current) => (current ? { ...current, age: Number(event.target.value) } : current))
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#1ec28e]"
                />
              </label>
              <label className="space-y-1 text-sm">
                <span className="text-slate-500">Marks</span>
                <input
                  type="number"
                  value={studentDraft.marks}
                  onChange={(event) =>
                    setStudentDraft((current) => (current ? { ...current, marks: Number(event.target.value) } : current))
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#1ec28e]"
                />
              </label>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeEditStudent}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveStudent}
                className="rounded-full bg-[#1ec28e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#18ad7d]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
