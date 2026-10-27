/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, CONDITIONS, UNIVERSITIES } from '../data/mockData';
import { ItemCategory, ItemCondition, TransactionType } from '../types';
import { 
  Camera, 
  Upload, 
  X, 
  Plus, 
  MapPin, 
  Repeat, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  DollarSign,
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react';

const QUICK_SAMPLE_IMAGES = [
  { label: '教科書/原文書', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80' },
  { label: '平板筆電3C', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80' },
  { label: '生活用品保溫杯', url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80' },
  { label: '宿舍家具推車', url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop&q=80' },
  { label: '工程計算機', url: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e485?w=800&auto=format&fit=crop&q=80' },
  { label: '耳機音訊', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' },
];

export const PostTab: React.FC = () => {
  const { 
    currentUser, 
    addProduct, 
    setActiveTab, 
    setSelectedProduct,
    isLoggedIn,
    setAuthModalOpen,
    setAuthModalTab
  } = useApp();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ItemCategory>('textbook');
  const [condition, setCondition] = useState<ItemCondition>('good');
  const [type, setType] = useState<TransactionType>('sell');
  const [price, setPrice] = useState<string>('300');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
  ]);

  // Exchange preferences
  const [wantsItem, setWantsItem] = useState('');
  const [allowCashAdjustment, setAllowCashAdjustment] = useState(true);
  const [adjustmentAmount, setAdjustmentAmount] = useState<string>('0');
  const [exchangeNotes, setExchangeNotes] = useState('');

  // Meetup locations
  const [selectedSchool, setSelectedSchool] = useState(currentUser.school);
  const [meetupLocations, setMeetupLocations] = useState<string[]>([
    `${currentUser.school} 總圖書館正門`,
    '捷運站出口 / 學生活動中心',
  ]);
  const [customLocation, setCustomLocation] = useState('');

  // Validation & Loading
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <Upload className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">請先登入後再發布商品</h2>
        <p className="text-xs text-gray-600">
          UniTrade 為保障校園真實交易與安全，僅限認證或註冊之大專院校學生刊登商品。
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

  const handleAddImageViaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSampleImage = (url: string) => {
    if (images.length >= 5) return;
    setImages((prev) => [...prev, url]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddLocation = () => {
    if (customLocation.trim()) {
      setMeetupLocations((prev) => [...prev, customLocation.trim()]);
      setCustomLocation('');
    }
  };

  const handleRemoveLocation = (index: number) => {
    setMeetupLocations((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) {
      errs.title = '請輸入商品標題 (至少 4 個字)';
    } else if (title.trim().length < 4) {
      errs.title = '商品標題過短，請具體描述商品';
    }

    if (!description.trim()) {
      errs.description = '請填寫商品詳細描述，幫助同學了解品況';
    }

    if (images.length === 0) {
      errs.images = '請上傳至少一張商品照片';
    }

    if (type === 'sell') {
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice <= 0) {
        errs.price = '現售商品價格必須大於 0';
      }
    }

    if (type === 'exchange') {
      if (!wantsItem.trim()) {
        errs.wantsItem = '以物易物模式下，請填寫您希望交換的物品';
      }
    }

    if (meetupLocations.length === 0) {
      errs.locations = '請設定至少一個校園面交地點';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newProductId = addProduct({
        title: title.trim(),
        description: description.trim(),
        price: type === 'free' ? 0 : Number(price) || 0,
        type,
        category,
        condition,
        images,
        sellerId: currentUser.id,
        sellerName: currentUser.name,
        sellerAvatar: currentUser.avatar,
        sellerSchool: selectedSchool,
        sellerVerified: currentUser.isVerified,
        meetupLocations,
        exchangePreference:
          type === 'exchange'
            ? {
                wants: wantsItem.trim(),
                allowCashAdjustment,
                adjustmentAmount: Number(adjustmentAmount) || 0,
                notes: exchangeNotes.trim(),
              }
            : undefined,
        status: 'available',
      });

      setIsSubmitting(false);
      setActiveTab('home');
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>發布閒置好物</span>
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              學生專屬
            </span>
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            快速上架出清二手教科書、電器與生活用品，享受同校面交的安全與零運費。
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-800 p-2 rounded-2xl border border-emerald-200 text-xs">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <div className="font-bold">{currentUser.name}</div>
            <div className="text-[10px] text-gray-600">{currentUser.school}</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Photos */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>商品照片上傳 (1-5 張，第一張為封面)</span>
              <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-gray-600">{images.length} / 5 張</span>
          </div>

          {errors.images && (
            <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.images}</span>
            </p>
          )}

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 group bg-gray-100"
              >
                <img src={img} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-rose-600 text-white p-1 rounded-full backdrop-blur-xs transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                    主封面
                  </span>
                )}
              </div>
            ))}

            {images.length < 5 && (
              <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 hover:border-emerald-500 bg-gray-50/60 hover:bg-emerald-50/30 flex flex-col items-center justify-center cursor-pointer transition text-gray-600 hover:text-emerald-600">
                <Upload className="w-6 h-6 mb-1" />
                <span className="text-[11px] font-medium">選取照片</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAddImageViaUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Preset Campus Photo library shortcuts */}
          <div className="pt-2 border-t border-gray-100 space-y-1.5">
            <span className="text-[11px] font-semibold text-gray-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>快捷挑選預設校園好物照片（方便快速體驗）：</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_SAMPLE_IMAGES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddSampleImage(sample.url)}
                  disabled={images.length >= 5}
                  className="text-[11px] bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-800 px-2.5 py-1 rounded-lg transition disabled:opacity-40 cursor-pointer"
                >
                  + {sample.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Basic Information */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900">基本資料與成色</h2>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
              <span>商品名稱</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：微積分原文書 (Stewart 8th ed) 附期中重點整理筆記"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
            {errors.title && (
              <p className="text-xs text-rose-600 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">分類</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">新舊程度成色</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {Object.entries(CONDITIONS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label} ({item.badge})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
              <span>詳細描述與使用狀況</span>
              <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="請具體說明二手使用頻率、有無塗鴉筆記、購買時間、配件是否齊全，以及適合什麼系的同學～"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
            {errors.description && (
              <p className="text-xs text-rose-600 font-medium">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Section 3: Transaction Type & Pricing (PRD 8 & 15) */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900">交易方式與價格</h2>

          {/* Type Selector Tabs */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setType('sell')}
              className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                type === 'sell'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="text-xs">💰 現售出清</div>
              <div className="text-[10px] text-gray-600 mt-0.5">自訂出售金額</div>
            </button>

            <button
              type="button"
              onClick={() => setType('exchange')}
              className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                type === 'exchange'
                  ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold shadow-xs'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="text-xs">🔄 以物易物</div>
              <div className="text-[10px] text-gray-600 mt-0.5">希望交換物品</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('free');
                setPrice('0');
              }}
              className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                type === 'free'
                  ? 'bg-teal-50 border-teal-500 text-teal-800 font-bold shadow-xs'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="text-xs">🎁 免費贈送</div>
              <div className="text-[10px] text-gray-600 mt-0.5">送給同校學弟妹</div>
            </button>
          </div>

          {/* Price Input (if not free) */}
          {type !== 'free' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                <span>{type === 'exchange' ? '交換預估價值 / 或直接購買價 (NT$)' : '出清價格 (NT$)'}</span>
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-bold text-sm">
                  NT$
                </span>
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="300"
                  className="w-full pl-12 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              {errors.price && (
                <p className="text-xs text-rose-600 font-medium">{errors.price}</p>
              )}
            </div>
          )}

          {/* Exchange Preferences Section */}
          {type === 'exchange' && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Repeat className="w-4 h-4 text-amber-600" />
                <span>交換意願設定</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                  <span>希望交換的物品描述</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={wantsItem}
                  onChange={(e) => setWantsItem(e.target.value)}
                  placeholder="例如：想換線性代數課本、機械鍵盤、或 Switch 二手遊戲片"
                  className="w-full p-2 bg-white border border-amber-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20"
                />
                {errors.wantsItem && (
                  <p className="text-xs text-rose-600 font-medium">{errors.wantsItem}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowCashAdjustment}
                    onChange={(e) => setAllowCashAdjustment(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                  />
                  <span>接受互補差價 (雙方物品價值不一致時可補現金)</span>
                </label>
              </div>

              {allowCashAdjustment && (
                <div className="space-y-1 pt-1">
                  <label className="text-xs font-semibold text-gray-700">
                    最高可接受補貼差價上限 (NT$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={adjustmentAmount}
                    onChange={(e) => setAdjustmentAmount(e.target.value)}
                    placeholder="例如：500"
                    className="w-full p-2 bg-white border border-amber-200 rounded-xl text-xs"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 4: Campus & Meetup Locations */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>校園面交地點設定</span>
            </h2>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              同校優先面交
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">面交學校</label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {UNIVERSITIES.filter((u) => u.id !== 'all').map((uni) => (
                <option key={uni.id} value={uni.name}>
                  {uni.name}
                </option>
              ))}
            </select>
          </div>

          {/* Current Locations */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700">
              推薦面交地標 (如圖書館、大門、學餐)：
            </label>
            <div className="flex flex-wrap gap-2">
              {meetupLocations.map((loc, idx) => (
                <span
                  key={idx}
                  className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                >
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>{loc}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLocation(idx)}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add custom location */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="新增面交地點，例如：女宿一舍交誼廳、捷運公館站3號出口"
                className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddLocation();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddLocation}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                + 新增
              </button>
            </div>
            {errors.locations && (
              <p className="text-xs text-rose-600 font-medium">{errors.locations}</p>
            )}
          </div>
        </div>

        {/* Submit Actions (UI/UX 5.2 Loading states) */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>上架中，正在發布至校園市集...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>立即確認發布 (一鍵上架)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
