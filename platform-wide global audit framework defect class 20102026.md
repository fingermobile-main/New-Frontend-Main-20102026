Yes. This should be treated as a **platform-wide defect class**, not a page-by-page cosmetic issue.

The defect is:

> **Dead affordance:** any button, link, tab, card, menu item, form control, row action, toggle, or clickable surface that appears interactive but has no real navigation, no state change, no API call, no database persistence, no modal/drawer target, or no meaningful user outcome.

If hundreds or thousands of elements are like this, the audit must be global, automated, repeatable, and enforced in CI.

Below is the **global platform audit framework** you should run across the entire monorepo.

---

# 1. Global Audit Objective

Audit every frontend surface starting from:

```txt
http://localhost:3000/dashboard
```

and extend across all consoles, dashboards, modals, drawers, tables, settings pages, media surfaces, feed surfaces, call surfaces, admin surfaces, and shared UI components.

The audit must identify every element that is visually or semantically interactive but does not do one of the following:

1. Navigate to a real route.
2. Open a real modal/drawer/popover.
3. Submit a real form.
4. Call a real backend endpoint.
5. Persist data to PostgreSQL.
6. Update real application state/context.
7. Trigger a real file/media upload.
8. Perform a real local utility action, such as copy, download, print, close, cancel, back, toggle, expand, collapse.
9. Have a clearly justified disabled state with explanation.

Anything else is a stub, dead CTA, fake button, hashed link, orphan tab, or missing endpoint.

---

# 2. Non-Negotiable Platform Rule

## No dead interactive elements are allowed.

Every interactive element must resolve to exactly one of these categories:

| Category | Required Behavior |
|---|---|
| Navigation CTA | Must have valid `href`, `to`, router push, or external URL |
| Mutation CTA | Must call backend API and persist to database where applicable |
| Form CTA | Must have real `onSubmit` or valid `action` |
| Upload CTA | Must send `multipart/form-data` to backend, not localStorage |
| Tab CTA | Must switch panel/state and update URL or controlled state |
| Modal/Drawer CTA | Must open/close a real target |
| Toggle CTA | Must update real state and/or persist setting |
| Row Action CTA | Must execute action against record ID |
| Utility CTA | Must copy/download/print/close/etc. for real |
| Disabled CTA | Must be disabled intentionally and explain why |

If an element cannot satisfy one of those, it must be removed, hidden behind a properly gated feature, or implemented.

No placeholder buttons.

No `href="#"`.

No `onClick={() => {}}`.

No “coming soon” controls in production UI.

No fake cards.

No dead tabs.

No orphan forms.

No localStorage pretending to be persistence.

---

# 3. Audit Scope

Audit these layers globally:

```txt
/Users/user/Documents/FingerMobile Protocol Communication
/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol
```

Focus directories:

```txt
apps/frontend
apps/backend
packages/ui
packages/api
packages/shared
packages/config
packages/database
```

Ignore:

```txt
node_modules
.next
dist
build
coverage
out
.turbo
.git
```

File types:

```txt
*.js
*.jsx
*.ts
*.tsx
*.css
*.scss
*.html
```

---

# 4. Defect Taxonomy

Use this taxonomy for the audit report.

## A. Dead Link / Hashed Navigation

Examples:

```jsx
<a href="#">Dashboard</a>
<Link href="#">Settings</Link>
<a href="">Continue</a>
<a href="javascript:void(0)">Open</a>
<a href="javascript:;">View</a>
<Link to="#">Console</Link>
```

Severity:

```txt
High
```

Required fix:

```txt
Provide real route, remove element, or convert to proper button with real action.
```

---

## B. Dead Button / No Handler

Examples:

```jsx
<button>Save</button>
<button type="button">Upload</button>
<Button>Connect</Button>
<button onClick={undefined}>Approve</button>
<button onClick={null}>Delete</button>
```

Severity:

```txt
High
```

Required fix:

```txt
Bind real handler or remove.
```

---

## C. No-Op Handler

Examples:

```jsx
<button onClick={() => {}}>Save</button>
<button onClick={async () => {}}>Submit</button>
<button onClick={() => null}>Cancel</button>
<button onClick={() => console.log('clicked')}>Upload</button>
<button onClick={(e) => e.preventDefault()}>Submit</button>
```

Severity:

```txt
High
```

Required fix:

```txt
Replace with real action pipeline.
```

---

## D. Named Handler Is Empty / Stub

Examples:

```jsx
const handleSave = () => {};

<button onClick={handleSave}>Save</button>
```

or:

```jsx
const handleSubmit = async () => {
  // TODO
};
```

Severity:

```txt
High
```

Required fix:

```txt
Implement handler or remove button.
```

---

## E. Dead Form

Examples:

```jsx
<form>
  <button type="submit">Save</button>
</form>
```

or:

```jsx
<form onSubmit={() => {}}>
```

or:

```jsx
<form action="#">
```

Severity:

```txt
High
```

Required fix:

```txt
Form must have real submit handler or valid action endpoint.
```

---

## F. Upload Form Not Using Backend

Examples:

```jsx
<form encType="multipart/form-data" onSubmit={saveToLocalStorage}>
```

or:

```js
localStorage.setItem('media', JSON.stringify(file));
```

Severity:

```txt
Critical
```

Required fix:

```txt
Browser must send multipart/form-data to Express backend.
Backend must persist metadata to PostgreSQL.
File must be stored according to platform storage policy.
No client-only persistence.
```

---

## G. Dead Tab

Examples:

```jsx
<button role="tab">Activity</button>
<div role="tab">Settings</div>
<Tab label="Console" />
```

with no panel switch, no route change, no state change.

Severity:

```txt
High
```

Required fix:

```txt
Tabs must control real panels, URL search params, route segments, or persisted UI state.
```

---

## H. Fake Clickable Surface

Examples:

```jsx
<div className="cursor-pointer hover:shadow">Card</div>
<span className="cursor-pointer">View Profile</span>
<tr className="cursor-pointer">...</tr>
```

with no `onClick`, no link, no keyboard handler, no accessible role.

Severity:

```txt
Medium to High
```

Required fix:

```txt
Convert to real button/link or remove clickable styling.
```

---

## I. Missing Accessible Name

Examples:

```jsx
<button>
  <Icon name="save" />
</button>
```

with no `aria-label`, `title`, visible text, or labelledby.

Severity:

```txt
Medium
```

Required fix:

```txt
Every interactive element must have an accessible name.
```

---

## J. Disabled Without Explanation

Examples:

```jsx
<button disabled>Upgrade</button>
```

with no tooltip, helper text, reason, or feature gate.

Severity:

```txt
Low to Medium
```

Required fix:

```txt
Either enable with real action or explain why disabled.
```

---

## K. TODO / Stub / Mock / Placeholder Language

Examples:

```txt
TODO
FIXME
STUB
mock
placeholder
coming soon
not implemented
dummy
fake
temp
```

Severity:

```txt
High if attached to interactive element
Medium otherwise
```

Required fix:

```txt
Remove from production UI or implement.
```

---

## L. Frontend Calls Missing Backend Endpoint

Examples:

```js
fetch('/api/dashboard/stats')
```

but backend has no corresponding route.

Severity:

```txt
Critical
```

Required fix:

```txt
Create backend controller/service/repository route or remove frontend call.
```

---

## M. Backend Endpoint Exists But Does Not Persist

Examples:

```js
app.post('/api/upload', (req, res) => {
  res.json({ success: true });
});
```

with no database insert/update.

Severity:

```txt
Critical
```

Required fix:

```txt
Endpoint must validate, authenticate, authorize, persist, and return real data.
```

---

## N. Database Table / Migration Missing

Examples:

```sql
INSERT INTO media_uploads ...
```

but table does not exist.

Severity:

```txt
Critical
```

Required fix:

```txt
Create migration, constraints, indexes, RLS/authorization model if needed, and seed/test data.
```

---

# 5. Immediate Terminal Audit Commands

Run these from the workspace root:

```bash
cd "/Users/user/Documents/FingerMobile Protocol Communication"
```

Create reports folder:

```bash
mkdir -p reports
```

---

## 5.1 Quick Hashed Link Audit

```bash
rg -n --no-heading \
  -g '*.{js,jsx,ts,tsx}' \
  -e 'href=["'"'"']#' \
  -e 'href=\{["'"'"']#["'"'"']\}' \
  -e 'to=["'"'"']#' \
  -e 'href=["'"'"']""' \
  -e 'href=["'"'"']javascript:void\(0\)' \
  -e 'href=["'"'"']javascript:;' \
  apps packages > reports/hashed-links.txt
```

---

## 5.2 Empty Click Handler Audit

```bash
rg -n --no-heading \
  -g '*.{js,jsx,ts,tsx}' \
  -e 'onClick=\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*\}' \
  -e 'onClick=\{\s*async\s*\(\s*\)\s*=>\s*\{\s*\}\s*\}' \
  -e 'onClick=\{undefined\}' \
  -e 'onClick=\{null\}' \
  -e 'onPress=\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*\}' \
  -e 'onSelect=\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*\}' \
  apps packages > reports/empty-click-handlers.txt
```

---

## 5.3 Empty Submit Handler Audit

```bash
rg -n --no-heading \
  -g '*.{js,jsx,ts,tsx}' \
  -e 'onSubmit=\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*\}' \
  -e 'onSubmit=\{\s*async\s*\(\s*\)\s*=>\s*\{\s*\}\s*\}' \
  -e 'onSubmit=\{undefined\}' \
  -e 'onSubmit=\{null\}' \
  -e 'action=["'"'"']#' \
  apps packages > reports/dead-forms.txt
```

---

## 5.4 TODO / Stub / Mock Audit

```bash
rg -n --no-heading \
  -g '*.{js,jsx,ts,tsx}' \
  -e 'TODO' \
  -e 'FIXME' \
  -e 'XXX' \
  -e 'stub' \
  -e 'Stub' \
  -e 'mock' \
  -e 'Mock' \
  -e 'placeholder' \
  -e 'Placeholder' \
  -e 'coming soon' \
  -e 'not implemented' \
  -e 'dummy' \
  -e 'fake' \
  apps packages > reports/stub-language.txt
```

---

## 5.5 Client Storage Persistence Audit

This is critical because you explicitly do not want localStorage acting as persistence.

```bash
rg -n --no-heading \
  -g '*.{js,jsx,ts,tsx}' \
  -e 'localStorage\.' \
  -e 'sessionStorage\.' \
  -e 'indexedDB' \
  -e 'window\.localStorage' \
  -e 'window\.sessionStorage' \
  apps packages > reports/client-storage-usage.txt
```

Any hit related to upload, feed, messages, media, dashboard state, console state, settings persistence, auth, or records must be reviewed.

Allowed use:

```txt
Non-sensitive UI preferences only, if justified.
```

Not allowed:

```txt
Source of truth for platform data.
```

---

## 5.6 Frontend Network Call Audit

```bash
rg -n --no-heading \
  -g '*.{js,jsx,ts,tsx}' \
  -e 'fetch\(' \
  -e 'axios\.' \
  -e 'api\.' \
  -e '/api/' \
  apps packages > reports/frontend-api-calls.txt
```

---

## 5.7 Backend Route Audit

```bash
rg -n --no-heading \
  -g '*.{js,ts}' \
  -e 'router\.(get|post|put|patch|delete)\(' \
  -e 'app\.(get|post|put|patch|delete)\(' \
  -e 'fastify\.(get|post|put|patch|delete)\(' \
  apps packages > reports/backend-routes.txt
```

---

## 5.8 Database Access Audit

```bash
rg -n --no-heading \
  -g '*.{js,ts}' \
  -e 'pool\.query' \
  -e 'client\.query' \
  -e 'knex' \
  -e 'prisma' \
  -e 'drizzle' \
  -e 'sequelize' \
  -e 'db\.' \
  apps packages > reports/database-access.txt
```

---

# 6. Automated AST Scanner

The grep commands are useful for fast discovery, but for a platform with hundreds/thousands of repeated elements, you need an AST scanner.

Install scanner dependencies:

```bash
npm install -D @babel/parser @babel/traverse
```

Create:

```bash
mkdir -p scripts
touch scripts/audit-dead-ctas.mjs
```

Use this starter scanner:

```js
#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import parser from "@babel/parser";
import _traverse from "@babel/traverse";

const traverse = _traverse.default ?? _traverse;

const argv = process.argv.slice(2);

function getArg(name, fallback) {
  const prefix = `--${name}=`;
  const hit = argv.find((a) => a.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
}

const roots = getArg("src", "apps,packages")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const csvOut = getArg("out", "reports/dead-cta-audit.csv");
const jsonOut = getArg("json", "reports/dead-cta-audit.json");

const extensions = new Set([".js", ".jsx", ".ts", ".tsx"]);

const ignoredDirs = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  "coverage",
  "out",
  ".turbo",
  "vendor",
]);

const findings = [];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) continue;
      walk(path.join(dir, entry.name), files);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (extensions.has(ext)) {
        files.push(path.join(dir, entry.name));
      }
    }
  }

  return files;
}

function parseFile(file) {
  const code = fs.readFileSync(file, "utf8");

  return parser.parse(code, {
    sourceType: "module",
    plugins: [
      "jsx",
      "typescript",
      "decorators-legacy",
      "classProperties",
      "optionalChaining",
      "nullishCoalescingOperator",
    ],
  });
}

function getName(node) {
  if (!node) return "";

  if (node.type === "JSXIdentifier") return node.name;

  if (node.type === "JSXMemberExpression") {
    return `${getName(node.object)}.${getName(node.property)}`;
  }

  if (node.type === "JSXNamespacedName") {
    return `${node.namespace.name}:${node.name.name}`;
  }

  return "";
}

function getAttr(openingElement, name) {
  if (!openingElement) return null;

  return (
    openingElement.attributes?.find(
      (attr) => attr.type === "JSXAttribute" && attr.name?.name === name
    ) || null
  );
}

function attrStringValue(attr) {
  if (!attr) return null;

  if (attr.value?.type === "StringLiteral") {
    return attr.value.value;
  }

  if (
    attr.value?.type === "JSXExpressionContainer" &&
    attr.value.expression?.type === "StringLiteral"
  ) {
    return attr.value.expression.value;
  }

  return null;
}

function attrExpression(attr) {
  if (attr?.value?.type === "JSXExpressionContainer") {
    return attr.value.expression;
  }

  return null;
}

function isFunctionNode(node) {
  return (
    node &&
    (node.type === "ArrowFunctionExpression" ||
      node.type === "FunctionExpression" ||
      node.type === "FunctionDeclaration")
  );
}

function getBodyStatements(body) {
  if (!body) return [];

  if (body.type === "BlockStatement") {
    return body.body;
  }

  return [{ type: "ExpressionStatement", expression: body }];
}

function isNoOpFunction(node) {
  if (!isFunctionNode(node)) return false;

  const statements = getBodyStatements(node.body);

  if (statements.length === 0) return true;

  if (statements.length > 1) return false;

  const statement = statements[0];

  if (!statement || statement.type !== "ExpressionStatement") return false;

  const expr = statement.expression;

  // () => console.log(...)
  if (
    expr.type === "CallExpression" &&
    expr.callee?.type === "MemberExpression" &&
    expr.callee.object?.name === "console"
  ) {
    return true;
  }

  // (e) => e.preventDefault()
  if (
    expr.type === "CallExpression" &&
    expr.callee?.type === "MemberExpression" &&
    expr.callee.property?.name === "preventDefault"
  ) {
    return true;
  }

  // () => null
  // () => undefined
  // () => false
  // () => true
  if (node.type === "ArrowFunctionExpression" && node.body?.type !== "BlockStatement") {
    const body = node.body;

    if (body.type === "NullLiteral") return true;
    if (body.type === "BooleanLiteral") return true;

    if (
      body.type === "Identifier" &&
      ["undefined", "noop", "Noop", "NOOP"].includes(body.name)
    ) {
      return true;
    }
  }

  return false;
}

function collectNoopHandlerNames(ast) {
  const names = new Set();

  traverse(ast, {
    FunctionDeclaration(pathRef) {
      if (pathRef.node.id?.name && isNoOpFunction(pathRef.node)) {
        names.add(pathRef.node.id.name);
      }
    },

    VariableDeclarator(pathRef) {
      if (
        pathRef.node.id?.type === "Identifier" &&
        isFunctionNode(pathRef.node.init) &&
        isNoOpFunction(pathRef.node.init)
      ) {
        names.add(pathRef.node.id.name);
      }
    },
  });

  return names;
}

function getTextFromChildren(children = []) {
  const parts = [];

  for (const child of children) {
    if (child.type === "JSXText") {
      const text = child.value.trim();
      if (text) parts.push(text);
    }

    if (child.type === "JSXExpressionContainer") {
      const expr = child.expression;

      if (expr?.type === "StringLiteral") {
        parts.push(expr.value);
      }

      if (expr?.type === "TemplateLiteral") {
        const text = expr.quasis
          .map((q) => q.value?.cooked || q.value?.raw || "")
          .join("");

        if (text.trim()) parts.push(text.trim());
      }
    }

    if (child.type === "JSXElement") {
      const elName = getName(child.openingElement?.name).toLowerCase();

      if (elName === "img") {
        const alt = attrStringValue(getAttr(child.openingElement, "alt"));
        if (alt) parts.push(alt);
      }
    }
  }

  return parts.join(" ").replace(/\s+/g, " ").trim().slice(0, 160);
}

function getElementLabel(pathRef) {
  const opening = pathRef.node.openingElement;

  const attrCandidates = [
    "aria-label",
    "title",
    "placeholder",
    "name",
    "label",
  ];

  for (const attrName of attrCandidates) {
    const value = attrStringValue(getAttr(opening, attrName));
    if (value) return value;
  }

  const text = getTextFromChildren(pathRef.node.children);
  if (text) return text;

  return "";
}

function recommendFor(label, elementName, issue) {
  const text = `${label} ${issue}`.toLowerCase();

  if (
    /upload|attach|file|media|image|video|audio|photo|picture|camera/.test(text)
  ) {
    return "Wire to multipart/form-data backend upload endpoint. Persist metadata to PostgreSQL. Remove any localStorage fallback.";
  }

  if (
    /save|update|edit|create|add|submit|confirm|approve|reject|delete|remove|archive|send|invite|connect|disconnect|enable|disable|verify|generate|export|import|sync|start|stop|call|message|post|publish/.test(
      text
    )
  ) {
    return "Implement real mutation endpoint, authorization check, database transaction, loading state, success state, and error state.";
  }

  if (/view|open|details|profile|dashboard|console|settings|page/.test(text)) {
    return "Route to a real page/modal/drawer or remove the control if no destination exists.";
  }

  if (/close|cancel|back|dismiss|exit/.test(text)) {
    return "Bind to real local state, router.back(), modal controller, or drawer controller.";
  }

  if (/tab|panel|section/.test(text)) {
    return "Connect tab to real panel state, route segment, or search param. Render actual content.";
  }

  return "Define explicit CTA contract or remove element from production UI.";
}

function addFinding({
  file,
  line,
  column,
  element,
  label,
  issue,
  severity,
  handlerName = "",
  snippet = "",
}) {
  findings.push({
    file: path.relative(process.cwd(), file),
    line: line || "",
    column: column || "",
    element,
    label,
    issue,
    severity,
    handlerName,
    snippet: String(snippet || "").replace(/\s+/g, " ").trim().slice(0, 180),
    recommendation: recommendFor(label, element, issue),
  });
}

function scanFile(file) {
  let ast;

  try {
    ast = parseFile(file);
  } catch (error) {
    addFinding({
      file,
      line: 1,
      column: 1,
      element: "parser",
      label: "",
      issue: `parse-error: ${error.message}`,
      severity: "medium",
    });

    return;
  }

  const noopHandlers = collectNoopHandlerNames(ast);

  traverse(ast, {
    JSXOpeningElement(pathRef) {
      const opening = pathRef.node;
      const elementName = getName(opening.name);
      const lowerName = elementName.toLowerCase();

      const hrefAttr = getAttr(opening, "href") || getAttr(opening, "to");
      const hrefValue = attrStringValue(hrefAttr);
      const hrefExpr = attrExpression(hrefAttr);

      const clickAttr =
        getAttr(opening, "onClick") ||
        getAttr(opening, "onPress") ||
        getAttr(opening, "onTap");

      const clickExpr = attrExpression(clickAttr);

      const roleValue = attrStringValue(getAttr(opening, "role"));
      const typeValue = attrStringValue(getAttr(opening, "type"));
      const classNameValue =
        attrStringValue(getAttr(opening, "className")) || "";

      const loc = pathRef.node.loc?.start || {};
      const label = getElementLabel(pathRef.parentPath || pathRef);

      const isAnchorLike =
        lowerName === "a" ||
        elementName === "Link" ||
        elementName.endsWith(".Link");

      const isButtonLike =
        lowerName === "button" ||
        elementName === "Button" ||
        elementName.endsWith(".Button") ||
        roleValue === "button";

      const isFormLike = lowerName === "form";

      const isTabLike =
        roleValue === "tab" ||
        elementName === "Tab" ||
        elementName.endsWith(".Tab");

      const isFakeClickable =
        ["div", "span", "li", "td", "tr", "card", "Card"].includes(lowerName) &&
        (classNameValue.includes("cursor-pointer") ||
          !!getAttr(opening, "tabIndex"));

      // Anchors / links
      if (isAnchorLike) {
        if (!hrefValue && !hrefExpr && !clickExpr) {
          addFinding({
            file,
            line: loc.line,
            column: loc.column,
            element: elementName,
            label,
            issue: "missing-navigation-target",
            severity: "high",
          });
        }

        if (
          hrefValue === "#" ||
          hrefValue === "" ||
          hrefValue === "javascript:void(0)" ||
          hrefValue === "javascript:;" ||
          hrefValue === "#!"
        ) {
          addFinding({
            file,
            line: loc.line,
            column: loc.column,
            element: elementName,
            label,
            issue: "hashed-or-empty-link",
            severity: "high",
          });
        }

        if (
          hrefExpr?.type === "StringLiteral" &&
          ["#", "", "javascript:void(0)", "javascript:;", "#!"].includes(
            hrefExpr.value
          )
        ) {
          addFinding({
            file,
            line: loc.line,
            column: loc.column,
            element: elementName,
            label,
            issue: "hashed-or-empty-link-expression",
            severity: "high",
          });
        }
      }

      // Buttons
      if (isButtonLike) {
        if (!clickExpr && typeValue !== "submit") {
          addFinding({
            file,
            line: loc.line,
            column: loc.column,
            element: elementName,
            label,
            issue: "button-missing-click-handler",
            severity: "high",
          });
        }

        if (clickExpr) {
          if (clickExpr.type === "NullLiteral") {
            addFinding({
              file,
              line: loc.line,
              column: loc.column,
              element: elementName,
              label,
              issue: "null-click-handler",
              severity: "high",
            });
          }

          if (
            clickExpr.type === "Identifier" &&
            clickExpr.name === "undefined"
          ) {
            addFinding({
              file,
              line: loc.line,
              column: loc.column,
              element: elementName,
              label,
              issue: "undefined-click-handler",
              severity: "high",
            });
          }

          if (
            clickExpr.type === "Identifier" &&
            noopHandlers.has(clickExpr.name)
          ) {
            addFinding({
              file,
              line: loc.line,
              column: loc.column,
              element: elementName,
              label,
              issue: "named-handler-is-noop",
              severity: "high",
              handlerName: clickExpr.name,
            });
          }

          if (isFunctionNode(clickExpr) && isNoOpFunction(clickExpr)) {
            addFinding({
              file,
              line: loc.line,
              column: loc.column,
              element: elementName,
              label,
              issue: "inline-handler-is-noop",
              severity: "high",
            });
          }
        }

        if (typeValue === "submit") {
          const formParent = pathRef.findParent((parent) => {
            return (
              parent.isJSXElement?.() &&
              getName(parent.node.openingElement.name).toLowerCase() === "form"
            );
          });

          if (!formParent) {
            addFinding({
              file,
              line: loc.line,
              column: loc.column,
              element: elementName,
              label,
              issue: "submit-button-outside-form",
              severity: "medium",
            });
          } else {
            const formOpening = formParent.node.openingElement;
            const onSubmitAttr = getAttr(formOpening, "onSubmit");
            const onSubmitExpr = attrExpression(onSubmitAttr);
            const actionValue = attrStringValue(getAttr(formOpening, "action"));

            if (!onSubmitExpr && (!actionValue || actionValue === "#")) {
              addFinding({
                file,
                line: formParent.node.loc?.start?.line || loc.line,
                column: formParent.node.loc?.start?.column || loc.column,
                element: "form",
                label: getElementLabel(formParent),
                issue: "form-submit-without-handler-or-action",
                severity: "high",
              });
            }
          }
        }
      }

      // Forms
      if (isFormLike) {
        const onSubmitAttr = getAttr(opening, "onSubmit");
        const onSubmitExpr = attrExpression(onSubmitAttr);
        const actionValue = attrStringValue(getAttr(opening, "action"));

        if (!onSubmitExpr && (!actionValue || actionValue === "#")) {
          addFinding({
            file,
            line: loc.line,
            column: loc.column,
            element: elementName,
            label,
            issue: "form-without-submit-target",
            severity: "high",
          });
        }

        if (isFunctionNode(onSubmitExpr) && isNoOpFunction(onSubmitExpr)) {
          addFinding({
            file,
            line: loc.line,
            column: loc.column,
            element: elementName,
            label,
            issue: "form-noop-submit-handler",
            severity: "high",
          });
        }
      }

      // Tabs
      if (isTabLike) {
        if (!clickExpr && !hrefValue && !hrefExpr) {
          addFinding({
            file,
            line: loc.line,
            column: loc.column,
            element: elementName,
            label,
            issue: "tab-without-action",
            severity: "high",
          });
        }

        if (isFunctionNode(clickExpr) && isNoOpFunction(clickExpr)) {
          addFinding({
            file,
            line: loc.line,
            column: loc.column,
            element: elementName,
            label,
            issue: "tab-noop-handler",
            severity: "high",
          });
        }
      }

      // Fake clickables
      if (isFakeClickable) {
        if (!clickExpr && !hrefValue && !hrefExpr) {
          addFinding({
            file,
            line: loc.line,
            column: loc.column,
            element: elementName,
            label,
            issue: "fake-clickable-no-handler",
            severity: "medium",
          });
        }

        if (isFunctionNode(clickExpr) && isNoOpFunction(clickExpr)) {
          addFinding({
            file,
            line: loc.line,
            column: loc.column,
            element: elementName,
            label,
            issue: "fake-clickable-noop-handler",
            severity: "high",
          });
        }
      }

      // Missing accessible name
      if (isButtonLike || isAnchorLike || roleValue === "button") {
        const hasLabel =
          label ||
          getAttr(opening, "aria-labelledby") ||
          getAttr(opening, "aria-label");

        if (!hasLabel) {
          addFinding({
            file,
            line: loc.line,
            column: loc.column,
            element: elementName,
            label: "",
            issue: "missing-accessible-name",
            severity: "medium",
          });
        }
      }
    },

    ObjectProperty(pathRef) {
      const key =
        pathRef.node.key?.name ||
        pathRef.node.key?.value ||
        "";

      const actionKeys = new Set([
        "onClick",
        "onPress",
        "onTap",
        "onSelect",
        "handler",
        "action",
        "submit",
        "onSubmit",
      ]);

      if (!actionKeys.has(key)) return;

      const value = pathRef.node.value;
      const loc = pathRef.node.loc?.start || {};

      if (value.type === "NullLiteral") {
        addFinding({
          file,
          line: loc.line,
          column: loc.column,
          element: `object.${key}`,
          label: "",
          issue: "object-action-null",
          severity: "high",
        });
      }

      if (value.type === "Identifier" && value.name === "undefined") {
        addFinding({
          file,
          line: loc.line,
          column: loc.column,
          element: `object.${key}`,
          label: "",
          issue: "object-action-undefined",
          severity: "high",
        });
      }

      if (isFunctionNode(value) && isNoOpFunction(value)) {
        addFinding({
          file,
          line: loc.line,
          column: loc.column,
          element: `object.${key}`,
          label: "",
          issue: "object-action-noop",
          severity: "high",
        });
      }
    },
  });
}

function toCsv(rows) {
  const headers = [
    "file",
    "line",
    "column",
    "element",
    "label",
    "issue",
    "severity",
    "handlerName",
    "recommendation",
    "snippet",
  ];

  const escape = (value) => {
    const str = String(value ?? "");
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [headers.join(",")];

  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  }

  return `${lines.join("\n")}\n`;
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

const files = [];

for (const root of roots) {
  walk(root, files);
}

for (const file of files) {
  scanFile(file);
}

ensureDir(csvOut);
ensureDir(jsonOut);

fs.writeFileSync(csvOut, toCsv(findings));
fs.writeFileSync(jsonOut, `${JSON.stringify(findings, null, 2)}\n`);

console.log(`Scanned ${files.length} files.`);
console.log(`Found ${findings.length} candidate dead/non-wired interactions.`);
console.log(`CSV: ${csvOut}`);
console.log(`JSON: ${jsonOut}`);
```

Run it:

```bash
node scripts/audit-dead-ctas.mjs \
  --src="apps,packages,FingerMobile Protocol/apps,FingerMobile Protocol/packages" \
  --out="reports/dead-cta-audit.csv" \
  --json="reports/dead-cta-audit.json"
```

If the inner directory duplicates the outer repo, use only one root to avoid duplicate findings:

```bash
node scripts/audit-dead-ctas.mjs \
  --src="FingerMobile Protocol/apps,FingerMobile Protocol/packages" \
  --out="reports/dead-cta-audit.csv" \
  --json="reports/dead-cta-audit.json"
```

---

# 7. Analyze the Audit Output

Once the report is generated, rank the worst offenders.

## Top files with dead interactions

```bash
cut -d',' -f1 reports/dead-cta-audit.csv | tail -n +2 | sort | uniq -c | sort -nr | head -50
```

## Top repeated labels

```bash
cut -d',' -f5 reports/dead-cta-audit.csv | tail -n +2 | sort | uniq -c | sort -nr | head -50
```

## Top issue types

```bash
cut -d',' -f6 reports/dead-cta-audit.csv | tail -n +2 | sort | uniq -c | sort -nr | head -50
```

## High severity only

Using `jq`:

```bash
jq '[.[] | select(.severity == "high")]' reports/dead-cta-audit.json > reports/dead-cta-high.json
```

Count:

```bash
jq 'length' reports/dead-cta-high.json
```

---

# 8. Global CTA Inventory Format

Every audited element should be entered into a master inventory.

Use this schema:

```json
{
  "id": "CTA-000001",
  "surface": "dashboard",
  "route": "/dashboard",
  "component": "DashboardQuickActions",
  "file": "apps/frontend/src/components/dashboard/DashboardQuickActions.tsx",
  "line": 84,
  "element": "button",
  "visible_text": "Upload Media",
  "accessible_name": "Upload Media",
  "current_behavior": "noop",
  "intended_behavior": "upload_media",
  "required_endpoint": "POST /api/media/upload",
  "required_db_tables": [
    "media_assets",
    "feed_items"
  ],
  "auth_required": true,
  "permission_required": "media:create",
  "severity": "critical",
  "status": "unwired",
  "owner": "frontend-platform",
  "recommended_action": "Wire multipart/form-data to backend and persist metadata to PostgreSQL."
}
```

The audit should eventually produce a CSV/JSON with these columns:

```txt
id
surface
route
component
file
line
element
visible_text
accessible_name
current_behavior
intended_behavior
endpoint
method
payload
db_table
auth_required
permission_required
severity
status
owner
recommended_action
```

---

# 9. Endpoint Parity Audit

A dead frontend button often means a missing backend endpoint.

You need a parity matrix:

```txt
Frontend Action → Required API Route → Backend Controller → Service → Repository → DB Table → Response Contract → UI State
```

Generate frontend API calls:

```bash
rg -n --no-heading \
  -g '*.{js,jsx,ts,tsx}' \
  -e 'fetch\(' \
  -e 'axios\.' \
  -e '/api/' \
  apps packages > reports/frontend-api-calls.txt
```

Generate backend routes:

```bash
rg -n --no-heading \
  -g '*.{js,ts}' \
  -e 'router\.(get|post|put|patch|delete)\(' \
  -e 'app\.(get|post|put|patch|delete)\(' \
  apps packages > reports/backend-routes.txt
```

Then compare:

```txt
Every frontend /api/* call must exist in backend routes.
Every backend mutation route must be reachable by a real UI action or be explicitly internal.
Every mutation route must touch PostgreSQL or another approved durable store.
```

---

# 10. Database Persistence Audit

For every mutation CTA, identify the durable effect.

Examples:

| UI Action | Expected Endpoint | Expected DB Effect |
|---|---|---|
| Upload Media | `POST /api/media/upload` | Insert into `media_assets` |
| Create Post | `POST /api/feed/posts` | Insert into `feed_items` |
| Like Post | `POST /api/feed/posts/:id/like` | Insert/update `feed_reactions` |
| Comment | `POST /api/feed/posts/:id/comments` | Insert into `feed_comments` |
| Connect Account | `POST /api/integrations/connect` | Insert/update `integration_connections` |
| Disconnect Account | `DELETE /api/integrations/:id` | Update/delete `integration_connections` |
| Save Settings | `PATCH /api/settings` | Upsert `user_settings` |
| Invite User | `POST /api/team/invites` | Insert `team_invites` |
| Approve Request | `POST /api/requests/:id/approve` | Update `requests.status` |
| Delete Record | `DELETE /api/:resource/:id` | Soft delete or hard delete per policy |
| Export Data | `GET /api/:resource/export` | Generate durable export job/file |
| Start Call | `POST /api/calls/start` | Insert `call_sessions` |
| End Call | `POST /api/calls/:id/end` | Update `call_sessions` |

If a button cannot be mapped to a durable effect or explicit local effect, it should not exist.

---

# 11. LocalStorage Shim Audit

You specifically called this out, so it needs a dedicated gate.

Run:

```bash
rg -n --no-heading \
  -g '*.{js,jsx,ts,tsx}' \
  -e 'localStorage\.' \
  -e 'sessionStorage\.' \
  -e 'indexedDB' \
  -e 'window\.localStorage' \
  -e 'window\.sessionStorage' \
  apps packages > reports/client-storage-usage.txt
```

Classify every hit:

| Classification | Allowed? | Notes |
|---|---:|---|
| Auth token refresh marker | Conditional | Must not be sole source of truth |
| Theme preference | Usually allowed | Non-critical UI preference |
| Sidebar collapsed state | Usually allowed | UX preference only |
| Draft form recovery | Conditional | Must sync to backend when relevant |
| Media upload persistence | Not allowed | Must use backend + PostgreSQL |
| Feed persistence | Not allowed | Must use backend + PostgreSQL |
| Console data persistence | Not allowed | Must use backend + PostgreSQL |
| Dashboard metrics persistence | Not allowed | Must come from API/database |
| User records persistence | Not allowed | Must use backend + PostgreSQL |
| Messages persistence | Not allowed | Must use backend + PostgreSQL |
| Calls persistence | Not allowed | Must use backend + PostgreSQL |

Rule:

```txt
localStorage may store disposable UI preferences only.
localStorage must never be the system of record.
```

---

# 12. Runtime Audit Strategy

Static analysis is the safest first pass.

Runtime clicking is useful but dangerous because many buttons may be destructive.

Use a staged runtime audit:

## Phase A: Read-only crawl

Visit every route and collect interactive elements without clicking.

Targets:

```txt
/dashboard
/camus
all console routes
all settings routes
all media routes
all feed routes
all admin routes
all profile routes
all team routes
all integration routes
```

Collect:

```txt
route
element tag
role
text
aria-label
href
disabled
visible
bounding box
component stack if available
```

## Phase B: Safe click audit

Only click elements marked safe:

```html
<button data-audit-safe="true">
```

or elements classified as:

```txt
open modal
close modal
switch tab
expand section
copy link
navigate to known safe route
```

Do not automatically click:

```txt
delete
remove
disconnect
revoke
reset
send
invite
publish
charge
transfer
start call
end call
upload
overwrite
```

unless running against a disposable staging database.

## Phase C: Network assertion

For each mutation CTA, assert:

```txt
A network request is made.
The request goes to /api/*.
The response status is expected.
The database changes.
The UI updates from server response or revalidated query.
```

---

# 13. Required CTA Contract

Every interactive element should declare its contract explicitly.

Example:

```ts
type CtaContract = {
  id: string;
  label: string;
  intent:
    | "navigate"
    | "mutate"
    | "upload"
    | "submit"
    | "toggle"
    | "open-modal"
    | "close-modal"
    | "select-tab"
    | "copy"
    | "download"
    | "print"
    | "disabled-explained";

  route?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  payloadSchema?: unknown;
  dbTables?: string[];
  permission?: string;
  successBehavior?: string;
  errorBehavior?: string;
  loadingBehavior?: string;
  analyticsEvent?: string;
};
```

Then shared components can enforce it.

Example:

```tsx
<Action_button
  id="dashboard-upload-media"
  label="Upload Media"
  intent="upload"
  endpoint="/api/media/upload"
  method="POST"
  dbTables={["media_assets", "feed_items"]}
  permission="media:create"
/>
```

If `intent` is missing, the component throws in development and fails CI in production builds.

---

# 14. Shared Button Policy

If hundreds of buttons are dead, the problem is likely systemic shared components.

Your shared `Button` should not allow ambiguous rendering.

Bad:

```tsx
<Button>Save</Button>
```

Better:

```tsx
<Button
  action={saveAction}
>
  Save
</Button>
```

Or:

```tsx
<Button href="/dashboard/settings">
  Open Settings
</Button>
```

Or:

```tsx
<Button
  disabled
  disabledReason="Requires verified organization"
>
  Upgrade
</Button>
```

Development-mode rule:

```txt
If Button has no href, no to, no onClick, no action, no submit target, and is not intentionally disabled, render a visible development error.
```

Example:

```tsx
if (process.env.NODE_ENV !== "production") {
  if (!href && !to && !onClick && !action && !disabled) {
    throw new Error(`Dead CTA detected: "${children}" in ${componentStack}`);
  }
}
```

This will surface the problem immediately during local development.

---

# 15. CI Enforcement

Add CI checks so this cannot regress.

## CI Gate 1: No hashed links

Fail if:

```txt
href="#"
href=""
href="javascript:void(0)"
href="javascript:;"
to="#"
```

appear in production-facing frontend files.

## CI Gate 2: No empty handlers

Fail if:

```txt
onClick={() => {}}
onSubmit={() => {}}
onClick={undefined}
onClick={null}
```

appear.

## CI Gate 3: No stub language near interactive elements

Fail if:

```txt
TODO
FIXME
coming soon
not implemented
stub
mock
placeholder
```

appear in components rendering buttons/links/forms.

## CI Gate 4: No localStorage as persistence

Fail if upload/feed/dashboard/console/message/call/settings mutation paths reference localStorage as source of truth.

## CI Gate 5: Endpoint parity

Fail if frontend calls `/api/*` routes that do not exist in backend route manifest.

## CI Gate 6: Dead CTA scanner returns zero high-severity findings

Command:

```bash
node scripts/audit-dead-ctas.mjs --src="apps,packages" --out="reports/dead-cta-audit.csv" --json="reports/dead-cta-audit.json"

HIGH_COUNT=$(jq '[.[] | select(.severity == "high")] | length' reports/dead-cta-audit.json)

if [ "$HIGH_COUNT" -gt 0 ]; then
  echo "Dead CTA audit failed with $HIGH_COUNT high severity findings."
  exit 1
fi
```

---

# 16. Remediation Priority Matrix

Do not fix randomly. Prioritize by user impact and platform integrity.

## Priority 0 — Critical

Elements that fake persistence or safety.

Examples:

```txt
Upload buttons using localStorage
Save buttons with no API
Delete buttons with no backend confirmation
Connect/disconnect integration buttons with no endpoint
Payment/billing/upgrade buttons with no real flow
Auth/session buttons with no real behavior
Feed publish buttons with no database write
```

Action:

```txt
Fix immediately or remove from UI.
```

---

## Priority 1 — High

Core dashboard/console CTAs.

Examples:

```txt
Dashboard quick actions
Console tabs
Settings save buttons
Media management buttons
Feed actions
Team invite buttons
Approval/rejection buttons
Export/import buttons
```

Action:

```txt
Wire to real endpoints and database tables.
```

---

## Priority 2 — Medium

Secondary UI affordances.

Examples:

```txt
Card click areas
Row menus
Filter buttons
Sort buttons
View toggles
Copy buttons
Tooltip triggers
Expand/collapse controls
```

Action:

```txt
Implement real local/state behavior or remove fake affordance.
```

---

## Priority 3 — Low

Polish/accessibility.

Examples:

```txt
Missing accessible names
Disabled buttons without explanation
Inconsistent loading states
Missing analytics events
```

Action:

```txt
Clean up during component normalization.
```

---

# 17. Recommended Audit Workflow

Use this exact sequence.

## Step 1: Generate full static audit

```bash
node scripts/audit-dead-ctas.mjs \
  --src="FingerMobile Protocol/apps,FingerMobile Protocol/packages" \
  --out="reports/dead-cta-audit.csv" \
  --json="reports/dead-cta-audit.json"
```

## Step 2: Count total findings

```bash
jq 'length' reports/dead-cta-audit.json
```

## Step 3: Count high severity findings

```bash
jq '[.[] | select(.severity == "high")] | length' reports/dead-cta-audit.json
```

## Step 4: Group by file

```bash
jq -r '.[].file' reports/dead-cta-audit.json | sort | uniq -c | sort -nr | head -50
```

## Step 5: Group by issue

```bash
jq -r '.[].issue' reports/dead-cta-audit.json | sort | uniq -c | sort -nr
```

## Step 6: Group by label

```bash
jq -r '.[].label' reports/dead-cta-audit.json | sort | uniq -c | sort -nr | head -100
```

## Step 7: Identify repeated shared components

```bash
jq -r '.[] | select(.element == "Button" or .element == "button") | .file' reports/dead-cta-audit.json | sort | uniq -c | sort -nr | head -50
```

## Step 8: Create backlog by domain

Domains:

```txt
dashboard
camus
media
feed
calls
settings
team
integrations
auth
admin
notifications
analytics
billing
```

Each domain gets:

```txt
dead CTAs
missing endpoints
missing DB tables
localStorage violations
accessibility issues
remediation owner
target release
```

---

# 18. Expected Audit Report Structure

The final audit report should have these sections:

```txt
1. Executive Summary
2. Total Interactive Elements Scanned
3. Total Dead/Unwired Elements Found
4. Findings by Severity
5. Findings by Surface
6. Findings by Route
7. Findings by Component
8. Findings by Issue Type
9. Missing Backend Endpoints
10. Missing Database Tables
11. localStorage Persistence Violations
12. Upload Pipeline Violations
13. Feed Persistence Violations
14. Console Tab Violations
15. Dashboard CTA Violations
16. Accessibility Issues
17. Remediation Plan by Priority
18. CI Enforcement Plan
19. Sign-off Checklist
```

---

# 19. Executive Summary Template

Use this once the scan completes:

```md
# Global Dead CTA Audit Summary

Date:

Repository:

Branch:

Commit:

Scope:

- apps/frontend
- apps/backend
- packages/ui
- packages/api
- packages/shared

## Results

Total files scanned:

Total interactive elements inspected:

Total findings:

High severity findings:

Medium severity findings:

Low severity findings:

## Top Defect Classes

1. Button missing click handler:
2. Hashed or empty link:
3. Inline no-op handler:
4. Named no-op handler:
5. Form without submit target:
6. Tab without action:
7. Fake clickable surface:
8. Missing accessible name:
9. localStorage persistence violation:
10. Missing backend endpoint:

## Top Affected Surfaces

1. /dashboard
2. /camus
3. media console
4. feed console
5. settings console
6. team console
7. integrations console
8. calls console

## Top Affected Components

List files with highest counts.

## Critical Risks

- Users may believe data is saved when it is not.
- Uploads may persist only to localStorage.
- Dashboards may display stale/mock data.
- Console tabs may not manage real screens.
- Backend endpoints may be missing for visible actions.
- Database tables may not exist for claimed features.

## Required Decision

All high severity dead CTAs must be either:

1. Fully wired to backend/database, or
2. Removed from production UI.

No stubbed interactive elements may remain.
```

---

# 20. Acceptance Criteria for “Audit Complete”

The platform audit is not complete until all of these are true:

```txt
[ ] Every route has been crawled or statically enumerated.
[ ] Every interactive element has an identified intent.
[ ] Every button has a real handler, link, submit target, or justified disabled state.
[ ] Every link has a real destination.
[ ] Every tab controls a real panel/route/state.
[ ] Every form submits to a real handler or endpoint.
[ ] Every upload sends multipart/form-data to backend.
[ ] No upload/feed/dashboard/console data persists only to localStorage.
[ ] Every mutation endpoint exists in backend.
[ ] Every mutation endpoint performs authorization.
[ ] Every mutation endpoint persists to PostgreSQL or approved durable store.
[ ] Every database table referenced by endpoints exists via migration.
[ ] Every UI action has loading state.
[ ] Every UI action has success feedback.
[ ] Every UI action has error feedback.
[ ] Every interactive element has accessible name.
[ ] CI blocks new dead CTAs.
[ ] Audit report has zero high severity findings.
```

---

# 21. What I Need From You Next

Run the scanner and provide the summary output.

Specifically, send me these results:

```bash
jq 'length' reports/dead-cta-audit.json
```

```bash
jq '[.[] | select(.severity == "high")] | length' reports/dead-cta-audit.json
```

```bash
jq -r '.[].issue' reports/dead-cta-audit.json | sort | uniq -c | sort -nr
```

```bash
jq -r '.[].file' reports/dead-cta-audit.json | sort | uniq -c | sort -nr | head -50
```

```bash
jq -r '.[].label' reports/dead-cta-audit.json | sort | uniq -c | sort -nr | head -100
```

Once you paste those outputs, I can turn the raw audit into:

1. a ranked remediation backlog,
2. missing endpoint list,
3. missing database table list,
4. localStorage violation list,
5. shared-component fix plan,
6. CI gate implementation,
7. exact code patterns to replace the dead buttons platform-wide.