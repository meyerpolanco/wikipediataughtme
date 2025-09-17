import express from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { db } from '../database';
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
router.get('/', verifyToken, async (req: express.Request, res) => {
  try {
    const user = await db.getUserByEmail(req.user?.email || '');
    
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
router.put('/', verifyToken, async (req: express.Request, res) => {
  try {
    const { subscriptions } = updateSubscriptionsSchema.parse(req.body);
    const user = await db.updateUserSubscriptions(req.user?.email || '', subscriptions);
    
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
router.get('/options', async (req, res) => {
  try {
    const options = await db.getSubscriptionOptions();
    
    res.json({
      success: true,
      options: options.map(option => ({
        id: option.name,
        name: option.name.charAt(0).toUpperCase() + option.name.slice(1).replace('-', ' '),
        description: option.description
      }))
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
