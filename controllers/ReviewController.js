import Review from "../models/Reviews.js"

export async function createReview(req,res){
    if (!req.user) {
        res.status(403).json(
            {
                message : "Please login first"
            }
        )
        return
    }
try {
        const review = new Review(
        {
            email : req.user.email,
            firstName : req.user.firstName,
            lastName : req.user.lastName,
            reviewString : req.body.review,
            image : req.user.image
              
        }
        )
        const response = await review.save()
        res.json(
            {
                message : "Review is saved"
            }
        )
} catch (error) {
    res.status(500).json(
        {
            message : "Review is not saved.",
            error:error
        }
    )
}     
}

export async function getReviews(req,res){
    try {
        const reviews = await Review.find()
        if (reviews==null) {
            res.status(404).json(
                {
                    message : "No reviews yet"
                }
            )
            return
        }
        res.json(
            {
                reviews : reviews
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                message : "Loading failed"
            }
        )
    }
}

   