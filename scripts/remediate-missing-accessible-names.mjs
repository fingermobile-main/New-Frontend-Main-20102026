import fs from "node:fs";
import path from "node:path";
import parser from "@babel/parser";
import _traverse from "@babel/traverse";

const traverse = _traverse.default || _traverse;

const auditJsonPath = "reports/dead-cta-audit.json";
if (!fs.existsSync(auditJsonPath)) {
  console.error("Audit JSON file not found at " + auditJsonPath);
  process.exit(1);
}

const auditData = JSON.parse(fs.readFileSync(auditJsonPath, "utf8"));
const missingItems = auditData.filter((d) => d.issue === "missing-accessible-name");

console.log(`Found ${missingItems.length} missing-accessible-name items to remediate.`);

// Group items by file
const fileMap = new Map();
for (const item of missingItems) {
  if (!fileMap.has(item.file)) {
    fileMap.set(item.file, []);
  }
  fileMap.get(item.file).push(item);
}

function getAttr(opening, name) {
  return opening.attributes?.find(
    (a) => a.type === "JSXAttribute" && a.name?.name === name
  );
}

function getChildrenIcons(element) {
  const icons = [];
  if (!element?.children) return icons;

  function collect(node) {
    if (!node) return;
    if (node.type === "JSXElement") {
      const name = node.openingElement?.name?.name;
      if (name && /^[A-Z]/.test(name)) {
        icons.push(name);
      }
      if (node.children) {
        for (const c of node.children) collect(c);
      }
    } else if (node.type === "JSXFragment") {
      if (node.children) {
        for (const c of node.children) collect(c);
      }
    } else if (node.type === "JSXExpressionContainer") {
      const expr = node.expression;
      if (expr?.type === "ConditionalExpression") {
        collect(expr.consequent);
        collect(expr.alternate);
      } else if (expr?.type === "LogicalExpression") {
        collect(expr.right);
      }
    }
  }

  for (const child of element.children) {
    collect(child);
  }

  return icons;
}

const iconLabels = {
  X: "Close",
  XMarkIcon: "Close",
  XIcon: "Close",
  XCircle: "Close",
  CloseIcon: "Close",
  Trash: "Delete",
  Trash2: "Delete",
  TrashIcon: "Delete",
  Edit: "Edit",
  Edit2: "Edit",
  Edit3: "Edit",
  Pencil: "Edit",
  PencilIcon: "Edit",
  Plus: "Add",
  PlusIcon: "Add",
  Play: "Play",
  PlayIcon: "Play",
  Pause: "Pause",
  PauseIcon: "Pause",
  SkipBack: "Previous track",
  SkipForward: "Next track",
  Shuffle: "Shuffle",
  Repeat: "Repeat",
  Send: "Send",
  FiSend: "Send",
  PaperAirplaneIcon: "Send",
  Heart: "Like",
  HeartIcon: "Like",
  Bookmark: "Bookmark",
  BookmarkIcon: "Bookmark",
  Share: "Share",
  Share2: "Share",
  ShareIcon: "Share",
  Download: "Download",
  DownloadIcon: "Download",
  Upload: "Upload",
  UploadIcon: "Upload",
  Filter: "Filter",
  FilterIcon: "Filter",
  Search: "Search",
  SearchIcon: "Search",
  Settings: "Settings",
  SettingsIcon: "Settings",
  CogIcon: "Settings",
  User: "Profile",
  UserIcon: "Profile",
  ChevronLeft: "Previous",
  ChevronLeftIcon: "Previous",
  ArrowLeft: "Previous",
  ChevronRight: "Next",
  ChevronRightIcon: "Next",
  ArrowRight: "Next",
  ChevronUp: "Expand",
  ChevronUpIcon: "Expand",
  ArrowUp: "Move up",
  ChevronDown: "Expand options",
  ChevronDownIcon: "Expand options",
  ArrowDown: "Move down",
  Eye: "View details",
  EyeOff: "Hide",
  MoreVertical: "More options",
  MoreHorizontal: "More options",
  EllipsisVerticalIcon: "More options",
  RefreshCw: "Refresh",
  RotateCcw: "Refresh",
  RefreshIcon: "Refresh",
  Check: "Confirm",
  CheckIcon: "Confirm",
  CheckCircle: "Confirm",
  Bars3Icon: "Toggle menu",
  Menu: "Toggle menu",
  MessageSquare: "Chat",
  ChatBubbleLeftRightIcon: "Chat",
  Copy: "Copy",
  ExternalLink: "Open external link",
  Star: "Rate",
  GlobeAltIcon: "Visit website",
  FolderHeart: "Favorites",
  Eraser: "Erase",
  Square: "Rectangle tool",
  Circle: "Circle tool",
  Type: "Text tool",
};

function determineAccessibleLabel(item, opening, parent) {
  const roleAttr = getAttr(opening, "role");
  const isBackdrop =
    roleAttr?.value?.value === "button" && opening.name?.name === "div";
  if (isBackdrop) return "Close modal";

  // Check child icons
  const icons = getChildrenIcons(parent);
  for (const ic of icons) {
    if (iconLabels[ic]) {
      return iconLabels[ic];
    }
  }

  // Check handler
  const onClickAttr = getAttr(opening, "onClick");
  let handlerStr = "";
  if (onClickAttr?.value?.type === "JSXExpressionContainer") {
    const expr = onClickAttr.value.expression;
    if (expr.type === "Identifier") {
      handlerStr = expr.name.toLowerCase();
    } else if (
      expr.type === "ArrowFunctionExpression" ||
      expr.type === "FunctionExpression"
    ) {
      if (expr.body?.type === "CallExpression") {
        handlerStr = (
          expr.body.callee?.name ||
          expr.body.callee?.property?.name ||
          ""
        ).toLowerCase();
      } else if (expr.body?.type === "BlockStatement") {
        for (const stmt of expr.body.body) {
          if (stmt.type === "ExpressionStatement") {
            const e = stmt.expression;
            if (e.type === "CallExpression") {
              handlerStr = (
                e.callee?.name ||
                e.callee?.property?.name ||
                ""
              ).toLowerCase();
              break;
            }
          }
        }
      }
    }
  }

  if (/close|dismiss|cancel/.test(handlerStr)) return "Close";
  if (/play|toggleplay/.test(handlerStr)) return "Play or pause";
  if (/delete|remove/.test(handlerStr)) return "Delete";
  if (/edit/.test(handlerStr)) return "Edit";
  if (/mute/.test(handlerStr)) return "Toggle mute";
  if (/prev/.test(handlerStr)) return "Previous";
  if (/next/.test(handlerStr)) return "Next";
  if (/shuffle/.test(handlerStr)) return "Shuffle";
  if (/repeat/.test(handlerStr)) return "Repeat";
  if (/profile/.test(handlerStr)) return "Profile";
  if (/fullscreen/.test(handlerStr)) return "Toggle fullscreen";
  if (/select|color/.test(handlerStr)) return "Select option";
  if (/incognito/.test(handlerStr)) return "Toggle incognito mode";
  if (/page/.test(handlerStr)) return "Navigate page";
  if (/zoom.*in/.test(handlerStr)) return "Zoom in";
  if (/zoom.*out/.test(handlerStr)) return "Zoom out";
  if (/reset/.test(handlerStr)) return "Reset";

  // Check filename hints
  const fn = path.basename(item.file).toLowerCase();
  if (fn.includes("player")) return "Playback control";
  if (fn.includes("modal")) return "Modal action";
  if (fn.includes("editor")) return "Editor action";

  return "Action";
}

let totalUpdated = 0;

for (const [filePath, items] of fileMap.entries()) {
  try {
    const code = fs.readFileSync(filePath, "utf8");
    const ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    // Collect insertions for this file: { offset, text }
    const insertions = [];

    traverse(ast, {
      JSXOpeningElement(pathRef) {
        const opening = pathRef.node;
        const line = opening.loc?.start?.line;
        if (!line) return;

        const matchedItem = items.find((it) => it.line === line);
        if (!matchedItem) return;

        // Check if aria-label or aria-labelledby is already present
        const hasAria =
          getAttr(opening, "aria-label") || getAttr(opening, "aria-labelledby");
        if (hasAria) return;

        const label = determineAccessibleLabel(
          matchedItem,
          opening,
          pathRef.parent
        );
        const elName = opening.name?.name || "";
        const isButton = elName === "button" || elName === "Button";
        const hasType = getAttr(opening, "type");

        let addedAttrs = "";
        if (isButton && !hasType) {
          addedAttrs += ' type="button"';
        }
        addedAttrs += ` aria-label="${label}"`;

        // We insert right after `<${elName}`
        // opening.name.end is the character offset right after the element tag name
        const insertOffset = opening.name.end;
        insertions.push({ offset: insertOffset, text: addedAttrs });
      },
    });

    if (insertions.length > 0) {
      // Sort insertions by offset descending to maintain accurate offsets
      insertions.sort((a, b) => b.offset - a.offset);

      let newCode = code;
      for (const ins of insertions) {
        newCode =
          newCode.slice(0, ins.offset) + ins.text + newCode.slice(ins.offset);
      }

      fs.writeFileSync(filePath, newCode, "utf8");
      totalUpdated += insertions.length;
      console.log(`Updated ${filePath}: +${insertions.length} attributes`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}: ${err.message}`);
  }
}

console.log(`\nRemediation complete. Updated ${totalUpdated} elements.`);
