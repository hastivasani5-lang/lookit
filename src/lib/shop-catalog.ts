import { getAllLibraries } from "@/lib/content-library-store";
import { getAllUsers } from "@/lib/user-store";

export type ShopCatalogItemType = "book" | "video";

export type ShopCatalogItem = {
  id: string;
  slug: string;
  contentId: string;
  contentType: ShopCatalogItemType;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  amount: number;
  imageUrl: string | null;
  sourceUrl: string;
  sourceType: "file" | "amazon" | "youtube";
  category: string;
  sizeLabel: string;
  professionalId: string;
  professionalName: string;
  createdAt: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseAmount(value: string) {
  const amount = Number.parseFloat(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

function toPriceLabel(value: string) {
  const amount = parseAmount(value);
  return amount > 0 ? `₹${amount.toFixed(2)}` : "Free";
}

function toBookDescription(category: string, sourceType: "file" | "amazon") {
  const sourceLabel = sourceType === "amazon" ? "Amazon link" : "Uploaded file";
  return `Category: ${category || "General"}. Source: ${sourceLabel}.`;
}

function toVideoDescription(sourceType: "file" | "youtube", sizeLabel: string) {
  const sourceLabel = sourceType === "youtube" ? "YouTube" : "Uploaded video";
  return `Video source: ${sourceLabel}. Size/Duration: ${sizeLabel || "-"}.`;
}

export async function buildShopCatalog(): Promise<ShopCatalogItem[]> {
  const [allUsers, libraries] = await Promise.all([getAllUsers(), getAllLibraries()]);

  const professionalById = new Map(
    allUsers
      .filter((user) => user.role === "professional" && user.approvalStatus === "approved")
      .map((user) => [user.id, user]),
  );

  const items: ShopCatalogItem[] = [];

  for (const [professionalId, library] of Object.entries(libraries.professionals)) {
    const professional = professionalById.get(professionalId);
    if (!professional) {
      continue;
    }

    for (const book of library.books) {
      const baseSlug = slugify(book.name) || "book";
      items.push({
        id: `${professionalId}:book:${book.id}`,
        slug: `${baseSlug}-${book.id}`,
        contentId: book.id,
        contentType: "book",
        title: book.name,
        subtitle: `${book.category} • ${book.source === "amazon" ? "Amazon" : "Uploaded book"}`,
        description: toBookDescription(book.category, book.source),
        price: toPriceLabel(book.mrp),
        amount: parseAmount(book.mrp),
        imageUrl: book.imageUrl || null,
        sourceUrl: book.url || "",
        sourceType: book.source,
        category: book.category || "General",
        sizeLabel: book.sizeLabel || "-",
        professionalId,
        professionalName: professional.name,
        createdAt: book.createdAt,
      });
    }

    for (const video of library.videos) {
      const baseSlug = slugify(video.name) || "video";
      items.push({
        id: `${professionalId}:video:${video.id}`,
        slug: `${baseSlug}-${video.id}`,
        contentId: video.id,
        contentType: "video",
        title: video.name,
        subtitle: `${video.source === "youtube" ? "YouTube" : "Uploaded video"} • ${video.sizeLabel}`,
        description: toVideoDescription(video.source, video.sizeLabel),
        price: toPriceLabel(video.mrp),
        amount: parseAmount(video.mrp),
        imageUrl: null,
        sourceUrl: video.url || "",
        sourceType: video.source,
        category: "Video",
        sizeLabel: video.sizeLabel || "-",
        professionalId,
        professionalName: professional.name,
        createdAt: video.createdAt,
      });
    }
  }

  return items.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function getShopCatalogItemBySlug(slug: string) {
  const items = await buildShopCatalog();
  return items.find((item) => item.slug === slug) ?? null;
}
