import SparePart from "../models/SparePart.js";
import SparePartReview from "../models/SparePartReview.js";

// Create a new review for a spare part
export const createSparePartReview = async (req, res) => {
  try {
    const sparePartId = req.params.sparePartId;
    if (!sparePartId) {
      throw new Error("Spare part ID is missing in the request parameters.");
    }

    const newReview = new SparePartReview({ ...req.body, sparePartId });

    const savedReview = await newReview.save();

    // Optional: push review ID to spare part (if using embedded ref)
    const updatedSparePart = await SparePart.findByIdAndUpdate(
      sparePartId,
      { $push: { reviews: savedReview._id } },
      { new: true }
    );

    if (!updatedSparePart) {
      throw new Error("Failed to update spare part with the new review.");
    }

    res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      data: savedReview,
    });
  } catch (err) {
    console.error("Error submitting review:", err.message);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to submit review. Try again.",
    });
  }
};

// Get all spare part reviews (for admin/dashboard)
export const getAllSparePartReviews = async (req, res) => {
  try {
    const reviews = await SparePartReview.find()
      .populate("sparePartId", "name") // Populate name field only
      .sort({ createdAt: -1 });

    const formattedReviews = reviews.map((r) => ({
      _id: r._id,
      username: r.username,
      reviewText: r.reviewText,
      rating: r.rating,
      sparePartId: r.sparePartId?._id,
      sparePartName: r.sparePartId?.name || "N/A",
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    res.status(200).json({
      success: true,
      data: formattedReviews,
    });
  } catch (err) {
    console.error("Failed to fetch spare part reviews:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update a spare part review
export const updateSparePartReview = async (req, res) => {
  try {
    const updatedReview = await SparePartReview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedReview });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete a spare part review
export const deleteSparePartReview = async (req, res) => {
  try {
    await SparePartReview.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all reviews for a specific spare part
export const getSparePartReviewsByPartId = async (req, res) => {
  const { sparePartId } = req.params;
  try {
    const reviews = await SparePartReview.find({ sparePartId });
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};