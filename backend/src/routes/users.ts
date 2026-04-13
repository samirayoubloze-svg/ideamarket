import express, { Request, Response } from 'express';
import User from '../models/User';
import Idea from '../models/Idea';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get user profile
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const ideas = await Idea.find({ author: user._id }).countDocuments();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        totalEarnings: user.totalEarnings,
        followers: user.followers,
        following: user.following,
        ideasCount: ideas,
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, avatar, bio } = req.body;
    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Follow user
router.post('/:id/follow', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const currentUser = await User.findById(req.user?.id);
    const userToFollow = await User.findById(req.params.id);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!currentUser?.following.includes(userToFollow._id)) {
      currentUser?.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser?._id!);
      await currentUser?.save();
      await userToFollow.save();
    }

    res.json({
      success: true,
      message: 'User followed successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Unfollow user
router.post('/:id/unfollow', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const currentUser = await User.findById(req.user?.id);
    const userToUnfollow = await User.findById(req.params.id);

    if (!userToUnfollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    currentUser?.following.pull(userToUnfollow._id);
    userToUnfollow.followers.pull(currentUser?._id!);
    await currentUser?.save();
    await userToUnfollow.save();

    res.json({
      success: true,
      message: 'User unfollowed successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
