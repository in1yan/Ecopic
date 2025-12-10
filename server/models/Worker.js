import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Worker name is required'],
    trim: true
  },
  date: {
    type: String,
    required: [true, 'Date is required'],
    index: true
  },
  hours: {
    type: Number,
    required: [true, 'Hours worked is required'],
    min: [0, 'Hours cannot be negative']
  },
  cost: {
    type: Number,
    required: [true, 'Cost is required'],
    min: [0, 'Cost cannot be negative']
  },
  picked: {
    type: Number,
    required: [true, 'Amount picked is required'],
    min: [0, 'Amount picked cannot be negative']
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
workerSchema.index({ userId: 1, date: -1 });
workerSchema.index({ userId: 1, name: 1 });

// Virtual for efficiency calculation
workerSchema.virtual('efficiency').get(function() {
  return this.hours > 0 ? (this.picked / this.hours).toFixed(1) : '0';
});

// Ensure virtuals are included in JSON
workerSchema.set('toJSON', { virtuals: true });
workerSchema.set('toObject', { virtuals: true });

const Worker = mongoose.model('Worker', workerSchema);

export default Worker;
