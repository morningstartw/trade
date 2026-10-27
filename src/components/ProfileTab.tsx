/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { ItemStatus, Product } from '../types';
import { AvatarModal } from './AvatarModal';
import { EditProductModal } from './EditProductModal';
import { 
  User, 
  ShieldCheck, 
  Star, 
  Package, 
  Heart, 
  History, 
  Edit3, 
  Trash2, 
  Plus, 
  GraduationCap, 
  AlertCircle,
  SlidersHorizontal,
  Camera,
  CheckCircle2,
  Clock,
  Sparkles,
  Tag,
  AlertTriangle,
  X
} from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    products,
    updateProductStatus,
    deleteProduct,
    favorites,
    transactionRecords,
    setActiveTab,
    setAdminModalOpen,
    isLoggedIn,
    setAuthModalOpen,
    setAuthModalTab,
    setVerificationModalOpen,
  } = useApp();

  const [activeSegment, setActiveSegment] = useState<'selling' | 'favorites' | 'history'>('selling');
  const [sellingFilterStatus, setSellingFilterStatus] = useState<ItemStatus>('available');

  // Modals state
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProductModalOpen, setEditProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);

  // Profile text state
  const [editName, setEditName] = useState(currentUser.name);
  const [editBio, setEditBio] = useState(currentUser.bio || '');
  const [editDept, setEditDept] = useState(currentUser.department);

  // Current user's products
  const myProducts = products.filter((p) => p.sellerId === currentUser.id);
  const myFilteredProducts = myProducts.filter((p) => p.status === sellingFilterStatus);

  // Favorited products
  const favoritedProducts = products.filter((p) => favorites.includes(p.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName.trim(),
      bio: editBio.trim(),
      department: editDept.trim(),
    });
    setIsEditingProfile(false);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmProduct) {
      deleteProduct(deleteConfirmProduct.id);
      setDeleteConfirmProduct(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">請先登入或註冊大專院校會員</h2>
        <p className="text-xs text-gray-600">
          登入後即可管理頭像、上架及修改您的校園二手商品、隨時標示預約與交易狀態。
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

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-6">
      {/* User Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Avatar with Camera Overlay */}
          <div className="relative group shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-emerald-100 shadow-md group-hover:opacity-90 transition"
            />
            <button
              onClick={() => setAvatarModalOpen(true)}
              className="absolute inset-0 bg-black/40 text-white rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer"
              title="點擊更換或自訂頭像"
            >
              <Camera className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-bold">更換頭像</span>
            </button>
            {currentUser.isVerified && (
              <div 
                className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow-md"
                title="校園在學生官方認證"
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-xl font-black text-gray-900">{currentUser.name}</h1>
                {currentUser.isVerified ? (
                  <button
                    onClick={() => setVerificationModalOpen(true)}
                    className="flex items-center gap-1 bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 hover:bg-emerald-100 transition cursor-pointer"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>在學生認證 (查看證書)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setVerificationModalOpen(true)}
                    className="text-xs bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold px-2.5 py-0.5 rounded-full shadow-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>點擊認證大學生身分</span>
                  </button>
                )}
              </div>

              {/* Action Buttons: Avatar, Edit Profile, Admin */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <button
                  onClick={() => setAvatarModalOpen(true)}
                  className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl transition flex items-center gap-1.5 border border-emerald-200 cursor-pointer"
                  title="管理並更換個人頭像"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  <span>管理頭像</span>
                </button>

                <button
                  onClick={() => {
                    setEditName(currentUser.name);
                    setEditBio(currentUser.bio || '');
                    setEditDept(currentUser.department);
                    setIsEditingProfile(true);
                  }}
                  className="text-xs font-semibold px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>編輯檔案</span>
                </button>

                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setAdminModalOpen(true)}
                    className="text-xs font-bold px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>管理員後台</span>
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs font-medium text-emerald-800 flex items-center justify-center sm:justify-start gap-1">
              <span>{currentUser.school}</span>
              <span>•</span>
              <span>{currentUser.department}</span>
              {currentUser.studentId && (
                <>
                  <span>•</span>
                  <span className="font-mono text-gray-700">學號：{currentUser.studentId}</span>
                </>
              )}
            </p>

            <p className="text-xs text-gray-600 max-w-xl">
              {currentUser.bio || '這個同學很低調，尚未填寫自我介紹～'}
            </p>

            {/* Quick Stats: Rating, Sold count */}
            <div className="flex items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-gray-900">{currentUser.rating}</span>
                <span>({currentUser.ratingCount} 筆真實評價)</span>
              </div>
              <div className="border-l border-gray-200 pl-4">
                <span>上架物品：</span>
                <span className="font-bold text-gray-900">{myProducts.length} 件</span>
              </div>
              <div className="border-l border-gray-200 pl-4">
                <span>加入平台：</span>
                <span className="font-bold text-gray-900">{currentUser.joinDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification banner if unverified */}
        {!currentUser.isVerified && (
          <div className="mt-4 p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-950">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                <strong>尚未完成大學生身分認證</strong>：認證後可享有同校學生專屬面交保障與藍色官方徽章！
              </span>
            </div>
            <button
              onClick={() => setVerificationModalOpen(true)}
              className="text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold px-3.5 py-1.5 rounded-xl cursor-pointer shrink-0 shadow-xs"
            >
              立刻前往認證中心
            </button>
          </div>
        )}
      </div>

      {/* Navigation Segments */}
      <div className="bg-white rounded-2xl p-1.5 border border-gray-100 shadow-xs flex items-center justify-between gap-1">
        <button
          onClick={() => setActiveSegment('selling')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSegment === 'selling'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>我的賣場 ({myProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveSegment('favorites')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSegment === 'favorites'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>收藏清單 ({favoritedProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveSegment('history')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSegment === 'history'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>歷史交易紀錄 ({transactionRecords.length})</span>
        </button>
      </div>

      {/* Segment 1: Selling Management (Edit, Take Down, Status Toggle) */}
      {activeSegment === 'selling' && (
        <div className="space-y-4">
          {/* Sub-status filter pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSellingFilterStatus('available')}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  sellingFilterStatus === 'available'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>上架中 ({myProducts.filter((p) => p.status === 'available').length})</span>
              </button>

              <button
                onClick={() => setSellingFilterStatus('reserved')}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  sellingFilterStatus === 'reserved'
                    ? 'bg-amber-50 text-amber-800 border border-amber-300 shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>預約中 ({myProducts.filter((p) => p.status === 'reserved').length})</span>
              </button>

              <button
                onClick={() => setSellingFilterStatus('sold')}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  sellingFilterStatus === 'sold'
                    ? 'bg-slate-100 text-slate-800 border border-slate-300 shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>交易完成 ({myProducts.filter((p) => p.status === 'sold').length})</span>
              </button>
            </div>

            <button
              onClick={() => setActiveTab('post')}
              className="text-xs bg-emerald-600 text-white font-bold px-3.5 py-1.5 rounded-xl shadow-xs hover:bg-emerald-700 transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>發布新商品</span>
            </button>
          </div>

          {/* List of my products with Action Controls */}
          {myFilteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myFilteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-xs flex flex-col justify-between gap-3 relative hover:shadow-sm transition"
                >
                  <div className="flex gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                      {product.images.length > 1 && (
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 py-0.5 rounded font-mono">
                          {product.images.length}P
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        {/* Top status & price badge */}
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-bold text-emerald-600">
                            {product.type === 'free' ? '免費贈送' : `NT$ ${product.price}`}
                          </span>

                          {/* Current Status Badge */}
                          {product.status === 'available' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              上架中
                            </span>
                          )}
                          {product.status === 'reserved' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1">
                              <span>🤝</span>
                              預約中
                            </span>
                          )}
                          {product.status === 'sold' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1">
                              <span>🎉</span>
                              交易完成
                            </span>
                          )}
                        </div>

                        <h3 className="text-xs font-bold text-gray-900 truncate" title={product.title}>
                          {product.title}
                        </h3>

                        <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                            {product.category}
                          </span>
                          <span>•</span>
                          <span>{product.condition}</span>
                          <span>•</span>
                          <span>👁️ {product.views}</span>
                          <span>❤️ {product.likes}</span>
                        </div>

                        <p className="text-[10px] text-gray-600 truncate mt-1">
                          面交地點：{product.meetupLocations[0] || '校內面交'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3-State Status Labeling Switcher */}
                  <div className="bg-gray-50 rounded-xl p-2 border border-gray-100">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="text-gray-500 font-medium flex items-center gap-1">
                        <Tag className="w-3 h-3 text-emerald-600" />
                        標示商品狀態：
                      </span>
                      <span className="text-[10px] text-gray-600">隨時切換即時同步</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateProductStatus(product.id, 'available')}
                        className={`py-1.5 text-[11px] font-bold rounded-lg transition flex items-center justify-center gap-1 cursor-pointer ${
                          product.status === 'available'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-800'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${product.status === 'available' ? 'bg-white' : 'bg-emerald-500'}`}></span>
                        <span>上架中</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateProductStatus(product.id, 'reserved')}
                        className={`py-1.5 text-[11px] font-bold rounded-lg transition flex items-center justify-center gap-1 cursor-pointer ${
                          product.status === 'reserved'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-amber-50 hover:text-amber-800'
                        }`}
                      >
                        <span>🤝</span>
                        <span>預約中</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateProductStatus(product.id, 'sold')}
                        className={`py-1.5 text-[11px] font-bold rounded-lg transition flex items-center justify-center gap-1 cursor-pointer ${
                          product.status === 'sold'
                            ? 'bg-slate-700 text-white shadow-xs'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <span>🎉</span>
                        <span>交易完成</span>
                      </button>
                    </div>
                  </div>

                  {/* Operational Action Bar: Edit & Take Down */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setEditProductModalOpen(true);
                      }}
                      className="flex-1 py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-gray-600" />
                      <span>修改商品資訊</span>
                    </button>

                    <button
                      onClick={() => setDeleteConfirmProduct(product)}
                      className="py-1.5 px-3 border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                      title="下架商品"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>下架商品</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 space-y-3">
              <Package className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="text-xs font-bold text-gray-800">
                此狀態下目前沒有任何商品
              </h3>
              <p className="text-[11px] text-gray-600">
                出清宿舍閒置二手物品，或將狀態調整為上架中以開放同校同學洽談！
              </p>
            </div>
          )}
        </div>
      )}

      {/* Segment 2: Favorites / Wishlist */}
      {activeSegment === 'favorites' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-600 px-1">
            <span>已收藏 {favoritedProducts.length} 件心儀的校園好物</span>
          </div>

          {favoritedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {favoritedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 space-y-3">
              <Heart className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="text-xs font-bold text-gray-800">
                目前還沒有收藏任何商品
              </h3>
              <p className="text-[11px] text-gray-600">
                快去探索熱門課本或生活雜物，點擊愛心收藏吧！
              </p>
              <button
                onClick={() => setActiveTab('explore')}
                className="text-xs bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                探索尋寶
              </button>
            </div>
          )}
        </div>
      )}

      {/* Segment 3: Transaction Records */}
      {activeSegment === 'history' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <History className="w-4 h-4 text-emerald-600" />
              <span>歷史交易紀錄</span>
            </h2>
            <span className="text-xs text-gray-600">共 {transactionRecords.length} 筆已完成紀錄</span>
          </div>

          <div className="divide-y divide-gray-100">
            {transactionRecords.map((record) => (
              <div key={record.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={record.productImage}
                    alt={record.productTitle}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      record.role === 'seller' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {record.role === 'seller' ? '我售出' : '我購買'}
                    </span>
                    <h3 className="font-bold text-gray-900 mt-0.5">{record.productTitle}</h3>
                    <p className="text-[10px] text-gray-600">
                      交易對象：{record.counterpartName} • {record.completedAt} 完成
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-sm text-gray-900">
                    NT$ {record.price}
                  </div>
                  {record.rated && (
                    <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[10px] justify-end mt-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{record.ratingScore}.0 五星評價</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Avatar Modal */}
      <AvatarModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        product={editingProduct}
        isOpen={editProductModalOpen}
        onClose={() => {
          setEditProductModalOpen(false);
          setEditingProduct(null);
        }}
      />

      {/* Delete / Take Down Confirmation Modal */}
      {deleteConfirmProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-gray-900">確認下架並刪除商品？</h3>
              <p className="text-xs text-gray-600">
                下架後該商品將從校園市集完全移除，買家將無法再搜尋或瀏覽。
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-3 flex items-center gap-3 border border-gray-100">
              <img
                src={deleteConfirmProduct.images[0]}
                alt={deleteConfirmProduct.title}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-gray-900 truncate">
                  {deleteConfirmProduct.title}
                </h4>
                <p className="text-xs font-extrabold text-emerald-600">
                  {deleteConfirmProduct.type === 'free' ? '免費贈送' : `NT$ ${deleteConfirmProduct.price}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteConfirmProduct(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                保留商品
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-rose-600/20 cursor-pointer"
              >
                確認下架刪除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Info Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">編輯個人資料</h2>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">顯示姓名/暱稱</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">所屬系所年級</label>
                <input
                  type="text"
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">個人簡介 / 常見面交習慣</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="例如：平日白天可在管院或總圖面交，物品皆保持良好～"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 cursor-pointer shadow-sm"
                >
                  儲存變更
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
