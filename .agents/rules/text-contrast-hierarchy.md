# Platform Text Contrast & Color Hierarchy Standard (WCAG AAA)

This rule is mandatory across all screens, pages, and components in the FingerMobile platform.

## 1. Problem Definition & Core Mandate
Gray text (`text-gray-300`, `text-gray-400`, `text-slate-400`, `text-muted-foreground`) rendered on crystalline white cards (`bg-white`), light canvas (`bg-slate-50`), or light tinted panels (`bg-emerald-50`, `bg-amber-50`, `bg-indigo-50`, `bg-blue-50`) fails accessibility contrast standards (often dropping to 1.5:1 - 2.5:1) and becomes completely illegible.

Blanket `text-black` or `!important` overrides are forbidden because they flatten visual hierarchy, making titles, labels, and secondary descriptions indistinguishable.

## 2. The 4-Tier Hierarchical Dark Shades for Light Backgrounds
When designing, modifying, or refactoring any component on light/white backgrounds, you MUST apply this hierarchy:

| Role | Tailwind Class | Hex Code | Contrast on `#ffffff` | WCAG Status |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1: Primary Headings & Titles** | `text-slate-900` or `text-gray-900` | `#0f172a` | 15.9:1 | AAA (Pass) |
| **Tier 2: Table Cells, Field Labels, Key Numbers** | `text-slate-800` or `text-gray-800` | `#1e293b` / `#334155` | 8.8:1 | AAA (Pass) |
| **Tier 3: Descriptions, Captions, Explanations, Notes** | `text-slate-700` or `text-gray-700` | `#334155` / `#374151` | >7:1 | AAA (Pass) |
| **Tier 4: Separators, Secondary Metadata, Inactive Icons** | `text-slate-500` | `#475569` | 4.6:1 | AA (Pass) |

### Strict Prohibitions
- **NEVER** use `text-gray-400`, `text-slate-400`, or `text-zinc-400` for descriptions or body copy on white/light backgrounds.
- **NEVER** use blanket `text-black` on everything.
- **NEVER** leave form input elements to default unstyled text without explicit dark color classes.

## 3. Form Controls Standard (Inputs, Selects, Textareas)
Every input, textarea, and select element rendered on white or light backgrounds MUST have:
```tsx
className="w-full text-slate-900 font-bold border border-slate-300 rounded px-2.5 py-1.5 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
```
For numeric / monetary inputs:
```tsx
className="font-mono font-bold text-slate-900 border border-slate-300 rounded px-2 py-1 bg-white"
```

## 4. Card & Table Borders
- Change weak `border-gray-200` and `border-gray-100` to `border-slate-300` or `border-slate-200`.
- This ensures clean structural separation between cards, table rows, and the surrounding canvas.

## 5. Status Badges & Pill Tags on Tinted Backgrounds
When pill badges use light backgrounds (`bg-*-100` or `bg-*-50`), the text color MUST be the ultra-dark 950 shade with an explicit matching border:
- **Success / Revenue**: `bg-emerald-100 text-emerald-950 border border-emerald-400 font-black`
- **Info / International**: `bg-blue-100 text-blue-950 border border-blue-400 font-black`
- **Warning / Pending**: `bg-amber-100 text-amber-950 border border-amber-400 font-black`
- **Surplus / Profit**: `bg-purple-100 text-purple-950 border border-purple-400 font-black`
- **Solid Active Pills**: `bg-emerald-700 text-white font-extrabold` or `bg-indigo-700 text-white font-extrabold`

## 6. Gold Standard Reference Component
Use [EnterpriseFinancialEcosystemConsole.tsx](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Protocol/apps/frontend-main/src/components/dashboard/EnterpriseFinancialEcosystemConsole.tsx) as the benchmark reference when refactoring other screens and pages across the platform.
