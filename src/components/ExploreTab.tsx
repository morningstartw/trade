/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { CATEGORIES, UNIVERSITIES, CONDITIONS, REGIONS } from '../data/mockData';
import { ItemCategory, TransactionType, ItemCondition, UniversityRegion } from '../types';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  ArrowUpDown, 
  Filter, 
  Sparkles,
  MapPin,
  Check
} from 'lucide-react';

type SortOption = 'latest' | 'price_asc' | 'price_desc' | 'popular';

export const ExploreTab: React.FC = () => {
  const {
    products,
    keywordQuery,
    setKeywordQuery,
    categoryFilter,
    setCategoryFilter,
    typeFilter,
    setTypeFilter,
    selectedRegionFilter,
    setSelectedRegionFilter,
    selectedSchoolFilter,
    setSelectedSchoolFilter,
    currentUser,
  } = useApp();

  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<ItemCondition | 'all'>('all');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Keyword search (title + description + school)
      if (keywordQuery.trim()) {
        const query = keywordQuery.toLowerCase();
        const inTitle = p.title.toLowerCase().includes(query);
        const inDesc = p.description.toLowerCase().includes(query);
        const inSchool = p.sellerSchool.toLowerCase().includes(query);
        if (!inTitle && !inDesc && !inSchool) return false;
      }

      // 2. Category
      if (categoryFilter !== 'all' && p.category !== categoryFilter) {
        return false;
      }

      // 3. Transaction Type (sell, exchange, free)
      if (typeFilter !== 'all' && p.type !== typeFilter) {
        return false;
      }

      // 4. University School & Region Filter
      if (selectedSchoolFilter !== 'all' && p.sellerSchool !== selectedSchoolFilter) {
        return false;
      }

      if (selectedRegionFilter !== 'all') {
        const uni = UNIVERSITIES.find((u) => u.name === p.sellerSchool);
        if (uni && uni.region !== selectedRegionFilter) {
          return false;
        }
      }

      // 5. Condition
      if (selectedCondition !== 'all' && p.condition !== selectedCondition) {
        return false;
      }

      // 6. Price Range
      const parsedMin = minPrice !== '' ? Number(minPrice) : null;
      const parsedMax = maxPrice !== '' ? Number(maxPrice) : null;

      if (parsedMin !== null && !isNaN(parsedMin)) {
        if (p.price < parsedMin) return false;
      }
      if (parsedMax !== null && !isNaN(parsedMax)) {
        if (p.price > parsedMax) return false;
      }

      return true;
    });
  }, [
    products,
    keywordQuery,
    categoryFilter,
    typeFilter,
    selectedRegionFilter,
    selectedSchoolFilter,
    selectedCondition,
    minPrice,
    maxPrice,
  ]);

  // Sort logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'latest':
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'price_asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return list.sort((a, b) => b.price - a.price);
      case 'popular':
        return list.sort((a, b) => b.likes + b.views - (a.likes + a.views));
      default:
        return list;
    }
  }, [filteredProducts, sortBy]);

  const handlePriceChange = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
    if (min !== '' && max !== '' && Number(min) > Number(max)) {
      setPriceError('最低價格不可大於最高價格');
    } else {
      setPriceError(null);
    }
  };

  const clearAllFilters = () => {
    setKeywordQuery('');
    setCategoryFilter('all');
    setTypeFilter('all');
    setSelectedRegionFilter('all');
    setSelectedSchoolFilter('all');
    setSelectedCondition('all');
    setMinPrice('');
    setMaxPrice('');
    setPriceError(null);
  };

  const hasActiveFilters =
    keywordQuery !== '' ||
    categoryFilter !== 'all' ||
    typeFilter !== 'all' ||
    selectedRegionFilter !== 'all' ||
    selectedSchoolFilter !== 'all' ||
    selectedCondition !== 'all' ||
    minPrice !== '' ||
    maxPrice !== '';

  const activeRegionSchools = UNIVERSITIES.filter((u) => {
    if (selectedRegionFilter === 'all') return true;
    return u.region === selectedRegionFilter;
  });

  return (
    <div className="space-y-5 pb-24">
      {/* Search Bar & Quick Toggles */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={keywordQuery}
            onChange={(e) => setKeywordQuery(e.target.value)}
            placeholder="搜尋商品名稱、教材原文書、型號、學校或面交地..."
            className="w-full pl-11 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
          {keywordQuery && (
            <button
              onClick={() => setKeywordQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 學校與地區篩選 */}
        <div className="pt-1 pb-1 border-t border-gray-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-800 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>學校與地區篩選</span>
            </span>

            {/* Same school quick lock */}
            <button
              onClick={() => {
                setSelectedSchoolFilter(currentUser.school);
                const matchUni = UNIVERSITIES.find((u) => u.name === currentUser.school);
                if (matchUni) setSelectedRegionFilter(matchUni.region);
              }}
              className="text-[11px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 font-bold px-2 py-0.5 rounded-lg transition cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>同校面交：{currentUser.school}</span>
            </button>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {REGIONS.map((reg) => {
              const isSelected = selectedRegionFilter === reg.id;
              return (
                <button
                  key={reg.id}
                  onClick={() => {
                    setSelectedRegionFilter(reg.id);
                    if (selectedSchoolFilter !== 'all') {
                      const matchUni = UNIVERSITIES.find((u) => u.name === selectedSchoolFilter);
                      if (matchUni && reg.id !== 'all' && matchUni.region !== reg.id) {
                        setSelectedSchoolFilter('all');
                      }
                    }
                  }}
                  className={`text-xs px-3 py-1 rounded-xl font-bold shrink-0 transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {reg.label}
                </button>
              );
            })}
          </div>

          {/* University quick chips under this region */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <button
              onClick={() => setSelectedSchoolFilter('all')}
              className={`px-2.5 py-1 rounded-lg shrink-0 transition cursor-pointer ${
                selectedSchoolFilter === 'all'
                  ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              不限特定學校
            </button>
            {activeRegionSchools.map((uni) => {
              const isSelected = selectedSchoolFilter === uni.name;
              return (
                <button
                  key={uni.id}
                  onClick={() => setSelectedSchoolFilter(uni.name)}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 border border-gray-200'
                  }`}
                >
                  {uni.short} ({uni.city})
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-gray-100">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`text-xs px-3 py-1.5 rounded-full font-medium shrink-0 transition cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部類別
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium shrink-0 transition cursor-pointer ${
                categoryFilter === c.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Sub-bar: Type selector + Filter trigger + Sorting */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap text-xs">
          {/* Transaction Type Filters */}
          <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                typeFilter === 'all' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600'
              }`}
            >
              不限方式
            </button>
            <button
              onClick={() => setTypeFilter('sell')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                typeFilter === 'sell' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600'
              }`}
            >
              現售出清
            </button>
            <button
              onClick={() => setTypeFilter('exchange')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                typeFilter === 'exchange' ? 'bg-white text-amber-700 shadow-xs' : 'text-gray-600'
              }`}
            >
              以物易物
            </button>
            <button
              onClick={() => setTypeFilter('free')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                typeFilter === 'free' ? 'bg-white text-teal-700 shadow-xs' : 'text-gray-600'
              }`}
            >
              免費贈送
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Drawer Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                hasActiveFilters
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>進階篩選</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="排序依據"
                className="text-xs bg-transparent border-none text-gray-700 font-semibold focus:outline-hidden cursor-pointer"
              >
                <option value="latest">最新上架</option>
                <option value="price_asc">價格：由低到高</option>
                <option value="price_desc">價格：由高到低</option>
                <option value="popular">熱門收藏排行</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel (Collapsible / Drawer) */}
      {mobileFilterOpen && (
        <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-md space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
              <Filter className="w-4 h-4 text-emerald-600" />
              <span>進階篩選條件</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearAllFilters}
                className="text-xs text-gray-600 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>重設所有條件</span>
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-gray-600 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* School Filter */}
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>學校篩選 (同校面交優先)</span>
              </label>
              <select
                value={selectedSchoolFilter}
                onChange={(e) => setSelectedSchoolFilter(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="all">全台所有大專院校 (不拘)</option>
                {UNIVERSITIES.filter((u) => u.id !== 'all').map((uni) => (
                  <option key={uni.id} value={uni.name}>
                    {uni.name} ({uni.short})
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">
                價格區間 (NT$)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="最低"
                  value={minPrice}
                  onChange={(e) => handlePriceChange(e.target.value, maxPrice)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <span className="text-gray-600">~</span>
                <input
                  type="number"
                  min="0"
                  placeholder="最高"
                  value={maxPrice}
                  onChange={(e) => handlePriceChange(minPrice, e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              {priceError && (
                <p className="text-[11px] text-rose-600 font-medium">{priceError}</p>
              )}
            </div>

            {/* Condition Filter */}
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">新舊程度成色</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value as ItemCondition | 'all')}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="all">不限新舊成色</option>
                {Object.entries(CONDITIONS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label} ({item.badge})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-gray-600">已套用篩選：</span>
          {keywordQuery && (
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
              關鍵字: {keywordQuery}
              <button onClick={() => setKeywordQuery('')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {categoryFilter !== 'all' && (
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
              分類: {CATEGORIES.find((c) => c.id === categoryFilter)?.label}
              <button onClick={() => setCategoryFilter('all')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedSchoolFilter !== 'all' && (
            <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
              學校: {selectedSchoolFilter}
              <button onClick={() => setSelectedSchoolFilter('all')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {typeFilter !== 'all' && (
            <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
              方式: {typeFilter === 'sell' ? '現售' : typeFilter === 'exchange' ? '以物易物' : '免費贈送'}
              <button onClick={() => setTypeFilter('all')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="bg-gray-100 text-gray-800 border border-gray-300 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
              金額: NT${minPrice || '0'} ~ {maxPrice || '無上限'}
              <button onClick={() => { setMinPrice(''); setMaxPrice(''); }} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-emerald-600 hover:text-emerald-700 font-semibold underline text-xs cursor-pointer ml-1"
          >
            清除全部
          </button>
        </div>
      )}

      {/* Results Count Header */}
      <div className="flex items-center justify-between text-xs text-gray-600 px-1">
        <div>
          找到 <span className="font-bold text-gray-900 text-sm">{sortedProducts.length}</span> 件符合的校園二手好物
        </div>
      </div>

      {/* Product List Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State per UI/UX.md 5.1 */
        <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900">
              找不到符合條件的商品
            </h3>
            <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
              試試看更換其他關鍵字、擴大價格範圍，或是取消特定的學校與分類篩選條件。
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={clearAllFilters}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>清除所有篩選條件</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
