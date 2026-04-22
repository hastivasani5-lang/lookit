export type ProfessionalUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
  image?: string | null;
  specialization?: string | null;
  contactNumber?: string | null;
  location?: string | null;
  certificates?: string[];
  reviews?: string[];
  profileBoostedUntil?: string | null;
};

export type DashboardSection = "overview" | "add" | "upgrade" | "settings";
export type AddContentTab = "books" | "videos" | "classes";

export type SearchResultItem = {
  id: string;
  title: string;
  description: string;
  section: DashboardSection;
  addTab?: AddContentTab;
  featuredTargetPage?: FeaturedPage;
  openUrl?: string;
};

export type AddedBook = {
  id: string;
  name: string;
  mrp: string;
  category: string;
  fileName: string;
  sizeLabel: string;
  url: string;
  imageUrl: string;
  source: "file" | "amazon";
};

export type AddedVideo = {
  id: string;
  name: string;
  mrp: string;
  sizeLabel: string;
  url: string;
  level?: string;
  category?: string;
  source: "file" | "youtube";
  isPopular: boolean;
};

export type FeaturedPage = 1 | 2 | 3;

export type UpgradePlanKey = "starter" | "pro" | "premium" | "elite";

export const upgradePlans: Array<{
  key: UpgradePlanKey;
  name: string;
  price: string;
  duration: string;
}> = [
  { key: "starter", name: "Starter", price: "$9", duration: "1 week boost" },
  { key: "pro", name: "Pro", price: "$19", duration: "1 month boost" },
  { key: "premium", name: "Premium", price: "$39", duration: "2 months boost" },
  { key: "elite", name: "Elite", price: "$59", duration: "3 months boost" },
];

export const RAZORPAY_PAYMENT_LINK = "https://razorpay.me/@jenildineshbhaigadhiya";

import { LayoutGrid, Upload, CreditCard, Settings, BookOpen, Star, Users } from "lucide-react";

export const sidebarItems: Array<{ label: string; icon: typeof LayoutGrid; section?: DashboardSection; href?: string }> = [
  { label: "Overview",        icon: LayoutGrid, section: "overview" },
  { label: "Add",             icon: Upload,     section: "add" },
  { label: "Upgrade Profile", icon: CreditCard, section: "upgrade" },
  { label: "Purchases",       icon: Users,      href: "/dashboard/teachers/purchases" },
  { label: "Followers",       icon: Users,      href: "/dashboard/teachers/followers" },
  { label: "Reviews",         icon: Star,       href: "/dashboard/teachers/reviews" },
  { label: "Settings",        icon: Settings,   section: "settings" },
];

export const overviewCards = [
  {
    title: "Business Analytics",
    description: "Invest in your future with our business analysis course",
    icon: LayoutGrid,
    iconBg: "bg-[#eef5ff] text-[#5067d9]",
  },
  {
    title: "Design",
    description: "Invest in your future with our design strategy course",
    icon: BookOpen,
    iconBg: "bg-[#effaf6] text-[#1ec28e]",
  },
  {
    title: "Currency",
    description: "Invest in your future with our finance and currency course",
    icon: CreditCard,
    iconBg: "bg-[#f0f7ff] text-[#5067d9]",
  },
  {
    title: "Sale Marketing",
    description: "Invest in your future with our marketing course",
    icon: Users,
    iconBg: "bg-[#fff4e8] text-[#f59e0b]",
  },
];

export const coursePageOne = [
  {
    title: "The Complete HTML & CSS Bootcamp 2023 Edition",
    image: "/img1.png",
    tag: "Graphic Design",
    academy: "JDG Academy",
    lessons: "32 Lessons",
  },
  {
    title: "The Complete HTML & CSS Bootcamp 2023 Edition",
    image: "/person.png",
    tag: "Graphic Design",
    academy: "STK Academy",
    lessons: "28 Lessons",
  },
  {
    title: "The Complete HTML & CSS Bootcamp 2023 Edition",
    image: "/books.png",
    tag: "Graphic Design",
    academy: "LOA Academy",
    lessons: "32 Lessons",
  },
  {
    title: "The Complete HTML & CSS Bootcamp 2023 Edition",
    image: "/girls.png",
    tag: "Graphic Design",
    academy: "JDG Academy",
    lessons: "30 Lessons",
  },
  {
    title: "The Complete HTML & CSS Bootcamp 2023 Edition",
    image: "/offer-video.png",
    tag: "Graphic Design",
    academy: "JDG Academy",
    lessons: "34 Lessons",
  },
  {
    title: "The Complete HTML & CSS Bootcamp 2023 Edition",
    image: "/hero.png",
    tag: "Graphic Design",
    academy: "JDG Academy",
    lessons: "35 Lessons",
  },
];

export const coursePageTwo = [
  {
    title: "CSS Grid in Depth",
    youtubeId: "UB1O30fR-EE",
    tag: "Video Course",
    academy: "EducateX Academy",
  },
  {
    title: "Flexbox Masterclass",
    youtubeId: "yfoY53QXEnI",
    tag: "Video Course",
    academy: "EducateX Academy",
  },
  {
    title: "HTML Layout Workshop",
    youtubeId: "1Rs2ND1ryYc",
    tag: "Video Course",
    academy: "EducateX Academy",
  },
];

export const coursePageThree = [
  {
    title: "UI Design System Workshop",
    image: "/person.png",
    tag: "Workshop",
    academy: "EducateX Lab",
    lessons: "18 Lessons",
  },
  {
    title: "Responsive Landing Page Build",
    image: "/books.png",
    tag: "Workshop",
    academy: "EducateX Lab",
    lessons: "20 Lessons",
  },
  {
    title: "Professional Portfolio Sprint",
    image: "/girls.png",
    tag: "Workshop",
    academy: "EducateX Lab",
    lessons: "16 Lessons",
  },
  {
    title: "Component Styling Deep Dive",
    image: "/img1.png",
    tag: "Workshop",
    academy: "EducateX Lab",
    lessons: "24 Lessons",
  },
  {
    title: "Dashboard UI Patterns",
    image: "/hero.png",
    tag: "Workshop",
    academy: "EducateX Lab",
    lessons: "19 Lessons",
  },
  {
    title: "Modern Page Layouts",
    image: "/offer-video.png",
    tag: "Workshop",
    academy: "EducateX Lab",
    lessons: "22 Lessons",
  },
];

export const detailVideos = [
  {
    title: "Grid Layout Tutorial",
    youtubeId: "UB1O30fR-EE",
  },
  {
    title: "Flexbox Tutorial",
    youtubeId: "yfoY53QXEnI",
  },
  {
    title: "HTML/CSS Course",
    youtubeId: "1Rs2ND1ryYc",
  },
];
