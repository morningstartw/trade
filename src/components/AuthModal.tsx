/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UNIVERSITIES, MOCK_USERS } from '../data/mockData';
import { 
  X, 
  LogIn, 
  UserPlus, 
  GraduationCap, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    allUsers,
    switchUser,
    setVerificationModalOpen,
  } = useApp();

  // Login form state
  const [loginAccount, setLoginAccount] = useState('b10902045@ntu.edu.tw');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regSchool, setRegSchool] = useState(UNIVERSITIES[0].name);
  const [regDept, setRegDept] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAgreed, setRegAgreed] = useState(true);
  const [regError, setRegError] = useState<string | null>(null);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  if (!authModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginAccount.trim()) {
      setLoginError('請輸入電子郵件、學號或姓名');
      return;
    }
    const res = login(loginAccount, loginPassword);
    if (!res.success) {
      setLoginError(res.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setRegError('請輸入姓名或暱稱');
      return;
    }
    if (!regDept.trim()) {
      setRegError('請輸入系所年級');
      return;
    }
    if (!regStudentId.trim()) {
      setRegError('請輸入學生學號');
      return;
    }
    if (!regEmail.trim()) {
      setRegError('請輸入電子郵件信箱');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('密碼長度至少需 6 個字元');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('兩次輸入的密碼不一致');
      return;
    }
    if (!regAgreed) {
      setRegError('請勾選同意遵守校園二手物品交易誠信守則');
      return;
    }

    const res = register({
      name: regName.trim(),
      school: regSchool,
      department: regDept.trim(),
      studentId: regStudentId.trim(),
      email: regEmail.trim(),
      password: regPassword,
    });

    if (res.success) {
      setAuthModalOpen(false);
      // prompt verification if not edu email
      if (!regEmail.toLowerCase().includes('edu.tw')) {
        setTimeout(() => {
          setVerificationModalOpen(true);
        }, 600);
      }
    }
  };

  const handleQuickLogin = (userId: string) => {
    switchUser(userId);
    setAuthModalOpen(false);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header Banner */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">
                  {authModalTab === 'login'
                    ? '會員登入'
                    : authModalTab === 'register'
                    ? '大專院校學生註冊'
                    : '重設密碼'}
                </h2>
                <span className="text-[10px] bg-amber-400 text-gray-900 font-extrabold px-2 py-0.5 rounded-full">
                  校園市集
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                UniTrade 全國大學生專屬二手交換與買賣平台
              </p>
            </div>
          </div>

          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 bg-white flex items-center gap-3 border-b border-gray-200 text-xs">
          <button
            onClick={() => {
              setAuthModalTab('login');
              setLoginError(null);
            }}
            className={`pb-2.5 font-bold flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              authModalTab === 'login'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>會員登入</span>
          </button>

          <button
            onClick={() => {
              setAuthModalTab('register');
              setRegError(null);
            }}
            className={`pb-2.5 font-bold flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              authModalTab === 'register'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>學生會員註冊</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* TAB 1: LOGIN */}
          {authModalTab === 'login' && (
            <div className="space-y-4">
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">帳號 (學生信箱 / 學號 / 姓名)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={loginAccount}
                      onChange={(e) => setLoginAccount(e.target.value)}
                      placeholder="例如：b10902045@ntu.edu.tw 或 B10902045"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-gray-700">登入密碼</label>
                    <button
                      type="button"
                      onClick={() => setAuthModalTab('forgot')}
                      className="text-[11px] text-emerald-700 hover:underline"
                    >
                      忘記密碼？
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                      required
                    />
                  </div>
                </div>

                {loginError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  確認登入
                </button>
              </form>

              {/* Quick test student logins */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <span className="font-bold text-gray-700 text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>一鍵快速以測試學生身分登入體驗：</span>
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickLogin(u.id)}
                      className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-left transition flex items-center gap-2 cursor-pointer"
                    >
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                      <div className="min-w-0">
                        <div className="font-bold text-gray-800 truncate text-[11px]">{u.name}</div>
                        <div className="text-[10px] text-gray-600 truncate">{u.school.replace('國立', '')}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTER */}
          {authModalTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">學生姓名/暱稱</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="例如：陳大為"
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">學生學號</label>
                  <input
                    type="text"
                    value={regStudentId}
                    onChange={(e) => setRegStudentId(e.target.value)}
                    placeholder="例如：B11209018"
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">就讀大專院校</label>
                <select
                  value={regSchool}
                  onChange={(e) => setRegSchool(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                >
                  {UNIVERSITIES.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} ({u.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">系所與就讀年級</label>
                <input
                  type="text"
                  value={regDept}
                  onChange={(e) => setRegDept(e.target.value)}
                  placeholder="例如：資訊工程學系 大二"
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 flex items-center justify-between">
                  <span>電子郵件信箱</span>
                  <span className="text-[10px] text-emerald-700">填寫 .edu.tw 可直接開通認證</span>
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="student@ntu.edu.tw 或個人信箱"
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">設定密碼</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="至少 6 位密碼"
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">確認密碼</label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="再次輸入密碼"
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-[11px] text-gray-600">
                  <input
                    type="checkbox"
                    checked={regAgreed}
                    onChange={(e) => setRegAgreed(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-emerald-600 mt-0.5"
                  />
                  <span>我同意遵守《校園二手誠信交易守則》，承諾面交物品真實且無仿冒品。</span>
                </label>
              </div>

              {regError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
              >
                立即註冊學生帳號
              </button>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD */}
          {authModalTab === 'forgot' && (
            <div className="space-y-4">
              {forgotSent ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <div className="font-bold text-gray-900 text-sm">密碼重設信已寄出！</div>
                  <p className="text-gray-600 text-xs">
                    請至信箱 <code className="font-bold">{forgotEmail}</code> 點擊連結重設您的登入密碼。
                  </p>
                  <button
                    onClick={() => {
                      setForgotSent(false);
                      setAuthModalTab('login');
                    }}
                    className="mt-2 text-xs bg-emerald-600 text-white font-bold px-4 py-1.5 rounded-xl cursor-pointer"
                  >
                    返回登入
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-3">
                  <p className="text-gray-600 text-xs">
                    請輸入您註冊時填寫的學生信箱，我們將發送密碼重設安全連結至您的信箱。
                  </p>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">登記信箱</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="student@ntu.edu.tw"
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setAuthModalTab('login')}
                      className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold cursor-pointer"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 cursor-pointer"
                    >
                      發送重設信
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs">
          <span className="text-gray-600">
            {authModalTab === 'login' ? '還沒有學生帳號？' : '已經有帳號？'}
          </span>
          <button
            onClick={() => {
              setAuthModalTab(authModalTab === 'login' ? 'register' : 'login');
              setLoginError(null);
              setRegError(null);
            }}
            className="text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>{authModalTab === 'login' ? '免費註冊學生會員' : '直接會員登入'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
