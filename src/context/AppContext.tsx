/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Product,
  ItemCategory,
  TransactionType,
  ItemStatus,
  NotificationItem,
  Conversation,
  TransactionRecord,
  ReportItem,
  UniversityRegion,
} from '../types';
import {
  MOCK_USERS,
  INITIAL_PRODUCTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_TRANSACTION_RECORDS,
  INITIAL_REPORTS,
} from '../data/mockData';

export type NavigationTab = 'home' | 'explore' | 'post' | 'messages' | 'profile';

interface AppContextType {
  currentUser: User;
  allUsers: User[];
  switchUser: (userId: string) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  verifyStudentEmail: (email: string) => { success: boolean; message: string };
  
  // Navigation & Modals
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  adminModalOpen: boolean;
  setAdminModalOpen: (open: boolean) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;

  // Auth & Student Identity
  isLoggedIn: boolean;
  login: (emailOrId: string, pass: string) => { success: boolean; message: string };
  register: (data: {
    name: string;
    school: string;
    department: string;
    studentId: string;
    email: string;
    password: string;
  }) => { success: boolean; message: string };
  logout: () => void;
  authModalTab: 'login' | 'register' | 'forgot';
  setAuthModalTab: (tab: 'login' | 'register' | 'forgot') => void;
  verificationModalOpen: boolean;
  setVerificationModalOpen: (open: boolean) => void;
  verifyStudentStatus: (
    method: 'edu_email' | 'student_id_card',
    details: {
      email?: string;
      studentId?: string;
      school?: string;
      proofImage?: string;
      verificationCode?: string;
    }
  ) => { success: boolean; message: string };

  // Search, School & Regional Filters
  selectedRegionFilter: UniversityRegion;
  setSelectedRegionFilter: (region: UniversityRegion) => void;
  selectedSchoolFilter: string;
  setSelectedSchoolFilter: (school: string) => void;
  keywordQuery: string;
  setKeywordQuery: (query: string) => void;
  categoryFilter: ItemCategory | 'all';
  setCategoryFilter: (category: ItemCategory | 'all') => void;
  typeFilter: TransactionType | 'all';
  setTypeFilter: (type: TransactionType | 'all') => void;

  // Products
  products: Product[];
  addProduct: (newProduct: Omit<Product, 'id' | 'createdAt' | 'views' | 'likes' | 'questions'>) => string;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductStatus: (id: string, status: ItemStatus) => void;
  toggleLike: (id: string) => void;
  addQuestion: (productId: string, content: string) => void;
  replyQuestion: (productId: string, questionId: string, replyContent: string) => void;

  // Favorites
  favorites: string[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Conversations & Chat
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string) => void;
  createOrOpenConversation: (
    product: Product,
    tradeDetails?: {
      type: 'buy' | 'exchange';
      proposedPrice?: number;
      exchangeItem?: string;
      meetupLocation?: string;
    }
  ) => string;
  respondToOffer: (conversationId: string, messageId: string, accept: boolean) => void;

  // Transactions & Reports
  transactionRecords: TransactionRecord[];
  reports: ReportItem[];
  submitReport: (report: Omit<ReportItem, 'id' | 'status' | 'createdAt'>) => void;
  resolveReport: (reportId: string, action: 'dismiss' | 'take_down') => void;

  // Utility toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'unitrade_products_v4',
  FAVORITES: 'unitrade_favorites_v4',
  NOTIFICATIONS: 'unitrade_notifications_v4',
  CONVERSATIONS: 'unitrade_conversations_v4',
  USER_ID: 'unitrade_active_user_v4',
  REPORTS: 'unitrade_reports_v4',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.USER_ID) || 'u-1';
  });

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Global filters
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<UniversityRegion>('all');
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('all');
  const [keywordQuery, setKeywordQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : ['p-1', 'p-4'];
    } catch {
      return ['p-1', 'p-4'];
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Transactions
  const [transactionRecords] = useState<TransactionRecord[]>(INITIAL_TRANSACTION_RECORDS);

  // Reports
  const [reports, setReports] = useState<ReportItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return saved ? JSON.parse(saved) : INITIAL_REPORTS;
    } catch {
      return INITIAL_REPORTS;
    }
  });

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_ID, currentUserId);
  }, [currentUserId]);

  // User Actions
  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUserId(userId);
      showToast(`已切換為：${target.name} (${target.school})`);
    }
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUserId ? { ...u, ...updates } : u))
    );
    if (updates.avatar) {
      setProducts((prev) =>
        prev.map((p) =>
          p.sellerId === currentUserId ? { ...p, sellerAvatar: updates.avatar! } : p
        )
      );
    }
    showToast('個人檔案已更新！');
  };

  const login = (emailOrId: string, _pass: string) => {
    const trimmed = emailOrId.trim().toLowerCase();
    const target = users.find(
      (u) =>
        u.email.toLowerCase() === trimmed ||
        (u.studentId && u.studentId.toLowerCase() === trimmed) ||
        u.name.toLowerCase() === trimmed
    );
    if (target) {
      setCurrentUserId(target.id);
      setIsLoggedIn(true);
      setAuthModalOpen(false);
      showToast(`登入成功！歡迎回來，${target.name} (${target.school})`);
      return { success: true, message: '登入成功' };
    }
    // Default fallback to first student user if not found
    setCurrentUserId('u-1');
    setIsLoggedIn(true);
    setAuthModalOpen(false);
    showToast('登入成功！已載入學生測試帳號');
    return { success: true, message: '登入成功' };
  };

  const register = (data: {
    name: string;
    school: string;
    department: string;
    studentId: string;
    email: string;
    password: string;
  }) => {
    const newId = `u-${Date.now()}`;
    const isEdu = data.email.toLowerCase().includes('edu.tw');
    const newUser: User = {
      id: newId,
      name: data.name,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      school: data.school,
      department: data.department,
      studentId: data.studentId,
      email: data.email,
      isVerified: isEdu,
      verificationMethod: isEdu ? 'edu_email' : 'none',
      verifiedAt: isEdu ? new Date().toISOString().split('T')[0] : undefined,
      rating: 5.0,
      ratingCount: 0,
      joinDate: new Date().toISOString().split('T')[0].slice(0, 7),
      role: 'student',
      bio: `${data.school} ${data.department}，剛加入 UniTrade 校園市集！`,
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newId);
    setIsLoggedIn(true);
    setAuthModalOpen(false);
    showToast(`註冊成功！歡迎 ${data.name} 同學加入校園二手市集`);
    return { success: true, message: '註冊成功' };
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast('已登出目前會員帳號');
  };

  const verifyStudentStatus = (
    method: 'edu_email' | 'student_id_card',
    details: {
      email?: string;
      studentId?: string;
      school?: string;
      proofImage?: string;
      verificationCode?: string;
    }
  ) => {
    const targetSchool = details.school || currentUser.school;
    const targetStudentId = details.studentId || currentUser.studentId || 'B11209018';
    const targetEmail = details.email || currentUser.email;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUserId
          ? {
              ...u,
              school: targetSchool,
              studentId: targetStudentId,
              email: targetEmail,
              isVerified: true,
              verificationMethod: method,
              verifiedAt: new Date().toISOString().split('T')[0],
              verificationProof: details.proofImage,
            }
          : u
      )
    );

    const newNotif: NotificationItem = {
      id: `n-${Date.now()}`,
      userId: currentUserId,
      type: 'system',
      title: '🎓 大學生校園身分認證審核通過！',
      message: `恭喜！您的 ${targetSchool} 大學生身分已通過審核（認證方式：${
        method === 'edu_email' ? '大專院校教育信箱 (.edu.tw)' : '學生證在學證明文件審核'
      }），已為您解鎖「校園在學生官方認證」徽章！`,
      createdAt: '剛剛',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast('🎉 校園在學大學生身分認證成功！已解鎖官方徽章');
    return { success: true, message: '認證成功！已取得學生官方徽章' };
  };

  const verifyStudentEmail = (email: string) => {
    return verifyStudentStatus('edu_email', { email });
  };

  // Product Actions
  const addProduct = (
    newProductData: Omit<Product, 'id' | 'createdAt' | 'views' | 'likes' | 'questions'>
  ): string => {
    const id = `p-${Date.now()}`;
    const newProduct: Product = {
      ...newProductData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      views: 1,
      likes: 0,
      questions: [],
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast('商品上架成功！已在校園市集公開發布');
    return id;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct((prev) => (prev ? { ...prev, ...updates } : null));
    }
    showToast('商品資訊已更新');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct(null);
    }
    showToast('商品已下架並刪除');
  };

  const updateProductStatus = (id: string, status: ItemStatus) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct((prev) => (prev ? { ...prev, status } : null));
    }
    const statusText =
      status === 'available'
        ? '已標示為「上架中」'
        : status === 'reserved'
        ? '已標示為「預約中」'
        : '已標示為「交易完成」！';
    showToast(statusText);
  };

  const toggleLike = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, likes: p.likes + 1 } : p
      )
    );
  };

  const addQuestion = (productId: string, content: string) => {
    const newQ = {
      id: `q-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userSchool: currentUser.school,
      content,
      createdAt: '剛剛',
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updated = { ...p, questions: [...p.questions, newQ] };
          if (selectedProduct?.id === productId) {
            setSelectedProduct(updated);
          }
          return updated;
        }
        return p;
      })
    );

    // Notify seller if not self
    const targetProduct = products.find((p) => p.id === productId);
    if (targetProduct && targetProduct.sellerId !== currentUser.id) {
      const notif: NotificationItem = {
        id: `n-${Date.now()}`,
        userId: targetProduct.sellerId,
        type: 'inquiry',
        title: '商品有新的公開問答',
        message: `${currentUser.name} 詢問：${content.slice(0, 30)}...`,
        productId,
        productTitle: targetProduct.title,
        createdAt: '剛剛',
        isRead: false,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
      };
      setNotifications((prev) => [notif, ...prev]);
    }
    showToast('提問已送出！請等待賣家回覆');
  };

  const replyQuestion = (productId: string, questionId: string, replyContent: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedQ = p.questions.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  reply: {
                    sellerName: currentUser.name,
                    content: replyContent,
                    createdAt: '剛剛',
                  },
                }
              : q
          );
          const updated = { ...p, questions: updatedQ };
          if (selectedProduct?.id === productId) {
            setSelectedProduct(updated);
          }
          return updated;
        }
        return p;
      })
    );
    showToast('已回覆提問');
  };

  // Favorites
  const isFavorite = (productId: string) => favorites.includes(productId);

  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites((prev) => prev.filter((id) => id !== productId));
      showToast('已從收藏清單移除');
    } else {
      setFavorites((prev) => [...prev, productId]);
      showToast('已加入我的收藏 ❤️');
    }
  };

  // Notifications
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('已全部標記為已讀');
  };

  // Conversations & Chat
  const sendMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newMsg = {
      id: `m-${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: timeStr,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: text,
            lastMessageTime: timeStr,
            messages: [...conv.messages, newMsg],
          };
        }
        return conv;
      })
    );
  };

  const createOrOpenConversation = (
    product: Product,
    tradeDetails?: {
      type: 'buy' | 'exchange';
      proposedPrice?: number;
      exchangeItem?: string;
      meetupLocation?: string;
    }
  ): string => {
    // Check if conversation already exists between current user and seller for this product
    const existing = conversations.find(
      (c) =>
        c.productId === product.id &&
        ((c.buyerId === currentUser.id && c.sellerId === product.sellerId) ||
          (c.buyerId === product.sellerId && c.sellerId === currentUser.id))
    );

    if (existing) {
      if (tradeDetails) {
        // Append trade offer
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const offerMsg = {
          id: `m-${Date.now()}`,
          senderId: currentUser.id,
          text: `【提出${tradeDetails.type === 'exchange' ? '以物易物交換' : '購買交易'}申請】地點：${tradeDetails.meetupLocation || '同校面交'}`,
          timestamp: timeStr,
          isOffer: true,
          offerDetails: {
            ...tradeDetails,
            status: 'pending' as const,
          },
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === existing.id
              ? {
                  ...c,
                  lastMessage: offerMsg.text,
                  lastMessageTime: timeStr,
                  messages: [...c.messages, offerMsg],
                }
              : c
          )
        );
      }
      setActiveConversationId(existing.id);
      setActiveTab('messages');
      return existing.id;
    }

    // Create new conversation
    const newConvId = `c-${Date.now()}`;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const initialText = tradeDetails
      ? `【提出${tradeDetails.type === 'exchange' ? '交換' : '購買'}申請】地點：${tradeDetails.meetupLocation || '面交'}。您好！我想與您約定面交。`
      : `您好！我對您的商品《${product.title}》很有興趣，想詢問商品細節～`;

    const firstMsg = {
      id: `m-${Date.now()}`,
      senderId: currentUser.id,
      text: initialText,
      timestamp: timeStr,
      isOffer: Boolean(tradeDetails),
      offerDetails: tradeDetails
        ? {
            ...tradeDetails,
            status: 'pending' as const,
          }
        : undefined,
    };

    const newConv: Conversation = {
      id: newConvId,
      productId: product.id,
      productTitle: product.title,
      productImage: product.images[0] || '',
      productPrice: product.price,
      productType: product.type,
      sellerId: product.sellerId,
      buyerId: currentUser.id,
      otherUser: {
        id: product.sellerId,
        name: product.sellerName,
        avatar: product.sellerAvatar,
        school: product.sellerSchool,
      },
      lastMessage: initialText,
      lastMessageTime: timeStr,
      unreadCount: 0,
      messages: [firstMsg],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConvId);
    setActiveTab('messages');

    // Notify seller
    const notif: NotificationItem = {
      id: `n-${Date.now()}`,
      userId: product.sellerId,
      type: 'trade_request',
      title: '收到新的交易/洽詢申請！',
      message: `${currentUser.name} 對《${product.title}》發送了私訊洽詢`,
      productId: product.id,
      productTitle: product.title,
      createdAt: '剛剛',
      isRead: false,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast('已發起對話與交易洽談！');
    return newConvId;
  };

  const respondToOffer = (conversationId: string, messageId: string, accept: boolean) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: conv.messages.map((m) =>
              m.id === messageId && m.offerDetails
                ? {
                    ...m,
                    offerDetails: {
                      ...m.offerDetails,
                      status: accept ? 'accepted' : 'declined',
                    },
                  }
                : m
            ),
          };
        }
        return conv;
      })
    );
    showToast(accept ? '已接受面交提議！請與對方確認時間' : '已婉拒該提議');
  };

  // Reports
  const submitReport = (report: Omit<ReportItem, 'id' | 'status' | 'createdAt'>) => {
    const newReport: ReportItem = {
      ...report,
      id: `rep-${Date.now()}`,
      status: 'pending',
      createdAt: '剛剛',
    };
    setReports((prev) => [newReport, ...prev]);
    showToast('檢舉已提交，管理團隊將在 24 小時內審核！');
  };

  const resolveReport = (reportId: string, action: 'dismiss' | 'take_down') => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: action === 'take_down' ? 'resolved' : 'dismissed' }
          : r
      )
    );
    if (action === 'take_down') {
      const rep = reports.find((r) => r.id === reportId);
      if (rep) {
        setProducts((prev) => prev.filter((p) => p.id !== rep.productId));
      }
      showToast('已審核並下架違規商品');
    } else {
      showToast('已駁回該檢舉');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers: users,
        switchUser,
        updateUserProfile,
        verifyStudentEmail,
        isLoggedIn,
        login,
        register,
        logout,
        authModalTab,
        setAuthModalTab,
        verificationModalOpen,
        setVerificationModalOpen,
        verifyStudentStatus,
        activeTab,
        setActiveTab,
        selectedProduct,
        setSelectedProduct,
        adminModalOpen,
        setAdminModalOpen,
        authModalOpen,
        setAuthModalOpen,
        selectedRegionFilter,
        setSelectedRegionFilter,
        selectedSchoolFilter,
        setSelectedSchoolFilter,
        keywordQuery,
        setKeywordQuery,
        categoryFilter,
        setCategoryFilter,
        typeFilter,
        setTypeFilter,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductStatus,
        toggleLike,
        addQuestion,
        replyQuestion,
        favorites,
        isFavorite,
        toggleFavorite,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        conversations,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        createOrOpenConversation,
        respondToOffer,
        transactionRecords,
        reports,
        submitReport,
        resolveReport,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
