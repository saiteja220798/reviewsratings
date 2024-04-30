const express = require('express');
const router = express.Router();
const RatingReview = require('../models/RatingReview');

// Submit rating and review route
router.post('/submit-rating-review', async (req, res) => {
  try {
    const { userId, businessId, rating, review } = req.body;
    // Save rating and review to the database
    const newRatingReview = new RatingReview({ userId, businessId, rating, review });
    await newRatingReview.save();
    res.status(201).json({ message: 'Rating and review submitted successfully!' });
  } catch (error) {
    console.error('Error submitting rating and review:', error);
    res.status(500).json({ error: 'Failed to submit rating and review.' });
  }
});

module.exports = router;
