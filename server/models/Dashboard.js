import mongoose from 'mongoose';

// Delivery Schema
const deliverySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Buyer/Agent name is required'],
    trim: true
  },
  quantity: {
    type: String,
    required: [true, 'Quantity is required']
  },
  date: {
    type: String,
    required: [true, 'Delivery date is required']
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In-Transit', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  statusColor: {
    type: String,
    enum: ['blue', 'orange', 'green', 'red'],
    default: 'blue'
  }
}, {
  timestamps: true
});

deliverySchema.index({ userId: 1, date: 1 });

// Activity Schema
const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  time: {
    type: String,
    required: true
  },
  activity: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'info', 'warning', 'error'],
    default: 'info'
  }
}, {
  timestamps: true
});

activitySchema.index({ userId: 1, createdAt: -1 });

// Inventory Schema
const inventorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  currentStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  maxCapacity: {
    type: Number,
    required: true,
    min: 0,
    default: 1000
  },
  totalHarvested: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  pendingDelivery: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  unit: {
    type: String,
    default: 'quintals'
  }
}, {
  timestamps: true
});

// Virtual for percentage full
inventorySchema.virtual('percentageFull').get(function() {
  return this.maxCapacity > 0 ? Math.round((this.currentStock / this.maxCapacity) * 100) : 0;
});

inventorySchema.set('toJSON', { virtuals: true });
inventorySchema.set('toObject', { virtuals: true });

const Delivery = mongoose.model('Delivery', deliverySchema);
const Activity = mongoose.model('Activity', activitySchema);
const Inventory = mongoose.model('Inventory', inventorySchema);

export { Delivery, Activity, Inventory };
