import mongoose from 'mongoose';

const issueReportSchema = new mongoose.Schema({
  issueType: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
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
  reportedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date,
    default: null
  }
}, {
  _id: true // Each issue gets its own ID
});

const machineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  machineNumber: {
    type: Number,
    required: true
  },
  field: {
    type: String,
    required: [true, 'Field name is required'],
    trim: true
  },
  battery: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0
  },
  temp: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  trash: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  bags: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'maintenance'],
    default: 'offline'
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  issues: [issueReportSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes
machineSchema.index({ userId: 1, status: 1 });
machineSchema.index({ userId: 1, machineNumber: 1 }, { unique: true });

// Update lastUpdated on save
machineSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

const Machine = mongoose.model('Machine', machineSchema);

export default Machine;
