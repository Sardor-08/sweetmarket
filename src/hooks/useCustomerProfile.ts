import { useCallback, useEffect, useState } from 'react';
import { SavedDeliveryAddress } from '../types';

const PROFILE_STORAGE_KEY = 'sweetmarket_customer_profile';

export type PaymentPreference = 'cash_on_delivery' | 'card_on_delivery';

export interface CustomerProfile {
  fullName: string;
  phone: string;
  districtId: string;
  address: string;
  birthDate: string;
  preferredPayment: PaymentPreference;
  notifyOrders: boolean;
  notifyPromos: boolean;
  savedAddresses: SavedDeliveryAddress[];
}

const DEFAULT_PROFILE: CustomerProfile = {
  fullName: '',
  phone: '+998 ',
  districtId: 'registon',
  address: '',
  birthDate: '',
  preferredPayment: 'cash_on_delivery',
  notifyOrders: true,
  notifyPromos: true,
  savedAddresses: [],
};

function normalizeAddresses(raw: unknown): SavedDeliveryAddress[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item): item is SavedDeliveryAddress =>
        Boolean(item) &&
        typeof item === 'object' &&
        typeof (item as SavedDeliveryAddress).id === 'string' &&
        typeof (item as SavedDeliveryAddress).address === 'string',
    )
    .map((item) => ({
      id: item.id,
      label: typeof item.label === 'string' && item.label.trim() ? item.label.trim() : 'Manzil',
      districtId: typeof item.districtId === 'string' && item.districtId ? item.districtId : 'registon',
      address: item.address.trim(),
      note: typeof item.note === 'string' ? item.note.trim() : '',
      isDefault: Boolean(item.isDefault),
    }));
}

function readProfile(): CustomerProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw) as Partial<CustomerProfile>;
    return {
      fullName: typeof parsed.fullName === 'string' ? parsed.fullName : '',
      phone: typeof parsed.phone === 'string' && parsed.phone ? parsed.phone : '+998 ',
      districtId:
        typeof parsed.districtId === 'string' && parsed.districtId
          ? parsed.districtId
          : 'registon',
      address: typeof parsed.address === 'string' ? parsed.address : '',
      birthDate: typeof parsed.birthDate === 'string' ? parsed.birthDate : '',
      preferredPayment:
        parsed.preferredPayment === 'card_on_delivery' ? 'card_on_delivery' : 'cash_on_delivery',
      notifyOrders: typeof parsed.notifyOrders === 'boolean' ? parsed.notifyOrders : true,
      notifyPromos: typeof parsed.notifyPromos === 'boolean' ? parsed.notifyPromos : true,
      savedAddresses: normalizeAddresses(parsed.savedAddresses),
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function useCustomerProfile() {
  const [profile, setProfile] = useState<CustomerProfile>(readProfile);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore storage quota errors
    }
  }, [profile]);

  const updateProfile = useCallback((next: Partial<CustomerProfile>) => {
    setProfile((prev) => ({ ...prev, ...next }));
  }, []);

  const addSavedAddress = useCallback(
    (input: { label: string; districtId: string; address: string; note?: string; makeDefault?: boolean }) => {
      const cleanAddress = input.address.trim();
      if (!cleanAddress) return;
      setProfile((prev) => {
        const shouldDefault = input.makeDefault || prev.savedAddresses.length === 0;
        const newEntry: SavedDeliveryAddress = {
          id: `addr-${Date.now()}`,
          label: input.label.trim() || 'Uy',
          districtId: input.districtId || 'registon',
          address: cleanAddress,
          note: input.note?.trim() || '',
          isDefault: shouldDefault,
        };
        const updatedList = shouldDefault
          ? [newEntry, ...prev.savedAddresses.map((a) => ({ ...a, isDefault: false }))]
          : [...prev.savedAddresses, newEntry];
        return {
          ...prev,
          ...(shouldDefault
            ? { districtId: newEntry.districtId, address: newEntry.address }
            : {}),
          savedAddresses: updatedList,
        };
      });
    },
    [],
  );

  const setDefaultSavedAddress = useCallback((addressId: string) => {
    setProfile((prev) => {
      const target = prev.savedAddresses.find((a) => a.id === addressId);
      if (!target) return prev;
      return {
        ...prev,
        districtId: target.districtId,
        address: target.address,
        savedAddresses: prev.savedAddresses.map((a) => ({
          ...a,
          isDefault: a.id === addressId,
        })),
      };
    });
  }, []);

  const removeSavedAddress = useCallback((addressId: string) => {
    setProfile((prev) => {
      const remaining = prev.savedAddresses.filter((a) => a.id !== addressId);
      if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
        remaining[0] = { ...remaining[0], isDefault: true };
      }
      const nextDefault = remaining.find((a) => a.isDefault);
      return {
        ...prev,
        ...(nextDefault
          ? { districtId: nextDefault.districtId, address: nextDefault.address }
          : {}),
        savedAddresses: remaining,
      };
    });
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
  }, []);

  return {
    profile,
    updateProfile,
    addSavedAddress,
    setDefaultSavedAddress,
    removeSavedAddress,
    resetProfile,
  };
}
