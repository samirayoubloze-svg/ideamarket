import express, { Request, Response } from 'express';
import Idea from '../models/Idea';
import User from '../models/User';
import { authenticateToken, optionalAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all ideas
router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { category, search, sort = 'newest' } = req.query;
    let query: any = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortObj: any = {};
    if (sort === 'trending') {
      sortObj = { views: -1 };
    } else if (sort === 'rating') {
      sortObj = { rating: -1 };
    } else {
      sortObj = { createdAt: -1 };
    }

    const ideas = await Idea.find(query)
      .populate('author', 'name avatar bio')
      .sort(sortObj)
      .limit(50);

    res.json({
      success: true,
      ideas
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single idea
router.get('/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate('author', 'name avatar bio followers')
      .populate('buyers', 'name avatar');

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    // Increment views
    idea.views += 1;
    await idea.save();

    res.json({
      success: true,
      idea,
      isPurchased: req.user ? idea.buyers.some(b => b._id.toString() === req.user?.id) : false
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create idea
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, price, image } = req.body;

    if (!title || !description || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const idea = new Idea({
      title,
      description,
      category,
      price: parseFloat(price),
      image,
      author: req.user?.id
    });

    await idea.save();
    await idea.populate('author', 'name avatar bio');

    res.status(201).json({
      success: true,
      message: 'Idea created successfully',
      idea
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update idea
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    if (idea.author.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this idea'
      });
    }

    const { title, description, category, price, image } = req.body;

    if (title) idea.title = title;
    if (description) idea.description = description;
    if (category) idea.category = category;
    if (price !== undefined) idea.price = parseFloat(price);
    if (image) idea.image = image;

    await idea.save();
    await idea.populate('author', 'name avatar bio');

    res.json({
      success: true,
      message: 'Idea updated successfully',
      idea
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete idea
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    if (idea.author.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this idea'
      });
    }

    await Idea.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Idea deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get user ideas
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const ideas = await Idea.find({ author: req.params.userId })
      .populate('author', 'name avatar bio')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      ideas
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
