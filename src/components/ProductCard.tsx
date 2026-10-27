/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { CONDITIONS } from '../data/mockData';
import { 
  Heart, 
  MapPin, 
  Repeat, 
  Gift, 
  ShieldCheck, 
  Sparkles,
  Eye,
  MessageCircle
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, isFavorite, toggleFavorite, currentUser } = useApp();
  const favorited = isFavorite(product.id);
  const conditionMeta = CONDITIONS[product.condition] || CONDITIONS.good;
  const isSameSchool = currentUser.school === product.sellerSchool;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100/90 hover:border-emerald-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Image Thumbnail Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Status Overlay if Reserved / Sold */}
        {product.status !== 'available' && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${
              product.status === 'reserved' ? 'bg-amber-600' : 'bg-gray-800'
            }`}>
              {product.status === 'reserved' ? '🤝 預約中 (面交洽談)' : '🎉 交易完成'}
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {/* Transaction Type Tag */}
          {product.type === 'free' ? (
            <span className="flex items-center gap-1 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              <Gift className="w-3 h-3" />
              <span>免費贈送</span>
            </span>
          ) : product.type === 'exchange' ? (
            <span className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              <Repeat className="w-3 h-3" />
              <span>以物易物</span>
            </span>
          ) : (
            <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              現售出清
            </span>
          )}

          {/* Same school indicator */}
          {isSameSchool && (
            <span className="bg-blue-600/90 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-0.5 shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              <span>同校同學</span>
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={favorited ? '取消收藏' : '加入收藏'}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-700 hover:text-rose-500 hover:bg-white transition-all shadow-sm z-20 cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              favorited ? 'fill-rose-500 text-rose-500' : 'stroke-gray-600'
            }`}
          />
        </button>

        {/* Condition Tag at Bottom-Left of thumbnail */}
        <div className="absolute bottom-2 left-2 z-10">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border backdrop-blur-md shadow-xs ${conditionMeta.color} bg-white/90`}>
            {conditionMeta.label}
          </span>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Price or Exchange Notice */}
          <div className="flex items-baseline justify-between mb-1">
            <div className="flex items-baseline gap-1">
              {product.type === 'free' ? (
                <span className="text-base font-extrabold text-teal-600">
                  NT$ 0 (免費)
                </span>
              ) : (
                <>
                  <span className="text-xs font-semibold text-emerald-600">NT$</span>
                  <span className="text-lg font-black text-gray-900 tracking-tight">
                    {product.price.toLocaleString()}
                  </span>
                  {product.type === 'exchange' && (
                    <span className="text-[11px] text-amber-600 font-semibold ml-1">
                      (可談交換)
                    </span>
                  )}
                </>
              )}
            </div>
            
            {/* Question count */}
            {product.questions.length > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-gray-600 font-medium">
                <MessageCircle className="w-3 h-3 text-gray-600" />
                <span>{product.questions.length}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Footer Meta: School & Location */}
        <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-600">
          <div className="flex items-center gap-1 truncate max-w-[140px]">
            <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate font-medium">{product.sellerSchool}</span>
          </div>

          {/* Seller Verified Check */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="truncate max-w-[60px] text-gray-600">{product.sellerName}</span>
            {product.sellerVerified && (
              <span title="校園學生認證" className="inline-flex">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
