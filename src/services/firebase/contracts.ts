/**
 * Stage 1 Architectural Contract for Firebase Integration.
 * Actual Firebase provisioning, SDK initialization, and Firestore security rules
 * will be activated in Stage 2 using Google AI Studio's Firebase integration.
 */

export const FIRESTORE_COLLECTIONS = {
  usersPublic: 'users/{uid}',
  usersPrivateContact: 'users/{uid}/private/contact',
  admins: 'admins/{uid}',
  companies: 'companies/{companyId}',
  products: 'products/{productId}',
  mediaPosts: 'media_posts/{postId}',
  carts: 'users/{uid}/cart/{itemId}',
  orders: 'orders/{orderId}',
  conversations: 'conversations/{conversationId}',
  messages: 'conversations/{conversationId}/messages/{messageId}',
  notifications: 'notifications/{notificationId}',
} as const;

export const STORAGE_BUCKETS = {
  companyLogos: 'companies/{companyId}/logo',
  productPhotos: 'products/{productId}/images',
  storiesAndReels: 'media_posts/{companyId}/{postId}',
} as const;
