import express, { Request, Response } from 'express';
import Idea from '../models/Idea';
import User from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Buy idea
router.post('/buy/:ideaId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const idea = await Idea.findById(req.params.ideaId);
    const buyer = await User.findById(req.user?.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already purchased
    if (idea.buyers.includes(buyer._id)) {
      return res.status(400).json({
        success: false,
        message: 'You have already purchased this idea'
      });
    }

    // Add buyer to idea
    idea.buyers.push(buyer._id);
    await idea.save();

    // Add earnings to author
    const author = await User.findById(idea.author);
    if (author) {
      author.totalEarnings += idea.price;
      await author.save();
    }

    res.json({
      success: true,
      message: 'Idea purchased successfully',
      purchaseData: {
        ideaId: idea._id,
        title: idea.title,
        price: idea.price,
        purchasedAt: new Date()
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get purchased ideas
router.get('/purchased', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const ideas = await Idea.find({ buyers: req.user?.id })
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

// Get user earnings
router.get('/earnings', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    const ideas = await Idea.find({ author: req.user?.id });
    const totalSales = ideas.reduce((sum, idea) => sum + idea.buyers.length, 0);

    res.json({
      success: true,
      earnings: {
        totalEarnings: user?.totalEarnings || 0,
        totalSales,
        ideasCount: ideas.length
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
