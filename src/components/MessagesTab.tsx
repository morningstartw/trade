/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  Bell, 
  CheckCheck, 
  Send, 
  ShieldCheck, 
  MapPin, 
  Repeat, 
  DollarSign, 
  Check, 
  X, 
  ArrowLeft,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const MessagesTab: React.FC = () => {
  const {
    currentUser,
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    respondToOffer,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationsCount,
    setSelectedProduct,
    products,
    isLoggedIn,
    setAuthModalOpen,
    setAuthModalTab,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'chats' | 'notifications'>('chats');
  const [inputText, setInputText] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const targetProduct = activeConv ? products.find((p) => p.id === activeConv.productId) : null;

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">請先登入查看即時私訊與通知</h2>
        <p className="text-xs text-gray-600">
          登入後即可與同校買家/賣家即時洽談面交地點與出價交換。
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setAuthModalTab('login');
              setAuthModalOpen(true);
            }}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs cursor-pointer"
          >
            會員登入
          </button>
          <button
            onClick={() => {
              setAuthModalTab('register');
              setAuthModalOpen(true);
            }}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
          >
            學生會員註冊
          </button>
        </div>
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;
    sendMessage(activeConversationId, inputText.trim());
    setInputText('');
  };

  const handleQuickReply = (text: string) => {
    if (!activeConversationId) return;
    sendMessage(activeConversationId, text);
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Top Switcher Sub-tabs */}
      <div className="bg-white rounded-2xl p-2 border border-gray-100 shadow-xs mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setActiveSubTab('chats');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'chats'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>私訊與面交洽談 ({conversations.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('notifications');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer relative ${
              activeSubTab === 'notifications'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>站內通知</span>
            {unreadNotificationsCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>

        {activeSubTab === 'notifications' && (
          <button
            onClick={markAllNotificationsAsRead}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span className="hidden sm:inline">全部標記為已讀</span>
          </button>
        )}
      </div>

      {/* Sub-Tab 1: Chats */}
      {activeSubTab === 'chats' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden min-h-[550px] flex flex-col md:flex-row">
          {/* Conversation List Sidebar */}
          <div
            className={`w-full md:w-80 border-r border-gray-100 flex flex-col ${
              activeConversationId ? 'hidden md:flex' : 'flex'
            }`}
          >
            <div className="p-3.5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800">所有對話紀錄</span>
              <span className="text-[11px] text-gray-600">{conversations.length} 個對話</span>
            </div>

            <div className="divide-y divide-gray-100 overflow-y-auto flex-1 max-h-[500px]">
              {conversations.length > 0 ? (
                conversations.map((conv) => {
                  const isSelected = conv.id === activeConversationId;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConversationId(conv.id)}
                      className={`w-full text-left p-3.5 flex items-start gap-3 transition cursor-pointer ${
                        isSelected ? 'bg-emerald-50/70 border-l-4 border-emerald-600' : 'hover:bg-gray-50'
                      }`}
                    >
                      <img
                        src={conv.otherUser.avatar}
                        alt={conv.otherUser.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-emerald-400"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900 truncate">
                            {conv.otherUser.name}
                          </span>
                          <span className="text-[10px] text-gray-600">
                            {conv.lastMessageTime}
                          </span>
                        </div>
                        <div className="text-[10px] text-emerald-700 font-medium truncate">
                          {conv.otherUser.school}
                        </div>
                        <p className="text-xs text-gray-600 truncate mt-1">
                          {conv.lastMessage}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md truncate">
                          <span>📦 {conv.productTitle}</span>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center text-gray-600 text-xs">
                  目前尚未有進行中的私訊對話
                </div>
              )}
            </div>
          </div>

          {/* Active Conversation Detail Pane */}
          <div
            className={`flex-1 flex flex-col ${
              !activeConversationId ? 'hidden md:flex items-center justify-center' : 'flex'
            }`}
          >
            {activeConv ? (
              <>
                {/* Chat Header */}
                <div className="p-3.5 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setActiveConversationId(null)}
                      className="md:hidden p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-200 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <img
                      src={activeConv.otherUser.avatar}
                      alt={activeConv.otherUser.name}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-emerald-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-gray-900 flex items-center gap-1">
                        <span>{activeConv.otherUser.name}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-[10px] text-gray-600">
                        {activeConv.otherUser.school}
                      </div>
                    </div>
                  </div>

                  {/* Product Mini Preview Badge */}
                  <div
                    onClick={() => {
                      if (targetProduct) setSelectedProduct(targetProduct);
                    }}
                    className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl border border-gray-200 hover:border-emerald-300 transition cursor-pointer shadow-2xs max-w-[200px]"
                  >
                    <img
                      src={activeConv.productImage}
                      alt="product"
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                    <div className="truncate text-left">
                      <div className="text-[10px] font-bold text-gray-900 truncate">
                        {activeConv.productTitle}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-extrabold">
                        {activeConv.productType === 'free' ? '免費贈送' : `NT$ ${activeConv.productPrice}`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/30 max-h-[400px]">
                  {/* Security Hint */}
                  <div className="text-center">
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-medium inline-block">
                      💡 提示：建議約定在校園公共場所 (總圖書館、學生活動中心、學餐) 面交，切勿私下匯款！
                    </span>
                  </div>

                  {activeConv.messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        {/* If this message is a Trade Offer / Application card */}
                        {msg.isOffer && msg.offerDetails ? (
                          <div
                            className={`p-3.5 rounded-2xl max-w-sm border shadow-xs space-y-2 text-xs ${
                              isMe
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                                : 'bg-white border-amber-300 text-gray-900'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold border-b border-gray-200/60 pb-1.5">
                              <span className="flex items-center gap-1 text-emerald-800">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                <span>
                                  {msg.offerDetails.type === 'exchange'
                                    ? '🤝 收到以物易物申請'
                                    : '💰 收到購買面交申請'}
                                </span>
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                  msg.offerDetails.status === 'accepted'
                                    ? 'bg-emerald-600 text-white'
                                    : msg.offerDetails.status === 'declined'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {msg.offerDetails.status === 'accepted'
                                  ? '已同意面交'
                                  : msg.offerDetails.status === 'declined'
                                  ? '已婉拒'
                                  : '等待賣家確認'}
                              </span>
                            </div>

                            <div className="space-y-1 text-xs">
                              {msg.offerDetails.proposedPrice !== undefined && (
                                <div>
                                  出價金額：<span className="font-bold">NT$ {msg.offerDetails.proposedPrice}</span>
                                </div>
                              )}
                              {msg.offerDetails.exchangeItem && (
                                <div>
                                  交換物品：<span className="font-bold">{msg.offerDetails.exchangeItem}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-gray-600">
                                <MapPin className="w-3 h-3 text-emerald-600" />
                                <span>面交地點：{msg.offerDetails.meetupLocation || '校園大門'}</span>
                              </div>
                            </div>

                            {/* Seller Action Buttons if pending & recipient is seller */}
                            {!isMe && msg.offerDetails.status === 'pending' && (
                              <div className="flex items-center gap-2 pt-2 border-t border-gray-200/60">
                                <button
                                  onClick={() => respondToOffer(activeConv.id, msg.id, true)}
                                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>同意面交</span>
                                </button>
                                <button
                                  onClick={() => respondToOffer(activeConv.id, msg.id, false)}
                                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs cursor-pointer"
                                >
                                  婉拒
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Regular text message */
                          <div
                            className={`p-3 rounded-2xl max-w-xs sm:max-w-md text-xs leading-relaxed ${
                              isMe
                                ? 'bg-emerald-600 text-white rounded-br-xs'
                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-xs shadow-2xs'
                            }`}
                          >
                            {msg.text}
                          </div>
                        )}

                        <span className="text-[10px] text-gray-600 mt-1 px-1">
                          {msg.timestamp}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Reply Pills */}
                <div className="px-3 py-2 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
                  <span className="text-[10px] font-semibold text-gray-600 shrink-0">快捷常用句：</span>
                  <button
                    onClick={() => handleQuickReply('請問這週末方便在總圖書館面交嗎？')}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 rounded-full text-[11px] shrink-0 transition cursor-pointer"
                  >
                    約總圖面交
                  </button>
                  <button
                    onClick={() => handleQuickReply('請問商品品況是否如照片無刮痕？')}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 rounded-full text-[11px] shrink-0 transition cursor-pointer"
                  >
                    確認品況
                  </button>
                  <button
                    onClick={() => handleQuickReply('我有帶零錢，現場點清面交～謝謝同學！')}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 rounded-full text-[11px] shrink-0 transition cursor-pointer"
                  >
                    現場現金付清
                  </button>
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={handleSend}
                  className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="輸入私訊內容，洽談校園面交..."
                    className="flex-1 py-2 px-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl disabled:opacity-40 transition shadow-xs cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="p-12 text-center space-y-2 text-gray-600">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="text-sm font-bold text-gray-700">選擇左側對話以開始聊天</h3>
                <p className="text-xs">
                  點選任一同學的對話即可約定校園面交時間與地點
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Notifications */}
      {activeSubTab === 'notifications' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-emerald-600" />
              <span>校園站內即時通知</span>
            </h2>
            <span className="text-xs text-gray-600">
              共 {notifications.length} 則通知 ({unreadNotificationsCount} 則未讀)
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`py-3.5 px-3 rounded-2xl flex items-start gap-3 transition cursor-pointer ${
                  notif.isRead ? 'hover:bg-gray-50' : 'bg-emerald-50/60 hover:bg-emerald-50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                    notif.type === 'trade_request'
                      ? 'bg-amber-100 text-amber-700'
                      : notif.type === 'inquiry'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {notif.type === 'trade_request' ? (
                    <Repeat className="w-4 h-4" />
                  ) : notif.type === 'inquiry' ? (
                    <MessageSquare className="w-4 h-4" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-gray-600">{notif.createdAt}</span>
                  </div>
                  <p className="text-xs text-gray-700 mt-1 leading-snug">
                    {notif.message}
                  </p>
                  {notif.productTitle && (
                    <div className="mt-1.5 text-[10px] font-semibold text-emerald-700 bg-white border border-emerald-200 px-2 py-0.5 rounded-md inline-block">
                      相關商品：{notif.productTitle}
                    </div>
                  )}
                </div>

                {!notif.isRead && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
