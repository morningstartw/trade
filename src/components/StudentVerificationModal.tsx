/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UNIVERSITIES } from '../data/mockData';
import { 
  X, 
  GraduationCap, 
  ShieldCheck, 
  Mail, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  Upload, 
  Camera, 
  Building2, 
  KeyRound,
  FileCheck2,
  RefreshCw
} from 'lucide-react';

const SAMPLE_STUDENT_CARDS = [
  {
    school: '國立臺灣大學',
    label: '台大學生證 (樣本)',
    studentId: 'B11209045',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
  },
  {
    school: '國立清華大學',
    label: '清大學生證 (樣本)',
    studentId: '111012019',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
  },
  {
    school: '逢甲大學',
    label: '逢甲學生證 (樣本)',
    studentId: 'D1248902',
    url: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=80',
  },
];

export const StudentVerificationModal: React.FC = () => {
  const {
    verificationModalOpen,
    setVerificationModalOpen,
    currentUser,
    verifyStudentStatus,
  } = useApp();

  const [activeMethod, setActiveMethod] = useState<'edu_email' | 'student_id_card'>('edu_email');

  // Email method state
  const [eduEmail, setEduEmail] = useState(currentUser.email.includes('edu.tw') ? currentUser.email : '');
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [generatedCode, setGeneratedCode] = useState('839201');
  const [enteredCode, setEnteredCode] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  // Student ID card method state
  const [cardSchool, setCardSchool] = useState(currentUser.school);
  const [cardStudentId, setCardStudentId] = useState(currentUser.studentId || '');
  const [cardDept, setCardDept] = useState(currentUser.department || '');
  const [cardImage, setCardImage] = useState<string>(SAMPLE_STUDENT_CARDS[0].url);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  // Success state
  const [successAnimation, setSuccessAnimation] = useState(false);

  if (!verificationModalOpen) return null;

  // Handle Send Email Code
  const handleSendCode = () => {
    if (!eduEmail.trim().toLowerCase().includes('edu.tw')) {
      setEmailError('請輸入含有 .edu.tw 的大專院校學生官方信箱');
      return;
    }
    setEmailError(null);
    setCodeSent(true);
    setCountdown(60);
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(randomCode);

    // countdown interval simulation
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle Submit Email Verification
  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduEmail.trim().toLowerCase().includes('edu.tw')) {
      setEmailError('請輸入含有 .edu.tw 的大專院校信箱');
      return;
    }
    if (enteredCode.trim() !== generatedCode) {
      setEmailError(`驗證碼不正確，請輸入模擬驗證碼：${generatedCode}`);
      return;
    }

    setSuccessAnimation(true);
    setTimeout(() => {
      verifyStudentStatus('edu_email', {
        email: eduEmail.trim(),
        verificationCode: enteredCode.trim(),
      });
      setSuccessAnimation(false);
      setVerificationModalOpen(false);
    }, 900);
  };

  // Handle Submit Student ID Card Verification
  const handleSubmitCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardStudentId.trim()) {
      setCardError('請填寫學生學號');
      return;
    }
    if (!cardDept.trim()) {
      setCardError('請填寫就讀系所年級');
      return;
    }

    setIsOcrProcessing(true);
    setCardError(null);

    // Simulate AI / OCR smart validation on student ID
    setTimeout(() => {
      setIsOcrProcessing(false);
      setSuccessAnimation(true);
      setTimeout(() => {
        verifyStudentStatus('student_id_card', {
          school: cardSchool,
          studentId: cardStudentId.trim(),
          proofImage: cardImage,
        });
        setSuccessAnimation(false);
        setVerificationModalOpen(false);
      }, 900);
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCardImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">校園在學大學生身分認證中心</h2>
                <span className="text-[10px] bg-amber-400 text-gray-900 font-extrabold px-2 py-0.5 rounded-full">
                  實名核身
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                驗證是否為大學生｜守護同校面交安全｜杜絕校外詐騙
              </p>
            </div>
          </div>

          <button
            onClick={() => setVerificationModalOpen(false)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Verification Status Bar */}
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500"
            />
            <div>
              <div className="font-bold text-gray-900 flex items-center gap-1.5">
                <span>{currentUser.name}</span>
                {currentUser.isVerified ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>已認證在學生</span>
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>尚未認證 (訪客學生)</span>
                  </span>
                )}
              </div>
              <div className="text-[11px] text-gray-600">
                {currentUser.school} • {currentUser.department}
              </div>
            </div>
          </div>

          {currentUser.isVerified && (
            <div className="text-right text-[10px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
              <div>✓ 官方效期至畢業年</div>
              <div>學號：{currentUser.studentId || 'B10902045'}</div>
            </div>
          )}
        </div>

        {/* Verification Method Tabs */}
        <div className="px-5 pt-3 bg-white flex items-center gap-2 border-b border-gray-200 text-xs">
          <button
            onClick={() => setActiveMethod('edu_email')}
            className={`pb-2.5 font-bold flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeMethod === 'edu_email'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>方式一：學校信箱認證 (.edu.tw)</span>
          </button>

          <button
            onClick={() => setActiveMethod('student_id_card')}
            className={`pb-2.5 font-bold flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeMethod === 'student_id_card'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>方式二：學生證/在學證件審查</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Method 1: EDU EMAIL */}
          {activeMethod === 'edu_email' && (
            <form onSubmit={handleSubmitEmail} className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-gray-800 flex items-center justify-between">
                  <span>台灣大專院校學生信箱 (.edu.tw)</span>
                  <span className="text-[10px] text-emerald-700 font-medium">支援台大、清大、成大、政大等全台院校</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-gray-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={eduEmail}
                      onChange={(e) => setEduEmail(e.target.value)}
                      placeholder="例如：student@ntu.edu.tw 或 s1110@nthu.edu.tw"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                    className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl border border-emerald-200 transition shrink-0 disabled:opacity-50 cursor-pointer"
                  >
                    {countdown > 0 ? `${countdown}s 後可重發` : '發送驗證碼'}
                  </button>
                </div>
              </div>

              {/* Code input if sent */}
              {codeSent && (
                <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                      <span>請輸入信箱收到的 6 位數驗證碼：</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setEnteredCode(generatedCode)}
                      className="text-[11px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-md hover:bg-emerald-700 cursor-pointer"
                    >
                      點擊自動填入測試碼 ({generatedCode})
                    </button>
                  </div>

                  <input
                    type="text"
                    maxLength={6}
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value)}
                    placeholder="請輸入 6 位數數字"
                    className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-center text-base tracking-widest font-black"
                  />
                </div>
              )}

              {emailError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{emailError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={successAnimation}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {successAnimation ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-amber-300 animate-bounce" />
                    <span>認證通過！正在點亮學生官方徽章...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>確認信箱並啟用在學生認證</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Method 2: STUDENT ID CARD / ENROLLMENT PROOF */}
          {activeMethod === 'student_id_card' && (
            <form onSubmit={handleSubmitCard} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">就讀大專院校</label>
                  <select
                    value={cardSchool}
                    onChange={(e) => setCardSchool(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  >
                    {UNIVERSITIES.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name} ({u.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">學生學號</label>
                  <input
                    type="text"
                    value={cardStudentId}
                    onChange={(e) => setCardStudentId(e.target.value)}
                    placeholder="例如：B11209045"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">系所與就讀年級</label>
                <input
                  type="text"
                  value={cardDept}
                  onChange={(e) => setCardDept(e.target.value)}
                  placeholder="例如：資訊工程學系 大三"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  required
                />
              </div>

              {/* Card Photo Preview & Upload */}
              <div className="space-y-2">
                <label className="font-semibold text-gray-700 flex items-center justify-between">
                  <span>學生證正面或在學證明照片</span>
                  <span className="text-gray-600">需包含有效註冊章或學年標註</span>
                </label>

                <div className="relative aspect-16/9 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                  <img src={cardImage} alt="student card" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 hover:bg-black/50 transition flex items-center justify-center gap-3">
                    <label className="bg-white/90 hover:bg-white text-gray-900 font-bold px-3 py-1.5 rounded-xl cursor-pointer text-xs flex items-center gap-1.5 shadow">
                      <Camera className="w-4 h-4 text-emerald-600" />
                      <span>上傳本機證件</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Preset sample cards for rapid evaluation */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-gray-600">快速切換預設校園學生證樣本：</span>
                  {SAMPLE_STUDENT_CARDS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCardSchool(sample.school);
                        setCardStudentId(sample.studentId);
                        setCardImage(sample.url);
                      }}
                      className="text-[10px] bg-gray-100 hover:bg-emerald-100 text-gray-800 font-medium px-2 py-0.5 rounded-md transition cursor-pointer"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>

              {cardError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{cardError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isOcrProcessing || successAnimation}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isOcrProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>校園 AI 證件 OCR 辨識學號與註冊章中...</span>
                  </>
                ) : successAnimation ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-amber-300 animate-bounce" />
                    <span>審核合格！已發放大學生身分認證</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4" />
                    <span>送出學生證智能審核 (即時驗證)</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Verification Perks Showcase */}
          <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2 pt-3">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>通過大學生校園認證後享有的 4 大專屬權益：</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-700">
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-emerald-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>點亮在學生藍色官方徽章</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-emerald-100">
                <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>同校面交專屬免運保障</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-emerald-100">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>二手教材以物易物優先推薦</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>提升二手交易信任度與成交率</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs">
          <span className="text-gray-600">
            學生身分認證每年進行一次學期註冊稽核
          </span>
          <button
            onClick={() => setVerificationModalOpen(false)}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition cursor-pointer"
          >
            關閉視窗
          </button>
        </div>
      </div>
    </div>
  );
};
