/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Camera, 
  Upload, 
  Check, 
  Sparkles, 
  User, 
  Smile, 
  CheckCircle2, 
  Save 
} from 'lucide-react';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_PRESETS = [
  {
    id: 'a1',
    label: '陽光資工系男生',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'a2',
    label: '氣質外語系女生',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'a3',
    label: '溫柔商學院男生',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'a4',
    label: '活潑大一女生',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'a5',
    label: '簡約設計系男生',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'a6',
    label: '知性文學院女生',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'a7',
    label: '俐落工學院女生',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'a8',
    label: '活力運動系男生',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
];

export const AvatarModal: React.FC<AvatarModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile } = useApp();
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateUserProfile({ avatar: selectedAvatar });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">管理個人頭像照片</h2>
              <p className="text-xs text-emerald-100">
                可上傳相片或挑選校園學生代表頭像
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

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* Live Preview */}
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="relative">
              <img
                src={selectedAvatar}
                alt="Avatar preview"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-500 shadow-md"
              />
              <span className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1.5 rounded-full shadow-md">
                <Check className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="mt-2 text-center">
              <div className="font-bold text-gray-900 text-sm">{currentUser.name}</div>
              <div className="text-[11px] text-gray-600">{currentUser.school}</div>
            </div>
          </div>

          {/* Upload Button */}
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-800 flex items-center justify-between">
              <span>上傳本機相片</span>
              <span className="text-[11px] text-gray-600">支援 JPG、PNG、WEBP</span>
            </label>
            <label className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-2 border-dashed border-emerald-300 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer transition">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>點此選取本機照片上傳</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Preset Avatars Grid */}
          <div className="space-y-2">
            <label className="font-semibold text-gray-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>挑選大專院校代表頭像 (點選即預覽)：</span>
            </label>
            <div className="grid grid-cols-4 gap-3">
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = selectedAvatar === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedAvatar(preset.url)}
                    className={`flex flex-col items-center p-2 rounded-2xl transition cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <span className="text-[10px] text-gray-700 mt-1.5 text-center truncate w-full">
                      {preset.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>儲存新頭像</span>
          </button>
        </div>
      </div>
    </div>
  );
};
