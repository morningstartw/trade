/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import { 
  Home, 
  Search, 
  PlusCircle, 
  MessageSquare, 
  User 
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, unreadNotificationsCount, conversations } = useApp();

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const totalBadge = unreadNotificationsCount + unreadMessagesCount;

  const navItems: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: '首頁', icon: Home },
    { id: 'explore', label: '探索搜尋', icon: Search },
    { id: 'post', label: '一鍵發布', icon: PlusCircle },
    { id: 'messages', label: '訊息通知', icon: MessageSquare },
    { id: 'profile', label: '個人中心', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-lg px-2 py-1 safe-area-pb">
      <div className="max-w-md md:max-w-xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          const isPost = item.id === 'post';

          if (isPost) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab('post')}
                className="group flex flex-col items-center relative -top-3 cursor-pointer focus:outline-hidden"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 active:scale-95 transition-transform border-4 border-white">
                  <PlusCircle className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-bold text-emerald-700 mt-0.5">
                  上架出清
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? 'text-emerald-600 font-bold scale-105'
                  : 'text-gray-600 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.id === 'messages' && totalBadge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalBadge > 9 ? '9+' : totalBadge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
