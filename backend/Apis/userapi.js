// // userapi.js
// const express = require("express");
// const userapi = express.Router();
// const expressAsyncHandler = require("express-async-handler");
// const bcryptjs = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { RatingReviewModel } = require("../models/ratingReviewModel");

// userapi.use(express.json());

// // Route for login
// userapi.post('/login', expressAsyncHandler(async (request, response) => {
//   // Your existing login logic
// }));

// // Route for signup
// userapi.post('/signup', expressAsyncHandler(async (request, response) => {
//   // Your existing signup logic
// }));

// // Route for storing rating and review data
// userapi.post('/rating-review', expressAsyncHandler(async (request, response) => {
//   const { rating, review } = request.body;
//   const userId = request.user.userId; // Assuming userId is extracted from JWT token
//   try {
//     const ratingReview = new RatingReviewModel({
//       userId,
//       rating,
//       review
//     });
//     const savedRatingReview = await ratingReview.save();
//     response.status(201).json(savedRatingReview);
//   } catch (error) {
//     console.error("Error saving rating and review:", error);
//     response.status(500).json({ message: "Error saving rating and review" });
//   }
// }));

// module.exports = userapi;
















































// // const express = require("express");
// // const userapi = express.Router();
// // const expressAsyncHandler = require("express-async-handler");
// // const bcryptjs = require("bcryptjs");
// // const jwt = require("jsonwebtoken");

// // userapi.use(express.json());

// // // Route for login
// // userapi.post('/login', expressAsyncHandler(async (request, response) => {
// //   const mycollection = request.app.get("mycollection");
// //   const usercred = request.body;

// //   // Find user by email
// //   const userdb = await mycollection.findOne({ email: usercred.email });

// //   if (!userdb) {
// //     response.status(401).send({ message: "User Not Found" });
// //   } else {
// //     const passwordMatch = await bcryptjs.compare(usercred.password, userdb.password);
// //     if (!passwordMatch) {
// //       response.send({ message: "Invalid password" });
// //     } else {
// //       const token = jwt.sign({ email: userdb.email }, "fdubai", { expiresIn: 3600 });
// //       response.send({ message: "Login Successful", payload: token, userobj: userdb });
// //     }
// //   }
// // }));

// // // Route for signup
// // userapi.post('/signup', expressAsyncHandler(async (request, response) => {
// //   const mycollection = request.app.get("mycollection");
// //   const newUserObj = request.body;

// //   // Check if user already exists
// //   const userExists = await mycollection.findOne({ email: newUserObj.email });
// //   if (userExists) {
// //     response.send({ message: "User Already Exists" });
// //   } else {
// //     // Hash password
// //     const hashedPassword = await bcryptjs.hash(newUserObj.password, 10);
// //     newUserObj.password = hashedPassword;

// //     // Insert new user into the collection
// //     await mycollection.insertOne(newUserObj);
// //     response.send({ message: "User Created Successfully" });
// //   }
// // }));

// // module.exports = userapi;
