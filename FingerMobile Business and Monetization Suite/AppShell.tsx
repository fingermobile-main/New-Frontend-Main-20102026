import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  BadgeDollarSign,
  Building2,
  ClipboardCheck,
  Compass,
  Landmark,
  ShieldCheck,
  WalletCards,
  Wrench,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Overview', icon: Compass },
  { to: '/seshat', label: 'Seshat', icon: Building2 },
  { to: '/monetization', label: 'Monetization', icon: BadgeDollarSign },
  { to: '/verification', label: 'Verification', icon: ClipboardCheck },
  { to: '/revenue', label: 'Revenue', icon: WalletCards },
  { to: '/affiliate', label: 'Affiliate', icon: Landmark },
  { to: '/policy', label: 'Policy', icon: ShieldCheck },
  { to: '/admin', label: 'Admin', icon: Wrench },
]

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_28%),linear-gradient(180deg,_#040816,_#0b1120_55%,_#0f172a)] text-white">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 backdrop-blur">
          <Link to="/" className="block">
            <div className="text-xs uppercase tracking-[0.34em] text-emerald-300">
              FingerMobile
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Business Suite
            </h1>
            <p className="mt-3 text-sm text-slate-400">
              Creator earnings, policy operations, finance controls, and Seshat lifecycle management in one command surface.
            </p>
          </Link>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.05] hover:text-white',
                      isActive && 'bg-white/[0.08] text-white',
                    )
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="mt-8 rounded-[28px] border border-emerald-500/20 bg-emerald-500/10 p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-emerald-200">
              Admin Note
            </div>
            <p className="mt-3 text-sm text-emerald-50">
              Seshat Pages remain free for two years, then convert to Super Admin controlled monthly or yearly billing.
            </p>
          </div>
        </aside>

        <main className="rounded-[32px] border border-white/10 bg-slate-950/60 p-6 backdrop-blur lg:p-8">
          <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.32em] text-slate-400">
                Operations Console
              </div>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white">
                {title}
              </h2>
              <p className="mt-3 max-w-3xl text-sm text-slate-300">{subtitle}</p>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
