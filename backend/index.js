const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3001',
}));


// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'your_secret_key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// MongoDB connection
mongoose.connect('mongodb+srv://saitejareddie22:Saiteja22@cluster1.he2a79y.mongodb.net/signupdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the user schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  
});

// Define the rating and review schema
const ratingReviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rating: Number,
    review: String,
    userName: String,
    // Add a field for storing replies
    reply: String
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Create the RatingReview model
const RatingReview = mongoose.model('RatingReview', ratingReviewSchema);


// Define the business user schema
const businessUserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
  });
  

  // Create the BusinessUser model
  const BusinessUser = mongoose.model('BusinessUser', businessUserSchema);
  
  // Define the service schema
  const serviceSchema = new mongoose.Schema({
    businessName: String,
    address: String,
    countryCode: String,
    mobileNumber: String,
    image: String // Store image URL in database
  });
  
  // Create the Service model
const Service = mongoose.model('Service', serviceSchema);

// Multer storage configuration for image upload
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads'); // Save uploaded images in 'uploads' directory
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });
//  const upload = multer({ storage: storage });

app.post('/add-service', authenticateToken,  async (req, res) => {
  try {
    const { businessName, address, countryCode, mobileNumber } = req.body;

    // // Construct image URL
    // const imageURL = `http://localhost:${PORT}/${req.file.filename}`;

    // Create new service instance
    const newService = new Service({
      businessName,
      address,
      countryCode,
      mobileNumber,
      image: imageURL
    });

    // Save the new service to the database
    await newService.save();

    res.status(201).json({ message: 'Service added successfully!', service: newService });
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({ error: 'Failed to add service.' });
  }
});


  // Signup route for business users
  app.post('/business/signup', async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newBusinessUser = new BusinessUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
  
      await newBusinessUser.save();
      res.status(201).json({ message: 'Business signed up successfully!' });
    } catch (error) {
      console.error('Error during business signup:', error);
      res.status(500).json({ error: 'Failed to sign up business.' });
    }
  });


// Login route for business users
app.post('/business/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const businessUser = await BusinessUser.findOne({ email }); // Find business user by email
  
      if (!businessUser) {
        return res.status(404).json({ error: 'Business user not found.' });
      }
  
      const passwordMatch = await bcrypt.compare(password, businessUser.password);
  
      if (passwordMatch) {
        const token = jwt.sign({ userId: businessUser._id, userType: 'business' }, 'your_secret_key');
  
        res.status(200).json({ token, username: businessUser.firstName });
      } else {
        res.status(401).json({ error: 'Incorrect password.' });
      }
    } catch (error) {
      console.error('Error during business login:', error);
      res.status(500).json({ error: 'Business login failed.' });
    }
  });
  


// Signup route
app.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User signed up successfully!' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Failed to sign up.' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = jwt.sign({ userId: user._id }, 'your_secret_key');

      res.status(200).json({ token, username: user.firstName });
    } else {
      res.status(401).json({ error: 'Incorrect password.' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed.' });
  }
});



//  submit-rating-review endpoint
app.post('/submit-rating-review', authenticateToken, async (req, res) => {
    try {
        const { rating, review } = req.body;
        const userId = req.user.userId; // Get user ID from authenticated request

        // Find the user by ID to get the name
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Create a new rating and review document
        const newRatingReview = new RatingReview({
            userId, // Assign the logged-in user's ID
            rating,
            review,
            userName: `${user.firstName} ${user.lastName}`, // Combine first name and last name
        });

        // Save the rating and review to the database
        await newRatingReview.save();

        res.status(201).json({ message: 'Rating and review submitted successfully!' });
    } catch (error) {
        console.error('Error submitting rating and review:', error);
        res.status(500).json({ error: 'Failed to submit rating and review.' });
    }
});


// New route to fetch username associated with logged-in user

app.get('/get-username', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId; // Get user ID from authenticated request

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Send the username in the response
        res.status(200).json({ username: user.firstName });
    } catch (error) {
        console.error('Error fetching username:', error);
        res.status(500).json({ error: 'Failed to fetch username.' });
    }
});

// Add route for fetching all restaurant ratings and reviews
// Fetch all ratings and reviews
app.get('/get-ratings-reviews', async (req, res) => {
    try {
        // Fetch all ratings and reviews
        const ratingsReviews = await RatingReview.find().populate('userId', 'firstName lastName');
        res.status(200).json(ratingsReviews);
    } catch (error) {
        console.error('Error fetching ratings and reviews:', error);
        res.status(500).json({ error: 'Failed to fetch ratings and reviews.' });
    }
});




// Update review
app.put('/update-rating-review/:id', authenticateToken, async (req, res) => {
    try {
        const { rating, review } = req.body;
        const reviewId = req.params.id;
        const userId = req.user.userId; // Get user ID from authenticated request

        // Check if the review belongs to the current user
        const existingReview = await RatingReview.findOne({ _id: reviewId, userId });

        if (!existingReview) {
            return res.status(404).json({ error: 'You cant edit other user reviews' });
        }

        existingReview.rating = rating;
        existingReview.review = review;

        await existingReview.save();

        res.status(200).json({ message: 'Review updated successfully!' });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Failed to update review.' });
    }
});

// Delete review
app.delete('/delete-rating-review/:id', authenticateToken, async (req, res) => {
    try {
        const reviewId = req.params.id;
        const userId = req.user.userId; // Get user ID from authenticated request

        // Check if the review belongs to the current user
        const deletedReview = await RatingReview.findOneAndDelete({ _id: reviewId, userId });

        if (!deletedReview) {
            return res.status(404).json({ error: 'You cant delete other user reviews' });
        }

        res.status(200).json({ message: 'Review deleted successfully!' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Failed to delete review.' });
    }
});

// Add route for fetching the average rating of all reviews
// Add route for fetching the average rating and count of reviews
app.get('/get-average-rating', async (req, res) => {
    try {
        // Fetch all ratings from the database
        const ratings = await RatingReview.find({}, 'rating');

        // Calculate the average rating
        const totalRating = ratings.reduce((acc, curr) => acc + curr.rating, 0);
        const averageRating = totalRating / ratings.length;

        res.status(200).json({ averageRating, totalReviews: ratings.length });
    } catch (error) {
        console.error('Error getting average rating:', error);
        res.status(500).json({ error: 'Failed to get average rating.' });
    }
});


// Add route for submitting a reply to a review
// Add route for submitting a reply to a review
app.post('/submit-reply/:id', authenticateToken, async (req, res) => {
    try {
        const { reply } = req.body;
        const reviewId = req.params.id;
        const userId = req.user.userId; // Get user ID from authenticated request

        // Find the review by ID
        const review = await RatingReview.findById(reviewId);

        if (!review) {
            return res.status(404).json({ error: 'Review not found.' });
        }

        // Check if the review belongs to the current user
        if (review.userId.toString() !== userId) {
            return res.status(403).json({ error: 'You are not authorized to reply to this review.' });
        }

        // Update the review with the reply
        review.reply = reply;
        await review.save();

        res.status(200).json({ message: 'Reply submitted successfully!' });
    } catch (error) {
        console.error('Error submitting reply:', error);
        res.status(500).json({ error: 'Failed to submit reply.' });
    }
});

// Example route for reporting reviews
app.post('/report-review', authenticateToken, async (req, res) => {
  try {
      const { reviewId } = req.body;

      // Update the 'reported' field for the review with the provided ID
      const updatedReview = await RatingReview.findByIdAndUpdate(reviewId, { reported: true });

      if (!updatedReview) {
          return res.status(404).json({ error: 'Review not found' });
      }

      // Notify the business dashboard or take any other necessary actions
      console.log(`Review ${reviewId} reported. Notify business dashboard.`);

      // Respond with a success message
      res.status(200).json({ message: 'Review reported successfully' });
  } catch (error) {
      console.error('Error reporting review:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});