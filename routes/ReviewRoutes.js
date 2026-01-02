import express from 'express';
import { createReview, getReviews } from '../controllers/ReviewController.js';

const reviewRouter = express.Router()

reviewRouter.post('/',createReview)
reviewRouter.get('/',getReviews)

export default reviewRouter