# Workspace Rules & Quality Guidelines

## Accessibility & Text Contrast Rules (MANDATORY)

All screens, pages, modals, tables, and components across the FingerMobile platform must strictly adhere to the high-contrast color hierarchy on light/white backgrounds:

1. **Titles & Primary Headings**: Always use `text-slate-900` or `text-gray-900` (`#0f172a`, 15.9:1 AAA contrast). Never use blanket `text-black`.
2. **Table Cells, Labels & Core Data**: Use `text-slate-800` or `text-gray-800` (`#1e293b`, 8.8:1 AAA contrast).
3. **Descriptions, Captions & Notes**: Use `text-slate-700` or `text-gray-700` (`#334155`, >7:1 AAA contrast). NEVER use `text-gray-400`, `text-slate-400`, or raw `text-muted-foreground` directly on white cards or light backgrounds.
4. **Separators & Inactive Icons**: Use `text-slate-500` (4.6:1 AA contrast).
5. **Form Inputs**: Every input/textarea/select on white backgrounds must have explicit `text-slate-900 font-bold border border-slate-300 bg-white`.
6. **Card & Table Borders**: Use `border-slate-300` or `border-slate-200` to prevent cards and tables from dissolving into white canvas.
7. **Badges on Light Tints**: Use deep 950 text shades on `*-100` backgrounds (e.g. `bg-emerald-100 text-emerald-950 border border-emerald-400`).

Reference component: [EnterpriseFinancialEcosystemConsole.tsx](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Protocol/apps/frontend-main/src/components/dashboard/EnterpriseFinancialEcosystemConsole.tsx)
Detailed rule: [.agents/rules/text-contrast-hierarchy.md](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/.agents/rules/text-contrast-hierarchy.md)
