import express from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { users } from '../data/users';

const router = express.Router();

// Validation schemas
const signInSchema = z.object({
  email: z.string().email('Invalid email address')
});

// Sign in endpoint
router.post('/signin', async (req, res) => {
  try {
    const { email } = signInSchema.parse(req.body);
    
    // Check if user exists, if not create them
    if (!users.has(email)) {
      users.set(email, {
        email,
        subscriptions: ['true-random', 'brand-new'] // Default subscriptions
      });
    }
    
    const user = users.get(email)!;
    
    // Create JWT token
    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        email: user.email,
        subscriptions: user.subscriptions
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      });
    }
    
    console.error('Sign in error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Verify token endpoint
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const user = users.get(decoded.email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user: {
        email: user.email,
        subscriptions: user.subscriptions
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

export default router;
