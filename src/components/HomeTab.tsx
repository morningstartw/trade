/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { ProductCard } from './ProductCard';
import { ItemCategory, TransactionType } from '../types';
import { 
  Sparkles, 
  MapPin, 
  BookOpen, 
  Laptop, 
  Coffee, 
  Armchair, 
  Shirt, 
  PenTool, 
  Bike, 
  ArrowRight,
  TrendingUp,
  Gift,
  Repeat,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Laptop,
  Coffee,
  Armchair,
  Shirt,
  PenTool,
  Bike,
  Sparkles,
};

export const HomeTab: React.FC = () => {
  const { 
    products, 
    currentUser, 
    selectedSchoolFilter, 
    setSelectedSchoolFilter,
    setActiveTab, 
    setCategoryFilter,
    setTypeFilter,
    setKeywordQuery
  } = useApp();

  const [activeTypeTab, setActiveTypeTab] = useState<TransactionType | 'all'>('all');

  // Filter products by selected university (or all) & transaction type
  const schoolFilteredProducts = products.filter((p) => {
    if (selectedSchoolFilter !== 'all' && p.sellerSchool !== selectedSchoolFilter) {
      return false;
    }
    if (activeTypeTab !== 'all' && p.type !== activeTypeTab) {
      return false;
    }
    return true;
  });

  // Same-school items for current logged-in user
  const sameSchoolProducts = products.filter(
    (p) => p.sellerSchool === currentUser.school && p.sellerId !== currentUser.id
  );

  const handleCategoryClick = (catId: ItemCategory) => {
    setCategoryFilter(catId);
    setActiveTab('explore');
  };

  const handleQuickSearch = (keyword: string) => {
    setKeywordQuery(keyword);
    setActiveTab('explore');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Campus Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>開學與畢業季 二手教材出清專題</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            同校當面交，<br />
            省下運費更安心。
          </h1>

          <p className="text-sm text-emerald-100/90 leading-relaxed">
            教科書、工程計算機、宿舍電器、筆記神器——全台各大專院校學生實名驗證，杜絕詐騙！
          </p>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => handleQuickSearch('微積分')}
              className="text-xs bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full backdrop-blur-xs transition border border-white/20 font-medium cursor-pointer"
            >
              📚 微積分課本
            </button>
            <button
              onClick={() => handleQuickSearch('iPad')}
              className="text-xs bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full backdrop-blur-xs transition border border-white/20 font-medium cursor-pointer"
            >
              📱 iPad筆記神器
            </button>
            <button
              onClick={() => {
                setTypeFilter('exchange');
                setActiveTab('explore');
              }}
              className="text-xs bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold px-3 py-1.5 rounded-full transition shadow-md cursor-pointer flex items-center gap-1"
            >
              <Repeat className="w-3 h-3" />
              以物易物專區
            </button>
            <button
              onClick={() => {
                setTypeFilter('free');
                setActiveTab('explore');
              }}
              className="text-xs bg-teal-400 hover:bg-teal-300 text-gray-950 font-bold px-3 py-1.5 rounded-full transition shadow-md cursor-pointer flex items-center gap-1"
            >
              <Gift className="w-3 h-3" />
              免費贈送好物
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Campus Trust Banner */}
      <div className="grid grid-cols-3 gap-2 bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3 text-center">
        <div className="flex flex-col items-center justify-center p-1">
          <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
          <span className="text-xs font-bold text-gray-800">校園信箱認證</span>
          <span className="text-[10px] text-gray-600">.edu 學生驗證安心交易</span>
        </div>
        <div className="flex flex-col items-center justify-center p-1 border-x border-emerald-200/60">
          <MapPin className="w-5 h-5 text-emerald-600 mb-1" />
          <span className="text-xs font-bold text-gray-800">校內景點面交</span>
          <span className="text-[10px] text-gray-600">總圖、活大、學餐一手交錢貨</span>
        </div>
        <div className="flex flex-col items-center justify-center p-1">
          <Repeat className="w-5 h-5 text-amber-600 mb-1" />
          <span className="text-xs font-bold text-gray-800">以物易物互惠</span>
          <span className="text-[10px] text-gray-600">課本換生活用品免花錢</span>
        </div>
      </div>

      {/* Category Icons Carousel / Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
            <span>熱門分類</span>
            <span className="text-xs font-normal text-gray-600">Campus Categories</span>
          </h2>
          <button
            onClick={() => {
              setCategoryFilter('all');
              setActiveTab('explore');
            }}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 cursor-pointer"
          >
            <span>全部探索</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {CATEGORIES.map((cat) => {
            const IconComponent = CATEGORY_ICONS[cat.icon] || Sparkles;
            const categoryProductCount = products.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group flex flex-col items-center p-2.5 rounded-2xl bg-white border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors mb-1.5">
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-gray-700 group-hover:text-emerald-700 truncate w-full text-center">
                  {cat.label}
                </span>
                <span className="text-[10px] text-gray-600">
                  {categoryProductCount} 件
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Same School Spotlight (if any available from current student's school) */}
      {sameSchoolProducts.length > 0 && (
        <section className="bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-blue-50/60 p-4 sm:p-5 rounded-3xl border border-emerald-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-base font-bold text-gray-900">
                  {currentUser.school} 同校面交專區
                </h2>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                  免出校門
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                你的同學正在出清的二手物品，下課即可直接約圖書館或學餐面交！
              </p>
            </div>
            
            <button
              onClick={() => {
                setSelectedSchoolFilter(currentUser.school);
                setActiveTab('explore');
              }}
              className="text-xs font-semibold text-emerald-700 hover:underline shrink-0 cursor-pointer"
            >
              查看全部同校 ({sameSchoolProducts.length})
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {sameSchoolProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Listings & Quick Type Filter */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-gray-900">
              {selectedSchoolFilter === 'all' ? '最新全台校園上架' : `${selectedSchoolFilter} 最新刊登`}
            </h2>
            <span className="text-xs text-gray-600">({schoolFilteredProducts.length} 件商品)</span>
          </div>

          {/* Quick Pill Filter for Sale, Exchange, Free */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTypeTab('all')}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition cursor-pointer shrink-0 ${
                activeTypeTab === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              全部好物
            </button>
            <button
              onClick={() => setActiveTypeTab('sell')}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition cursor-pointer shrink-0 ${
                activeTypeTab === 'sell'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              💰 出售出清
            </button>
            <button
              onClick={() => setActiveTypeTab('exchange')}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition cursor-pointer shrink-0 ${
                activeTypeTab === 'exchange'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🔄 以物易物
            </button>
            <button
              onClick={() => setActiveTypeTab('free')}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition cursor-pointer shrink-0 ${
                activeTypeTab === 'free'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🎁 免費贈送
            </button>
          </div>
        </div>

        {/* Double-column Grid as defined in UI/UX.md 2.1 */}
        {schoolFilteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {schoolFilteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State per UI/UX.md 5.1 */
          <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-800">
              該學校或分類目前暫無相關商品
            </h3>
            <p className="text-xs text-gray-600 max-w-sm mx-auto">
              成為這所學校的第一個上架者吧！出清你的閒置二手課本或生活雜物。
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={() => {
                  setSelectedSchoolFilter('all');
                  setActiveTypeTab('all');
                }}
                className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-4 py-2 rounded-xl hover:bg-emerald-100 transition cursor-pointer"
              >
                切換回全台學校
              </button>
              <button
                onClick={() => setActiveTab('post')}
                className="text-xs bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-emerald-700 transition cursor-pointer"
              >
                立即上架出清
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
