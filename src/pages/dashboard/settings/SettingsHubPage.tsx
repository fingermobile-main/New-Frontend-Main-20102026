import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import {
  Search,
  Users,
  Building2,
  Bot,
  Smartphone,
  Globe2,
  HardDrive,
  Inbox,
  Radio,
  Bell,
  Send,
  ChevronRight,
  Shield,
  Award,
  Layers,
  Sparkles,
  Lock,
} from 'lucide-react';

export const SettingsHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const generalSettings = [
    {
      id: 'roles-permissions',
      title: 'Roles & permissions',
      description: 'Invite collaborators to work on this site and assign their roles and permissions.',
      icon: Users,
      route: '/settings/roles-permissions',
      badge: '5 Seats Left',
    },
    {
      id: 'site-member-access',
      title: 'Site Member Access',
      description: 'Gate private pages and manage end-user tiered permissions for courses and VIP content.',
      icon: Lock,
      route: '/contacts/site-members/site-member-access',
      badge: '10 Gated Pages',
    },
    {
      id: 'member-badges',
      title: 'Member Badges Studio',
      description: 'Reward milestones with custom SVG badges and auto-unlock restricted community content.',
      icon: Award,
      route: '/settings/badges',
      badge: 'Gamified',
    },
    {
      id: 'business-info',
      title: 'Business info',
      description: 'Set your business name, logo, location and contact info.',
      icon: Building2,
      route: '/settings',
    },
    {
      id: 'ai-integrations',
      title: 'AI Integrations & Agents',
      description: 'Connect AI agents, automate business tasks, and manage your site with advanced AI assistants.',
      icon: Bot,
      route: '/guardian-ai',
      badge: 'NEW',
    },
    {
      id: 'mobile-app',
      title: 'Mobile app preferences',
      description: 'Choose who can join and log in to your app & set your app preferences.',
      icon: Smartphone,
      route: '/settings',
    },
    {
      id: 'language-region',
      title: 'Language & region',
      description: 'Set your language, region & currency, and translate your site.',
      icon: Globe2,
      route: '/settings',
    },
    {
      id: 'manage-storage',
      title: 'Manage storage',
      description: 'Check your storage and free up space, or upgrade your storage plan.',
      icon: HardDrive,
      route: '/settings',
    },
  ];

  const communicationsSettings = [
    {
      id: 'inbox-settings',
      title: 'Inbox settings',
      description: 'Manage how you send and receive Inbox messages.',
      icon: Inbox,
      route: '/messages',
    },
    {
      id: 'communication-channels',
      title: 'Communication channels',
      description: 'Set up channels for communicating with customers and leads.',
      icon: Radio,
      route: '/private-messages',
    },
    {
      id: 'notifications-you-get',
      title: 'Notifications you get',
      description: 'Choose which notifications you get from FingerMobile Platform.',
      icon: Bell,
      route: '/notifications',
    },
    {
      id: 'notifications-you-send',
      title: 'Notifications you send',
      description: 'Manage the notifications & reminders you send out to community members.',
      icon: Send,
      route: '/notifications',
    },
  ];

  const filterItems = (items: typeof generalSettings) =>
    items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              <span>Platform Control & Enterprise Settings</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Settings Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Configure platform rules, collaborator seats, role permissions, site member page access, and communication channels.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search settings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Section 1: General */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>General Settings</span>
              <span className="text-xs font-mono font-normal text-slate-400">
                ({filterItems(generalSettings).length})
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filterItems(generalSettings).map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => navigate(item.route)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-500/50 cursor-pointer transition-all flex items-start gap-4 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all self-center flex-shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Communications & Notifications */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Communications & Notifications</span>
              <span className="text-xs font-mono font-normal text-slate-400">
                ({filterItems(communicationsSettings).length})
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filterItems(communicationsSettings).map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => navigate(item.route)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-purple-500/50 cursor-pointer transition-all flex items-start gap-4 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all self-center flex-shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsHubPage;
