/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CONDITIONS } from '../data/mockData';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  MessageCircle, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Send, 
  Repeat, 
  Gift, 
  Flag, 
  AlertTriangle, 
  Clock, 
  Eye, 
  Share2,
  Check,
  Sparkles
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    currentUser,
    isFavorite,
    toggleFavorite,
    addQuestion,
    replyQuestion,
    createOrOpenConversation,
    submitReport,
    showToast,
  } = useApp();

  if (!selectedProduct) return null;

  // Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Question input state
  const [questionInput, setQuestionInput] = useState('');
  const [replyInputId, setReplyInputId] = useState<string | null>(null);
  const [replyInputText, setReplyInputText] = useState('');

  // Trade Application Modal state
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(
    selectedProduct.meetupLocations[0] || '同校總圖書館'
  );
  const [offerType, setOfferType] = useState<'buy' | 'exchange'>(
    selectedProduct.type === 'exchange' ? 'exchange' : 'buy'
  );
  const [proposedPrice, setProposedPrice] = useState(selectedProduct.price.toString());
  const [exchangeItemOffer, setExchangeItemOffer] = useState('');

  // Report Modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState<
    'counterfeit' | 'misleading' | 'inappropriate' | 'contact_violation' | 'scam' | 'other'
  >('contact_violation');
  const [reportDetail, setReportDetail] = useState('');

  const favorited = isFavorite(selectedProduct.id);
  const conditionMeta = CONDITIONS[selectedProduct.condition] || CONDITIONS.good;
  const isSeller = currentUser.id === selectedProduct.sellerId;

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % selectedProduct.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedProduct.images.length - 1 : prev - 1
    );
  };

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;
    addQuestion(selectedProduct.id, questionInput.trim());
    setQuestionInput('');
  };

  const handleSendReply = (questionId: string) => {
    if (!replyInputText.trim()) return;
    replyQuestion(selectedProduct.id, questionId, replyInputText.trim());
    setReplyInputText('');
    setReplyInputId(null);
  };

  const handleConfirmTradeOffer = (e: React.FormEvent) => {
    e.preventDefault();
    createOrOpenConversation(selectedProduct, {
      type: offerType,
      proposedPrice: Number(proposedPrice) || 0,
      exchangeItem: exchangeItemOffer.trim() || undefined,
      meetupLocation: selectedLocation,
    });
    setTradeModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDirectContact = () => {
    createOrOpenConversation(selectedProduct);
    setSelectedProduct(null);
  };

  const handleSubmitReportForm = (e: React.FormEvent) => {
    e.preventDefault();
    const reasonMap = {
      counterfeit: '盜版或仿冒品',
      misleading: '商品描述不實/價格不符',
      inappropriate: '不當言論或違禁品',
      contact_violation: '公然要求外部私下私訊匯款',
      scam: '疑似詐騙帳號',
      other: '其他違規',
    };
    submitReport({
      productId: selectedProduct.id,
      productTitle: selectedProduct.title,
      reportedUserId: selectedProduct.sellerId,
      reporterName: currentUser.name,
      reason: reportReason,
      reasonText: reasonMap[reportReason],
      detail: reportDetail.trim() || '使用者未補充備註',
    });
    setReportModalOpen(false);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('商品連結已複製到剪貼簿！');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Top Header bar */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10 sticky top-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-800">商品詳情</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              同校面交優先
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition cursor-pointer"
              title="分享商品"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setReportModalOpen(true)}
              className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition cursor-pointer"
              title="檢舉違規商品"
            >
              <Flag className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedProduct(null)}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* Multi-image Carousel (UI/UX 2.2) */}
          <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-gray-900 group">
            <img
              src={selectedProduct.images[currentImageIndex] || selectedProduct.images[0]}
              alt={selectedProduct.title}
              className="w-full h-full object-contain sm:object-cover"
            />

            {/* Navigation Arrows */}
            {selectedProduct.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs">
                  {selectedProduct.images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {selectedProduct.type === 'free' ? (
                <span className="bg-teal-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" />
                  <span>免費贈送</span>
                </span>
              ) : selectedProduct.type === 'exchange' ? (
                <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Repeat className="w-3.5 h-3.5" />
                  <span>以物易物</span>
                </span>
              ) : (
                <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                  現售出清
                </span>
              )}

              {/* Status Badge: 上架中 / 預約中 / 交易完成 */}
              {selectedProduct.status === 'reserved' ? (
                <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  🤝 預約中
                </span>
              ) : selectedProduct.status === 'sold' ? (
                <span className="bg-slate-800 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  🎉 交易完成
                </span>
              ) : (
                <span className="bg-emerald-700/90 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  🟢 上架中
                </span>
              )}

              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shadow-md bg-white/95 ${conditionMeta.color}`}>
                {conditionMeta.label} ({conditionMeta.badge})
              </span>
            </div>
          </div>

          {/* Pricing & Title Block */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              {selectedProduct.type === 'free' ? (
                <span className="text-2xl font-black text-teal-600">
                  NT$ 0 (免費贈送好物)
                </span>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-emerald-600">NT$</span>
                  <span className="text-3xl font-black text-gray-900 tracking-tight">
                    {selectedProduct.price.toLocaleString()}
                  </span>
                  {selectedProduct.type === 'exchange' && (
                    <span className="text-xs font-bold text-amber-600 ml-2 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      接受以物易物
                    </span>
                  )}
                </div>
              )}
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
              {selectedProduct.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-gray-600 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>上架日期：{selectedProduct.createdAt}</span>
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{selectedProduct.views} 次瀏覽</span>
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                <span>{selectedProduct.likes} 人收藏</span>
              </span>
            </div>
          </div>

          {/* Exchange Terms Banner (PRD 15) */}
          {selectedProduct.exchangePreference && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Repeat className="w-4 h-4 text-amber-600" />
                <span>賣家設定的交換意願</span>
              </div>
              <p className="text-xs text-gray-800">
                <span className="font-semibold text-amber-900">希望交換：</span>
                {selectedProduct.exchangePreference.wants}
              </p>
              {selectedProduct.exchangePreference.allowCashAdjustment && (
                <p className="text-[11px] text-amber-800 font-medium">
                  ✓ 賣家願意接受物品價值差額以現金補貼 (最高可補 NT$ {selectedProduct.exchangePreference.adjustmentAmount || '面議'})
                </p>
              )}
              {selectedProduct.exchangePreference.notes && (
                <p className="text-[11px] text-gray-600 italic">
                  備註：{selectedProduct.exchangePreference.notes}
                </p>
              )}
            </div>
          )}

          {/* Description Section */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              商品描述與品況說明
            </h2>
            <div className="p-4 bg-gray-50 rounded-2xl text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-line border border-gray-100">
              {selectedProduct.description}
            </div>
          </div>

          {/* Campus Meetup Locations */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>同校面交地點推薦</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {selectedProduct.meetupLocations.map((loc, idx) => (
                <span
                  key={idx}
                  className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1.5 rounded-xl font-medium flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>{loc}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Seller Information Card */}
          <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={selectedProduct.sellerAvatar}
                alt={selectedProduct.sellerName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-gray-900">
                    {selectedProduct.sellerName}
                  </span>
                  {selectedProduct.sellerVerified && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>校園認證</span>
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-600">
                  {selectedProduct.sellerSchool}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-0.5">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>4.9 買賣家高評分</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleDirectContact}
              className="text-xs font-bold px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition cursor-pointer"
            >
              查看賣場
            </button>
          </div>

          {/* Public Q&A Section (PRD 16) */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>公開問答交流區</span>
              </h2>
              <span className="text-xs text-gray-600">
                {selectedProduct.questions.length} 則問答
              </span>
            </div>

            {/* Privacy notice banner */}
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-800 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>為維護雙方個資安全，公開問答請勿透露個人手機號碼、LINE ID 或私人住址。</span>
            </div>

            {/* Questions list */}
            <div className="space-y-3">
              {selectedProduct.questions.map((q) => (
                <div
                  key={q.id}
                  className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={q.userAvatar}
                        alt={q.userName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-bold text-gray-800">{q.userName}</span>
                      <span className="text-[10px] text-gray-600">({q.userSchool})</span>
                    </div>
                    <span className="text-[10px] text-gray-600">{q.createdAt}</span>
                  </div>

                  <p className="text-gray-800 pl-8">{q.content}</p>

                  {/* Seller Reply */}
                  {q.reply ? (
                    <div className="ml-6 mt-2 p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-emerald-900 flex items-center gap-1">
                          <span>賣家回覆 ({q.reply.sellerName})</span>
                        </span>
                        <span className="text-gray-600 text-[10px]">{q.reply.createdAt}</span>
                      </div>
                      <p className="text-gray-800 text-xs">{q.reply.content}</p>
                    </div>
                  ) : isSeller ? (
                    /* Seller reply form */
                    <div className="ml-6 pt-1">
                      {replyInputId === q.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={replyInputText}
                            onChange={(e) => setReplyInputText(e.target.value)}
                            placeholder="回覆此同學的提問..."
                            className="flex-1 p-2 bg-white border border-gray-300 rounded-xl text-xs"
                          />
                          <button
                            onClick={() => handleSendReply(q.id)}
                            className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                          >
                            回覆
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setReplyInputId(q.id);
                            setReplyInputText('');
                          }}
                          className="text-[11px] text-emerald-700 font-semibold hover:underline"
                        >
                          回覆此問答
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Post question form */}
            <form onSubmit={handleSendQuestion} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="對商品有疑問？公開向賣家發問（例如：品況、是否附贈配件）..."
                className="flex-1 py-2 px-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                type="submit"
                disabled={!questionInput.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs disabled:opacity-40 transition cursor-pointer"
              >
                提問
              </button>
            </form>
          </div>
        </div>

        {/* Fixed Bottom Action Bar (UI/UX 2.2) */}
        <div className="p-3 sm:p-4 bg-white border-t border-gray-200 flex items-center gap-2 sticky bottom-0 z-20">
          {/* Favorite button */}
          <button
            onClick={() => toggleFavorite(selectedProduct.id)}
            className={`p-3 rounded-2xl border transition flex flex-col items-center justify-center shrink-0 cursor-pointer ${
              favorited
                ? 'bg-rose-50 border-rose-300 text-rose-500'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
            title={favorited ? '取消收藏' : '加入收藏'}
          >
            <Heart className={`w-5 h-5 ${favorited ? 'fill-rose-500' : ''}`} />
          </button>

          {/* Contact Seller directly */}
          <button
            onClick={handleDirectContact}
            className="flex-1 py-3 px-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-gray-600" />
            <span>私訊洽談</span>
          </button>

          {/* Primary Action: Trade / Buy application */}
          {!isSeller && (
            <button
              onClick={() => setTradeModalOpen(true)}
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md shadow-emerald-600/25 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{selectedProduct.type === 'exchange' ? '提出交換申請' : '提出面交購買'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Trade / Purchase Application Modal */}
      {tradeModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>
                  提出{selectedProduct.type === 'exchange' ? '以物易物交換' : '同校面交購買'}申請
                </span>
              </h3>
              <button
                onClick={() => setTradeModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmTradeOffer} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">選擇方便的同校面交地點</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  {selectedProduct.meetupLocations.map((loc, idx) => (
                    <option key={idx} value={loc}>
                      {loc}
                    </option>
                  ))}
                  <option value="校內其他地點 (於私訊進一步確認)">
                    校內其他地點 (於私訊進一步確認)
                  </option>
                </select>
              </div>

              {selectedProduct.type === 'exchange' ? (
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">
                    你想提供的交換物品名稱與品況
                  </label>
                  <input
                    type="text"
                    value={exchangeItemOffer}
                    onChange={(e) => setExchangeItemOffer(e.target.value)}
                    placeholder="例如：我有一本大二下線性代數原文書，保存良好！"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">確認出價金額 (NT$)</label>
                  <input
                    type="number"
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                    required
                  />
                </div>
              )}

              <div className="p-3 bg-emerald-50 rounded-xl text-[11px] text-emerald-800 space-y-1">
                <div>• 送出申請後，系統將自動為您開啟與賣家的專屬對話視窗。</div>
                <div>• 賣家同意後，即可約定見面面交時間一手交錢一手交貨。</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTradeModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  立即送出申請
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal (PRD 19) */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <Flag className="w-5 h-5" />
              <h3 className="text-base font-bold text-gray-900">
                檢舉違規商品
              </h3>
            </div>

            <form onSubmit={handleSubmitReportForm} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">檢舉違規原因</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value as any)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  <option value="contact_violation">要求加私人 LINE / 外部匯款詐騙風險</option>
                  <option value="misleading">商品描述與照片不符 / 誇大品況</option>
                  <option value="counterfeit">疑似仿冒品 / 盜版教科書</option>
                  <option value="inappropriate">非學生二手物品 / 違禁品</option>
                  <option value="scam">惡意棄單或詐騙行為</option>
                  <option value="other">其他不當行為</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">具體說明 (選填)</label>
                <textarea
                  rows={3}
                  value={reportDetail}
                  onChange={(e) => setReportDetail(e.target.value)}
                  placeholder="請補充說明違規細節，幫助平台管理團隊審查..."
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  送出檢舉
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
