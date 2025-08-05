import Service from "../models/Service.js";
import ServiceReview from "../models/ReviewService.js"



export const createRevieww = async (req, res) => {
    try {

        const serviceId = req.params.serviceId; 
        if (!serviceId) {
            throw new Error("Service ID is missing in the request parameters.");
        }

        const newReview = new ServiceReview({ ...req.body, serviceId });

        const savedReview = await newReview.save();
        
        const updatedService = await Service.findByIdAndUpdate(serviceId, {
            $push: { reviews: savedReview._id }
        }, { new: true });

        if (!updatedService) {
            throw new Error("Failed to update service with the new review.");
        }

        res.status(200).json({
            success: true,
            message: "Review submitted successfully",
            data: savedReview
        });

    } catch (err) {
        console.error("Error submitting review:", err.message);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to submit review. Try again."
        });
    }
};

export const getAllServiceReviews = async (req, res) => {
  try {
    const reviews = await ServiceReview.find()
      .populate('serviceId', 'name') // Only populate the name
      .sort({ createdAt: -1 });

    const formattedReviews = reviews.map(r => ({
      _id: r._id,
      username: r.username,
      reviewText: r.reviewText,
      rating: r.rating,
      serviceId: r.serviceId?._id,
      serviceName: r.serviceId?.name || 'N/A',
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    res.status(200).json({
      success: true,
      data: formattedReviews
    });
  } catch (err) {
    console.error('Failed to fetch service reviews:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateServiceReview = async (req, res) => {
  try {
    const updatedReview = await ServiceReview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedReview });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const deleteServiceReview = async (req, res) => {
  try {
    await ServiceReview.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
