import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BakerySummary,
  CartLineItem,
  ConfirmedOrderReceipt,
  LocalizedText,
  ProductVariantItem,
  ShowcaseProduct,
} from '../types';

const CART_STORAGE_KEY = 'sweetmarket_cart';
const ORDERS_STORAGE_KEY = 'sweetmarket_orders';

function readStorageJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorageJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

export interface AddToCartInput {
  product: ShowcaseProduct;
  variant: ProductVariantItem;
  quantity?: number;
  customNote?: string;
}

export interface AddCustomCakeInput {
  bakery: BakerySummary;
  tierId: string;
  tierLabel: LocalizedText;
  weightGrams: number;
  fillingId: string;
  fillingLabel: LocalizedText;
  unitPriceUzs: number;
  quantity?: number;
  customNote?: string;
}

export function useCart() {
  const [items, setItems] = useState<CartLineItem[]>(() => {
    const stored = readStorageJson<CartLineItem[]>(CART_STORAGE_KEY, []);
    return Array.isArray(stored) ? stored : [];
  });

  const [recentOrders, setRecentOrders] = useState<ConfirmedOrderReceipt[]>(() => {
    const stored = readStorageJson<ConfirmedOrderReceipt[]>(ORDERS_STORAGE_KEY, []);
    return Array.isArray(stored) ? stored : [];
  });

  useEffect(() => {
    writeStorageJson(CART_STORAGE_KEY, items);
  }, [items]);

  useEffect(() => {
    writeStorageJson(ORDERS_STORAGE_KEY, recentOrders);
  }, [recentOrders]);

  const addToCart = useCallback(
    ({ product, variant, quantity = 1, customNote = '' }: AddToCartInput) => {
      const cleanNote = customNote.trim().slice(0, 160);
      const safeQty = Math.max(1, Math.min(50, Math.round(quantity)));
      const lineKey = `${product.id}::${variant.id}::${cleanNote.toLowerCase()}`;

      setItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.lineKey === lineKey);
        if (existingIndex >= 0) {
          const updated = [...prev];
          const existing = updated[existingIndex];
          updated[existingIndex] = {
            ...existing,
            quantity: Math.min(50, existing.quantity + safeQty),
          };
          return updated;
        }
        return [
          ...prev,
          {
            lineKey,
            productId: product.id,
            bakeryId: product.bakeryId,
            bakeryName: product.bakeryName,
            mediaKey: product.mediaKey,
            title: product.title,
            variantId: variant.id,
            variantLabel: variant.label,
            weightGrams: variant.weightGrams,
            unitPriceUzs: variant.priceUzs,
            quantity: safeQty,
            customNote: cleanNote,
          },
        ];
      });
    },
    [],
  );

  const addCustomCakeToCart = useCallback(
    ({
      bakery,
      tierId,
      tierLabel,
      weightGrams,
      fillingId,
      fillingLabel,
      unitPriceUzs,
      quantity = 1,
      customNote = '',
    }: AddCustomCakeInput) => {
      const cleanNote = customNote.trim().slice(0, 160);
      const safeQty = Math.max(1, Math.min(20, Math.round(quantity)));
      const lineKey = `custom-cake::${bakery.id}::${tierId}::${fillingId}::${cleanNote.toLowerCase()}`;

      setItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.lineKey === lineKey);
        if (existingIndex >= 0) {
          const updated = [...prev];
          const existing = updated[existingIndex];
          updated[existingIndex] = {
            ...existing,
            quantity: Math.min(20, existing.quantity + safeQty),
          };
          return updated;
        }
        return [
          ...prev,
          {
            lineKey,
            productId: 'custom-cake',
            bakeryId: bakery.id,
            bakeryName: bakery.name,
            mediaKey: 'celebration_cake',
            title: {
              uz: `Maxsus buyurtma tort (${fillingLabel.uz})`,
              ru: `Торт на заказ (${fillingLabel.ru})`,
            },
            variantId: tierId,
            variantLabel: tierLabel,
            weightGrams,
            unitPriceUzs,
            quantity: safeQty,
            customNote: cleanNote,
            customCake: {
              tierId,
              fillingId,
            },
          },
        ];
      });
    },
    [],
  );

  const updateQuantity = useCallback((lineKey: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.lineKey !== lineKey);
      }
      const clamped = Math.min(50, Math.round(quantity));
      return prev.map((item) =>
        item.lineKey === lineKey ? { ...item, quantity: clamped } : item,
      );
    });
  }, []);

  const removeLine = useCallback((lineKey: string) => {
    setItems((prev) => prev.filter((item) => item.lineKey !== lineKey));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const addConfirmedOrder = useCallback((receipt: ConfirmedOrderReceipt) => {
    setRecentOrders((prev) => [receipt, ...prev].slice(0, 20));
  }, []);

  const updateOrderReceipt = useCallback((updatedReceipt: ConfirmedOrderReceipt) => {
    setRecentOrders((prev) =>
      prev.map((order) =>
        order.batchId === updatedReceipt.batchId ? updatedReceipt : order,
      ),
    );
  }, []);

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotalUzs = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPriceUzs * item.quantity, 0),
    [items],
  );

  return {
    items,
    totalCount,
    subtotalUzs,
    addToCart,
    addCustomCakeToCart,
    updateQuantity,
    removeLine,
    clearCart,
    recentOrders,
    addConfirmedOrder,
    updateOrderReceipt,
  };
}
