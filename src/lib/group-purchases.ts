export type PurchaseRow = {
  id: string;
  studentId: string;
  studentName: string;
  itemTitle: string;
  contentType: "book" | "video";
  purchaseTime: string;
  transactionId: string;
  amount: string;
};

export type StudentGroup = {
  studentId: string;
  studentName: string;
  purchaseCount: number;
  uniqueItemCount: number;
  latestPurchaseTime: string;
};

export function groupPurchases(purchases: PurchaseRow[]): StudentGroup[] {
  const map = new Map<string, { studentName: string; itemTitles: Set<string>; purchaseCount: number; latestPurchaseTime: string }>();

  for (const purchase of purchases) {
    const existing = map.get(purchase.studentId);
    if (existing) {
      existing.purchaseCount += 1;
      existing.itemTitles.add(purchase.itemTitle);
      if (new Date(purchase.purchaseTime) > new Date(existing.latestPurchaseTime)) {
        existing.latestPurchaseTime = purchase.purchaseTime;
      }
    } else {
      map.set(purchase.studentId, {
        studentName: purchase.studentName,
        itemTitles: new Set([purchase.itemTitle]),
        purchaseCount: 1,
        latestPurchaseTime: purchase.purchaseTime,
      });
    }
  }

  return Array.from(map.entries())
    .map(([studentId, data]) => ({
      studentId,
      studentName: data.studentName,
      purchaseCount: data.purchaseCount,
      uniqueItemCount: data.itemTitles.size,
      latestPurchaseTime: data.latestPurchaseTime,
    }))
    .sort((a, b) => new Date(b.latestPurchaseTime).getTime() - new Date(a.latestPurchaseTime).getTime());
}
