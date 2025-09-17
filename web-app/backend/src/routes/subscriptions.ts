import express from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { users } from '../data/users';
import '../types'; // Import to extend Express types

const router = express.Router();

// Validation schemas
const updateSubscriptionsSchema = z.object({
  subscriptions: z.array(z.string())
});

// Middleware to verify JWT token
const verifyToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

// Get user subscriptions
router.get('/', verifyToken, (req: express.Request, res) => {
  try {
    const user = users.get(req.user?.email || '');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      subscriptions: user.subscriptions
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update user subscriptions
router.put('/', verifyToken, (req: express.Request, res) => {
  try {
    const { subscriptions } = updateSubscriptionsSchema.parse(req.body);
    const user = users.get(req.user?.email || '');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Update subscriptions
    user.subscriptions = subscriptions;
    users.set(req.user?.email || '', user);
    
    res.json({
      success: true,
      subscriptions: user.subscriptions
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid subscriptions data'
      });
    }
    
    console.error('Update subscriptions error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get available subscription options
router.get('/options', (req, res) => {
  try {
    const options = [
      {
        id: 'true-random',
        name: 'True Random',
        description: 'Completely random Wikipedia articles'
      },
      {
        id: 'trending',
        name: 'Trending',
        description: 'Currently popular articles'
      },
      {
        id: 'brand-new',
        name: 'Brand New',
        description: 'Recently created articles'
      },
      {
        id: 'science',
        name: 'Science & Technology',
        description: 'Articles about science, tech, and innovation'
      },
      {
        id: 'history',
        name: 'History',
        description: 'Historical events, figures, and periods'
      },
      {
        id: 'culture',
        name: 'Culture & Arts',
        description: 'Music, literature, art, and cultural topics'
      }
    ];
    
    res.json({
      success: true,
      options
    });
  } catch (error) {
    console.error('Get options error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
