import mongoose, { Schema, Document } from 'mongoose';

export interface IIdea extends Document {
  title: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  author: mongoose.Types.ObjectId;
  buyers: mongoose.Types.ObjectId[];
  rating: number;
  reviewCount: number;
  views: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ideaSchema = new Schema<IIdea>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      minlength: 50
    },
    category: {
      type: String,
      enum: [
        'Business',
        'Technology',
        'Content',
        'Marketing',
        'Design',
        'Education',
        'Entertainment',
        'Finance',
        'Health',
        'Other'
      ],
      default: 'Other'
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      default: null
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    buyers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model<IIdea>('Idea', ideaSchema);
