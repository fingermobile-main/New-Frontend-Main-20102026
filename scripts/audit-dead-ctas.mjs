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

const roots = getArg("src", "FingerMobile Protocol/apps/frontend-main/src")
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
  ".quarantine",
]);

const findings = [];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  const stat = fs.statSync(dir);
  if (stat.isFile()) {
    const ext = path.extname(dir);
    if (extensions.has(ext)) {
      files.push(dir);
    }
    return files;
  }

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

  if (attr.value?.type === "JSXExpressionContainer") {
    const expr = attr.value.expression;

    if (expr?.type === "StringLiteral") {
      return expr.value;
    }

    if (expr?.type === "ConditionalExpression") {
      const c = expr.consequent?.type === "StringLiteral" ? expr.consequent.value : "";
      const a = expr.alternate?.type === "StringLiteral" ? expr.alternate.value : "";
      return (c || a) ? `${c} ${a}`.trim() : null;
    }

    if (expr?.type === "TemplateLiteral") {
      return expr.quasis
        .map((q) => q.value?.cooked || q.value?.raw || "")
        .join("")
        .trim();
    }
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

  // () => null / () => undefined / () => false / () => true
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

      if (expr?.type === "ConditionalExpression") {
        if (expr.consequent?.type === "StringLiteral") parts.push(expr.consequent.value);
        if (expr.alternate?.type === "StringLiteral") parts.push(expr.alternate.value);
      }

      if (expr?.type === "LogicalExpression") {
        if (expr.right?.type === "StringLiteral") parts.push(expr.right.value);
      }

      if (expr?.type === "MemberExpression") {
        if (expr.property?.name) parts.push(expr.property.name);
      }

      if (expr?.type === "Identifier") {
        parts.push(expr.name);
      }
    }

    if (child.type === "JSXElement") {
      const elName = getName(child.openingElement?.name).toLowerCase();
      const titleOrAria =
        attrStringValue(getAttr(child.openingElement, "title")) ||
        attrStringValue(getAttr(child.openingElement, "aria-label"));

      if (titleOrAria) {
        parts.push(titleOrAria);
      }

      if (elName === "img") {
        const alt = attrStringValue(getAttr(child.openingElement, "alt"));
        if (alt) parts.push(alt);
      } else {
        const innerText = getTextFromChildren(child.children);
        if (innerText) parts.push(innerText);
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
