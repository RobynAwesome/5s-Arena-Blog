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
    image: {
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
    series: {
      name: String,
      part: Number,
      total: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
