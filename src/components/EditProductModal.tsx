/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, ItemCategory, ItemCondition, TransactionType, ItemStatus } from '../types';
import { useApp } from '../context/AppContext';
import { CATEGORIES, CONDITIONS, UNIVERSITIES } from '../data/mockData';
import { 
  X, 
  Trash2, 
  Upload, 
  Camera, 
  MapPin, 
  Repeat, 
  DollarSign, 
  Check, 
  AlertCircle, 
  Sparkles,
  Save,
  CheckCircle2,
  Clock,
  PackageCheck
} from 'lucide-react';

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_PHOTOS = [
  { label: '課本教科書', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80' },
  { label: '3C平板筆電', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80' },
  { label: '生活用品杯具', url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80' },
  { label: '宿舍家具推車', url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop&q=80' },
  { label: '工程計算機', url: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e485?w=800&auto=format&fit=crop&q=80' },
  { label: '耳機耳罩音訊', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' },
];

export const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { updateProduct, deleteProduct, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ItemCategory>('textbook');
  const [condition, setCondition] = useState<ItemCondition>('good');
  const [type, setType] = useState<TransactionType>('sell');
  const [price, setPrice] = useState<string>('0');
  const [status, setStatus] = useState<ItemStatus>('available');
  const [images, setImages] = useState<string[]>([]);

  // Exchange preferences
  const [wantsItem, setWantsItem] = useState('');
  const [allowCashAdjustment, setAllowCashAdjustment] = useState(false);
  const [adjustmentAmount, setAdjustmentAmount] = useState('0');

  // Locations
  const [meetupLocations, setMeetupLocations] = useState<string[]>([]);
  const [customLocation, setCustomLocation] = useState('');

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setDescription(product.description);
      setCategory(product.category);
      setCondition(product.condition);
      setType(product.type);
      setPrice(product.price.toString());
      setStatus(product.status);
      setImages([...product.images]);
      setMeetupLocations([...product.meetupLocations]);

      if (product.exchangePreference) {
        setWantsItem(product.exchangePreference.wants || '');
        setAllowCashAdjustment(product.exchangePreference.allowCashAdjustment || false);
        setAdjustmentAmount((product.exchangePreference.adjustmentAmount || 0).toString());
      } else {
        setWantsItem('');
        setAllowCashAdjustment(false);
        setAdjustmentAmount('0');
      }
      setShowDeleteConfirm(false);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('請填寫商品名稱');
      return;
    }
    if (images.length === 0) {
      showToast('請保留至少一張商品照片');
      return;
    }

    updateProduct(product.id, {
      title: title.trim(),
      description: description.trim(),
      category,
      condition,
      type,
      price: type === 'free' ? 0 : Number(price) || 0,
      status,
      images,
      meetupLocations,
      exchangePreference:
        type === 'exchange'
          ? {
              wants: wantsItem.trim(),
              allowCashAdjustment,
              adjustmentAmount: Number(adjustmentAmount) || 0,
            }
          : undefined,
    });

    onClose();
  };

  const handleDelete = () => {
    deleteProduct(product.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Save className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">修改商品資料與狀態標示</h2>
              <p className="text-xs text-emerald-100">
                可修改價格、品況、標示狀態（上架中/預約中/交易完成）或將商品下架
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* Status Labeling Bar (標示上架中、預約中或交易完成) */}
          <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
            <label className="font-bold text-gray-900 flex items-center justify-between">
              <span>商品狀態標示 (即時切換)</span>
              <span className="text-[10px] text-gray-500">買家將可於市集看到對應狀態標籤</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('available')}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                  status === 'available'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>上架中</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('reserved')}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                  status === 'reserved'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>預約中</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('sold')}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                  status === 'sold'
                    ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <PackageCheck className="w-3.5 h-3.5" />
                <span>交易完成</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-700">商品標題</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              required
            />
          </div>

          {/* Photos Management */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-700">商品照片 ({images.length}/5 張)</label>
              <label className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer flex items-center gap-1">
                <Camera className="w-3.5 h-3.5" />
                <span>+ 上傳新照片</span>
                <input type="file" accept="image/*" onChange={handleAddImage} className="hidden" />
              </label>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shrink-0 group">
                  <img src={img} alt="item" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-rose-600 text-white p-1 rounded-full backdrop-blur-xs transition cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-emerald-600 text-white text-[9px] text-center font-bold py-0.5">
                      封面
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Preset quick photo pick */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-gray-600">快捷挑選校園樣本圖：</span>
              {PRESET_PHOTOS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImages((prev) => (prev.length < 5 ? [...prev, p.url] : prev))}
                  className="text-[10px] bg-gray-100 hover:bg-emerald-100 text-gray-700 px-2 py-0.5 rounded-md transition cursor-pointer"
                >
                  + {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">分類</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700">新舊程度成色</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              >
                {Object.entries(CONDITIONS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label} ({item.badge})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Transaction Type & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">交易方式</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TransactionType)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              >
                <option value="sell">💰 現售出清</option>
                <option value="exchange">🔄 以物易物</option>
                <option value="free">🎁 免費贈送</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700">價格 (NT$)</label>
              <input
                type="number"
                min="0"
                disabled={type === 'free'}
                value={type === 'free' ? 0 : price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold disabled:opacity-50"
              />
            </div>
          </div>

          {/* Exchange terms if type is exchange */}
          {type === 'exchange' && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
              <span className="font-bold text-amber-900">以物易物條件：</span>
              <input
                type="text"
                value={wantsItem}
                onChange={(e) => setWantsItem(e.target.value)}
                placeholder="希望交換的物品..."
                className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs"
              />
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowCashAdjustment}
                  onChange={(e) => setAllowCashAdjustment(e.target.checked)}
                  className="rounded text-amber-600"
                />
                <span>接受互補差價</span>
              </label>
              {allowCashAdjustment && (
                <input
                  type="number"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                  placeholder="補差價金額上限"
                  className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs"
                />
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-700">商品詳細描述</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          {/* Meetup locations */}
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-700">校園面交地點</label>
            <div className="flex flex-wrap gap-1.5">
              {meetupLocations.map((loc, idx) => (
                <span
                  key={idx}
                  className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1"
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

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="新增面交地點，如：校門口、學生餐廳..."
                className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
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
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold cursor-pointer"
              >
                新增
              </button>
            </div>
          </div>

          {/* Take Down / Delete Confirmation Alert */}
          {showDeleteConfirm && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl space-y-2 text-rose-950 animate-in fade-in">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>確定要下架並刪除《{product.title}》嗎？</span>
              </div>
              <p className="text-[11px] text-rose-800">
                下架後商品將自校園市集完全移除，買家將無法再搜尋或發送面交申請。
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  確定下架刪除
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl cursor-pointer"
                >
                  取消
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            {!showDeleteConfirm && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>下架此商品</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>儲存修改</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
