export enum UserRole {
  CUSTOMER = 'customer',
  CONFECTIONER = 'confectioner',
  HOME_BAKER = 'home_baker',
  BAKERY = 'bakery',
  ADMIN = 'admin',
}

export interface UserPublicProfile {
  uid: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  district: string | null;
  createdAt: string;
}

export interface UserPrivateContact {
  uid: string;
  email: string;
  phone: string | null;
  savedAddresses: string[];
  updatedAt: string;
}

export interface AuthSessionState {
  isReady: boolean;
  user: UserPublicProfile | null;
}

export interface SellerAccountRecord {
  id: string;
  fullName: string;
  login: string;
  phone: string;
  password?: string;
  bakeryId: string;
  bakeryName?: string;
  roleLabel?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface PlatformSettingsRecord {
  commissionPercent: number;
  defaultDeliveryFeeUzs: number;
  freeDeliveryThresholdUzs: number;
  requireDeliveryPin: boolean;
  announcementEnabled: boolean;
  announcementUz: string;
  announcementRu: string;
  updatedAt: string;
}

