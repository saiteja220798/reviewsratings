const mongoose = require('mongoose');

const ratingReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Assuming you have a User model for authentication
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business' // Assuming you have a Business model for businesses
  },
  rating: {
    type: Number,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  moderated: {
    type: Boolean,
    default: false
  }
});

const RatingReview = mongoose.model('RatingReview', ratingReviewSchema);

module.exports = RatingReview;
