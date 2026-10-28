import { Link } from 'react-router-dom';
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Award, Compass, PlusCircle, ShieldCheck } from 'lucide-react';

/*
 * FingerMobile Protocol™ - Community Pages Component
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

const CommunityPages: React.FC = () => {
  return (
    <MainLayout pageTitle="Community Pages Directory">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-28 md:pb-12 w-full max-w-full overflow-x-hidden text-slate-900">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-300 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-950 border border-blue-400 text-xs font-black uppercase">
            <Award className="w-4 h-4 text-blue-700" />
            Hallmark Directory & Index
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Community Pages Directory
          </h1>
          <p className="text-slate-700 font-medium text-sm sm:text-base">
            Verified master index of Hallmark achievement modules, moderation workflows, and community management dashboards.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-300 shadow-sm">
          <ul className="divide-y divide-slate-200">
            <li>
              <Link to="/hallmark" className="flex items-center justify-between py-3 text-slate-900 font-bold hover:text-blue-600 transition min-h-[44px]">
                <span>Hallmark Achievements (Static)</span>
                <span className="text-xs text-slate-500 font-normal">/hallmark &rarr;</span>
              </Link>
            </li>
            <li>
              <Link to="/hallmarks" className="flex items-center justify-between py-3 text-slate-900 font-bold hover:text-blue-600 transition min-h-[44px]">
                <span>Hallmarks Feed (Dynamic)</span>
                <span className="text-xs text-slate-500 font-normal">/hallmarks &rarr;</span>
              </Link>
            </li>
            <li>
              <Link to="/hallmark/create" className="flex items-center justify-between py-3 text-slate-900 font-bold hover:text-blue-600 transition min-h-[44px]">
                <span>Create Hallmark NFT</span>
                <span className="text-xs text-slate-500 font-normal">/hallmark/create &rarr;</span>
              </Link>
            </li>
            <li>
              <Link to="/hallmark/1" className="flex items-center justify-between py-3 text-slate-900 font-bold hover:text-blue-600 transition min-h-[44px]">
                <span>Public Hallmark View (Example)</span>
                <span className="text-xs text-slate-500 font-normal">/hallmark/1 &rarr;</span>
              </Link>
            </li>
            <li>
              <Link to="/hallmark/manage/1" className="flex items-center justify-between py-3 text-slate-900 font-bold hover:text-blue-600 transition min-h-[44px]">
                <span>Manage My Hallmark (Example)</span>
                <span className="text-xs text-slate-500 font-normal">/hallmark/manage/1 &rarr;</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/moderation/hallmarks" className="flex items-center justify-between py-3 text-slate-900 font-bold hover:text-blue-600 transition min-h-[44px]">
                <span>Hallmark Approval Queue (Admin)</span>
                <span className="text-xs text-slate-500 font-normal">/dashboard/moderation/hallmarks &rarr;</span>
              </Link>
            </li>
            <li>
              <Link to="/unified-dashboard" className="flex items-center justify-between py-3 text-slate-900 font-bold hover:text-blue-600 transition min-h-[44px]">
                <span>Community Management Dashboard</span>
                <span className="text-xs text-slate-500 font-normal">/unified-dashboard &rarr;</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around shadow-lg">
        <Link
          to="/hallmarks"
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 text-blue-600 font-bold"
        >
          <Award className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Feed</span>
        </Link>
        <Link
          to="/hallmark/create"
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 text-slate-700 hover:text-slate-900"
        >
          <PlusCircle className="w-5 h-5 text-amber-500" />
          <span className="text-[10px] tracking-tight">Create</span>
        </Link>
        <Link
          to="/unified-dashboard"
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 text-slate-700 hover:text-slate-900"
        >
          <Compass className="w-5 h-5 text-indigo-500" />
          <span className="text-[10px] tracking-tight">Dashboard</span>
        </Link>
        <Link
          to="/dashboard/moderation/hallmarks"
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 text-slate-700 hover:text-slate-900"
        >
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span className="text-[10px] tracking-tight">Admin</span>
        </Link>
      </div>
    </MainLayout>
  );
};

export default CommunityPages;
