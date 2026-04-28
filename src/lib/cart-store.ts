export type CartItem = {
  id: string;
  contentId?: string;
  professionalId: string;
  professionalName: string;
  title: string;
  subtitle: string;
  price: string;
  duration?: string;
  sourceUrl?: string;
  contentType: "book" | "video" | "course" | "lecture";
  quantity?: number;
};

const CART_STORAGE_KEY = "lookit-cart-items";

function readStorage(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter(
          (item): item is CartItem =>
            typeof item?.id === "string" &&
            typeof item?.professionalId === "string" &&
            typeof item?.professionalName === "string" &&
            typeof item?.title === "string" &&
            typeof item?.subtitle === "string" &&
            typeof item?.price === "string" &&
            (item?.contentId === undefined || typeof item?.contentId === "string") &&
            (item?.sourceUrl === undefined || typeof item?.sourceUrl === "string") &&
            (item.contentType === "book" || item.contentType === "video" || item.contentType === "course" || item.contentType === "lecture"),
        )
      : [];
  } catch {
    return [];
  }
}

function writeStorage(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function getCartItems() {
  return readStorage();
}

export function addCartItem(item: CartItem) {
  const currentItems = readStorage();
  const existing = currentItems.find((currentItem) => currentItem.id === item.id);
  const nextItems = existing
    ? currentItems.map((currentItem) =>
        currentItem.id === item.id
          ? { ...currentItem, quantity: (currentItem.quantity ?? 1) + 1 }
          : currentItem,
      )
    : [{ ...item, quantity: 1 }, ...currentItems];

  writeStorage(nextItems);
  window.dispatchEvent(new Event("cart-updated"));
  return nextItems;
}

export function updateCartItemQuantity(itemId: string, quantity: number) {
  const currentItems = readStorage();
  const nextItems =
    quantity <= 0
      ? currentItems.filter((item) => item.id !== itemId)
      : currentItems.map((item) =>
          item.id === itemId ? { ...item, quantity } : item,
        );
  writeStorage(nextItems);
  window.dispatchEvent(new Event("cart-updated"));
  return nextItems;
}

export function removeCartItem(itemId: string) {
  const nextItems = readStorage().filter((item) => item.id !== itemId);
  writeStorage(nextItems);
  window.dispatchEvent(new Event("cart-updated"));
  return nextItems;
}

export function clearCartItems() {
  writeStorage([]);
  window.dispatchEvent(new Event("cart-updated"));
}
