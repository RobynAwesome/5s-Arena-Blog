import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    category: {
      type: String,
      enum: [
        'Culture',
        'Legends',
        'Skills',
        'Tactics',
        'Fitness',
        'Community',
        'News',
        "Women's Game",
        '5-a-Side',
        'Development',
        'Wellness',
      ],
    },
    author: {
      name: String,
      image: String,
    },
    tags: [String],
    readingTime: {
      type: Number,
    },
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
