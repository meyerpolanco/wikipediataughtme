import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface User {
  id: string;
  email: string;
  subscriptions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionOption {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
}

export class DatabaseService {
  // User operations
  async createUser(email: string, subscriptions: string[] = ['true-random', 'brand-new']): Promise<User> {
    const user = await prisma.user.create({
      data: {
        email,
        subscriptions: JSON.stringify(subscriptions)
      }
    });
    
    return {
      ...user,
      subscriptions: JSON.parse(user.subscriptions)
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) return null;
    
    return {
      ...user,
      subscriptions: JSON.parse(user.subscriptions)
    };
  }

  async updateUserSubscriptions(email: string, subscriptions: string[]): Promise<User> {
    const user = await prisma.user.update({
      where: { email },
      data: {
        subscriptions: JSON.stringify(subscriptions)
      }
    });
    
    return {
      ...user,
      subscriptions: JSON.parse(user.subscriptions)
    };
  }

  // Subscription options operations
  async getSubscriptionOptions(): Promise<SubscriptionOption[]> {
    const options = await prisma.subscriptionOption.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    
    return options;
  }

  async createSubscriptionOption(name: string, description: string): Promise<SubscriptionOption> {
    const option = await prisma.subscriptionOption.create({
      data: {
        name,
        description
      }
    });
    
    return option;
  }

  // Initialize default data
  async initializeDefaultData(): Promise<void> {
    // Check if we already have subscription options
    const existingOptions = await prisma.subscriptionOption.count();
    
    if (existingOptions === 0) {
      const defaultOptions = [
        {
          name: 'true-random',
          description: 'Completely random Wikipedia articles'
        },
        {
          name: 'trending',
          description: 'Currently popular articles'
        },
        {
          name: 'brand-new',
          description: 'Recently created articles'
        },
        {
          name: 'science',
          description: 'Articles about science, tech, and innovation'
        },
        {
          name: 'history',
          description: 'Historical events, figures, and periods'
        },
        {
          name: 'culture',
          description: 'Music, literature, art, and cultural topics'
        }
      ];

      await prisma.subscriptionOption.createMany({
        data: defaultOptions
      });
      
      console.log('✅ Default subscription options created');
    }
  }

  async disconnect(): Promise<void> {
    await prisma.$disconnect();
  }
}

export const db = new DatabaseService();
