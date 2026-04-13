import { create } from 'zustand';

export interface Rating {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  purchasedBy: string[];
  ratings: Rating[];
  views: number;
  isFeatured?: boolean;
}

interface IdeaStore {
  ideas: Idea[];
  addIdea: (idea: Idea) => void;
  updateIdea: (ideaId: string, idea: Partial<Idea>) => void;
  deleteIdea: (ideaId: string) => void;
  removeIdea: (ideaId: string) => void;
  getIdeas: () => Idea[];
  getIdeaById: (id: string) => Idea | undefined;
  purchaseIdea: (ideaId: string, userId: string) => void;
  addRating: (ideaId: string, rating: Rating) => void;
  setIdeas: (ideas: Idea[]) => void;
}

// Mock data
const mockIdeas: Idea[] = [
  {
    id: '1',
    title: 'AI-Powered Personal Finance App',
    description: 'A mobile app that uses AI to optimize spending, provide investment advice, and automate budgeting. The app learns user behavior and suggests savings opportunities.',
    category: 'Startup',
    price: 49,
    author: {
      id: 'user1',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
    },
    createdAt: '2024-01-15',
    purchasedBy: ['user2', 'user3'],
    ratings: [
      {
        id: 'r1',
        userId: 'user2',
        userName: 'John Doe',
        rating: 5,
        comment: 'Amazing idea with huge potential!',
        createdAt: '2024-01-20'
      }
    ],
    views: 324,
    isFeatured: true
  },
  {
    id: '2',
    title: 'Sustainable Fashion Marketplace',
    description: 'Connect eco-conscious brands with sustainable fashion enthusiasts. Features include brand verification, carbon footprint tracking, and circular economy initiatives.',
    category: 'Business',
    price: 39,
    author: {
      id: 'user4',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
    },
    createdAt: '2024-01-10',
    purchasedBy: ['user5'],
    ratings: [],
    views: 156,
  },
  {
    id: '3',
    title: 'LinkedIn Content Creation Strategy',
    description: 'A comprehensive guide to building an engaged LinkedIn audience from 0 to 100k followers. Includes templates, posting schedule, and engagement tactics.',
    category: 'Content',
    price: 19,
    author: {
      id: 'user6',
      name: 'Maria Santos',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
    },
    createdAt: '2024-01-12',
    purchasedBy: ['user2', 'user7', 'user8'],
    ratings: [
      {
        id: 'r2',
        userId: 'user2',
        userName: 'John Doe',
        rating: 4,
        comment: 'Very helpful content!',
        createdAt: '2024-01-18'
      }
    ],
    views: 542,
    isFeatured: true
  },
  {
    id: '4',
    title: 'Voice-Controlled Smart Home App',
    description: 'Control all smart home devices with natural voice commands in multiple languages. Supports integration with major IoT platforms and includes predictive automation.',
    category: 'Startup',
    price: 79,
    author: {
      id: 'user9',
      name: 'James Park',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
    },
    createdAt: '2024-01-08',
    purchasedBy: [],
    ratings: [],
    views: 89,
  },
  {
    id: '5',
    title: 'AI Image Generator for E-commerce',
    description: 'Tool to automatically generate product images from descriptions. Saves time and cost for e-commerce businesses. Includes background removal and style customization.',
    category: 'Business',
    price: 59,
    author: {
      id: 'user10',
      name: 'Lisa Wong',
      avatar: 'https://images.unsplash.com/photo-1514888286974-6c03bf1a7c47?w=150&h=150&fit=crop'
    },
    createdAt: '2024-01-05',
    purchasedBy: ['user1', 'user11'],
    ratings: [
      {
        id: 'r3',
        userId: 'user1',
        userName: 'Sarah Chen',
        rating: 5,
        comment: 'Perfect for our use case!',
        createdAt: '2024-01-16'
      }
    ],
    views: 267,
  },
];

export const useIdeaStore = create<IdeaStore>((set, get) => ({
  ideas: mockIdeas,
  
  addIdea: (idea) =>
    set((state) => ({
      ideas: [idea, ...state.ideas],
    })),
  
  updateIdea: (ideaId, updates) =>
    set((state) => ({
      ideas: state.ideas.map((idea) =>
        idea.id === ideaId ? { ...idea, ...updates } : idea
      ),
    })),
  
  deleteIdea: (ideaId) =>
    set((state) => ({
      ideas: state.ideas.filter((i) => i.id !== ideaId),
    })),
  
  removeIdea: (ideaId) =>
    set((state) => ({
      ideas: state.ideas.filter((i) => i.id !== ideaId),
    })),
  
  getIdeas: () => get().ideas,
  
  getIdeaById: (id) => get().ideas.find((idea) => idea.id === id),
  
  purchaseIdea: (ideaId, userId) =>
    set((state) => ({
      ideas: state.ideas.map((idea) =>
        idea.id === ideaId
          ? { ...idea, purchasedBy: [...idea.purchasedBy, userId] }
          : idea
      ),
    })),
  
  addRating: (ideaId, rating) =>
    set((state) => ({
      ideas: state.ideas.map((idea) =>
        idea.id === ideaId
          ? { ...idea, ratings: [...idea.ratings, rating] }
          : idea
      ),
    })),
  
  setIdeas: (ideas) => set({ ideas }),
}));
