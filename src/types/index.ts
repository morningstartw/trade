/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType = 'sell' | 'exchange' | 'free';

export type ItemCondition = 'brand_new' | 'like_new' | 'good' | 'fair' | 'flawed';

export type ItemCategory = 
  | 'textbook'
  | 'electronics'
  | 'clothing'
  | 'furniture'
  | 'living'
  | 'beauty'
  | 'sports'
  | 'stationery';

export type ItemStatus = 'available' | 'reserved' | 'sold';

export type VerificationMethod = 'edu_email' | 'student_id_card' | 'none';

export type UniversityRegion = 'all' | 'north' | 'central' | 'south' | 'east' | 'islands';

export interface UniversityItem {
  id: string;
  name: string;
  region: 'north' | 'central' | 'south' | 'east' | 'islands';
  short: string;
  city: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  school: string;
  department: string;
  studentId?: string; // 大學學號
  email: string;
  isVerified: boolean; // 是否為認證大學生
  verificationMethod?: VerificationMethod;
  verifiedAt?: string;
  verificationProof?: string;
  rating: number; // 評分 1-5
  ratingCount: number;
  joinDate: string;
  role: 'student' | 'admin';
  bio?: string;
}

export interface ProductQuestion {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userSchool: string;
  content: string;
  createdAt: string;
  reply?: {
    sellerName: string;
    content: string;
    createdAt: string;
  };
}

export interface ExchangePreference {
  wants: string; // 想換的物品
  allowCashAdjustment: boolean; // 是否接受補差價
  adjustmentAmount?: number; // 補差價金額或預算
  notes?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number; // 0 if free or pure exchange
  type: TransactionType; // 出售, 交換, 贈送
  category: ItemCategory;
  condition: ItemCondition;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerSchool: string;
  sellerVerified: boolean;
  meetupLocations: string[]; // 面交地點（同校校門口、圖書館等）
  exchangePreference?: ExchangePreference;
  status: ItemStatus;
  views: number;
  likes: number;
  createdAt: string;
  questions: ProductQuestion[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'inquiry' | 'trade_request' | 'status_change' | 'system';
  title: string;
  message: string;
  productId?: string;
  productTitle?: string;
  createdAt: string;
  isRead: boolean;
  senderName?: string;
  senderAvatar?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOffer?: boolean;
  offerDetails?: {
    type: 'buy' | 'exchange';
    proposedPrice?: number;
    exchangeItem?: string;
    meetupLocation?: string;
    status: 'pending' | 'accepted' | 'declined';
  };
}

export interface Conversation {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  productType: TransactionType;
  sellerId: string;
  buyerId: string;
  otherUser: {
    id: string;
    name: string;
    avatar: string;
    school: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface TransactionRecord {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  type: TransactionType;
  counterpartName: string;
  counterpartSchool: string;
  role: 'buyer' | 'seller';
  completedAt: string;
  rated: boolean;
  ratingScore?: number;
}

export interface ReportItem {
  id: string;
  productId: string;
  productTitle: string;
  reportedUserId: string;
  reporterName: string;
  reason: 'counterfeit' | 'misleading' | 'inappropriate' | 'contact_violation' | 'scam' | 'other';
  reasonText: string;
  detail: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
}
