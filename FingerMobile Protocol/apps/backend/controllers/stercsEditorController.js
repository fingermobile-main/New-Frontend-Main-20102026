const db = require('../db');
const StercsEditorPageModel = require('../models/StercsEditorPageModel.js');

const getPool = () => db.pool || db;
const getPageModel = () => new StercsEditorPageModel(getPool());

function mapDslTypeToComponent(dslType) {
  switch (dslType.toUpperCase()) {
  case 'HERO': return 'Hero Section';
  case 'HEADER': return 'Header';
  case 'TEXT': return 'Text Block';
  case 'IMAGE': return 'Image Placeholder';
  case 'FOOTER': return 'Footer';
  case 'FORUM_HEADER': return 'ForumHeader';
  case 'FORUM_LEFT_SIDEBAR': return 'ForumLeftSidebar';
  case 'FORUM_RIGHT_SIDEBAR': return 'ForumRightSidebar';
  case 'FORUM_FEED': return 'ForumFeed';
  case 'AD_BANNER': return 'AdBanner';
  case 'FIXED_AD_BANNER': return 'FixedAdBanner';
  default: return dslType;
  }
}

function parseStercsDsl(dslText) {
  if (!dslText || typeof dslText !== 'string') return [];
  const blocks = [];
  const regex = /\[STERCS:([A-Z0-9_]+)(?:\s+([^\]]+))?\]/gi;
  let match;
  let id = 1;

  while ((match = regex.exec(dslText)) !== null) {
    const dslType = match[1];
    const rawParams = match[2] || '';
    const params = {};

    const attrRegex = /(\w+)=(?:"([^"]*)"|'([^']*)'|(\S+))/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(rawParams)) !== null) {
      const key = attrMatch[1];
      const val = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4];
      params[key] = val;
    }

    blocks.push({
      id: `block-${id++}`,
      type: mapDslTypeToComponent(dslType),
      content: params.content || params.title || dslType,
      params,
      styles: {
        padding: params.padding || '16px',
        color: params.color || 'inherit'
      }
    });
  }

  return blocks;
}

exports.savePage = async (req, res) => {
  try {
    const { title, slug, components, dsl, theme, status } = req.body;
    if (!title || !slug) {
      return res.status(400).json({ error: 'Title and slug are required' });
    }

    let finalComponents = components || [];
    if (dsl && typeof dsl === 'string') {
      const parsedBlocks = parseStercsDsl(dsl);
      finalComponents = [...finalComponents, ...parsedBlocks];
    }

    const page = await getPageModel().savePage(title, slug, finalComponents, theme || {}, status || 'published');
    res.status(200).json({ message: 'Page saved successfully', page });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

exports.getPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await getPageModel().getPageBySlug(slug);

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    let parsedComponents = page.components;
    if (typeof parsedComponents === 'string') {
      try {
        parsedComponents = JSON.parse(parsedComponents);
      } catch (e) {
        parsedComponents = [];
      }
    }

    res.status(200).json({
      success: true,
      page: {
        ...page,
        is_published: page.status === 'published',
        content: {
          blocks: parsedComponents || []
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

exports.listPages = async (req, res) => {
  try {
    const pages = await getPageModel().listPages();
    res.status(200).json({ success: true, pages });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

exports.parseDslEndpoint = async (req, res) => {
  try {
    const { dsl } = req.body;
    if (!dsl) {
      return res.status(400).json({ success: false, message: 'DSL string is required' });
    }

    const blocks = parseStercsDsl(dsl);
    res.status(200).json({ success: true, blocks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.parseStercsDsl = parseStercsDsl;
