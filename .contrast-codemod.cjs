const fs = require('fs');
const path = require('path');
const ts = require('./FingerMobile Protocol/apps/frontend-main/node_modules/typescript');

const roots = [
  'FingerMobile Protocol/apps/frontend-main/src',
  'FingerMobile Protocol/apps/admin-dashboard/src',
  'FingerMobile Protocol/apps/frontend-main/apps/lumina-gallery/src',
  'FingerMobile Business and Monetization Suite/apps/frontend/src',
  'Platform Monetization/src',
];
const excluded = new Set([
  path.normalize('FingerMobile Protocol/apps/frontend-main/src/pages/WalletAndPayPage.tsx'),
  path.normalize('FingerMobile Protocol/apps/frontend-main/src/pages/WalletFundingPage.tsx'),
  path.normalize('FingerMobile Protocol/apps/frontend-main/src/pages/WalletPage.tsx'),
  path.normalize('FingerMobile Protocol/apps/frontend-main/src/pages/dashboard/FinanceDashboardPage.tsx'),
  path.normalize('FingerMobile Protocol/apps/frontend-main/src/pages/dashboard/PayoutsPage.tsx'),
  path.normalize('FingerMobile Protocol/apps/frontend-main/src/pages/dashboard/settings/BillingPage.tsx'),
  path.normalize('FingerMobile Protocol/apps/frontend-main/src/pages/financials/FicVaultPage.tsx'),
  path.normalize('FingerMobile Protocol/apps/frontend-main/src/pages/financials/GiftCardsPage.tsx'),
  path.normalize('FingerMobile Protocol/apps/frontend-main/src/pages/financials/LoyaltyRewardsPage.tsx'),
  path.normalize('FingerMobile Protocol/apps/frontend-main/src/pages/financials/MyWalletPage.tsx'),
  path.normalize('FingerMobile Protocol/apps/frontend-main/src/pages/MiiAvatarPage.tsx'),
  path.normalize('FingerMobile Protocol/apps/frontend-main/src/pages/dashboard/ContentModerationPage.tsx'),
]);
const badges = {
  emerald: ['text-emerald-950', 'border-emerald-400'],
  blue: ['text-blue-950', 'border-blue-400'],
  amber: ['text-amber-950', 'border-amber-400'],
  purple: ['text-purple-950', 'border-purple-400'],
};
const applyChanges = process.argv.includes('--apply');
const counts = { files: 0, tokens: 0, forms: 0, badges: 0, skippedDirty: 0 };

function collectFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectFiles(file);
    return /\.(?:tsx|jsx)$/.test(entry.name) ? [file] : [];
  });
}

function classAttribute(element) {
  const attributes = ts.isJsxElement(element) ? element.openingElement.attributes : element.attributes;
  return attributes.properties.find(attribute =>
    ts.isJsxAttribute(attribute) && attribute.name.getText() === 'className'
  );
}

function stringFragments(node, sourceFile, result = []) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    result.push({ start: node.getStart(sourceFile) + 1, end: node.end - 1 });
    return result;
  }
  if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node)) {
    result.push({ start: node.getStart(sourceFile) + 1, end: node.end - 2 });
    return result;
  }
  if (ts.isTemplateTail(node)) {
    result.push({ start: node.getStart(sourceFile) + 1, end: node.end - 1 });
    return result;
  }
  node.forEachChild(child => stringFragments(child, sourceFile, result));
  return result;
}

function classText(attribute, sourceFile) {
  if (!attribute?.initializer) return '';
  return stringFragments(attribute.initializer, sourceFile)
    .map(fragment => sourceFile.text.slice(fragment.start, fragment.end))
    .join(' ');
}

function baseToken(token) {
  const withoutImportant = token.replace(/^!/, '');
  const separator = withoutImportant.lastIndexOf(':');
  return {
    important: token.startsWith('!'),
    variants: separator < 0 ? [] : withoutImportant.slice(0, separator).split(':'),
    utility: separator < 0 ? withoutImportant : withoutImportant.slice(separator + 1),
  };
}

function backgroundKind(text) {
  let found = null;
  for (const token of text.split(/\s+/)) {
    if (!token) continue;
    const { variants, utility } = baseToken(token);
    if (variants.length || !utility.startsWith('bg-')) continue;
    if (/^bg-gradient-/.test(utility)) return 'unknown';
    if (/^bg-opacity-/.test(utility) || utility === 'bg-transparent' || utility === 'bg-none') continue;

    const color = utility.replace(/\/\d+$/, '');
    let current = null;
    if (color === 'bg-white' || /^bg-[a-z]+-(?:50|100|200|300)$/.test(color)) current = 'light';
    else if (color === 'bg-black' || /^bg-[a-z]+-(?:600|700|800|900|950)$/.test(color)) current = 'dark';
    else return 'unknown';

    if (found && found !== current) return 'unknown';
    found = current;
  }
  return found;
}

function nearestBackground(element, ancestors, sourceFile) {
  const own = backgroundKind(classText(classAttribute(element), sourceFile));
  if (own) return own;
  for (let index = ancestors.length - 1; index >= 0; index--) {
    const kind = backgroundKind(ancestors[index]);
    if (kind) return kind;
  }
  return null;
}

function colorToken(utility) {
  const value = utility.replace(/^text-/, '').replace(/\/\d+$/, '');
  return value === 'black' || value === 'white' || value === 'transparent' ||
    value === 'current' || value === 'inherit' || value === 'muted-foreground' ||
    /^(?:slate|gray|zinc|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}$/.test(value);
}

function rewriteUtility(token, tag, form, badgeColor, track = true, activePill = false) {
  const parsed = baseToken(token);
  const { variants, important } = parsed;
  let { utility } = parsed;
  if (variants.includes('dark')) return token;

  const marker = important ? '!' : '';
  const prefix = variants.length ? `${variants.join(':')}:` : '';
  const rawUtility = utility;
  const cleanUtility = utility.replace(/\/\d+$/, '');
  let replacement = utility;

  if (activePill && colorToken(cleanUtility)) {
    replacement = 'text-white';
  } else if (badgeColor) {
    if (colorToken(cleanUtility)) replacement = badges[badgeColor][0];
    else if (/^border-[a-z]+-(?:50|100|200|300|400|500|600|700|800|900|950)$/.test(cleanUtility)) {
      replacement = badges[badgeColor][1];
    }
  } else if (form && colorToken(cleanUtility)) {
    replacement = prefix.includes('placeholder:') ? 'text-slate-400' : 'text-slate-900';
  } else if (/^text-(?:gray|slate|zinc)-(?:300|400)$/.test(cleanUtility) ||
    cleanUtility === 'text-gray-500' ||
    cleanUtility === 'text-muted-foreground' ||
    cleanUtility === 'text-black' ||
    cleanUtility === 'text-white') {
    if (prefix.includes('placeholder:')) replacement = 'text-slate-400';
    else if (/^h[1-6]$/.test(tag)) replacement = 'text-slate-900';
    else if (tag === 'label' || tag === 'th' || tag === 'td') replacement = 'text-slate-800';
    else if (tag === 'svg') replacement = 'text-slate-500';
    else replacement = 'text-slate-700';
  }

  if (form && (cleanUtility === 'bg-white' || /^bg-[a-z]+-(?:50|100|200|300|400|500|600|700|800|900|950)$/.test(cleanUtility))) replacement = 'bg-white';
  if (form && /^border-gray-(?:100|200)$/.test(cleanUtility)) replacement = 'border-slate-300';
  else if (/^border-gray-100$/.test(cleanUtility)) replacement = 'border-slate-200';
  else if (/^border-gray-200$/.test(cleanUtility)) replacement = 'border-slate-300';

  if (form && /^border-0$/.test(cleanUtility)) replacement = 'border';
  if (form && /^rounded-none$/.test(cleanUtility)) replacement = 'rounded';

  if (track && replacement !== rawUtility) counts.tokens++;
  return `${marker}${prefix}${replacement}`;
}

function elementName(element, sourceFile) {
  const name = ts.isJsxElement(element) ? element.openingElement.tagName : element.tagName;
  return name.getText(sourceFile).toLowerCase();
}

function elementAttributes(element) {
  return ts.isJsxElement(element) ? element.openingElement.attributes : element.attributes;
}

function inputType(element, sourceFile) {
  for (const attribute of elementAttributes(element).properties) {
    if (ts.isJsxAttribute(attribute) && attribute.name.getText() === 'type' && attribute.initializer) {
      return attribute.initializer.getText(sourceFile).toLowerCase();
    }
  }
  return '';
}

function appendClassAttributeEdits(element, attribute, extra, sourceFile, edits) {
  if (!extra.length) return;
  const unique = [...new Set(extra)];
  if (!attribute) {
    const tagName = ts.isJsxElement(element) ? element.openingElement.tagName : element.tagName;
    edits.push({ start: tagName.end, end: tagName.end, text: ` className="${unique.join(' ')}"` });
    return;
  }
  const initializer = attribute.initializer;
  const fragments = initializer ? stringFragments(initializer, sourceFile) : [];
  if (fragments.length) {
    const last = fragments[fragments.length - 1];
    edits.push({ start: last.end, end: last.end, text: `${sourceFile.text.slice(last.start, last.end).trim() ? ' ' : ''}${unique.join(' ')}` });
    return;
  }
  if (initializer && ts.isJsxExpression(initializer) && initializer.expression) {
    const expression = initializer.expression;
    edits.push({
      start: expression.getStart(sourceFile),
      end: expression.end,
      text: `[(${expression.getText(sourceFile)}), "${unique.join(' ')}"].filter(Boolean).join(" ")`,
    });
  }
}

function transformFile(file) {
  if (excluded.has(path.normalize(path.relative(process.cwd(), file)))) {
    counts.skippedDirty++;
    return;
  }
  const original = fs.readFileSync(file, 'utf8');
  const sourceFile = ts.createSourceFile(file, original, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];
  const ancestors = [];

  function visit(node) {
    if (!ts.isJsxElement(node) && !ts.isJsxSelfClosingElement(node)) {
      node.forEachChild(visit);
      return;
    }

    const tag = elementName(node, sourceFile);
    const attribute = classAttribute(node);
    const before = classText(attribute, sourceFile);
    const rawTokens = before.split(/\s+/);
    const isActivePill = rawTokens.some(token =>
      !baseToken(token).variants.length && baseToken(token).utility.startsWith('rounded-full')
    ) && rawTokens.some(token =>
      !baseToken(token).variants.length && ['bg-emerald-700', 'bg-indigo-700'].includes(baseToken(token).utility)
    );
    const context = nearestBackground(node, ancestors, sourceFile);
    if (context === 'light') {
      const fragments = attribute?.initializer ? stringFragments(attribute.initializer, sourceFile) : [];
      const transformedFragments = fragments.map(fragment => {
        const raw = original.slice(fragment.start, fragment.end);
        return raw.replace(/\S+/g, token => rewriteUtility(token, tag, ['input', 'select', 'textarea'].includes(tag), null, false, isActivePill));
      });
      const ownTokens = transformedFragments.join(' ').split(/\s+/);
      const badgeBg = ownTokens.find(token =>
        !baseToken(token).variants.length &&
        /^bg-(emerald|blue|amber|purple)-(?:50|100|200)$/.test(baseToken(token).utility.replace(/\/\d+$/, ''))
      );
      const badgeColor = ownTokens.some(token => baseToken(token).utility.startsWith('rounded-full')) && badgeBg
        ? baseToken(badgeBg).utility.match(/^bg-(emerald|blue|amber|purple)-/)[1]
        : null;
      const isForm = ['input', 'select', 'textarea'].includes(tag);
      for (let index = 0; index < fragments.length; index++) {
        const fragment = fragments[index];
        const raw = original.slice(fragment.start, fragment.end);
        const changed = raw.replace(/\S+/g, token => rewriteUtility(token, tag, isForm, badgeColor, true, isActivePill));
        if (changed !== raw) edits.push({ start: fragment.start, end: fragment.end, text: changed });
        transformedFragments[index] = changed;
      }

      const extra = [];
      if (isForm) {
        const has = utility => ownTokens.some(token => baseToken(token).variants.length === 0 && baseToken(token).utility === utility);
        if (!has('text-slate-900')) extra.push('text-slate-900');
        if (!has('font-bold')) extra.push('font-bold');
        if (!has('border')) extra.push('border');
        if (!has('border-slate-300')) extra.push('border-slate-300');
        if (!ownTokens.some(token => baseToken(token).utility.startsWith('rounded'))) extra.push('rounded');
        if (!ownTokens.some(token => baseToken(token).variants.length === 0 && baseToken(token).utility.startsWith('bg-'))) extra.push('bg-white');
        if (!ownTokens.some(token => baseToken(token).variants.includes('focus') && /^focus:ring-(?:0|1|2|4|8)$/.test(token))) extra.push('focus:ring-2');
        if (!ownTokens.some(token => baseToken(token).variants.includes('focus') && /^focus:ring-(?!offset)/.test(token))) extra.push('focus:ring-indigo-500');
        if (tag !== 'select' && !ownTokens.some(token =>
          baseToken(token).variants.includes('placeholder') && baseToken(token).utility === 'text-slate-400'
        )) extra.push('placeholder:text-slate-400');
        if (tag === 'input' && inputType(node, sourceFile).includes('number') && !has('font-mono')) extra.push('font-mono');
        if (extra.length) counts.forms++;
      }
      if (badgeColor) {
        const badgeClasses = badges[badgeColor];
        if (!ownTokens.some(token => baseToken(token).variants.length === 0 && baseToken(token).utility === 'border')) extra.push('border');
        for (const badgeClass of badgeClasses) {
          if (!ownTokens.some(token => baseToken(token).variants.length === 0 && baseToken(token).utility === badgeClass)) extra.push(badgeClass);
        }
        if (!ownTokens.some(token => baseToken(token).variants.length === 0 && baseToken(token).utility === 'font-black')) extra.push('font-black');
        if (extra.length) counts.badges++;
      }
      if (isActivePill) {
        if (!ownTokens.some(token => baseToken(token).variants.length === 0 && baseToken(token).utility === 'text-white')) extra.push('text-white');
        if (!ownTokens.some(token => baseToken(token).variants.length === 0 && baseToken(token).utility === 'font-extrabold')) extra.push('font-extrabold');
      }
      appendClassAttributeEdits(node, attribute, extra, sourceFile, edits);
    } else if (isActivePill) {
      const fragments = attribute?.initializer ? stringFragments(attribute.initializer, sourceFile) : [];
      for (const fragment of fragments) {
        const raw = original.slice(fragment.start, fragment.end);
        const changed = raw.replace(/\S+/g, token => rewriteUtility(token, tag, false, null, true, true));
        if (changed !== raw) edits.push({ start: fragment.start, end: fragment.end, text: changed });
      }
      const extra = [];
      if (!rawTokens.some(token => baseToken(token).variants.length === 0 && baseToken(token).utility === 'text-white')) extra.push('text-white');
      if (!rawTokens.some(token => baseToken(token).variants.length === 0 && baseToken(token).utility === 'font-extrabold')) extra.push('font-extrabold');
      appendClassAttributeEdits(node, attribute, extra, sourceFile, edits);
    }

    if (ts.isJsxElement(node)) {
      ancestors.push(classText(classAttribute(node), sourceFile));
      node.children.forEach(visit);
      ancestors.pop();
    }
  }
  visit(sourceFile);

  if (!edits.length) return;
  counts.files++;
  edits.sort((a, b) => b.start - a.start || b.end - a.end);
  let updated = original;
  let previousStart = Infinity;
  for (const edit of edits) {
    if (edit.end > previousStart) throw new Error(`Overlapping edits in ${file}`);
    updated = updated.slice(0, edit.start) + edit.text + updated.slice(edit.end);
    previousStart = edit.start;
  }
  if (applyChanges) fs.writeFileSync(file, updated);
}

for (const root of roots) {
  for (const file of collectFiles(root)) transformFile(file);
}
console.log(JSON.stringify({ mode: applyChanges ? 'apply' : 'dry-run', ...counts }, null, 2));
