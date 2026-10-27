/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UNIVERSITIES, REGIONS } from '../data/mockData';
import { UniversityRegion } from '../types';
import { 
  GraduationCap, 
  MapPin, 
  Search, 
  ShieldCheck, 
  SlidersHorizontal, 
  ChevronDown,
  Bell,
  Sparkles,
  LogIn,
  UserPlus,
  LogOut,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    allUsers,
    switchUser,
    isLoggedIn,
    logout,
    setAuthModalOpen,
    setAuthModalTab,
    verificationModalOpen,
    setVerificationModalOpen,
    selectedRegionFilter,
    setSelectedRegionFilter,
    selectedSchoolFilter,
    setSelectedSchoolFilter,
    setActiveTab,
    setKeywordQuery,
    keywordQuery,
    unreadNotificationsCount,
    setAdminModalOpen,
  } = useApp();

  const [schoolDropdownOpen, setSchoolDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [dropdownRegion, setDropdownRegion] = useState<UniversityRegion>('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('explore');
  };

  const filteredDropdownSchools = UNIVERSITIES.filter((u) => {
    if (dropdownRegion === 'all') return true;
    return u.region === dropdownRegion;
  });

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 transition-shadow duration-200 shadow-xs">
      {/* Top Banner / Announcement */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs py-1.5 px-3 sm:px-4 font-medium flex items-center justify-between">
        <div className="flex items-center gap-1.5 truncate">
          <span className="bg-amber-400 text-gray-900 text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
            學生安全市集
          </span>
          <span className="truncate">
            🌱 全國大專院校二手教科書與好物交換｜同校免運面交｜實名在學身分審核
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isLoggedIn ? (
            <button
              onClick={() => setVerificationModalOpen(true)}
              className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md transition cursor-pointer font-bold ${
                currentUser.isVerified
                  ? 'bg-emerald-500/30 text-white hover:bg-emerald-500/50'
                  : 'bg-amber-400 text-gray-900 hover:bg-amber-300 animate-pulse'
              }`}
              title="驗證是否為大學生 / 查看學生認證狀態"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{currentUser.isVerified ? '學生證已認證' : '驗證大學生身分'}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthModalTab('login');
                setAuthModalOpen(true);
              }}
              className="flex items-center gap-1 text-[11px] bg-white/20 hover:bg-white/30 text-white font-semibold px-2.5 py-0.5 rounded-md transition cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>學生會員登入</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo and Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none group shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base sm:text-lg tracking-tight text-gray-900 group-hover:text-emerald-600 transition-colors">
                UniTrade
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded-full border border-emerald-200">
                校園二手
              </span>
            </div>
            <p className="text-[10px] text-gray-600 hidden md:block">
              二手教科書・生活用品・同校面交
            </p>
          </div>
        </div>

        {/* School & Region Selector Dropdown (PRD 6) */}
        <div className="relative">
          <button
            onClick={() => {
              setSchoolDropdownOpen(!schoolDropdownOpen);
              setUserDropdownOpen(false);
            }}
            className="flex items-center gap-1 sm:gap-1.5 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="max-w-[100px] sm:max-w-[140px] truncate">
              {selectedSchoolFilter === 'all'
                ? selectedRegionFilter === 'all'
                  ? '全台院校'
                  : `${REGIONS.find((r) => r.id === selectedRegionFilter)?.label}`
                : selectedSchoolFilter}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          </button>

          {/* Expanded Region & School Dropdown Menu */}
          {schoolDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="pb-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>學校與地區快捷篩選</span>
                </span>
                <button
                  onClick={() => {
                    setSelectedSchoolFilter('all');
                    setSelectedRegionFilter('all');
                    setSchoolDropdownOpen(false);
                  }}
                  className="text-[11px] text-emerald-700 hover:underline font-semibold cursor-pointer"
                >
                  查看全部
                </button>
              </div>

              {/* Regional Tabs */}
              <div className="flex items-center gap-1 pt-2 pb-2 overflow-x-auto scrollbar-none text-[11px]">
                {REGIONS.map((reg) => (
                  <button
                    key={reg.id}
                    onClick={() => {
                      setDropdownRegion(reg.id);
                      setSelectedRegionFilter(reg.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition cursor-pointer ${
                      dropdownRegion === reg.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {reg.label}
                  </button>
                ))}
              </div>

              {/* Universities List with Cities */}
              <div className="max-h-60 overflow-y-auto space-y-0.5 text-xs pt-1">
                <button
                  onClick={() => {
                    setSelectedSchoolFilter('all');
                    setSchoolDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition cursor-pointer ${
                    selectedSchoolFilter === 'all'
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>🏫 全台所有大專院校 (不限)</span>
                  {selectedSchoolFilter === 'all' && (
                    <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded">
                      選定
                    </span>
                  )}
                </button>

                {filteredDropdownSchools.map((uni) => {
                  const isSelected = uni.name === selectedSchoolFilter;
                  return (
                    <button
                      key={uni.id}
                      onClick={() => {
                        setSelectedSchoolFilter(uni.name);
                        setSchoolDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="truncate">
                        <span className="font-semibold">{uni.name}</span>
                        <span className="text-[10px] text-gray-600 ml-1.5">({uni.city})</span>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded shrink-0">
                          選定
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Search Bar (Desktop / Tablet) */}
        <form 
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-sm lg:max-w-md items-center relative"
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keywordQuery}
              onChange={(e) => setKeywordQuery(e.target.value)}
              placeholder="搜尋二手原文書、iPad、宿舍置物架、計算機..."
              className="w-full pl-9 pr-16 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-full focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-full transition cursor-pointer"
            >
              搜尋
            </button>
          </div>
        </form>

        {/* Right Actions: Member Auth / Profile / Verification */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Notifications button */}
          <button
            onClick={() => setActiveTab('messages')}
            className="relative p-2 rounded-xl text-gray-600 hover:text-emerald-600 hover:bg-gray-100 transition cursor-pointer"
            title="通知與訊息"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* If Logged In: User Profile & Switcher */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setSchoolDropdownOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 pr-2 rounded-2xl bg-gray-100 hover:bg-gray-200 transition border border-gray-200/60 cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-xl object-cover ring-1 ring-emerald-500"
                />
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-bold text-gray-900 flex items-center gap-1">
                    <span>{currentUser.name}</span>
                    {currentUser.isVerified ? (
                      <span title="已通過學生認證" className="inline-flex">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                      </span>
                    ) : (
                      <span title="尚未驗證身分" className="inline-flex">
                        <AlertCircle className="w-3 h-3 text-amber-500 inline" />
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-600 truncate max-w-[85px]">
                    {currentUser.role === 'admin' ? '系統管理員' : currentUser.school.replace('國立', '')}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-gray-600" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-1 py-1 border-b border-gray-100 mb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">{currentUser.name}</span>
                      {currentUser.isVerified ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                          在學生已認證
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                          待驗證
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-600">{currentUser.school}</div>
                  </div>

                  {/* Student verification shortcut */}
                  <button
                    onClick={() => {
                      setVerificationModalOpen(true);
                      setUserDropdownOpen(false);
                    }}
                    className="w-full mb-2 p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <span>校園在學生認證中心</span>
                  </button>

                  <div className="text-[11px] font-bold text-gray-700 px-1 mb-1">
                    切換測試帳號 (買賣雙方)：
                  </div>

                  <div className="space-y-1">
                    {allUsers.map((u) => {
                      const isCurrent = u.id === currentUser.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u.id);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl flex items-center gap-2 transition cursor-pointer ${
                            isCurrent ? 'bg-emerald-50 border border-emerald-200' : 'hover:bg-gray-50'
                          }`}
                        >
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-800 truncate">
                                {u.name}
                              </span>
                              {u.isVerified && (
                                <span className="text-[9px] text-emerald-600 font-bold">✓已認證</span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-600 truncate">{u.school}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setAdminModalOpen(true);
                        setUserDropdownOpen(false);
                      }}
                      className="text-purple-600 hover:text-purple-700 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>審查後台</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>登出</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out / Guest Mode: Show Login & Register Buttons (PRD 11) */
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setAuthModalTab('login');
                  setAuthModalOpen(true);
                }}
                className="text-xs font-bold px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl transition cursor-pointer"
              >
                登入
              </button>
              <button
                onClick={() => {
                  setAuthModalTab('register');
                  setAuthModalOpen(true);
                }}
                className="text-xs font-bold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>註冊</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
