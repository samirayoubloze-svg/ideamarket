import express, { Request, Response } from 'express';
import Comment from '../models/Comment';
import Idea from '../models/Idea';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get comments for idea
router.get('/idea/:ideaId', async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ idea: req.params.ideaId })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      comments
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create comment
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { text, rating, ideaId } = req.body;

    if (!text || !rating || !ideaId) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    const comment = new Comment({
      text,
      rating: parseInt(rating),
      author: req.user?.id,
      idea: ideaId
    });

    await comment.save();
    await comment.populate('author', 'name avatar');

    // Update idea rating
    const comments = await Comment.find({ idea: ideaId });
    const avgRating = comments.reduce((sum, c) => sum + c.rating, 0) / comments.length;
    idea.rating = avgRating;
    idea.reviewCount = comments.length;
    await idea.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete comment
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (comment.author.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    await Comment.findByIdAndDelete(req.params.id);

    // Update idea rating
    const idea = await Idea.findById(comment.idea);
    const comments = await Comment.find({ idea: comment.idea });
    if (comments.length > 0) {
      const avgRating = comments.reduce((sum, c) => sum + c.rating, 0) / comments.length;
      idea!.rating = avgRating;
    } else {
      idea!.rating = 0;
    }
    idea!.reviewCount = comments.length;
    await idea!.save();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
