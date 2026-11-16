import { LocalizedText } from './common';

export enum NotificationType {
  ORDER_STATUS = 'order_status',
  NEW_MESSAGE = 'new_message',
  SELLER_VERIFICATION = 'seller_verification',
  SYSTEM = 'system',
}

export interface Conversation {
  id: string;
  customerUid: string;
  companyId: string;
  orderId: string | null;
  lastMessagePreview: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderUid: string;
  body: string;
  createdAt: string;
}

export interface PlatformNotification {
  id: string;
  recipientUid: string;
  type: NotificationType;
  title: LocalizedText;
  body: LocalizedText;
  isRead: boolean;
  actionUrl: string | null;
  createdAt: string;
}
