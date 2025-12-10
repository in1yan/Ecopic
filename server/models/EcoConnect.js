import mongoose from 'mongoose';

// Response sub-schema for support tickets
const responseSchema = new mongoose.Schema({
  by: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  _id: false
});

// Support Ticket Schema
const supportTicketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  farmerName: {
    type: String,
    required: [true, 'Farmer name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Emergency', 'Technical', 'Expert', 'General']
  },
  subcategory: {
    type: String,
    default: 'General',
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  assignedTo: {
    type: String,
    default: 'Support Team'
  },
  contactPhone: {
    type: String,
    required: [true, 'Contact phone is required']
  },
  responses: [responseSchema],
  resolvedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

supportTicketSchema.index({ userId: 1, status: 1 });
supportTicketSchema.index({ userId: 1, createdAt: -1 });
supportTicketSchema.index({ category: 1, priority: 1 });

// News Article Schema
const newsArticleSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Government Scheme', 'Subsidy', 'Grant', 'Workshop', 'Alert']
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  preview: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  publishDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  expiryDate: {
    type: Date,
    default: null
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  link: {
    type: String,
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

newsArticleSchema.index({ category: 1, publishDate: -1 });
newsArticleSchema.index({ isFeatured: 1, publishDate: -1 });

// Helpline Schema
const helplineSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['emergency', 'expert', 'support']
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  whatsapp: {
    type: String,
    default: null
  },
  email: {
    type: String,
    default: null
  },
  availability: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    required: true,
    min: 1
  },
  color: {
    type: String,
    enum: ['red', 'orange', 'blue', 'green'],
    default: 'blue'
  }
}, {
  timestamps: true
});

helplineSchema.index({ category: 1, priority: 1 });
helplineSchema.index({ isActive: 1 });

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);
const NewsArticle = mongoose.model('NewsArticle', newsArticleSchema);
const Helpline = mongoose.model('Helpline', helplineSchema);

export { SupportTicket, NewsArticle, Helpline };
