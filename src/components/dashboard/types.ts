export type DashboardSection = "overview" | "add" | "upgrade" | "settings";

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
