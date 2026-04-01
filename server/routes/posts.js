import { Router } from 'express';
import Post from '../models/Post.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Helper: generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper: calculate reading time from HTML content
function calculateReadingTime(html) {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// GET / - list all posts with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 9 } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'trending') sortOption = { views: -1, createdAt: -1 };
    if (sort === 'popular') sortOption = { views: -1 };
    if (sort === 'recent') sortOption = { createdAt: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      posts,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /featured - get featured posts
router.get('/featured', async (req, res) => {
  try {
    const posts = await Post.find({ featured: true }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /:slug - get single post by slug and increment views
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST / - create post (Authors/Admins only)
router.post('/', protect, authorize('author', 'admin'), async (req, res) => {
  try {
    const data = req.body;
    data.slug = generateSlug(data.title);
    if (data.content) {
      data.readingTime = calculateReadingTime(data.content);
    }
    const post = await Post.create(data);
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /:id - update post (Authors/Admins only)
router.put('/:id', protect, authorize('author', 'admin'), async (req, res) => {
  try {
    const data = req.body;
    if (data.title) {
      data.slug = generateSlug(data.title);
    }
    if (data.content) {
      data.readingTime = calculateReadingTime(data.content);
    }
    const post = await Post.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /:id - delete a post (Admins only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
