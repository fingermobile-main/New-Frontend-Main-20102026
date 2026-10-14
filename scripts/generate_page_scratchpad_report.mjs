import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.resolve(__dirname, '../../PAGES_AUDIT_356_INSPECTION.json');
const outputPath = path.resolve(__dirname, '../../../SCRATCHPAD_PAGE_INSPECTION_AND_GAPS_MATRIX.md');

const auditData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Group by domain
const domainGroups = {};
auditData.forEach(page => {
  if (!domainGroups[page.domain]) domainGroups[page.domain] = [];
  domainGroups[page.domain].push(page);
});

let md = `# FingerMobile Protocol™ — Master Page-by-Page Inspection & Gap Remediation Scratchpad
**Audit Date:** October 12, 2026 | **Total Audited Pages:** ${auditData.length} | **Domains:** ${Object.keys(domainGroups).length}

---

## 1. Executive Summary & Quality Scorecard

| Status Tier | Count | Percentage | Definition |
|---|---|---|---|
| 🟢 **Complete / Governed** | ${auditData.filter(p => p.implementationStatus === 'Complete / Governed').length} | ${Math.round((auditData.filter(p => p.implementationStatus === 'Complete / Governed').length / auditData.length) * 100)}% | Fully wired with state, handlers, form inputs, and connected services. |
| 🟡 **Partial / Needs Wiring** | ${auditData.filter(p => p.implementationStatus === 'Partial / Needs Wiring').length} | ${Math.round((auditData.filter(p => p.implementationStatus === 'Partial / Needs Wiring').length / auditData.length) * 100)}% | Functional UI with state, but relies on mock data or lacks live backend persistence. |
| 🔴 **High Gaps / Stubs** | ${auditData.filter(p => p.implementationStatus === 'High Gaps / Stub').length} | ${Math.round((auditData.filter(p => p.implementationStatus === 'High Gaps / Stub').length / auditData.length) * 100)}% | Missing event handlers, empty dummy callbacks, or unresolved TODOs. |

---

## 2. Platform Domain Matrix Breakdown

| # | Domain / Directory | Total Pages | Complete | Partial | High Gaps | Primary Entity Managed |
|---|---|---|---|---|---|---|
`;

Object.entries(domainGroups).forEach(([domain, pages], index) => {
  const complete = pages.filter(p => p.implementationStatus === 'Complete / Governed').length;
  const partial = pages.filter(p => p.implementationStatus === 'Partial / Needs Wiring').length;
  const highGaps = pages.filter(p => p.implementationStatus === 'High Gaps / Stub').length;
  md += `| ${index + 1} | \`${domain}\` | ${pages.length} | ${complete} | ${partial} | ${highGaps} | ${domain.toUpperCase()} records | \n`;
});

md += `\n---\n\n## 3. Detailed Page-by-Page Scratchpad & Action Plan\n\n`;

Object.entries(domainGroups).forEach(([domain, pages]) => {
  md += `### Domain: \`${domain.toUpperCase()}\` (${pages.length} Pages)\n\n`;
  md += `| Page / Component | File Path | Status | State / Handlers | Detected APIs / Services | Identified Gaps & Remediation Task |\n`;
  md += `|---|---|---|---|---|---|\n`;

  pages.forEach(p => {
    const badge = p.implementationStatus === 'Complete / Governed' ? '🟢 Governed' : p.implementationStatus === 'Partial / Needs Wiring' ? '🟡 Partial' : '🔴 High Gap';
    const handlersStr = p.handlers.length > 0 ? `\`${p.handlers.slice(0, 3).join(', ')}\`` : '_None_';
    const apiStr = p.apiCalls.length > 0 ? p.apiCalls.slice(0, 2).map(a => `\`${a}\``).join('<br/>') : '_Local / Service_';
    const gapsStr = p.gaps.length > 0 ? p.gaps.map(g => `• ${g}`).join('<br/>') : '✅ _Zero Gaps (Verified)_';

    md += `| **${p.componentName}** | \`${p.filePath}\` | ${badge} | State: ${p.stateCount}<br/>Handlers: ${handlersStr} | ${apiStr} | ${gapsStr} |\n`;
  });

  md += `\n`;
});

md += `\n---

## 4. Master Architectural Recommendations & Remediation Checklist

1. **Backend Endpoint Alignment:**
   - Migrate local mocked data stores in partial pages to PostgreSQL query endpoints.
   - Attach \`WORM\` audit logging triggers on all mutation actions (\`POST\`, \`PUT\`, \`DELETE\`).

2. **Shared Service Re-Use:**
   - Use unified \`DashboardService\`, \`UserProfileSyncService\`, and \`FICService\` across isolated community and media screens.

3. **SuperAdmin Governance Parity:**
   - Ensure every page is linked in \`masterPageInventoryData.ts\` with explicit \`canView, canCreate, canEdit, canPublish, canArchive, canDelete\` capability mappings.
`;

fs.writeFileSync(outputPath, md, 'utf8');
console.log(`Generated master scratchpad report: ${outputPath}`);
