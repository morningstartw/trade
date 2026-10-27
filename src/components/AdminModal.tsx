/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Trash2, 
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const AdminModal: React.FC = () => {
  const {
    adminModalOpen,
    setAdminModalOpen,
    reports,
    resolveReport,
    products,
    setSelectedProduct,
  } = useApp();

  if (!adminModalOpen) return null;

  const pendingReports = reports.filter((r) => r.status === 'pending');
  const resolvedReports = reports.filter((r) => r.status !== 'pending');

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">校園社群安全審查後台</h2>
                <span className="text-[10px] bg-purple-300 text-purple-950 font-extrabold px-2 py-0.5 rounded-full">
                  管理員模式
                </span>
              </div>
              <p className="text-xs text-purple-200">
                審查學生檢舉案件、維護校園同校面交安全與下架違規商品
              </p>
            </div>
          </div>

          <button
            onClick={() => setAdminModalOpen(false)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats strip */}
        <div className="px-5 py-3 bg-purple-50/70 border-b border-purple-100 flex items-center justify-between text-xs text-purple-900">
          <div>
            待審查案件：<span className="font-bold text-rose-600">{pendingReports.length}</span> 件
          </div>
          <div>
            已處置紀錄：<span className="font-bold">{resolvedReports.length}</span> 件
          </div>
          <div className="flex items-center gap-1 text-emerald-700 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>社群健康度：98.6%</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>待處理檢舉案件 ({pendingReports.length})</span>
            </h3>

            {pendingReports.length > 0 ? (
              <div className="space-y-3">
                {pendingReports.map((report) => {
                  const product = products.find((p) => p.id === report.productId);
                  return (
                    <div
                      key={report.id}
                      className="p-4 rounded-2xl bg-white border border-rose-200 shadow-xs space-y-2.5 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              {report.reasonText}
                            </span>
                            <span className="text-[10px] text-gray-600">
                              檢舉人：{report.reporterName} • {report.createdAt}
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-900 text-sm mt-1">
                            被檢舉商品：《{report.productTitle}》
                          </h4>
                        </div>

                        {product && (
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setAdminModalOpen(false);
                            }}
                            className="text-emerald-700 hover:text-emerald-800 text-[11px] font-semibold flex items-center gap-1 underline cursor-pointer shrink-0"
                          >
                            <span>預覽商品</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700 text-xs">
                        <span className="font-bold text-gray-900">檢舉具體描述：</span>
                        {report.detail}
                      </div>

                      {/* Admin action buttons */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => resolveReport(report.id, 'dismiss')}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition cursor-pointer"
                        >
                          駁回檢舉 (無違規)
                        </button>
                        <button
                          onClick={() => resolveReport(report.id, 'take_down')}
                          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs transition flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>核准違規並強制下架</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs text-emerald-800">
                🎉 目前沒有任何待審查的違規檢舉案件，校園市集秩序非常良好！
              </div>
            )}
          </div>

          {/* Past resolved reports */}
          {resolvedReports.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                已審理記錄
              </h3>
              <div className="divide-y divide-gray-100 text-xs text-gray-600">
                {resolvedReports.map((r) => (
                  <div key={r.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-gray-800">{r.productTitle}</span>
                      <span className="ml-2 text-[10px]">({r.reasonText})</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        r.status === 'resolved'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {r.status === 'resolved' ? '已下架處置' : '已駁回'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end text-xs">
          <button
            onClick={() => setAdminModalOpen(false)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-xl transition cursor-pointer"
          >
            關閉後台
          </button>
        </div>
      </div>
    </div>
  );
};
