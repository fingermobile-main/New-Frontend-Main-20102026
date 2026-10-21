jest.mock('../../db', () => ({
  query: jest.fn(),
  pool: {
    query: jest.fn()
  }
}));

const db = require('../../db');
const stercsEditorController = require('../../controllers/stercsEditorController');

describe('StercsEditorController & DSL Parser', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {},
      params: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('parseStercsDsl', () => {
    it('should parse STERCS DSL tags into block objects', () => {
      const dsl = '[STERCS:HERO title="Welcome to FingerMobile" color="#00ffff"] [STERCS:AD_BANNER title="Canary Ad"]';
      const blocks = stercsEditorController.parseStercsDsl(dsl);

      expect(blocks).toHaveLength(2);
      expect(blocks[0].type).toBe('Hero Section');
      expect(blocks[0].params.title).toBe('Welcome to FingerMobile');
      expect(blocks[1].type).toBe('AdBanner');
    });

    it('should return empty array for empty DSL string', () => {
      const blocks = stercsEditorController.parseStercsDsl('');
      expect(blocks).toEqual([]);
    });
  });

  describe('savePage', () => {
    it('should return 400 if title or slug is missing', async () => {
      req.body = { title: '' };
      await stercsEditorController.savePage(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should save page with components and optional DSL parsing', async () => {
      req.body = {
        title: 'Home Page',
        slug: 'home',
        dsl: '[STERCS:HERO title="Hero Banner"]',
        components: [{ id: 'block-0', type: 'Header', content: 'Main Header' }]
      };

      db.pool.query.mockResolvedValueOnce({
        rows: [{
          id: 1,
          title: 'Home Page',
          slug: 'home',
          status: 'published'
        }]
      });

      await stercsEditorController.savePage(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Page saved successfully'
        })
      );
    });
  });

  describe('getPageBySlug', () => {
    it('should return 404 if page is not found', async () => {
      req.params = { slug: 'unknown' };
      db.pool.query.mockResolvedValueOnce({ rows: [] });

      await stercsEditorController.getPageBySlug(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return published page structure with blocks', async () => {
      req.params = { slug: 'home' };
      db.pool.query.mockResolvedValueOnce({
        rows: [{
          id: 1,
          title: 'Home Page',
          slug: 'home',
          status: 'published',
          components: JSON.stringify([{ id: 'block-1', type: 'Hero Section', content: 'Welcome' }])
        }]
      });

      await stercsEditorController.getPageBySlug(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          page: expect.objectContaining({
            is_published: true,
            content: expect.objectContaining({
              blocks: expect.any(Array)
            })
          })
        })
      );
    });
  });
});
